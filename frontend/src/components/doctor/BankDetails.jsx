import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

export default function BankDetails({ user, notify, refresh }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    bankName:      user?.bankName || "",
    accountTitle:  user?.accountTitle || "",
    accountNumber: user?.accountNumber || "",
    iban:          user?.iban || "",
    jazzcash:      user?.jazzcash || "",
    easypaisa:     user?.easypaisa || "",
  });

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const hasAny = f.accountNumber || f.jazzcash || f.easypaisa;

  const save = async () => {
    setBusy(true);
    try {
      await API.put("/auth/profile", f);
      notify?.("✅ Payment details updated");
      setEditing(false);
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Could not save"));
    } finally {
      setBusy(false);
    }
  };

  const FIELDS = [
    ["bankName", "Bank Name", "e.g. Meezan Bank"],
    ["accountTitle", "Account Title", "Your full name"],
    ["accountNumber", "Account Number", "0000-0000000000"],
    ["jazzcash", "JazzCash Number", "0300-0000000"],
    ["easypaisa", "Easypaisa Number", "0345-0000000"],
  ];

  return (
    <div className="card">
      <div className="card-h">
        <div className="card-t"><AppIcon name="card" /> Payment Details</div>
        {!editing && (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
            <AppIcon name="edit" /> Edit
          </button>
        )}
      </div>
      <div className="card-b">
        {!hasAny && !editing && (
          <div className="alert al-warn">
            <AppIcon name="alert" /> You haven't added payment details yet. Patients cannot pay for your
            consultations until you do.
          </div>
        )}

        {!editing ? (
          FIELDS.map(([k, label]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "0.83rem", padding: "0.45rem 0",
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ color: "var(--text2)" }}>{label}</span>
              <strong style={{ wordBreak: "break-all" }}>{f[k] || "—"}</strong>
            </div>
          ))
        ) : (
          <>
            {FIELDS.map(([k, label, ph]) => (
              <div className="form-g" key={k}>
                <label className="form-l">{label}</label>
                <input className="form-i" value={f[k]}
                  onChange={set(k)} placeholder={ph} />
              </div>
            ))}

            <div className="alert al-info" style={{ fontSize: "0.8rem" }}>
              These details are shown to patients who book with you. Double-check them
              — an incorrect account means you won't receive payment.
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-pri" onClick={save} disabled={busy}>
                {busy ? "Saving…" : "Save Details"}
              </button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
