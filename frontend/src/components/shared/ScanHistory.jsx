import React, { useState } from "react";
import API from "../../api";
import AppIcon from "./AppIcon";
import ScanImage from "./ScanImage";

export default function ScanHistory({ analyses = [], refresh, notify }) {
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const deletePhoto = async (id) => {
    setBusy(id);
    try {
      const res = await API.delete(`/scans/${id}/image`);
      notify?.("✅ " + res.data.message);
      setConfirmId(null);
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Could not delete photo"));
    } finally {
      setBusy("");
    }
  };

  if (analyses.length === 0) {
    return (
      <div className="card">
        <div className="card-h">
          <div className="card-t"><AppIcon name="chart" /> My Scan History</div>
        </div>
        <div className="card-b">
          <div className="empty" style={{ padding: "1.5rem" }}>
            <div className="empty-ic"><AppIcon name="search" /></div>
            <div className="empty-t">No scans yet</div>
            <div className="empty-s">Run a skin analysis to start tracking your progress.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-h">
        <div className="card-t"><AppIcon name="chart" /> My Scan History</div>
        <div className="ps">{analyses.length} scan{analyses.length === 1 ? "" : "s"}</div>
      </div>
      <div className="card-b">
        {analyses.map((a) => {
          const id = a._id || a.id;
          const isOpen = open === id;

          return (
            <div key={id} style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--r)",
              marginBottom: "0.75rem",
              overflow: "hidden",
            }}>

              {/* ROW */}
              <div
                onClick={() => setOpen(isOpen ? null : id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.85rem",
                  cursor: "pointer",
                  background: isOpen ? "var(--bg)" : "transparent",
                }}
              >
                <ScanImage
                  scanId={id}
                  style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{a.atype || "Analysis"}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text3)" }}>{a.date}</div>
                  <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.35rem", flexWrap: "wrap" }}>
                    <span className={`badge b-${(a.sev || "clear").toLowerCase()}`}>{a.sev}</span>
                    <span className="badge b-completed">{a.conf}% confidence</span>
                  </div>
                </div>

                <div style={{ fontSize: "1.1rem", color: "var(--text3)" }}>{isOpen ? "▲" : "▼"}</div>
              </div>

              {/* DETAILS */}
              {isOpen && (
                <div style={{ padding: "0 0.85rem 0.85rem", borderTop: "1px solid var(--border)" }}>

                  <div style={{ margin: "0.85rem 0" }}>
                    <ScanImage
                      scanId={id}
                      style={{ width: "100%", maxWidth: 260, borderRadius: 10, display: "block", margin: "0 auto" }}
                    />
                  </div>

                  {[
                    ["Acne Type", a.atype],
                    ["Severity", a.sev],
                    ["AI Confidence", `${a.conf}%`],
                    ["Skin Type", a.skinType || "—"],
                    ["Date", a.date],
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: "0.82rem", padding: "0.35rem 0",
                      borderBottom: "1px solid var(--border)",
                    }}>
                      <span style={{ color: "var(--text2)" }}>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}

                  {a.probs && Object.keys(a.probs).length > 0 && (
                    <>
                      <div style={{ fontWeight: 700, fontSize: "0.8rem", margin: "0.85rem 0 0.4rem" }}>
                        Detection Breakdown
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.4rem" }}>
                        {Object.entries(a.probs).map(([k, v]) => (
                          <div key={k} style={{
                            background: "var(--bg)", borderRadius: 8,
                            padding: "0.5rem", textAlign: "center",
                          }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--text3)" }}>{k}</div>
                            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{Math.round(v)}%</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {a.questionnaire?.problems?.length > 0 && (
                    <>
                      <div style={{ fontWeight: 700, fontSize: "0.8rem", margin: "0.85rem 0 0.4rem" }}>
                        Reported Concerns
                      </div>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        {a.questionnaire.problems.map((p) => (
                          <span key={p} className="badge b-pat">{p}</span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* DELETE PHOTO */}
                  <div style={{ marginTop: "1rem" }}>
                    {confirmId !== id ? (
                      <button className="btn btn-ghost btn-sm" onClick={() => setConfirmId(id)}>
                        <AppIcon name="trash" /> Delete this photo
                      </button>
                    ) : (
                      <div className="alert al-warn" style={{ marginBottom: 0 }}>
                        <div style={{ width: "100%" }}>
                          <div style={{ marginBottom: "0.6rem" }}>
                            Delete this photo permanently? Your result stays saved.
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn btn-dan btn-sm" onClick={() => deletePhoto(id)} disabled={busy === id}>
                              {busy === id ? "Deleting..." : "Yes, delete"}
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
