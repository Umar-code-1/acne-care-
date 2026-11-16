import { useEffect, useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";
import { pkr, monthLabel, dateLabel, loadFeeReceipt } from "../shared/platformFee";
import FeeBadge from "../shared/FeeBadge";

// last 12 months, newest first ("YYYY-MM")
const recentMonths = (from) => {
  const [y, m] = from.split("-").map(Number);
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - i, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  });
};

// Admin: every doctor's monthly platform fee + receipt verification
export default function AdminPlatformFees({ notify }) {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [reason, setReason] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState("");

  const fetchFees = (m) => API.get("/platform-fees", { params: m ? { month: m } : {} })
    .then((r) => { setData(r.data); setMonth(r.data.month); setError(""); })
    .catch((err) => setError(err.response?.data?.message || "Could not load platform fees."))
    .finally(() => setLoading(false));

  const load = (m) => {
    setLoading(true);
    fetchFees(m);
  };

  useEffect(() => { fetchFees(); }, []);
  useEffect(() => () => { if (preview?.url) URL.revokeObjectURL(preview.url); }, [preview]);

  const viewReceipt = async (id) => {
    setPreviewLoading(id);
    try {
      setPreview(await loadFeeReceipt(id));
    } catch {
      notify?.("❌ Could not load receipt");
    } finally {
      setPreviewLoading("");
    }
  };

  const decide = async () => {
    const c = confirm;
    if (!c.approve && !reason.trim()) return;
    setConfirm(null);
    setBusy(c.id);
    try {
      const res = await API.put(`/platform-fees/${c.id}/verify`, { approve: c.approve, reason: reason.trim() });
      notify?.((c.approve ? "✅ " : "") + res.data.message);
      setReason("");
      load(month);
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Action failed"));
    } finally {
      setBusy("");
    }
  };

  if (loading && !data) return <div className="ps">Loading…</div>;
  if (error && !data) return <div className="alert al-dan"><AppIcon name="alert" /> {error}</div>;

  const { rate, totals, rows, pending, currentMonth } = data;

  return (
    <div className="pf-page">
      <div className="ph pf-ph">
        <div>
          <div className="pt">Platform Fees</div>
          <div className="ps">Doctors pay AcneCare {rate}% of their paid appointments each month, by the 10th of the next month.</div>
        </div>
        <select className="form-i pf-month-select" aria-label="Choose month" value={month}
          onChange={(e) => load(e.target.value)}>
          {recentMonths(currentMonth).map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
      </div>

      <div className="stat-grid">
        {[
          ["chart", "pri", pkr(totals.feeAmount), `Total fees · ${monthLabel(month)}`],
          ["check", "ok", pkr(totals.collected), "Collected"],
          ["clock", "acc", pkr(totals.pending), "Under review"],
          ["alert", totals.outstanding > 0 ? "dan" : "ok", pkr(totals.outstanding), month === currentMonth ? "Not yet due" : "Outstanding"],
        ].map(([ic, c, v, l]) => (
          <div key={l} className="stat-c">
            <div className="stat-ic" style={{ background: `var(--${c}-l)`, color: `var(--${c})` }}><AppIcon name={ic} /></div>
            <div>
              <div className="stat-v pf-stat-v" style={{ color: `var(--${c})` }}>{v}</div>
              <div className="stat-l">{l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- receipts waiting ---------- */}
      <div className="card pf-card">
        <div className="card-h">
          <div className="card-t"><AppIcon name="clock" /> Receipts to verify</div>
          <span className="badge b-pending">{pending.length}</span>
        </div>
        <div className="card-b">
          {pending.length === 0 ? (
            <div className="empty" style={{ padding: "1.25rem" }}>
              <div className="empty-ic"><AppIcon name="check" /></div>
              <div className="empty-t">No receipts waiting</div>
              <div className="empty-s">Doctor platform fee receipts will appear here.</div>
            </div>
          ) : pending.map((p) => (
            <div key={p.id} className="pf-review">
              <div className="pf-review-top">
                <div>
                  <strong>{p.doctorName}</strong>
                  <div className="pf-muted">{p.doctorEmail}</div>
                </div>
                <strong className="pf-review-amt">{pkr(p.pendingAmount)}</strong>
              </div>
              {[
                ["Month", monthLabel(p.month)],
                ["Appointments", `${p.appointmentCount} · ${pkr(p.grossAmount)} earned`],
                [`Fee (${p.rate}%)`, pkr(p.feeAmount) + (p.paidAmount ? ` (${pkr(p.paidAmount)} already paid)` : "")],
                ["Transaction ID", p.transactionRef || "— not provided —"],
                ["Submitted", p.submittedAt ? new Date(p.submittedAt).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" }) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="pf-company-row"><span>{k}</span><strong>{v}</strong></div>
              ))}
              <div className="pf-review-actions">
                <button className="btn btn-ghost btn-sm" disabled={previewLoading === p.id} onClick={() => viewReceipt(p.id)}>
                  <AppIcon name="document" /> {previewLoading === p.id ? "Loading…" : "View receipt"}
                </button>
                <button className="btn btn-pri btn-sm" disabled={busy === p.id}
                  onClick={() => { setReason(""); setConfirm({ id: p.id, approve: true, p }); }}>
                  <AppIcon name="check" /> Approve
                </button>
                <button className="btn btn-pri btn-sm payment-reject-action" disabled={busy === p.id}
                  onClick={() => { setReason(""); setConfirm({ id: p.id, approve: false, p }); }}>
                  <AppIcon name="close" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- every doctor this month ---------- */}
      <div className="card pf-card">
        <div className="card-h">
          <div className="card-t"><AppIcon name="users" /> Doctors · {monthLabel(month)}</div>
          <span className="pf-muted">{totals.doctors} with fees</span>
        </div>
        <div className="card-b">
          {rows.length === 0 ? (
            <div className="empty" style={{ padding: "1.25rem" }}>
              <div className="empty-t">No paid appointments in {monthLabel(month)}</div>
            </div>
          ) : (
            <div className="pf-list">
              {rows.map((r) => (
                <div key={r.doctorId} className="pf-list-row">
                  <div className="pf-list-main">
                    <strong>{r.doctorName}</strong>
                    <span className="pf-muted">
                      {r.appointmentCount} appt{r.appointmentCount === 1 ? "" : "s"} · earned {pkr(r.grossAmount)}
                      {r.paidAmount > 0 && ` · paid ${pkr(r.paidAmount)}`}
                      {r.balanceDue > 0 && r.status !== "running" && ` · ${pkr(r.balanceDue)} due ${dateLabel(r.dueDate)}`}
                    </span>
                  </div>
                  <div className="pf-list-amt">
                    <strong>{pkr(r.feeAmount)}</strong>
                    <div className="pf-list-actions">
                      <FeeBadge status={r.status} />
                      {r.hasProof && r.id && (
                        <button type="button" className="btn btn-ghost btn-sm" disabled={previewLoading === r.id} onClick={() => viewReceipt(r.id)}>
                          {previewLoading === r.id ? "…" : "Receipt"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {rows.length > 0 && (
            <div className="pf-total-row">
              <span>Doctors earned {pkr(totals.grossAmount)}</span>
              <strong>AcneCare fee {pkr(totals.feeAmount)}</strong>
            </div>
          )}
        </div>
      </div>

      {confirm && (
        <div className="payment-confirm-backdrop" onMouseDown={() => setConfirm(null)}>
          <section className="payment-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="pf-confirm-title" onMouseDown={(e) => e.stopPropagation()}>
            <div className="payment-confirm-icon"><AppIcon name={confirm.approve ? "check" : "alert"} /></div>
            <h2 id="pf-confirm-title">{confirm.approve ? "Approve this platform fee?" : "Reject this receipt?"}</h2>
            <p>
              {confirm.approve
                ? `Check that ${pkr(confirm.p.pendingAmount)} from ${confirm.p.doctorName} for ${monthLabel(confirm.p.month)} has reached AcneCare's account before approving.`
                : `Tell ${confirm.p.doctorName} why the receipt for ${monthLabel(confirm.p.month)} was rejected. They can upload a new one.`}
            </p>
            {!confirm.approve && (
              <textarea className="form-i" rows={3} maxLength={300} value={reason} autoFocus
                onChange={(e) => setReason(e.target.value)} placeholder="e.g. Amount doesn't match, receipt unclear" style={{ marginBottom: "0.75rem" }} />
            )}
            <div className="payment-confirm-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button type="button" className="btn btn-pri" onClick={decide} disabled={!confirm.approve && !reason.trim()}>
                Yes, {confirm.approve ? "approve" : "reject"}
              </button>
            </div>
          </section>
        </div>
      )}

      {preview && (
        <div className="payment-proof-backdrop" onMouseDown={() => setPreview(null)}>
          <section className="payment-proof-dialog" role="dialog" aria-modal="true" aria-labelledby="pf-admin-proof-title" onMouseDown={(e) => e.stopPropagation()}>
            <header className="payment-proof-header">
              <h2 id="pf-admin-proof-title">Platform fee receipt</h2>
              <button type="button" className="payment-proof-close" aria-label="Close receipt preview" onClick={() => setPreview(null)}>
                <AppIcon name="close" />
              </button>
            </header>
            <div className="payment-proof-content">
              {preview.type === "application/pdf"
                ? <iframe title="Receipt PDF" src={preview.url} />
                : <img src={preview.url} alt="Platform fee receipt" />}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
