import { useEffect, useMemo, useRef, useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";
import { pkr, monthLabel, dateLabel, loadFeeReceipt } from "../shared/platformFee";
import FeeBadge from "../shared/FeeBadge";

// Doctor: monthly platform fee (patients pay the doctor directly; doctor pays AcneCare its share)
export default function DocPlatformFee({ notify }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMonth, setViewMonth] = useState("");
  const [payMonth, setPayMonth] = useState("");
  const [file, setFile] = useState(null);
  const [txRef, setTxRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState("");
  const fileRef = useRef(null);

  const fetchFees = (month) => API.get("/platform-fees/my", { params: month ? { month } : {} })
    .then((r) => {
      setData(r.data);
      setViewMonth(r.data.selectedMonth);
      setError("");
    })
    .catch((err) => setError(err.response?.data?.message || "Could not load your platform fee."))
    .finally(() => setLoading(false));

  const load = (month) => {
    setLoading(true);
    fetchFees(month);
  };

  useEffect(() => { fetchFees(); }, []);
  useEffect(() => () => { if (preview?.url) URL.revokeObjectURL(preview.url); }, [preview]);

  const payable = useMemo(() => (data?.history || []).filter((r) => r.canPay), [data]);
  // chosen month, or the oldest-due first payable month
  const payRow = payable.find((r) => r.month === payMonth) || payable[0];

  const submit = async (e) => {
    e.preventDefault();
    if (!payRow) return;
    if (!file) return setFormError("Please choose your payment receipt (JPG, PNG or PDF).");
    setFormError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("proof", file);
      fd.append("transactionRef", txRef.trim());
      const res = await API.post(`/platform-fees/${payRow.month}/proof`, fd);
      notify?.("✅ " + res.data.message);
      setFile(null);
      setTxRef("");
      if (fileRef.current) fileRef.current.value = "";
      load(viewMonth);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not submit your receipt.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading && !data) return <div className="ps">Loading…</div>;
  if (error && !data) {
    return <div className="alert al-dan"><AppIcon name="alert" /> {error}</div>;
  }

  const { rate, current, totalDue, overdueCount, history, appointments, company, selected } = data;
  const rejected = history.find((r) => r.rejectionNote && r.canPay);

  return (
    <div className="pf-page">
      <div className="ph">
        <div className="pt">Platform Fee</div>
        <div className="ps">Patients pay you directly. Each month you pay AcneCare {rate}% of your paid appointments.</div>
      </div>

      {overdueCount > 0 && (
        <div className="alert al-dan">
          <AppIcon name="alert" />
          <span>You have <strong>{pkr(totalDue)}</strong> overdue. Please pay it to keep your account in good standing.</span>
        </div>
      )}
      {rejected && (
        <div className="alert al-warn">
          <AppIcon name="alert" />
          <span>Your receipt for <strong>{monthLabel(rejected.month)}</strong> was rejected: {rejected.rejectionNote} Please upload it again.</span>
        </div>
      )}

      <div className="stat-grid">
        {[
          ["calendar", "pri", current.appointmentCount, `Paid appointments · ${monthLabel(current.month)}`],
          ["wallet", "sec", pkr(current.grossAmount), "Your earnings this month"],
          ["chart", "acc", pkr(current.feeAmount), `Platform fee (${rate}%) · due ${dateLabel(current.dueDate)}`],
          ["card", totalDue > 0 ? "dan" : "ok", pkr(totalDue), totalDue > 0 ? "Balance to pay now" : "Nothing to pay now"],
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

      {/* ---------- Pay to AcneCare ---------- */}
      <div className="card pf-card">
        <div className="card-h">
          <div className="card-t"><AppIcon name="upload" /> Pay to AcneCare</div>
          {payable.length > 0 && <span className="badge b-pending">{payable.length} due</span>}
        </div>
        <div className="card-b">
          {payable.length === 0 ? (
            <div className="pf-nothing">
              <div className="pf-nothing-ic"><AppIcon name="check" /></div>
              <div>
                <strong>You're all caught up.</strong>
                <div className="pf-muted">
                  {current.feeAmount > 0
                    ? `This month's fee so far is ${pkr(current.feeAmount)}. You can pay it after ${monthLabel(current.month)} ends, by ${dateLabel(current.dueDate)}.`
                    : "Your fee is calculated from paid appointments at the end of each month."}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="pf-pay">
              <div className="pf-pay-grid">
                <div>
                  <div className="form-g">
                    <label className="form-l" htmlFor="pf-month">Month</label>
                    <select id="pf-month" className="form-i" value={payRow?.month || ""} onChange={(e) => setPayMonth(e.target.value)}>
                      {payable.map((r) => (
                        <option key={r.month} value={r.month}>
                          {monthLabel(r.month)} — {pkr(r.balanceDue)}{r.status === "overdue" ? " (overdue)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pf-amount">
                    <span>Amount to pay</span>
                    <strong>{pkr(payRow?.balanceDue)}</strong>
                    <small>{payRow?.appointmentCount} appointment{payRow?.appointmentCount === 1 ? "" : "s"} · {pkr(payRow?.grossAmount)} × {rate}%{payRow?.paidAmount ? ` − ${pkr(payRow.paidAmount)} already paid` : ""} · due {dateLabel(payRow?.dueDate)}</small>
                  </div>
                </div>

                <div className="pf-company">
                  <div className="pf-company-t">Send payment to</div>
                  {company.configured ? (
                    [
                      ["Bank", company.bankName],
                      ["Account title", company.accountTitle],
                      ["Account number", company.accountNumber],
                      ["IBAN", company.iban],
                      ["JazzCash", company.jazzcash],
                      ["Easypaisa", company.easypaisa],
                    ].filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="pf-company-row"><span>{k}</span><strong>{v}</strong></div>
                    ))
                  ) : (
                    <div className="alert al-warn" style={{ marginBottom: 0 }}>
                      <AppIcon name="alert" /> AcneCare's payment account isn't set up yet. Please contact support before paying.
                    </div>
                  )}
                </div>
              </div>

              <div className="pf-upload-grid">
                <div className="form-g">
                  <label className="form-l" htmlFor="pf-ref">Transaction ID <span className="pf-muted">(optional)</span></label>
                  <input id="pf-ref" className="form-i" value={txRef} maxLength={80} onChange={(e) => setTxRef(e.target.value)} placeholder="e.g. TXN123456" />
                </div>
                <div className="form-g">
                  <label className="form-l" htmlFor="pf-file">Payment receipt</label>
                  <input id="pf-file" ref={fileRef} className="form-i" type="file" accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => { setFile(e.target.files?.[0] || null); setFormError(""); }} />
                </div>
              </div>

              {formError && <div className="alert al-dan"><AppIcon name="alert" /> {formError}</div>}

              <button className="btn btn-pri pf-submit" type="submit" disabled={submitting || !company.configured}>
                <AppIcon name="upload" /> {submitting ? "Submitting…" : `Submit receipt for ${pkr(payRow?.balanceDue)}`}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ---------- Appointments in a month ---------- */}
      <div className="card pf-card">
        <div className="card-h pf-card-h-wrap">
          <div className="card-t"><AppIcon name="calendar" /> Paid appointments</div>
          <select className="form-i pf-month-select" aria-label="Choose month" value={viewMonth}
            onChange={(e) => { setViewMonth(e.target.value); load(e.target.value); }}>
            {history.map((r) => <option key={r.month} value={r.month}>{monthLabel(r.month)}</option>)}
          </select>
        </div>
        <div className="card-b">
          {appointments.length === 0 ? (
            <div className="empty" style={{ padding: "1.25rem" }}>
              <div className="empty-t">No paid appointments in {monthLabel(viewMonth)}</div>
              <div className="empty-s">Only appointments with a verified patient payment count towards the fee.</div>
            </div>
          ) : (
            <>
              <div className="pf-list">
                {appointments.map((a) => (
                  <div key={a._id} className="pf-list-row">
                    <div className="pf-list-main">
                      <strong>{a.patientName}</strong>
                      <span className="pf-muted">{dateLabel(a.date)} · {a.time} · {a.type === "online" ? "Online" : "Physical"}</span>
                    </div>
                    <div className="pf-list-amt">
                      <strong>{pkr(a.fee)}</strong>
                      <span className="pf-muted">fee {pkr(a.platformFee)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pf-total-row">
                <span>{selected.appointmentCount} appointments · {pkr(selected.grossAmount)}</span>
                <strong>Platform fee {pkr(selected.feeAmount)}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------- History ---------- */}
      <div className="card pf-card">
        <div className="card-h">
          <div className="card-t"><AppIcon name="document" /> Payment history</div>
        </div>
        <div className="card-b">
          <div className="pf-list">
            {history.map((r) => (
              <div key={r.month} className="pf-list-row">
                <div className="pf-list-main">
                  <strong>{monthLabel(r.month)}</strong>
                  <span className="pf-muted">
                    {r.appointmentCount} appt{r.appointmentCount === 1 ? "" : "s"} · earned {pkr(r.grossAmount)}
                    {r.paidAmount > 0 && ` · paid ${pkr(r.paidAmount)}`}
                    {r.status !== "paid" && r.status !== "no_fee" && r.status !== "running" && ` · due ${dateLabel(r.dueDate)}`}
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
        </div>
      </div>

      {preview && (
        <div className="payment-proof-backdrop" onMouseDown={() => setPreview(null)}>
          <section className="payment-proof-dialog" role="dialog" aria-modal="true" aria-labelledby="pf-proof-title" onMouseDown={(e) => e.stopPropagation()}>
            <header className="payment-proof-header">
              <h2 id="pf-proof-title">Platform fee receipt</h2>
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
