import React, { useState, useEffect } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

export default function DocPayments({ notify }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");

  const load = () => {
    setLoading(true);
    API.get("/payments/pending")
      .then((r) => setList(r.data))
      .catch(() => notify?.("Could not load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const act = async (id, approve, why) => {
    setBusy(id);
    try {
      await API.put(`/payments/${id}/verify`, { approve, reason: why });
      notify?.(approve ? "✅ Payment verified" : "Payment rejected");
      setRejectId(null);
      setReason("");
      load();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Action failed"));
    } finally {
      setBusy("");
    }
  };

  const viewProof = async (id) => {
    try {
      const res = await API.get(`/payments/${id}/proof`, { responseType: "blob" });
      window.open(URL.createObjectURL(res.data), "_blank");
    } catch {
      notify?.("❌ No receipt found");
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
              <div key={p._id} style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
                padding: "1rem", marginBottom: "0.85rem",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem",
                }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.pname}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text2)" }}>
                      {p.pphone || p.pemail}
                    </div>
                  </div>
                  <div style={{
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
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "0.81rem", padding: "0.3rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <span style={{ color: "var(--text2)" }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.85rem" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => viewProof(p._id)}>
                    <AppIcon name="document" /> View Receipt
                  </button>
                  <button className="btn btn-pri btn-sm"
                    disabled={busy === p._id}
                    onClick={() => act(p._id, true)}>
                    <AppIcon name="check" /> Approve
                  </button>
                  <button className="btn btn-dan btn-sm"
                    disabled={busy === p._id}
                    onClick={() => setRejectId(p._id)}>
                    <AppIcon name="close" /> Reject
                  </button>
                </div>

                {rejectId === p._id && (
                  <div className="alert al-dan" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                    <div style={{ width: "100%" }}>
                      <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                        Reason for rejection
                      </div>
                      <input className="form-i" value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Amount does not match"
                        style={{ marginBottom: "0.5rem" }} />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-dan btn-sm"
                          onClick={() => act(p._id, false, reason)}>
                          Confirm Rejection
                        </button>
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => { setRejectId(null); setReason(""); }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
