import React from "react";
import AppIcon from "./AppIcon";

export default function Disclaimer({ variant = "ai", style, compact = false }) {
  const text = {
    ai: "AI results are informational, may be inaccurate, and are not a diagnosis. Consult a licensed dermatologist before treatment.",
    diet: "These recommendations are general wellness guidance, not medical or nutritional advice. Consult a qualified professional before making dietary changes, especially if you have a medical condition.",
    routine: "This routine is a general suggestion based on your skin type. Discontinue any product that causes irritation and consult a dermatologist if symptoms worsen.",
    rx: "This plan was issued by a dermatologist through AcneCare AI. Follow it as directed. If you experience side effects, stop use and contact your doctor immediately.",
  }[variant];

  return (
    <div
      style={{
        display: "flex",
        gap: compact ? "0.4rem" : "0.6rem",
        alignItems: "flex-start",
        padding: compact ? "0.4rem 0.55rem" : "0.75rem 0.9rem",
        background: "var(--acc-l)",
        border: "1px solid #f0d898",
        borderRadius: "var(--r2)",
        fontSize: compact ? "0.68rem" : "0.78rem",
        lineHeight: compact ? 1.4 : 1.65,
        color: "var(--text2)",
        margin: compact ? "0.5rem 0" : "1rem 0",
        ...style,
      }}
    >
      <span style={{ fontSize: compact ? "0.82rem" : "1rem", flexShrink: 0 }}><AppIcon name="medicalKit" /></span>
      <span><strong>Medical disclaimer:</strong> {text}</span>
    </div>
  );
}
