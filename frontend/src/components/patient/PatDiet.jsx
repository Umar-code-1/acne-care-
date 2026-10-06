import React, { useState, useEffect } from "react";
import API from "../../api";
import Disclaimer from "../shared/Disclaimer";
import AppIcon from "../shared/AppIcon";

const PRIORITY = {
  high:   { bg: "var(--dan-l)",  border: "var(--dan)",  label: "High priority" },
  medium: { bg: "var(--acc-l)",  border: "var(--acc)",  label: "Worth doing" },
  low:    { bg: "var(--info-l)", border: "var(--info)", label: "Good to know" },
};

export default function PatDiet({ setPage }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/diet/my")
      .then((r) => setPlan(r.data))
      .catch((e) => setError(e.response?.data?.message || "Could not load your diet plan"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="ph">
          <div className="pt">Diet & Nutrition</div>
        </div>
        <div className="card"><div className="card-b"><div className="ps">Loading your plan…</div></div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="ph">
          <div className="pt">Diet & Nutrition</div>
          <div className="ps">Personalised to your skin analysis</div>
        </div>
        <div className="card">
          <div className="card-b" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}><AppIcon name="leaf" /></div>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No plan yet
            </div>
            <div style={{ color: "var(--text2)", fontSize: "0.9rem", maxWidth: 420, margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
              {error}
            </div>
            <button className="btn btn-pri" onClick={() => setPage?.("scan")}>
              <AppIcon name="camera" /> Run a Skin Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ph">
        <div className="pt">Your Diet Plan</div>
        <div className="ps">
          Built from your skin analysis and questionnaire answers
        </div>
      </div>

      {/* ---- personalisation summary ---- */}
      <div className="card">
        <div className="card-h">
          <div className="card-t"><AppIcon name="faceScan" /> Personalised for you</div>
          <span className="badge b-confirmed">{plan.personalisation}% tailored</span>
        </div>
        <div className="card-b">
          <div style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "var(--text2)", marginBottom: "1rem" }}>
            {plan.summary}
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginBottom: "0.5rem" }}>
            This plan accounts for:
          </div>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {plan.factors.map((f) => (
              <span key={f} className="badge b-pat">{f}</span>
            ))}
          </div>

          <div className="alert al-info" style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.82rem" }}>
            <AppIcon name="activity" /> <strong>{plan.skinType} skin:</strong> {plan.skinTip}
          </div>
        </div>
      </div>

      {/* ---- action points ---- */}
      {plan.focus.length > 0 && (
        <div className="card">
          <div className="card-h">
            <div className="card-t"><AppIcon name="activity" /> Your Priority Actions</div>
            <span className="badge b-pending">{plan.focus.length}</span>
          </div>
          <div className="card-b">
            {plan.focus.map((f, i) => {
              const p = PRIORITY[f.priority] || PRIORITY.low;
              return (
                <div key={i} style={{
                  display: "flex", gap: "0.85rem",
                  padding: "0.9rem",
                  background: p.bg,
                  borderLeft: `3px solid ${p.border}`,
                  borderRadius: "var(--r2)",
                  marginBottom: "0.6rem",
                }}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}><AppIcon emoji={f.icon} /></span>
                  <div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      marginBottom: "0.25rem", flexWrap: "wrap",
                    }}>
                      <strong style={{ fontSize: "0.88rem" }}>{f.title}</strong>
                      <span style={{ fontSize: "0.68rem", color: p.border, fontWeight: 700 }}>
                        {p.label}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.83rem", lineHeight: 1.7, color: "var(--text2)" }}>
                      {f.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- eat / avoid ---- */}
      <div className="diet-g">
        <div className="diet-eat">
          <div className="diet-title"><AppIcon name="check" /> Eat more of these</div>
          <ul className="diet-list">
            {plan.eat.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>

        <div className="diet-av">
          <div className="diet-title"><AppIcon name="closeCircle" /> Limit or avoid</div>
          <ul className="diet-list">
            {plan.avoid.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div className="card-t">How to use this plan</div>
        </div>
        <div className="card-b">
          <div style={{ fontSize: "0.85rem", lineHeight: 1.8, color: "var(--text2)" }}>
            Dietary changes take <strong>6–8 weeks</strong> to show on your skin. Change
            one or two things at a time rather than everything at once — it's easier to
            stick with, and you'll see which changes actually help you.
            <br /><br />
            Re-scan every few weeks to track whether your severity is improving.
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <button className="btn btn-pri btn-sm" onClick={() => setPage?.("scan")}>
              <AppIcon name="camera" /> New Scan
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage?.("book")}>
              <AppIcon name="doctor" /> Ask a Dermatologist
            </button>
          </div>
        </div>
      </div>

      <Disclaimer variant="diet" />
    </div>
  );
}
