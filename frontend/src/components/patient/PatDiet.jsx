import React, { useState, useEffect } from "react";
import API from "../../api";
import Disclaimer from "../shared/Disclaimer";
import AppIcon from "../shared/AppIcon";

const PRIORITY = {
  high:   { bg: "var(--dan-l)",  border: "var(--dan)",  label: "High priority" },
  medium: { bg: "var(--acc-l)",  border: "var(--acc)",  label: "Worth doing" },
  low:    { bg: "var(--info-l)", border: "var(--info)", label: "Good to know" },
};

function DietSection({ title, icon, badge, children }) {
  return (
    <details className="card diet-section">
      <summary className="card-h diet-section-summary">
        <span className="card-t"><AppIcon name={icon} /> {title}</span>
        {badge}
        <AppIcon name="arrowDown" className="diet-section-arrow" />
      </summary>
      <div className="card-b">{children}</div>
    </details>
  );
}

export default function PatDiet({ setPage }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestScanDate = plan?.basedOnScan
    ? new Date(plan.basedOnScan).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : "Date unavailable";

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
        <div className="ps">Your food and skin priorities, based on your scan</div>
      </div>

      <DietSection
        title="Personalised for you"
        icon="faceScan"
        badge={<span className="badge b-confirmed">{plan.personalisation}% tailored</span>}
      >
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem",
            flexWrap: "wrap", padding: "0.75rem", marginBottom: "0.85rem",
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r2)",
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.84rem", marginBottom: "0.25rem" }}>Latest AI analysis</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text2)" }}>
                {plan.severity} · {plan.acneType || "Skin type not classified"}
              </div>
            </div>
            <span className="badge b-pat">{latestScanDate}</span>
          </div>
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
      </DietSection>

      {plan.focus.length > 0 && (
        <DietSection
          title="Priority actions"
          icon="activity"
          badge={<span className="badge b-pending">{plan.focus.length}</span>}
        >
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
        </DietSection>
      )}

      <DietSection title="Food guide" icon="leaf">
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
        <div className="form-hint" style={{ marginTop: "0.8rem", lineHeight: 1.6 }}>
          Food is not a guaranteed acne trigger. Evidence is still developing; lower-glycemic choices may help some people, and cow's milk may affect some individuals. Track personal patterns and keep following your treatment plan. {" "}
          <a href="https://www.aad.org/public/diseases/acne/causes/diet" target="_blank" rel="noreferrer">Read the American Academy of Dermatology's guidance</a>.
        </div>
      </DietSection>

      <DietSection title="How to use this plan" icon="clipboard">
          <div style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text2)" }}>
            Start with one or two changes. Re-scan in <strong>6–8 weeks</strong> to track progress.
          </div>

          <div className="diet-plan-actions" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <button className="btn btn-pri btn-sm" onClick={() => setPage?.("scan")}>
              <AppIcon name="camera" /> New Scan
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage?.("book")}>
              <AppIcon name="doctor" /> Ask a Dermatologist
            </button>
          </div>
      </DietSection>

      <Disclaimer variant="diet" />
    </div>
  );
}
