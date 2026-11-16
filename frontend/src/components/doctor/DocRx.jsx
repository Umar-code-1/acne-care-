// src/components/doctor/DocRx.jsx
import React, { useEffect, useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";
import RxCard from "../shared/RxCard";
import ScanImage from "../shared/ScanImage";

function DocRx({ appts = [], rx = [], refresh, notify }) {
  const [tab, setTab] = useState("list");
  const [selAppt, setSelAppt] = useState("");
  const [inst, setInst] = useState("");
  const [fu, setFu] = useState("");
  const [saving, setSaving] = useState(false);
  const [patientDetailsOpen, setPatientDetailsOpen] = useState(false);
  const [patientScans, setPatientScans] = useState([]);
  const [loadingPatientScans, setLoadingPatientScans] = useState(false);
  const [patientScansError, setPatientScansError] = useState("");
  const [unreadChatCounts, setUnreadChatCounts] = useState(null);

  useEffect(() => {
    if (tab !== "list") return undefined;
    let active = true;
    let inFlight = false;
    const loadUnreadCounts = async () => {
      if (inFlight || document.visibilityState === "hidden") return;
      inFlight = true;
      try {
        const { data } = await API.get("/messages/unread-counts");
        if (active && data && typeof data === "object") setUnreadChatCounts(data);
      } catch {
        // Keep the initial counts from the prescription list if polling is unavailable.
      } finally {
        inFlight = false;
      }
    };
    loadUnreadCounts();
    const intervalId = window.setInterval(loadUnreadCounts, 10000);
    document.addEventListener("visibilitychange", loadUnreadCounts);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", loadUnreadCounts);
    };
  }, [tab]);

  const rxId = (r) => String(r.apid || "");
  const formatAppointmentDate = (value) => {
    const date = new Date(`${String(value || "").slice(0, 10)}T12:00:00`);
    return Number.isNaN(date.valueOf())
      ? "Date unavailable"
      : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  };
  const formatAppointmentFullDate = (value) => {
    const date = new Date(`${String(value || "").slice(0, 10)}T12:00:00`);
    return Number.isNaN(date.valueOf())
      ? "Date unavailable"
      : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
  };
  // confirmed ya completed — jin par abhi tak plan nahi bana
  const openAppts = appts.filter(
    (a) =>
      ["confirmed", "completed"].includes(a.status) &&
      !rx.some((r) => rxId(r) === String(a._id || a.id))
  );

  const curAppt = appts.find((a) => String(a._id || a.id) === String(selAppt));
  const patientAppointments = curAppt
    ? appts.filter((appointment) => String(appointment.pid) === String(curAppt.pid))
    : [];
  const patientPlans = curAppt
    ? rx.filter((plan) => String(plan.pid) === String(curAppt.pid))
    : [];

  const openPatientDetails = async () => {
    if (!curAppt?.pid) return;
    setPatientDetailsOpen(true);
    setLoadingPatientScans(true);
    setPatientScansError("");
    try {
      const { data } = await API.get(`/scans/patient/${curAppt.pid}`);
      setPatientScans(Array.isArray(data) ? data : []);
    } catch (error) {
      setPatientScansError(error.response?.data?.message || "Could not load scan history.");
      setPatientScans([]);
    } finally {
      setLoadingPatientScans(false);
    }
  };

  const resetForm = () => {
    setSelAppt("");
    setInst("");
    setFu("");
  };

  const save = async () => {
    if (!curAppt || !inst.trim() || !fu) return;
    setSaving(true);

    try {
      await API.post("/prescriptions", {
        patientId: curAppt.pid,
        appointmentId: curAppt._id || curAppt.id,
        instructions: inst,
        followUp: fu,
      });

      notify?.("✅ Skincare plan saved and sent to patient!");
      resetForm();
      setTab("list");
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Could not save plan"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="ph">
        <div className="section-row">
          <div>
            <div className="pt">Skincare Plans</div>
            <div className="ps">Write and manage patient skincare plans</div>
          </div>
          <button className="btn btn-pri" onClick={() => setTab("write")}>
            Write New Plan
          </button>
        </div>
      </div>

      <div className="tab-bar">
        <button
          className={`tab ${tab === "list" ? "act" : ""}`}
          onClick={() => setTab("list")}
        >
          All Plans ({rx.length})
        </button>
        <button
          className={`tab ${tab === "write" ? "act" : ""}`}
          onClick={() => setTab("write")}
        >
          Write New ({openAppts.length})
        </button>
      </div>

      {/* ---------- LIST ---------- */}
      {tab === "list" &&
        (rx.length === 0 ? (
          <div className="empty">
            <div className="empty-ic"><AppIcon name="bottle" /></div>
            <div className="empty-t">No skincare plans yet</div>
            <div className="empty-s">
              Confirm an appointment, then write a plan for that patient.
            </div>
          </div>
        ) : (
          rx.map((p) => (
            <RxCard key={p._id || p.id} rx={{
              ...p,
              unreadChatCount: unreadChatCounts?.[String(p._id || p.id)] ?? p.unreadChatCount ?? 0,
            }} showPatient showDoctor instructionMode="doctor" />
          ))
        ))}

      {/* ---------- WRITE ---------- */}
      {tab === "write" && (
        <div className="card">
          <div className="card-h">
            <div className="card-t">Write Skincare Plan</div>
          </div>
          <div className="card-b">
            {openAppts.length === 0 ? (
              <div className="alert al-warn">
                No appointments available. Confirm an appointment first, or all
                your appointments already have plans.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.1rem" }}>
                <div className="form-g">
                  <label className="form-l">Select Appointment</label>
                  <div className="doctor-plan-select-wrap">
                    <select
                      className="form-i doctor-plan-appointment-select"
                      value={selAppt}
                      onChange={(e) => setSelAppt(e.target.value)}
                    >
                      <option value="">-- Select Appointment --</option>
                      {openAppts.map((a) => (
                        <option key={a._id || a.id} value={a._id || a.id}>
                          {a.pname} • {formatAppointmentDate(a.date)}
                        </option>
                      ))}
                    </select>
                    <AppIcon name="arrowDown" className="doctor-plan-select-arrow" />
                  </div>
                </div>

                {curAppt && (
                  <>
                    <div className="doctor-plan-selected-appointment">
                      <div><span>Patient</span><strong>{curAppt.pname}</strong></div>
                      <div><span>Date</span><strong>{formatAppointmentFullDate(curAppt.date)}</strong></div>
                      <div className="doctor-plan-appointment-id"><span>Full Appointment ID</span><code>{String(curAppt._id || curAppt.id || "")}</code></div>
                    </div>
                    <button type="button" className="btn btn-ghost doctor-plan-patient-details-button" onClick={openPatientDetails}>
                      View all patient information
                    </button>
                  </>
                )}

                <div className="form-g">
                  <label className="form-l">Special Instructions</label>
                  <textarea
                    className="form-i"
                    placeholder="E.g., Avoid sun exposure. Use SPF 30 daily. Do not pop pimples..."
                    value={inst}
                    onChange={(e) => setInst(e.target.value)}
                  />
                </div>

                <div className="form-g">
                  <label className="form-l">Follow-up Date</label>
                  <input
                    className="form-i"
                    type="date"
                    value={fu}
                    onChange={(e) => setFu(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    className="btn btn-pri"
                    onClick={save}
                    disabled={saving || !selAppt || !inst.trim() || !fu}
                  >
                    {saving ? <><AppIcon name="clock" /> Saving...</> : "Save & Send to Patient"}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      resetForm();
                      setTab("list");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {patientDetailsOpen && curAppt && (
        <div className="doctor-patient-details-backdrop" onMouseDown={() => setPatientDetailsOpen(false)}>
          <section className="doctor-patient-details-dialog" role="dialog" aria-modal="true" aria-labelledby="doctor-patient-details-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="doctor-patient-details-header">
              <div>
                <h2 id="doctor-patient-details-title">Patient information</h2>
                <p>{curAppt.pname} · Patient ID: {curAppt.pid}</p>
              </div>
              <button type="button" className="payment-proof-close" aria-label="Close patient information" onClick={() => setPatientDetailsOpen(false)}><AppIcon name="close" /></button>
            </header>
            <div className="doctor-patient-details-content">
              <section className="doctor-patient-details-section">
                <h3>Profile</h3>
                <dl className="doctor-patient-details-grid">
                  <div><dt>Name</dt><dd>{curAppt.pname || "—"}</dd></div>
                  <div><dt>Email</dt><dd>{curAppt.pemail || "—"}</dd></div>
                  <div><dt>Phone</dt><dd>{curAppt.pphone || "—"}</dd></div>
                  <div><dt>Age</dt><dd>{curAppt.page || "—"}</dd></div>
                  <div><dt>Gender</dt><dd>{curAppt.pgender || "—"}</dd></div>
                  <div><dt>Skin type</dt><dd>{curAppt.pskinType || "—"}</dd></div>
                </dl>
              </section>
              <section className="doctor-patient-details-section">
                <h3>Appointments with you ({patientAppointments.length})</h3>
                {patientAppointments.length ? patientAppointments.map((appointment) => (
                  <article className="doctor-patient-history-item" key={appointment._id || appointment.id}>
                    <div><strong>{formatAppointmentFullDate(appointment.date)}</strong><span>{appointment.time} · {appointment.type || "Appointment"}</span></div>
                    <span className={`badge b-${appointment.status}`}>{appointment.status}</span>
                  </article>
                )) : <p className="doctor-patient-details-empty">No appointment history found.</p>}
              </section>
              <section className="doctor-patient-details-section">
                <h3>Skincare plans ({patientPlans.length})</h3>
                {patientPlans.length ? patientPlans.map((plan) => (
                  <article className="doctor-patient-plan-item" key={plan._id || plan.id}>
                    <strong>{formatAppointmentFullDate(plan.date)}</strong>
                    <p>{plan.inst || "No special instructions recorded."}</p>
                    {plan.fu && <span>Follow-up: {formatAppointmentFullDate(plan.fu)}</span>}
                  </article>
                )) : <p className="doctor-patient-details-empty">No skincare plans found.</p>}
              </section>
              <section className="doctor-patient-details-section">
                <h3>AI skin scans</h3>
                {loadingPatientScans ? <p className="doctor-patient-details-empty">Loading scan history…</p> : patientScansError ? <p className="doctor-patient-details-error">{patientScansError}</p> : patientScans.length ? (
                  <div className="doctor-patient-scans">
                    {patientScans.map((scan) => (
                      <article className="doctor-patient-scan-item" key={scan._id || scan.id}>
                        <ScanImage scanId={scan._id || scan.id} alt={`Patient skin scan from ${scan.date || "unknown date"}`} className="doctor-patient-scan-image" />
                        <div><strong>{scan.atype || "Skin scan"} · {scan.sev || "Unrated"}</strong><span>{scan.date || "Date unavailable"} · {Math.round(scan.conf || 0)}% confidence</span>{scan.notes && <p>{scan.notes}</p>}</div>
                      </article>
                    ))}
                  </div>
                ) : <p className="doctor-patient-details-empty">No AI scans found.</p>}
              </section>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default DocRx;
