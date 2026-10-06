// src/components/shared/RxCard.jsx
import React, { useState } from "react";

function RxCard({ rx, showPatient, showDoctor }) {
  const [tab, setTab] = useState("meds");

  return (
    <div className="rx-card">
      <div className="rx-h">
        <div>
          <div className="rx-t">Skincare Plan #{rx.id}</div>
          {showPatient && (
            <div className="rx-d">
              Patient <strong>{rx.pname}</strong>
            </div>
          )}
          {showDoctor && (
            <div className="rx-d">
              Dr <strong>{rx.dname}</strong>
            </div>
          )}
        </div>
        <div className="rx-d">{rx.date}</div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.85rem" }}>
        {["meds", "skincare", "diet", "instructions"].map((t) => (
          <button
            key={t}
            className={`btn btn-sm ${tab === t ? "btn-pri" : "btn-ghost"}`}
            onClick={() => setTab(t)}
          >
            {t === "meds"
              ? "Medications"
              : t === "skincare"
              ? "Skincare"
              : t === "diet"
              ? "Diet"
              : "Instructions"}
          </button>
        ))}
      </div>

      {tab === "meds" && (
        <div>
          {rx.meds.map((m, i) => (
            <div key={i} className="med-item">
              <div className="med-h">
                <span className="med-n">{m.n}</span>
                <span className={`mbt ${m.t === "Oral" ? "mb-o" : "mb-t"}`}>
                  {m.t}
                </span>
              </div>
              <div className="med-d">{m.u}</div>
              <div className="med-d" style={{ marginTop: 4 }}>
                Duration: {m.d}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "skincare" && (
        <div>
          {rx.skincare && rx.skincare.length > 0 ? (
            rx.skincare.map((s, i) => (
              <div key={i} className="skincare-step">
                <div className="sk-num">{i + 1}</div>
                <div>
                  <div className="sk-name">{s.product}</div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text2)",
                      marginTop: 4,
                    }}
                  >
                    {s.step} — {s.tip}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert al-info">
              No specific skincare routine added to this plan.
            </div>
          )}
        </div>
      )}

      {tab === "diet" && (
        <div className="diet-eat">
          <div className="diet-title">Diet Instructions</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text2)" }}>
            {rx.diet || "No specific diet instructions added."}
          </p>
        </div>
      )}

      {tab === "instructions" && (
        <div className="alert al-info">
          {rx.inst || "No special instructions provided."}
        </div>
      )}
    </div>
  );
}

export default RxCard;