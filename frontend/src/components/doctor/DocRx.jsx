// src/components/doctor/DocRx.jsx
import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";
import { MEDS, SKINCARE_STEPS } from "../../data/mockData";
import API from "../../api";
import RxCard from "../shared/RxCard";

function DocRx({ user, appts = [], rx = [], analyses = [], refresh, notify }) {
  const [tab, setTab] = useState("list");
  const [selAppt, setSelAppt] = useState("");
  const [selMeds, setSelMeds] = useState([]);
  const [selSkincare, setSelSkincare] = useState([]);
  const [inst, setInst] = useState("");
  const [diet, setDiet] = useState("");
  const [fu, setFu] = useState("");
  const [saving, setSaving] = useState(false);

  const rxId = (r) => String(r.apid || "");

  // confirmed ya completed — jin par abhi tak plan nahi bana
  const openAppts = appts.filter(
    (a) =>
      ["confirmed", "completed"].includes(a.status) &&
      !rx.some((r) => rxId(r) === String(a._id || a.id))
  );

  const curAppt = appts.find((a) => String(a._id || a.id) === String(selAppt));

  const sugMeds = curAppt ? (MEDS[curAppt.sev] || MEDS.Mild || []) : [];

  const skinType =
    analyses.find((a) => String(a.pid) === String(curAppt?.pid))?.skinType ||
    "Normal";

  const skincareSteps = curAppt
    ? SKINCARE_STEPS[skinType] || SKINCARE_STEPS.Normal
    : null;

  const toggleMed = (med) =>
    setSelMeds((prev) =>
      prev.some((m) => m.n === med.n)
        ? prev.filter((m) => m.n !== med.n)
        : [...prev, med]
    );

  const toggleSkincare = (step) =>
    setSelSkincare((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );

  const resetForm = () => {
    setSelAppt("");
    setSelMeds([]);
    setSelSkincare([]);
    setInst("");
    setDiet("");
    setFu("");
  };

  const save = async () => {
    if (!curAppt || selMeds.length === 0) return;
    setSaving(true);

    const morningCount = skincareSteps?.morning?.length || 0;

    try {
      await API.post("/prescriptions", {
        patientId: curAppt.pid,
        appointmentId: curAppt._id || curAppt.id,
        meds: selMeds,
        skincare: selSkincare.map((s) => ({
          product: s,
          step: skincareSteps?.morning?.includes(s) ? "Morning" : "Night",
          tip: "Apply as directed",
        })),
        instructions: inst,
        dietAdvice: diet,
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

  const stepRow = (step) => {
    const selected = selSkincare.includes(step);
    return (
      <div
        key={step}
        onClick={() => toggleSkincare(step)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.5rem 0.75rem",
          border: selected ? "2px solid var(--sec)" : "1.5px solid var(--border)",
          borderRadius: "var(--r2)",
          cursor: "pointer",
          marginBottom: "0.35rem",
          background: selected ? "var(--sec-l)" : "var(--bg)",
          fontSize: "0.84rem",
          fontWeight: 500,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 50,
            border: "2px solid var(--sec)",
            background: selected ? "var(--sec)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "0.6rem",
          }}
        >
          {selected ? "✓" : ""}
        </div>
        <div>{step}</div>
      </div>
    );
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
            <RxCard key={p._id || p.id} rx={p} showPatient showDoctor />
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
                  <select
                    className="form-i"
                    value={selAppt}
                    onChange={(e) => {
                      setSelAppt(e.target.value);
                      setSelMeds([]);
                      setSelSkincare([]);
                    }}
                  >
                    <option value="">-- Select Appointment --</option>
                    {openAppts.map((a) => (
                      <option key={a._id || a.id} value={a._id || a.id}>
                        {a.pname} • {a.date} • {a.sev || "N/A"} •{" "}
                        {a.atype || "N/A"}
                      </option>
                    ))}
                  </select>
                </div>

                {curAppt && (
                  <div className="alert al-info">
                    Patient <strong>{curAppt.pname}</strong> • Acne{" "}
                    <strong>{curAppt.atype || "N/A"}</strong> • Severity{" "}
                    <strong>{curAppt.sev || "N/A"}</strong> • Skin{" "}
                    <strong>{skinType}</strong>
                  </div>
                )}

                {/* Medications */}
                {curAppt && (
                  <>
                    <div className="form-l" style={{ marginBottom: "0.6rem" }}>
                      Select Medications for {curAppt.sev || "Mild"} acne
                    </div>
                    {sugMeds.map((med) => {
                      const selected = selMeds.some((m) => m.n === med.n);
                      return (
                        <div
                          key={med.n}
                          className="med-item"
                          style={{
                            cursor: "pointer",
                            border: selected
                              ? "2px solid var(--pri)"
                              : "1px solid var(--border)",
                          }}
                          onClick={() => toggleMed(med)}
                        >
                          <div className="med-h">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.6rem",
                              }}
                            >
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 50,
                                  border: "2px solid var(--pri)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.65rem",
                                  background: selected
                                    ? "var(--pri)"
                                    : "transparent",
                                  color: selected ? "#fff" : "transparent",
                                }}
                              >
                                {selected ? "✓" : ""}
                              </div>
                              <span className="med-n">{med.n}</span>
                            </div>
                            <span
                              className={`mbt ${
                                med.t === "Oral" ? "mb-o" : "mb-t"
                              }`}
                            >
                              {med.t}
                            </span>
                          </div>
                          <div className="med-d">{med.u}</div>
                          <div className="med-d" style={{ marginTop: "0.2rem" }}>
                            Duration: {med.d}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Skincare routine */}
                {skincareSteps && (
                  <>
                    <div className="form-l" style={{ marginBottom: "0.6rem" }}>
                      Skincare Routine Steps ({selSkincare.length} selected)
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        color: "var(--acc)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Morning Routine
                    </div>
                    {skincareSteps.morning.map(stepRow)}

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        color: "var(--info)",
                        marginBottom: "0.4rem",
                        marginTop: "0.75rem",
                      }}
                    >
                      Night Routine
                    </div>
                    {skincareSteps.night.map(stepRow)}
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
                  <label className="form-l">Diet Advice</label>
                  <textarea
                    className="form-i"
                    placeholder="E.g., Avoid dairy and sugar. Drink 8–10 glasses water daily..."
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
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
                    disabled={saving || selMeds.length === 0 || !selAppt}
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
    </div>
  );
}

export default DocRx;
