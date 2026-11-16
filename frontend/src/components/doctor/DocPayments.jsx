import React, { useState, useEffect } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

export default function DocPayments({ notify, refresh }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [proofLoading, setProofLoading] = useState("");

  const load = () => {
    setLoading(true);
    API.get("/payments/pending")
      .then((r) => setList(r.data))
      .catch(() => notify?.("Could not load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => () => {
    if (proofPreview?.url) URL.revokeObjectURL(proofPreview.url);
  }, [proofPreview]);

  const act = async (id, approve, why) => {
    setBusy(id);
    try {
      await API.put(`/payments/${id}/verify`, { approve, reason: why });
      notify?.(approve ? "✅ Payment verified" : "Payment rejected");
      load();
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Action failed"));
    } finally {
      setBusy("");
    }
  };

  const viewProof = async (id) => {
    setProofLoading(id);
    try {
      const res = await API.get(`/payments/${id}/proof`, { responseType: "blob" });
      const type = (res.headers["content-type"] || res.data.type || "").split(";")[0].trim().toLowerCase();
      if (!type.startsWith("image/") && type !== "application/pdf") {
        throw new Error("Unsupported receipt format");
      }
      setProofPreview({ url: URL.createObjectURL(res.data), type });
    } catch {
      notify?.("❌ Could not load receipt preview");
    } finally {
      setProofLoading("");
    }
  };

  return (
    <div>
      <div className="ph">
        <div className="pt">Payment Verification</div>
        <div className="ps">Confirm receipts from your patients</div>
      </div>

      <div className="alert al-warn">
        <AppIcon name="alert" /> Check the amount against your bank statement before approving. Approving
        allows the consultation to proceed.
      </div>

      <div className="card">
        <div className="card-h">
          <div className="card-t">Awaiting Verification</div>
          <span className="badge b-pending">{list.length}</span>
        </div>
        <div className="card-b">
          {loading ? (
            <div className="ps">Loading…</div>
          ) : list.length === 0 ? (
            <div className="empty" style={{ padding: "1.5rem" }}>
              <div className="empty-ic"><AppIcon name="check" /></div>
              <div className="empty-t">No payments pending</div>
              <div className="empty-s">Patient receipts will appear here.</div>
            </div>
          ) : (
            list.map((p) => (
              <div key={p._id} data-notification-appointment={p._id} tabIndex={-1} style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
                padding: "1rem", marginBottom: "0.85rem",
              }}>
                <div className="payment-verification-patient-header" style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem",
                }}>
                  <div className="payment-verification-patient">
                    <div style={{ fontWeight: 700 }}>{p.pname}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text2)" }}>
                      {p.pphone || p.pemail}
                    </div>
                  </div>
                  <div className="payment-verification-amount" style={{
                    fontFamily: "var(--font-d)", fontWeight: 800,
                    fontSize: "1.1rem", color: "var(--pri)", whiteSpace: "nowrap",
                  }}>
                    PKR {p.fee?.toLocaleString()}
                  </div>
                </div>

                {[
                  ["Appointment", `${p.date} · ${p.time}`],
                  ["Type", p.type === "online" ? "Online" : "Physical"],
                  ["Transaction ref", p.ref || "— not provided —"],
                ].map(([k, v]) => (
                  <div key={k} className={`payment-verification-detail${k === "Appointment" ? " payment-verification-appointment" : ""}`} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "0.88rem", padding: "0.4rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <span className="payment-verification-label" style={{ color: "var(--text2)" }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}

                <div className="payment-verification-actions" style={{ marginTop: "0.85rem" }}>
                  <button className="btn btn-ghost btn-sm payment-receipt-button" disabled={proofLoading === p._id} onClick={() => viewProof(p._id)}>
                    <AppIcon name="document" className="payment-receipt-icon" />
                    {proofLoading === p._id ? <span className="payment-action-label">Loading…</span> : <>
                      <span className="payment-action-label payment-receipt-full">View Receipt</span>
                      <span className="payment-action-label payment-receipt-short">Receipt</span>
                    </>}
                  </button>
                  <button className="btn btn-pri btn-sm"
                    disabled={busy === p._id}
                    onClick={() => setConfirmAction({ id: p._id, approve: true, patientName: p.pname, fee: p.fee })}>
                    <AppIcon name="check" className="payment-approve-check" /> <span className="payment-action-label">Approve</span>
                  </button>
                  <button className="btn btn-pri btn-sm payment-reject-action"
                    disabled={busy === p._id}
                    onClick={() => setConfirmAction({ id: p._id, approve: false, patientName: p.pname, fee: p.fee })}>
                    <AppIcon name="close" className="payment-reject-cross" /> <span className="payment-action-label">Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {confirmAction && (
        <div className="payment-confirm-backdrop" onMouseDown={() => setConfirmAction(null)}>
          <section className="payment-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="payment-confirm-title" aria-describedby="payment-confirm-message" onMouseDown={(event) => event.stopPropagation()}>
            <div className="payment-confirm-icon"><AppIcon name={confirmAction.approve ? "check" : "alert"} /></div>
            <h2 id="payment-confirm-title">{confirmAction.approve ? "Approve this payment?" : "Reject this payment?"}</h2>
            <p id="payment-confirm-message">
              {confirmAction.approve
                ? `Please verify the receipt and amount against your bank statement before approving ${confirmAction.patientName}’s payment of PKR ${Number(confirmAction.fee || 0).toLocaleString()}.`
                : `Are you sure you want to reject ${confirmAction.patientName}’s payment of PKR ${Number(confirmAction.fee || 0).toLocaleString()}?`}
            </p>
            <div className="payment-confirm-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmAction(null)}>No</button>
              <button type="button" className="btn btn-pri" onClick={() => {
                const decision = confirmAction;
                setConfirmAction(null);
                act(decision.id, decision.approve, decision.reason);
              }}>
                Yes, {confirmAction.approve ? "approve" : "reject"}
              </button>
            </div>
          </section>
        </div>
      )}

      {proofPreview && (
        <div className="payment-proof-backdrop" onMouseDown={() => setProofPreview(null)}>
          <section className="payment-proof-dialog" role="dialog" aria-modal="true" aria-labelledby="payment-proof-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="payment-proof-header">
              <h2 id="payment-proof-title">Payment receipt</h2>
              <button type="button" className="payment-proof-close" aria-label="Close receipt preview" onClick={() => setProofPreview(null)}>
                <AppIcon name="close" />
              </button>
            </header>
            <div className="payment-proof-content">
              {proofPreview.type === "application/pdf" ? (
                <iframe title="Payment receipt PDF" src={proofPreview.url} />
              ) : (
                <img src={proofPreview.url} alt="Uploaded payment receipt" />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
