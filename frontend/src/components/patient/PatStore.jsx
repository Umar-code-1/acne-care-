// src/components/patient/PatStore.jsx
import React from "react";
import AppIcon from "../shared/AppIcon";

export default function PatStore() {
  return (
    <div>
      <div className="ph">
        <div className="pt">Skincare Store</div>
        <div className="ps">Dermatologist-approved products, delivered to your door</div>
      </div>

      <div className="card">
        <div className="card-b" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}><AppIcon emoji="🛍️" /></div>

          <div style={{
            fontFamily: "var(--font-d)",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}>
            Coming Soon
          </div>

          <div style={{
            color: "var(--text2)",
            fontSize: "0.9rem",
            maxWidth: 420,
            margin: "0 auto 1.75rem",
            lineHeight: 1.7,
          }}>
            We're partnering with verified skincare brands to bring you products
            matched to your AI analysis and your dermatologist's plan.
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: "0.75rem",
            maxWidth: 520,
            margin: "0 auto",
          }}>
            {[
              ["🎯", "Matched to your skin"],
              ["✅", "Doctor approved"],
              ["🚚", "Delivered in 2–3 days"],
            ].map(([ic, t]) => (
              <div key={t} style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r2)",
                padding: "1rem 0.75rem",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}><AppIcon emoji={ic} /></div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
