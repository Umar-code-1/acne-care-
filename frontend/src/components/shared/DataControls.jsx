import React, { useState } from "react";
import API from "../../api";
import AppIcon from "./AppIcon";

export default function DataControls({ onLogout, notify, refresh }) {
  const [busy, setBusy] = useState("");
  const [confirmImages, setConfirmImages] = useState(false);
  const [confirmAccount, setConfirmAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Google-only accounts have no password — they type DELETE instead
  const [hasPassword, setHasPassword] = useState(true);

  const openAccountConfirm = async () => {
    setConfirmAccount(true);
    try {
      const res = await API.get("/auth/me");
      setHasPassword(res.data?.hasPassword !== false);
    } catch {
      setHasPassword(true);
    }
  };

  const deleteImages = async () => {
    setBusy("images");
    try {
      const res = await API.delete("/auth/my-images");
      notify?.("✅ " + res.data.message);
      setConfirmImages(false);
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Could not delete images"));
    } finally {
      setBusy("");
    }
  };

  const deleteAccount = async () => {
    if (hasPassword && !password) return setError("Enter your password to confirm.");
    if (!hasPassword && password !== "DELETE") return setError("Type DELETE to confirm.");
    setBusy("account");
    setError("");
    try {
      await API.delete("/auth/account", {
        data: hasPassword ? { password } : { confirm: "DELETE" },
      });
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("page");
      alert("Your account has been permanently deleted.");
      onLogout?.();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete account");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="card" style={{ borderColor: "var(--dan)" }}>
      <div className="card-h" style={{ background: "var(--dan-l)" }}>
        <div className="card-t" style={{ color: "var(--dan)" }}><AppIcon name="shield" /> Privacy & Data Controls</div>
      </div>
      <div className="card-b">

        {/* Delete images */}
        <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
            Delete my photos
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
            Removes every facial image you've uploaded. Your analysis results
            (acne type, severity) are kept so your history stays intact.
          </div>

          {!confirmImages ? (
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmImages(true)}>
              Delete all my photos
            </button>
          ) : (
            <div className="alert al-warn" style={{ marginBottom: 0 }}>
              <div style={{ width: "100%" }}>
                <div style={{ marginBottom: "0.6rem" }}>
                  This permanently deletes your photos. It cannot be undone.
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-dan btn-sm" onClick={deleteImages} disabled={busy === "images"}>
                    {busy === "images" ? "Deleting..." : "Yes, delete them"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setConfirmImages(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete account */}
        <div style={{ paddingTop: "1rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem", color: "var(--dan)" }}>
            Delete my account
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
            Permanently erases your account, photos, scan history, appointments
            and skincare plans. This cannot be undone.
          </div>

          {!confirmAccount ? (
            <button className="btn btn-dan btn-sm" onClick={openAccountConfirm}>
              Delete my account
            </button>
          ) : (
            <div className="alert al-dan" style={{ marginBottom: 0 }}>
              <div style={{ width: "100%" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.6rem" }}>
                  <AppIcon name="alert" /> This is permanent. {hasPassword ? "Enter your password to confirm." : "Type DELETE to confirm."}
                </div>
                <input
                  className="form-i"
                  type={hasPassword ? "password" : "text"}
                  placeholder={hasPassword ? "Your password" : "DELETE"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginBottom: "0.6rem" }}
                />
                {error && (
                  <div style={{ fontSize: "0.8rem", color: "var(--dan)", marginBottom: "0.6rem" }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-dan btn-sm" onClick={deleteAccount} disabled={busy === "account"}>
                    {busy === "account" ? "Deleting..." : "Permanently delete"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setConfirmAccount(false); setPassword(""); setError(""); }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
