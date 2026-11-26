import { useEffect, useLayoutEffect, useRef, useState } from "react";
import API from "../../api";
import AppIcon from "../shared/AppIcon";
import {
  finishGoogleRedirect, getGoogleIdToken, hasPendingGoogleRedirect, isGoogleConfigured, startGoogleRedirect,
} from "../../firebase";

const PMDC_PATTERN = /^\d{4,6}-[a-z]$/i;

const ROLE_TABS = [
  ["patient", "profile", "Patient"],
  ["dermatologist", "doctor", "Doctor"],
  ["admin", "shield", "Admin"],
];

export default function AuthScreen({ onLogin, onClose, onModeChange, initialMode = "signin" }) {
  const dialogRef = useRef(null);
  const resetToken = new URLSearchParams(window.location.search).get("resetToken") || "";
  const [mode, setMode] = useState(resetToken ? "reset" : initialMode);
  const [previousRouteMode, setPreviousRouteMode] = useState(initialMode);
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialMode === "signup" ? "" : "patient@acnecare.com");
  const [password, setPassword] = useState(initialMode === "signup" ? "" : "patient123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // Google redirect se wapas aaye hain to shuru se "loading" dikhao
  const [loading, setLoading] = useState(hasPendingGoogleRedirect);
  const requestInFlight = useRef(false);
  const [agreed, setAgreed] = useState(false);
  const [pmdc, setPmdc] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const roleDefaults = {
    admin:         { e: "admin@acnecare.com",   p: "admin123"   },
    dermatologist: { e: "doctor@acnecare.com",  p: "doctor123"  },
    patient:       { e: "patient@acnecare.com", p: "patient123" }
  };

  const switchRole = (r) => {
    setRole(r);
    if (mode === "signin") {
      setEmail(roleDefaults[r].e);
      setPassword(roleDefaults[r].p);
    }
    setError("");
  };

  const prepareMode = (m) => {
    // admin signup allowed nahi hai
    const nextRole = m === "signup" && role === "admin" ? "patient" : role;
    setMode(m);
    setAgreed(false);
    setRole(nextRole);
    setError("");
    setNotice("");
    setName("");
    setEmail(m === "signin" ? roleDefaults[nextRole].e : "");
    setPassword(m === "signin" ? roleDefaults[nextRole].p : "");
    setPmdc("");
  };

  if (initialMode !== previousRouteMode) {
    setPreviousRouteMode(initialMode);
    if (mode !== initialMode) prepareMode(initialMode);
  }

  const switchMode = (nextMode) => {
    prepareMode(nextMode);
    onModeChange(nextMode);
  };

  const backToSignIn = () => {
    setMode("signin");
    setError("");
    setNotice("");
    onModeChange("signin", mode === "reset");
  };

  const doLogin = async () => {
    if (requestInFlight.current) return;
    setNotice("");
    const missingEmail = !email.trim();
    const missingPassword = !password.trim();
    if (missingEmail && missingPassword) {
      return setError("Email and password are required.");
    }
    if (missingEmail) return setError("Email is required.");
    if (missingPassword) return setError("Password is required.");
    requestInFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password, role });
      saveToken(res.data.token, rememberMe);
      onLogin(res.data);
    } catch (err) {
      setError(err.response
        ? err.response.data?.message || "Sign-in failed. Please try again."
        : "Could not reach the sign-in server. Please try again.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const doSignup = async () => {
    if (requestInFlight.current) return;
    setNotice("");
    const missingFields = [
      !name.trim() && "Full name",
      !email.trim() && "Email",
      !password.trim() && "Password",
      role === "dermatologist" && !pmdc.trim() && "PMDC registration number",
    ].filter(Boolean);

    if (missingFields.length === 1) return setError(`${missingFields[0]} is required.`);
    if (missingFields.length > 1) {
      const requiredFields = missingFields.length === 2
        ? missingFields.join(" and ")
        : `${missingFields.slice(0, -1).join(", ")}, and ${missingFields.at(-1)}`;
      return setError(`${requiredFields} are required.`);
    }
    if (role === "dermatologist" && !/^\d{4,6}-[a-z]$/i.test(pmdc.trim())) {
      return setError("Enter a valid PMDC number: 4–6 digits, a hyphen, and one letter (for example, 12345-P).");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (!agreed) {
      return setError("Please accept the Terms and Conditions.");
    }

    requestInFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        pmdcNumber: pmdc.trim().toUpperCase(),
        acceptTerms: agreed,
      });
      saveToken(res.data.token, rememberMe);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const saveToken = (token, shouldRemember) => {
    if (shouldRemember) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
  };

  const showForgotPasswordHelp = () => {
    setError("");
    setNotice("");
    setMode("forgot");
  };

  const requestResetLink = async () => {
    if (requestInFlight.current) return;
    if (!email.trim()) return setError("Enter your email address.");
    requestInFlight.current = true;
    setLoading(true);
    setError("");
    setNotice("");
    setResetLink("");
    try {
      const res = await API.post("/auth/forgot-password", { email: email.trim() });
      setNotice(res.data.message);
      setResetLink(res.data.resetUrl || "");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send a reset link.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const submitNewPassword = async () => {
    if (requestInFlight.current) return;
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    requestInFlight.current = true;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const res = await API.post("/auth/reset-password", { token: resetToken, password: newPassword });
      setNotice(res.data.message);
      setMode("signin");
      setNewPassword("");
      onModeChange("signin", true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset your password.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const submit = () => (mode === "signin" ? doLogin() : doSignup());

  // Google ID token backend ko do; `p` = click ke waqt ka mode/role (redirect ke baad bhi yahi)
  const sendGoogleToken = async (idToken, p) => {
    const res = await API.post("/auth/google", {
      idToken,
      mode: p.mode,
      role: p.role,
      pmdcNumber: p.mode === "signup" ? p.pmdc : undefined,
      // Sign In (patient) shows a terms note under the button, so continuing = accepting
      acceptTerms: p.mode === "signup" ? p.agreed : p.role === "patient",
    });
    saveToken(res.data.token, p.rememberMe);
    onLogin(res.data);
  };

  const showGoogleError = (err) => {
    const code = err?.code || "";
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      // user ne popup band kar diya — koi error nahi
    } else if (code === "auth/popup-blocked") {
      setError("Your browser blocked the Google popup. Allow popups for this site and try again.");
    } else if (code === "auth/unauthorized-domain") {
      setError(`This address (${window.location.hostname}) is not allowed for Google sign-in. Add it in Firebase → Authentication → Settings → Authorized domains.`);
    } else if (code.startsWith("auth/")) {
      console.error("Firebase Google sign-in error:", err);
      setError(`Google sign-in failed (${code}). Please try again.`);
    } else {
      setError(err.response
        ? err.response.data?.message || "Google sign-in failed. Please try again."
        : "Could not reach the sign-in server. Please try again.");
    }
  };

  // Full-page Google redirect se wapas aaye hain to sign-in yahin poora karo
  useEffect(() => {
    if (!hasPendingGoogleRedirect()) return;
    requestInFlight.current = true;
    finishGoogleRedirect()
      .then((result) => {
        if (!result) return;
        setRole(result.pending.role);
        return sendGoogleToken(result.idToken, result.pending);
      })
      .catch(showGoogleError)
      .finally(() => {
        requestInFlight.current = false;
        setLoading(false);
      });
    // sirf screen khulne par ek dafa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doGoogle = async () => {
    if (requestInFlight.current) return;
    setNotice("");
    if (!isGoogleConfigured) {
      return setError("Google sign-in is not set up yet. Please use email and password.");
    }
    // Sign Up par popup se pehle hi terms / PMDC check kar lo
    if (mode === "signup") {
      if (role === "dermatologist" && !PMDC_PATTERN.test(pmdc.trim())) {
        return setError("Enter a valid PMDC number: 4–6 digits, a hyphen, and one letter (for example, 12345-P).");
      }
      if (!agreed) return setError("Please accept the Terms and Conditions.");
    }

    const pending = { mode, role, pmdc: pmdc.trim().toUpperCase(), agreed, rememberMe };
    requestInFlight.current = true;
    setLoading(true);
    setError("");
    try {
      let idToken;
      try {
        idToken = await getGoogleIdToken();
      } catch (err) {
        // Safari waghera ne popup rok diya — poore page wala Google sign-in use karo
        if (err?.code === "auth/popup-blocked") {
          await startGoogleRedirect(pending);
          return;
        }
        throw err;
      }
      await sendGoogleToken(idToken, pending);
    } catch (err) {
      showGoogleError(err);
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  };

  const tabs = mode === "signup"
    ? ROLE_TABS.filter(([id]) => id !== "admin")
    : ROLE_TABS;

  const roleIcon = role === "admin" ? "shield" : role === "dermatologist" ? "doctor" : "profile";
  const roleLabel = role === "dermatologist"
    ? "Dermatologist"
    : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <dialog
      ref={dialogRef}
      className="auth-dialog"
      aria-labelledby="auth-title"
      aria-describedby="auth-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button className="auth-close" type="button" onClick={onClose} aria-label="Close dialog">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      <div className="auth-card">
        <h2 id="auth-title" className="auth-title">{mode === "signin" ? "Welcome back" : mode === "signup" ? "Create account" : mode === "forgot" ? "Reset your password" : "Choose a new password"}</h2>
        <div id="auth-description" className="auth-sub">
          {mode === "signin"
            ? "Sign in to your account to continue"
            : mode === "signup" ? "Start tracking your skin in under a minute" : mode === "forgot" ? "Enter your email and we'll send you a reset link" : "Enter a new password for your account"}
        </div>

        {(mode === "signin" || mode === "signup") && <div className="tab-bar">
          <button className={`tab ${mode === "signin" ? "act" : ""}`} onClick={() => switchMode("signin")}>
            Sign In
          </button>
          <button className={`tab ${mode === "signup" ? "act" : ""}`} onClick={() => switchMode("signup")}>
            Sign Up
          </button>
        </div>}

        {(mode === "signin" || mode === "signup") && <div
          className="role-tabs"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
        >
          {tabs.map(([id, ic, lb]) => (
            <button key={id} className={`rt ${role === id ? "act" : ""}`} onClick={() => switchRole(id)}>
              <span><AppIcon name={ic} /></span>{lb}
            </button>
          ))}
        </div>}

        {error && <div className="auth-err"><AppIcon name="alert" /> {error}</div>}
        {notice && <div className="auth-notice" role="status">{notice}</div>}

        <div className={mode === "signup" && role === "dermatologist" ? "auth-fields-doctor" : undefined}>
          {mode === "signup" && (
            <div className="form-g">
              <label className="form-l">Full Name</label>
              <input className="form-i" value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe" />
            </div>
          )}
          {mode === "signup" && role === "dermatologist" && <>
            <div className="form-g">
              <label className="form-l">PMDC Number</label>
              <input className="form-i" value={pmdc}
                onChange={e => {
                  setPmdc(e.target.value.trimStart());
                  setError("");
                }}
                maxLength={8}
                aria-describedby="pmdc-format-hint"
                placeholder="e.g. 12345-P" />
            </div>
            <div className="form-hint auth-pmdc-hint" id="pmdc-format-hint">
              Use 4–6 digits, a hyphen and one letter (e.g. 12345-P). Verification is required before you can accept patients.
            </div>
          </>}

          {(mode === "signin" || mode === "signup" || mode === "forgot") && <div className="form-g">
            <label className="form-l">Email Address</label>
            <input className="form-i" type="email" autoComplete="email" value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (mode === "forgot") {
                  setError("");
                  setNotice("");
                  setResetLink("");
                }
              }}
              onKeyDown={e => mode === "forgot" && e.key === "Enter" && requestResetLink()}
              placeholder="your@email.com" />
          </div>}

          {(mode === "signin" || mode === "signup") && <div className="form-g">
            <label className="form-l">Password</label>
            <div className="auth-password-wrap">
              <input className="form-i" type={showPassword ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && submit()} />
              <button
                className="auth-password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword && <path d="m4 4 16 16" />}
                </svg>
              </button>
            </div>
          </div>}
          {mode === "reset" && <div className="form-g">
            <label className="form-l" htmlFor="reset-new-password">New password</label>
            <input id="reset-new-password" className="form-i" type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" onKeyDown={e => e.key === "Enter" && submitNewPassword()} />
          </div>}
        </div>
        {(mode === "signin" || mode === "signup") && <div className="auth-options-row">
          <label className="auth-remember">
            <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
            <span>Remember me</span>
          </label>
          {mode === "signin" && (
            <button className="auth-forgot" type="button" onClick={showForgotPasswordHelp}>Forgot password?</button>
          )}
        </div>}
        {resetLink && <p className="auth-notice"><a href={resetLink}>Open password reset link</a></p>}
        {mode === "signup" && (
          <label className={`check-item auth-terms ${agreed ? "sel" : ""}`}>
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
            <span>I agree to the <strong>Terms and Conditions</strong>.</span>
          </label>
        )}
        {mode === "signin" || mode === "signup" ? (
          <div className="auth-actions">
            <button className="btn btn-pri btn-full" onClick={submit} disabled={loading}>
              {loading ? (
                <><AppIcon name="clock" /> {mode === "signin" ? "Signing in..." : "Creating account..."}</>
              ) : (
                <><AppIcon name={roleIcon} /> {mode === "signin" ? `Sign In as ${roleLabel}` : `Create ${roleLabel} Account`}</>
              )}
            </button>
            <div className="auth-divider">or</div>
            <button className="btn btn-google btn-full" onClick={doGoogle} disabled={loading}>
              <span style={{ fontWeight: 800, color: "#4285F4" }}>G</span> Continue with Google
            </button>
            {mode === "signin" && role === "patient" && (
              <p className="form-hint auth-google-note" style={{ textAlign: "center", margin: "0.5rem 0 0" }}>
                New here? Google sign-in creates your patient account and you accept our <strong>Terms and Conditions</strong>.
              </p>
            )}
          </div>
        ) : (
          <button className="btn btn-pri btn-full" onClick={mode === "forgot" ? requestResetLink : submitNewPassword} disabled={loading}>
            {loading ? "Please wait..." : mode === "forgot" ? "Send reset link" : "Update password"}
          </button>
        )}

        {(mode === "forgot" || mode === "reset") && (
          <div className="auth-switch"><button onClick={backToSignIn}>Back to sign in</button></div>
        )}

        {mode === "signin" && <details className="auth-demo" open>
          <summary className="ad-t">Demo Credentials</summary>
          <div className="ad-c">
            <strong>Patient:</strong> patient@acnecare.com / patient123<br />
            <strong>Doctor:</strong> doctor@test.com / doctor123<br />
             <strong>Doctor:</strong> arham@acnecare.com / arham123<br />
            <strong>Admin:</strong> admin@acnecare.com / admin123
          </div>
        </details>}
      </div>
    </dialog>
  );
}
