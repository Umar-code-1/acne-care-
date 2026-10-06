import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

export default function VerificationBanner({ user, notify, refresh }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user?.isVerified) return null;

  const upload = async () => {
    if (!file) return notify?.("Please choose your licence document first");
    setBusy(true);
    const fd = new FormData();
    fd.append("license", file);
    fd.append("pmdcNumber", user.pmdcNumber || "");
    try {
      await API.post("/users/license", fd);
      notify?.("✅ Licence uploaded. Awaiting admin review.");
      setFile(null);
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ borderColor: "var(--acc)", borderWidth: 2 }}>
      <div className="card-h" style={{ background: "var(--acc-l)" }}>
        <div className="card-t"><AppIcon name="clock" /> Account Pending Verification</div>
      </div>
      <div className="card-b">
        {user?.rejectionReason ? (
          <div className="alert al-dan">
            <div>
              <strong>Verification declined:</strong> {user.rejectionReason}
              <div style={{ marginTop: "0.4rem" }}>
                You can re-upload a valid licence document below.
              </div>
            </div>
          </div>
        ) : (
          <div className="alert al-warn">
            Your account is under review. You cannot accept patients or issue
            skincare plans until an administrator verifies your credentials.
          </div>
        )}

        <div style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: "0.75rem", lineHeight: 1.7 }}>
          <strong>PMDC Number:</strong> {user?.pmdcNumber || "Not provided"}<br />
          Upload a clear photo or PDF of your PMDC registration certificate.
        </div>

        <div className="form-g">
          <input type="file" className="form-i" accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <button className="btn btn-pri btn-sm" onClick={upload} disabled={busy || !file}>
          {busy ? "Uploading..." : "Submit for Verification"}
        </button>
      </div>
    </div>
  );
}
