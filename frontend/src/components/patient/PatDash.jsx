// src/components/patient/PatDash.jsx
import { useEffect, useRef } from "react";
import AppIcon from "../shared/AppIcon";

function useDashboardOverscroll(dashboardRef) {
  useEffect(() => {
    const dashboard = dashboardRef.current;
    const scroller = dashboard?.closest(".content");
    if (!scroller) return;

    let touchStart = null;
    let lastWheelAt = -Infinity;
    let wheelDistance = 0;
    let wheelStartedAtTop = false;
    let settleTimer;

    const atTop = () => scroller.scrollTop <= 1;
    const stretch = (distance) => {
      dashboard.style.setProperty("--dashboard-pull", Math.min(48, distance * 0.35) + "px");
    };
    const settle = () => dashboard.style.removeProperty("--dashboard-pull");

    const startPull = (event) => {
      touchStart = atTop() && event.touches.length === 1 ? event.touches[0] : null;
    };
    const cancelPull = () => {
      touchStart = null;
      settle();
    };
    const movePull = (event) => {
      if (!touchStart) return;
      if (!atTop() || event.touches.length !== 1) return cancelPull();

      const touch = event.touches[0];
      const vertical = touch.clientY - touchStart.clientY;
      const horizontal = Math.abs(touch.clientX - touchStart.clientX);
      if (vertical < -8 || (horizontal > 8 && horizontal > vertical)) return cancelPull();
      if (vertical > 8 && event.cancelable) {
        event.preventDefault();
        stretch(vertical);
      } else {
        settle();
      }
    };

    const scrollAtTop = (event) => {
      const now = performance.now();
      // A wheel gesture that began below the top is still an ordinary scroll.
      if (now - lastWheelAt > 200) {
        wheelStartedAtTop = atTop();
        wheelDistance = 0;
      }
      lastWheelAt = now;

      if (event.ctrlKey || event.deltaY >= 0 || Math.abs(event.deltaX) > -event.deltaY) {
        wheelStartedAtTop = false;
      }
      if (!wheelStartedAtTop || !atTop()) {
        settle();
        return;
      }

      const pixelsPerUnit = [1, 16, scroller.clientHeight][event.deltaMode] ?? 1;
      wheelDistance -= event.deltaY * pixelsPerUnit;
      stretch(wheelDistance);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 120);
    };

    const controller = new AbortController();
    const { signal } = controller;
    scroller.addEventListener("touchstart", startPull, { signal, passive: true });
    scroller.addEventListener("touchmove", movePull, { signal, passive: false });
    scroller.addEventListener("touchend", cancelPull, { signal, passive: true });
    scroller.addEventListener("touchcancel", cancelPull, { signal, passive: true });
    scroller.addEventListener("wheel", scrollAtTop, { signal, passive: true });
    return () => {
      controller.abort();
      clearTimeout(settleTimer);
    };
  }, [dashboardRef]);
}

const getAppointmentDateParts = (value) => {
  const date = new Date(`${value}T12:00:00`);
  if (!value || Number.isNaN(date.getTime())) {
    return { month: "", day: "—", weekday: "" };
  }
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
};

