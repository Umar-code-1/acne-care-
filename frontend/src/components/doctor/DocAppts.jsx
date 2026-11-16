import React, { useEffect, useRef, useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

export default function DocAppts({ appts = [], appointments = [], selectedPatientId = "", setSelectedPatientId, refresh, notify }) {
  const list = appts.length ? appts : appointments;
  const patientList = selectedPatientId
    ? list.filter((appointment) => String(appointment.pid) === String(selectedPatientId))
    : list;
  const selectedPatientName = patientList[0]?.pname || "Selected patient";

  const [tab, setTab] = useState("all");
  const [busy, setBusy] = useState(null);
  const [linkFor, setLinkFor] = useState(null);
  const [link, setLink] = useState("");
  const completeDialog = useRef(null);
  const appointmentToComplete = useRef(null);
  const [now, setNow] = useState(Date.now);
  const nextExpiration = patientList.reduce((next, appointment) => {
    const expires = Date.parse(appointment.completionUndoUntil);
    return appointment.status === "completed" && expires > now ? Math.min(next, expires) : next;
  }, Infinity);

  useEffect(() => {
    if (!Number.isFinite(nextExpiration)) return;
    const timer = window.setTimeout(() => setNow(Date.now()), Math.max(0, nextExpiration - Date.now()));
    return () => window.clearTimeout(timer);
  }, [nextExpiration, now]);

  const TABS = [
    { k: "all",       l: "All" },
    { k: "pending",   l: "Pending" },
    { k: "confirmed", l: "Confirmed" },
    { k: "completed", l: "Completed" },
    { k: "cancelled", l: "Cancelled" },
  ];
const isNew = (a) => {
    if (a.status !== "pending") return false;
    if (!a.createdAt) return false;
    const hours = (Date.now() - new Date(a.createdAt)) / 36e5;
    return hours < 24;
  };
  
  const shown = tab === "all" ? patientList : patientList.filter((a) => a.status === tab);

  const update = async (id, body, msg) => {
    setBusy(id);
    try {
      await API.put(`/appointments/${id}`, body);
      if (body.status === "completed" || body.undoCompletion) {
        setTab("all");
        setNow(Date.now());
      }
      notify?.(msg);
      refresh?.();
      setLinkFor(null);
      setLink("");
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Update failed"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="doctor-appointments">
      <div className="ph doctor-appointments-heading">
        <div>
          <div className="pt">{selectedPatientId ? `${selectedPatientName}'s Appointments` : "Appointments"}</div>
          <div className="ps">
            {selectedPatientId ? "All appointments for this patient" : "Confirm bookings, share meeting links, and mark visits complete"}
          </div>
        </div>
        {selectedPatientId && setSelectedPatientId && (
          <button
            className="btn btn-ghost btn-sm doctor-appointments-clear-patient"
            type="button"
            onClick={() => setSelectedPatientId("")}
          >
            All patients
          </button>
        )}
      </div>

      <div className="tab-bar doctor-appointments-tabs">
        {TABS.map((t) => (
          <button
            key={t.k}
            className={`tab ${tab === t.k ? "act" : ""}`}
            onClick={() => setTab(t.k)}
          >
            {t.l} ({t.k === "all" ? patientList.length : patientList.filter((a) => a.status === t.k).length})
          </button>
        ))}
      </div>

      <label className="doctor-appointments-filter">
        <span>Filter</span>
        <span className="doctor-appointments-select-wrap">
          <select className="form-i" value={tab} onChange={(event) => setTab(event.target.value)}>
            {TABS.map((t) => (
              <option key={t.k} value={t.k}>
                {t.l} ({t.k === "all" ? patientList.length : patientList.filter((a) => a.status === t.k).length})
              </option>
            ))}
          </select>
        </span>
      </label>

      {shown.length === 0 ? (
        <div className="empty">
          <div className="empty-ic"><AppIcon name="calendar" /></div>
          <div className="empty-t">No {tab === "all" ? "" : tab} appointments</div>
          <div className="empty-s">Bookings from patients will appear here.</div>
        </div>
      ) : (
        shown.map((a) => (
          <div key={a._id || a.id} className="card doctor-appointment-card" data-notification-appointment={a._id || a.id} tabIndex={-1}>
            <div className="card-b">

              <div className="doctor-appointment-header">
                <div className="doc-av av-p doctor-appointment-avatar">{a.pname?.[0]?.toUpperCase() || "?"}</div>
                <div className="doctor-appointment-patient">
                  <div style={{ fontWeight: 700 }}>{a.pname || "Unknown patient"}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text2)" }}>
                    {a.pphone || "No contact"}
                  </div>
                </div>
                <div className="doctor-appointment-badges">
                  {isNew(a) && (
                    <span className="badge" style={{ background: "var(--pri)", color: "#fff" }}>
                      NEW
                    </span>
                  )}
                  <span className={`badge b-${a.status}`}>{a.status}</span>
                  <span className={`badge b-${a.payment || "unpaid"}`}>
                      {a.payment === "paid" ? <><AppIcon name="check" /> Paid</>
                        : a.payment === "pending_verification" ? <><AppIcon name="search" /> Verifying</>
                        : a.payment === "rejected" ? <><AppIcon name="closeCircle" /> Rejected</>
                        : <><AppIcon name="alert" /> Unpaid</>}
                    </span>
                </div>
              </div>

              <div className="g2" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
                {[
                  ["Date", a.date],
                  ["Time", a.time],
                  ["Type", a.type === "online" ? (a.plat || "Online") : "Physical"],
                  ["Fee", a.fee ? `Rs ${a.fee}` : "—"],
                  ["Acne Type", a.atype || "—"],
                  ["Severity", a.sev || "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "0.82rem", padding: "0.3rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <span style={{ color: "var(--text2)" }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>

              {a.link && (
                <div className="alert al-info doctor-appointment-link-display">
                  <AppIcon name="arrowRight" />
                  <a href={a.link} target="_blank" rel="noreferrer">{a.link}</a>
                  {a.type === "online" && a.status !== "cancelled" && (
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => { setLinkFor(a._id || a.id); setLink(a.link); }}
                    >
                      Edit Link
                    </button>
                  )}
                </div>
              )}

              {linkFor === (a._id || a.id) && (
                <form
                  className="doctor-meeting-link-card"
                  onSubmit={(event) => {
                    event.preventDefault();
                    update(a._id || a.id, { meetingLink: link.trim() }, "✅ Meeting link shared");
                  }}
                >
                  <div className="doctor-meeting-link-heading">
                    <AppIcon name="video" />
                    <span>Meeting link</span>
                  </div>
                  <label className="form-l" htmlFor={"meeting-link-" + (a._id || a.id)}>
                    Paste the link for the patient
                  </label>
                  <input
                    id={"meeting-link-" + (a._id || a.id)}
                    className="form-i"
                    type="url"
                    inputMode="url"
                    placeholder="https://zoom.us/j/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                  <div className="doctor-meeting-link-actions">
                    <button
                      className="btn btn-pri btn-sm"
                      type="submit"
                      disabled={!link.trim() || busy === (a._id || a.id)}
                    >
                      Save &amp; Share Link
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => { setLinkFor(null); setLink(""); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="doctor-appointment-actions">
                {a.status === "pending" && (
                  <button
                    className="btn btn-pri btn-sm doctor-appointment-main-action"
                    disabled={busy === (a._id || a.id)}
                    onClick={() => update(a._id || a.id, { status: "confirmed" }, "✅ Appointment confirmed")}
                  >
                    Confirm
                  </button>
                )}

                {a.status === "confirmed" && (
                  <button
                    className="btn btn-sec btn-sm doctor-appointment-main-action"
                    disabled={busy === (a._id || a.id) || (a.type === "online" && !a.link?.trim())}
                    onClick={() => {
                      appointmentToComplete.current = a._id || a.id;
                      completeDialog.current.returnValue = "";
                      completeDialog.current.showModal();
                    }}
                  >
                    Mark Completed
                  </button>
                )}

                {a.status === "completed" && Date.parse(a.completionUndoUntil) > now && (
                  <button type="button" className="btn btn-ghost btn-sm" disabled={busy === (a._id || a.id)}
                    onClick={() => update(a._id || a.id, { undoCompletion: true }, "Appointment restored to Confirmed") }>
                    Undo completion
                  </button>
                )}

                {a.type === "online" && ["pending", "confirmed"].includes(a.status) && !a.link && linkFor !== (a._id || a.id) && (
                  <button
                    className="btn btn-ghost btn-sm doctor-meeting-link-trigger"
                    onClick={() => { setLinkFor(a._id || a.id); setLink(a.link || ""); }}
                  >
                    <><span aria-hidden="true">+</span> Add Meeting Link</>
                  </button>
                )}

                {["pending", "confirmed"].includes(a.status) && (
                  <button
                    className="btn btn-dan btn-sm doctor-appointment-cancel-action"
                    disabled={busy === (a._id || a.id)}
                    onClick={() => update(a._id || a.id, { status: "cancelled" }, "Appointment cancelled")}
                  >
                    Cancel
                  </button>
                )}
              </div>
              {a.status === "confirmed" && a.type === "online" && !a.link?.trim() && (
                <p className="form-hint">Share the meeting link before marking this appointment complete.</p>
              )}

            </div>
          </div>
        ))
      )}
      <dialog ref={completeDialog} className="payment-confirm-dialog appointment-complete-dialog"
        aria-labelledby="appointment-complete-title"
        onClose={(event) => {
          const id = appointmentToComplete.current;
          appointmentToComplete.current = null;
          if (id && event.currentTarget.returnValue === "yes") {
            update(id, { status: "completed" }, "✅ Appointment completed. Undo is available for five minutes.");
          }
        }}>
        <div className="payment-confirm-icon"><AppIcon name="check" /></div>
        <h2 id="appointment-complete-title">Mark this appointment as complete?</h2>
        <form method="dialog" className="payment-confirm-actions">
          <button className="btn btn-ghost" value="no">No</button>
          <button className="btn btn-pri" value="yes">Yes</button>
        </form>
      </dialog>
    </div>
  );
}
