import React, { useState, useEffect } from "react";
import API from "../../api";
import AppIcon from "../shared/AppIcon";

const STATUS = {
  unpaid: { label: "Payment required", cls: "b-pending", icon: "⏳" },
  pending_verification: { label: "Awaiting verification", cls: "b-completed", icon: "🔍" },
  paid: { label: "Paid", cls: "b-confirmed", icon: "✅" },
  rejected: { label: "Payment rejected", cls: "b-cancelled", icon: "❌" },
};

export default function PatPayment({ appt, onBack, refresh, notify }) {
  const [bank, setBank] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
API.get(`/payments/${appt._id}/details`)
      .then((r) => setBank(r.data))
      .catch(() => notify?.("Could not load payment details"));
  }, []);

  const copy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return notify?.("❌ File too large (max 5MB)");
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
    e.target.value = "";
  };

  const submit = async () => {
    if (!file) return notify?.("Please upload your payment receipt");
    setBusy(true);
    const fd = new FormData();
    fd.append("proof", file);
    fd.append("transactionRef", ref.trim());
    try {
      const res = await API.post(`/payments/${appt._id}/proof`, fd);
      notify?.("✅ " + res.data.message);
      refresh?.();
      onBack?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  const st = STATUS[appt.payment] || STATUS.unpaid;

  const Row = ({ label, value, k }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0.6rem 0", borderBottom: "1px solid var(--border)", gap: "0.5rem",
    }}>
      <span style={{ color: "var(--text2)", fontSize: "0.82rem" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
        <strong style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>{value}</strong>
        <button className="btn btn-ghost btn-sm" style={{ padding: "0.2rem 0.45rem", flexShrink: 0 }}
          onClick={() => copy(value, k)}>
          {copied === k ? <AppIcon name="check" /> : <AppIcon name="clipboard" />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="ph">
        <button className="auth-back" onClick={onBack}>← Back to appointments</button>
        <div className="pt">Complete Payment</div>
        <div className="ps">Transfer the consultation fee and upload your receipt</div>
      </div>

      {/* SUMMARY */}
      <div className="card">
        <div className="card-h">
          <div className="card-t">Appointment Summary</div>
          <span className={`badge ${st.cls}`}><AppIcon emoji={st.icon} /> {st.label}</span>
        </div>
        <div className="card-b">
          {[
            ["Doctor", appt.dname],
            ["Date & time", `${appt.date} · ${appt.time}`],
            ["Type", appt.type === "online" ? `Online (${appt.plat || "—"})` : "Physical visit"],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "0.83rem", padding: "0.4rem 0",
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ color: "var(--text2)" }}>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: "0.85rem", padding: "0.85rem",
            background: "var(--pri-l)", borderRadius: "var(--r2)",
          }}>
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Amount due</span>
            <span style={{
              fontFamily: "var(--font-d)", fontWeight: 800,
              fontSize: "1.35rem", color: "var(--pri)",
            }}>
              PKR {appt.fee?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      {appt.payment === "paid" ? (
        <div className="alert al-ok">
          <AppIcon name="check" /> Payment verified. Your appointment is confirmed — your doctor will share
          the consultation details shortly.
        </div>
      ) : appt.payment === "pending_verification" ? (
        <div className="alert al-info">
          <AppIcon name="search" /> We've received your receipt and are verifying it. This usually takes a few
          hours. You'll be notified once confirmed.
        </div>
      ) : (
        <>
          {appt.payment === "rejected" && (
            <div className="alert al-dan">
              <div>
                <strong>Payment could not be verified</strong>
                <div style={{ marginTop: "0.3rem" }}>
                  {appt.paymentNote || "Please check the details and submit again."}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — transfer */}
          <div className="card">
            <div className="card-h">
              <div className="card-t">Step 1 — Transfer the amount</div>
            </div>
            <div className="card-b">
              {!bank ? (
                <div className="ps">Loading payment details…</div>
              ) : (
                <>
                  <div className="alert al-info" style={{ fontSize: "0.82rem" }}>
                    Send exactly <strong>PKR {appt.fee?.toLocaleString()}</strong> using
                    your banking app, Raast, JazzCash or Easypaisa.
                  </div>

                  <div style={{ fontWeight: 700, fontSize: "0.8rem", margin: "0.85rem 0 0.35rem" }}>
                    <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: "0.5rem" }}>
                    Paying: <strong>{bank.doctorName}</strong>
                  </div>
                    <AppIcon name="wallet" /> Bank Transfer
                  </div>
                  <Row label="Bank" value={bank.bankName} k="bn" />
                  <Row label="Account title" value={bank.accountTitle} k="at" />
                  <Row label="Account number" value={bank.accountNumber} k="an" />
                  <Row label="IBAN" value={bank.iban} k="ib" />

                  {(bank.jazzcash || bank.easypaisa) && (
                    <>
                      <div style={{ fontWeight: 700, fontSize: "0.8rem", margin: "1rem 0 0.35rem" }}>
                        <AppIcon name="card" /> Mobile Wallet
                      </div>
                      {bank.jazzcash && <Row label="JazzCash" value={bank.jazzcash} k="jc" />}
                      {bank.easypaisa && <Row label="Easypaisa" value={bank.easypaisa} k="ep" />}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* STEP 2 — upload */}
          <div className="card">
            <div className="card-h">
              <div className="card-t">Step 2 — Upload your receipt</div>
            </div>
            <div className="card-b">
              <div className="form-g">
                <label className="form-l">Transaction reference (optional)</label>
                <input className="form-i" value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g. TXN123456789" />
                <div className="form-hint">
                  Helps us verify your payment faster.
                </div>
              </div>

              {!file ? (
                <label className="upload-zone">
                  <input type="file" className="upload-input"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={pickFile} />
                  <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}><AppIcon name="document" /></div>
                  <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
                    Upload payment screenshot
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>
                    JPG, PNG or PDF · Max 5MB
                  </div>
                </label>
              ) : (
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  border: "2px solid var(--ok)", borderRadius: "var(--r)",
                  padding: "0.85rem", background: "var(--ok-l)", marginBottom: "1rem",
                }}>
                  {preview ? (
                    <img src={preview} alt="Receipt" style={{
                      width: 70, height: 70, objectFit: "cover",
                      borderRadius: 8, flexShrink: 0,
                    }} />
                  ) : (
                    <div style={{ fontSize: "2rem" }}><AppIcon name="document" /></div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}><AppIcon name="check" /> Receipt ready</div>
                    <div style={{
                      fontSize: "0.75rem", color: "var(--text2)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {file.name}
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm"
                    aria-label="Remove receipt"
                    onClick={() => { setFile(null); setPreview(""); }}>
                    <AppIcon name="trash" />
                  </button>
                </div>
              )}

              <button className="btn btn-pri btn-full"
                onClick={submit} disabled={busy || !file}>
                {busy ? <><AppIcon name="clock" /> Submitting…</> : "Submit Payment Receipt"}
              </button>

              <div style={{
                marginTop: "0.85rem", fontSize: "0.76rem",
                color: "var(--text3)", textAlign: "center", lineHeight: 1.6,
              }}>
                Your appointment is confirmed once we verify the payment.
                Online consultation links are shared after verification.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
