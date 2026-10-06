import { useState } from "react";
import API from "../../api";
import AppIcon from "../shared/AppIcon";

const ROLE_TABS = [
  ["patient", "profile", "Patient"],
  ["dermatologist", "doctor", "Doctor"],
  ["admin", "shield", "Admin"],
];

export default function AuthScreen({ onLogin, onBack, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("patient@acnecare.com");
  const [password, setPassword] = useState("patient123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [pmdc, setPmdc] = useState("");

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

  const switchMode = (m) => {
    // admin signup allowed nahi hai
    const nextRole = m === "signup" && role === "admin" ? "patient" : role;
    setMode(m);
    setAgreed(false);
    setRole(nextRole);
    setError("");
    setName("");
    setEmail(m === "signin" ? roleDefaults[nextRole].e : "");
    setPassword(m === "signin" ? roleDefaults[nextRole].p : "");
    setPmdc("");
  };

  const doLogin = async () => {
    if (!email || !password) return setError("Email and password are required.");
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password, role });
      localStorage.setItem("token", res.data.token);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const submit = () => (mode === "signin" ? doLogin() : doSignup());

  const doGoogle = () => {
    setError("Google sign-in is not available yet. Please use email and password.");
  };

  const tabs = mode === "signup"
    ? ROLE_TABS.filter(([id]) => id !== "admin")
    : ROLE_TABS;

  const roleIcon = role === "admin" ? "shield" : role === "dermatologist" ? "doctor" : "profile";
  const roleLabel = role === "dermatologist"
    ? "Dermatologist"
    : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="auth-root">
      <div className="auth-form-side">
        <div className="auth-card">
          {onBack && <button className="auth-back" onClick={onBack}>← Back to home</button>}

          <div className="auth-logo">
            <div className="auth-logo-ic"><AppIcon name="bottle" /></div>
            <div className="auth-logo-t">AcneCare AI</div>
          </div>

          <div className="auth-title">{mode === "signin" ? "Welcome back" : "Create account"}</div>
          <div className="auth-sub">
            {mode === "signin"
              ? "Sign in to your account to continue"
              : "Start tracking your skin in under a minute"}
          </div>

          <div className="tab-bar">
            <button className={`tab ${mode === "signin" ? "act" : ""}`} onClick={() => switchMode("signin")}>
              Sign In
            </button>
            <button className={`tab ${mode === "signup" ? "act" : ""}`} onClick={() => switchMode("signup")}>
              Sign Up
            </button>
          </div>

          <div
            className="role-tabs"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
          >
            {tabs.map(([id, ic, lb]) => (
              <button key={id} className={`rt ${role === id ? "act" : ""}`} onClick={() => switchRole(id)}>
                <span><AppIcon name={ic} /></span>{lb}
              </button>
            ))}
          </div>

          {error && <div className="auth-err"><AppIcon name="alert" /> {error}</div>}

          {mode === "signup" && (
            <div className="form-g">
              <label className="form-l">Full Name</label>
              <input className="form-i" value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe" />
            </div>
          )}
           {mode === "signup" && role === "dermatologist" && (
            <div className="form-g">
              <label className="form-l">PMDC Registration Number</label>
              <input className="form-i" value={pmdc}
                onChange={e => setPmdc(e.target.value)}
                placeholder="e.g. 12345-P" />
              <div className="form-hint">
                Your registration will be verified against the PMDC register before
                you can accept patients.
              </div>
            </div>
          )}

          <div className="form-g">
            <label className="form-l">Email Address</label>
            <input className="form-i" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" />
          </div>

          <div className="form-g">
            <label className="form-l">Password</label>
            <input className="form-i" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
{mode === "signup" && (
            <div
              className={`check-item ${agreed ? "sel" : ""}`}
              style={{ marginBottom: "1rem", alignItems: "flex-start", lineHeight: 1.6 }}
              onClick={() => setAgreed(!agreed)}
            >
              <span style={{ flexShrink: 0 }}>{agreed ? <AppIcon name="check" /> : "○"}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 400 }}>
                I agree to the <strong>Terms of Service</strong> and{" "}
                <strong>Privacy Policy</strong>, and I understand that AcneCare AI
                provides informational analysis only, not medical diagnosis.
              </span>
            </div>
          )}
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

          <div className="auth-switch">
            {mode === "signin" ? "Don't have an account? " : "Already registered? "}
            <button onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </div>

          <div className="auth-demo">
            <div className="ad-t">Demo Credentials</div>
            <div className="ad-c">
              <strong>Patient:</strong> patient@acnecare.com / patient123<br />
              <strong>Doctor:</strong> doctor@test.com / doctor123<br />
               <strong>Doctor:</strong> arham@acnecare.com / arham123<br />
              <strong>Admin:</strong> admin@acnecare.com / admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
