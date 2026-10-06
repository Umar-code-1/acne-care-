// src/components/patient/PatDash.jsx
import React from "react";
import AppIcon from "../shared/AppIcon";

function PatDash({ user, appts, rx, analyses, latestAn, setPage }) {
  const totalAnalyses = analyses.length;
  const totalAppts = appts.length;
  const completed = appts.filter((a) => a.status === "completed").length;
  const upcoming = appts.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;

  return (
    <div>
      <div className="ph">
        <div className="pt">Hello, {user.name}</div>
        <div className="ps">Your complete skincare health overview</div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {[
          [analyses.length, "Skin Analyses", "info", "search"],
          [appts.length, "Appointments", "acc", "calendar"],
          [rx.length, "Skincare Plans", "ok", "bottle"],
          [
            appts.filter(
              (a) => a.status === "pending" || a.status === "confirmed"
            ).length,
            "Upcoming",
            "pri",
            "clock",
          ],
        ].map(([v, l, c, ic]) => (
          <div key={l} className="stat-c">
            <div
              className="stat-ic"
              style={{ background: `var(--${c}-l)` }}
            >
              <AppIcon name={ic} />
            </div>
            <div>
              <div
                className="stat-v"
                style={{ color: `var(--${c})` }}
              >
                {v}
              </div>
              <div className="stat-l">{l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="g2">
        {/* My statistics card */}
        <div className="card">
          <div className="card-h">
            <div className="card-t">My Statistics</div>
          </div>
          <div className="card-b">
            {[
              ["Total Analyses", totalAnalyses],
              ["Total Appointments", totalAppts],
              ["Completed", completed],
              ["Upcoming", upcoming],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.6rem 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "var(--text2)" }}>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* CTA card */}
        <div className="card">
          <div className="card-h">
            <div className="card-t">Next Actions</div>
          </div>
          <div className="card-b">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.6rem",
              }}
            >
              <button
                className="btn btn-sec btn-sm"
                onClick={() => setPage("scan")}
              >
                Run AI Skin Scan
              </button>
              <button
                className="btn btn-pri btn-sm"
                onClick={() => setPage("book")}
              >
                Book Dermatologist
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage("routine")}
              >
                View Routine
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage("store")}
              >
                Shop Products
              </button>
            </div>
            <div
              style={{
                fontSize: "0.84rem",
                color: "var(--text2)",
                marginTop: "0.75rem",
                lineHeight: 1.7,
              }}
            >
              Complete your AI scan, book a consultation, and follow your
              personalized skincare plan regularly for best results.
            </div>
          </div>
        </div>
      </div>

      {/* Recent upcoming appointments and plans */}
      <div className="g2">
        <div className="card">
          <div className="card-h">
            <div className="card-t">Upcoming Appointments</div>
          </div>
          <div className="card-b">
            {appts.filter((a) => a.status !== "completed" && a.status !== "cancelled")
              .length === 0 ? (
              <div className="empty" style={{ padding: "1.5rem" }}>
                <div className="empty-ic"><AppIcon name="calendar" /></div>
                <div className="empty-t">No upcoming appointments</div>
                <div className="empty-s">
                  Book a consultation with a dermatologist to start your
                  treatment.
                </div>
              </div>
            ) : (
              appts
                .filter((a) => a.status !== "completed" && a.status !== "cancelled")
                .slice(0, 3)
                .map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: "0.75rem 1.1rem",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                      }}
                    >
                      {a.dname}
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text2)",
                        marginTop: "0.2rem",
                      }}
                    >
                      {a.date} at {a.time}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        marginTop: "0.4rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span className="badge b-online">
                        {a.type === "online" ? a.plat : "Physical"}
                      </span>
                      <span className={`badge b-${a.status}`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <div className="card-t">Recent Skincare Plans</div>
          </div>
          <div className="card-b">
            {rx.length === 0 ? (
              <div className="empty" style={{ padding: "1.5rem" }}>
                <div className="empty-ic"><AppIcon name="bottle" /></div>
                <div className="empty-t">No plans yet</div>
                <div className="empty-s">
                  Your doctor will send a skincare plan after your consultation.
                </div>
              </div>
            ) : (
              rx
                .slice(-2)
                .reverse()
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: "0.75rem 1.1rem",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                      }}
                    >
                      {p.dname}
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text2)",
                      }}
                    >
                      {p.date}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {p.meds.length} medications,{" "}
                      {p.skincare?.length || 0} skincare steps
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatDash;