function PatDash({ user, appts, rx, analyses, latestAn, setPage }) {
  const dashboardRef = useRef(null);
  useDashboardOverscroll(dashboardRef);

  const totalAnalyses = analyses.length;
  const totalAppts = appts.length;
  const completed = appts.filter((a) => a.status === "completed").length;
  const upcoming = appts.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;
  const upcomingAppointments = appts
    .filter((a) => a.status !== "completed" && a.status !== "cancelled")
    .slice(0, 3);
  const primaryActions = [
    { title: "Run AI Skin Scan", description: "Upload a photo for a skin analysis", icon: "camera", page: "scan", tone: "scan" },
    { title: "Book a Dermatologist", description: "Get guidance from a skin professional", icon: "calendar", page: "book", tone: "doctor" },
  ];
  const secondaryActions = [
    { title: "View My Routine", description: "Review your personalized skincare plan", icon: "clipboard", page: "skincare", tone: "routine" },
  ];

  return (
    <div className="patient-dashboard" ref={dashboardRef}>
      <div className="ph">
        <div className="pt">Hello, {user.name}</div>
        <div className="ps">Your complete skincare health overview</div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {[
          [analyses.length, "Skin Analyses", "info", "search"],
          [rx.length, "Skincare Plans", "ok", "bottle"],
          [appts.length, "Appointments", "acc", "calendar"],
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
        <section className="card next-actions-card" aria-labelledby="next-actions-title">
          <header className="next-actions-heading">
            <span className="next-actions-heading-icon"><AppIcon name="star" /></span>
            <div>
              <h2 className="next-actions-title" id="next-actions-title">Next Actions</h2>
            </div>
          </header>
          <div className="next-actions-primary">
            {primaryActions.map((action) => (
              <button key={action.page} type="button" className={`next-action next-action-primary next-action-${action.tone}`} onClick={() => setPage(action.page)}>
                <span className="next-action-icon"><AppIcon name={action.icon} /></span>
                <span className="next-action-copy">
                  <span className="next-action-title">{action.title}</span>
                  <span className="next-action-description">{action.description}</span>
                </span>
                <span className="next-action-arrow"><AppIcon name="arrowRight" /></span>
              </button>
            ))}
          </div>
          <div className="next-actions-secondary">
            {secondaryActions.map((action) => (
              <button key={action.page} type="button" className={`next-action next-action-secondary next-action-${action.tone}`} onClick={() => setPage(action.page)}>
                <span className="next-action-icon"><AppIcon name={action.icon} /></span>
                <span className="next-action-copy">
                  <span className="next-action-title">{action.title}</span>
                  <span className="next-action-description">{action.description}</span>
                </span>
                <span className="next-action-arrow"><AppIcon name="arrowRight" /></span>
              </button>
            ))}
          </div>
          <div className="next-actions-note">
            <AppIcon name="star" />
            <p>Regular scans and a consistent routine can help you track changes in your skin.</p>
          </div>
        </section>
      </div>

      {/* Recent upcoming appointments and plans */}
      <div className="g2">
        <section className="card appt-card" aria-labelledby="upcoming-appt-title">
          <header className="appt-card-head">
            <div className="appt-card-title" id="upcoming-appt-title">
              <AppIcon name="calendar" />
              <span>Upcoming Appointments</span>
            </div>
            <button className="recent-plans-view-all" type="button" onClick={() => setPage("appointments")}>
              View All <AppIcon name="arrowRight" />
            </button>
          </header>
          <div className="appt-card-list">
            {upcomingAppointments.length === 0 ? (
              <div className="empty" style={{ padding: "1.5rem" }}>
                <div className="empty-ic"><AppIcon name="calendar" /></div>
                <div className="empty-t">No upcoming appointments</div>
                <div className="empty-s">
                  Book a consultation with a dermatologist to start your treatment.
                </div>
              </div>
            ) : (
              upcomingAppointments.map((a) => {
                const dateParts = getAppointmentDateParts(a.date);
                const platformNames = {
                  zoom: "Zoom",
                  google_meet: "Google Meet",
                  whatsapp: "WhatsApp",
                };
                const doctorName = a.dname?.trim() || "Dermatologist";
                const formattedDoctorName = /^dr\.?\s/i.test(doctorName)
                  ? doctorName
                  : `Dr. ${doctorName}`;

                return (
                  <button
                    key={a.id}
                    type="button"
                    className={`appt-row appt-row-${a.status}`}
                    onClick={() => setPage("appointments")}
                  >
                    <span className="appt-date">
                      <span>{dateParts.month}</span>
                      <strong>{dateParts.day}</strong>
                      <span>{dateParts.weekday}</span>
                    </span>
                    <span className="appt-row-main">
                      <span className="appt-row-top">
                        <span className="appt-doctor-name">{formattedDoctorName}</span>
                        <span className={`appt-status appt-status-${a.status}`}>{a.status}</span>
                      </span>
                      <span className="appt-specialty">{a.dspec || "Dermatologist"}</span>
                      <span className="appt-details">
                        <span><AppIcon name="clock" />{a.time}</span>
                        <span>
                          <AppIcon name={a.type === "online" ? "video" : "medicalKit"} />
                          {a.type === "online"
                            ? `Online (${platformNames[a.plat] || a.plat || "Visit"})`
                            : "Physical Visit"}
                        </span>
                      </span>
                    </span>
                    <span className="appt-row-arrow"><AppIcon name="arrowRight" /></span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="card recent-plans-card" aria-labelledby="recent-plans-title">
          <header className="recent-plans-head">
            <span className="recent-plans-icon"><AppIcon name="document" /></span>
            <div className="recent-plans-heading">
              <h2 id="recent-plans-title">Recent Skincare Plans</h2>
            </div>
            <button className="recent-plans-view-all" type="button" onClick={() => setPage("skincare")}>
              View All <AppIcon name="arrowRight" />
            </button>
          </header>
          <div className="recent-plans-list">
            {rx.length === 0 ? (
              <div className="empty" style={{ padding: "1.5rem" }}>
                <div className="empty-ic"><AppIcon name="bottle" /></div>
                <div className="empty-t">No plans yet</div>
                <div className="empty-s">
                  Your doctor will send a skincare plan after your consultation.
                </div>
              </div>
            ) : (
              rx.slice(-2).reverse().map((p, index) => {
                const skincareCount = p.skincare?.length || 0;
                const doctorName = p.dname?.trim() || "Your dermatologist";
                const formattedDoctorName = /^dr\.?\s/i.test(doctorName)
                  ? doctorName
                  : `Dr. ${doctorName}`;

                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`recent-plan-row ${index % 2 ? "recent-plan-row-green" : "recent-plan-row-orange"}`}
                    onClick={() => setPage("skincare")}
                  >
                    <span className="recent-plan-copy">
                      <span className="recent-plan-doctor">{formattedDoctorName}</span>
                      <span className="recent-plan-date"><AppIcon name="calendar" />{p.date}</span>
                      <span className="recent-plan-summary">
                        <span><AppIcon name="document" />Read doctor’s instructions</span>
                        {skincareCount > 0 && <span className="recent-plan-divider" aria-hidden="true" />}
                        {skincareCount > 0 && <span><strong>{skincareCount}</strong> skincare steps</span>}
                      </span>
                    </span>
                    <span className="recent-plan-arrow"><AppIcon name="arrowRight" /></span>
                  </button>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PatDash;
