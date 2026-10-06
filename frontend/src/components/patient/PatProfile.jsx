// src/components/patient/PatProfile.jsx
import React from "react";
import Disclaimer from "../shared/Disclaimer";
import ScanHistory from "../shared/ScanHistory";
import DataControls from "../shared/DataControls";
function PatProfile({ user, appts = [], analyses = [], refresh, notify, onLogout }) {
  const totalAppts = appts.length;
  const completed = appts.filter((a) => a.status === "completed").length;
  const upcoming = appts.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;
  const latestAn = analyses.length ? analyses[analyses.length - 1] : null;

  return (
    <div>
      <div className="ph">
        <div className="pt">My Profile</div>
      </div>

      <div className="profile-hero">
        <div className="p-av">{user.avatar}</div>
        <div>
          <div className="p-name">{user.name}</div>
          <div className="p-email">{user.email}</div>
          <div className="p-badges">
            <div className="p-badge">Patient</div>
            {user.age && <div className="p-badge">Age {user.age}</div>}
            {user.gender && <div className="p-badge">{user.gender}</div>}
            {user.skinType && (
              <div className="p-badge">{user.skinType} Skin</div>
            )}
          </div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-h">
            <div className="card-t">Account Summary</div>
          </div>
          <div className="card-b">
            {[
              ["Total Analyses", analyses.length],
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
            {latestAn && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.6rem 0",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "var(--text2)" }}>Skin Analysis</span>
                <span
                  className={`badge b-${latestAn.sev.toLowerCase()}`}
                >
                  {latestAn.atype} ({latestAn.sev})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <div className="card-t">Skin Analysis Sharing</div>
          </div>
          <div className="card-b">
            <div
              className="alert al-info"
              style={{ marginBottom: "0.75rem" }}
            >
              Your AI skin analysis and assessment will be automatically shared
              with the doctor before your appointment.
            </div>
            <div
              style={{
                fontSize: "0.84rem",
                color: "var(--text2)",
                lineHeight: 1.9,
              }}
            >
              <strong>What this includes:</strong>{" "}
              acne type, severity, skin type, and dietary suggestions. This
              helps the dermatologist make faster, more accurate decisions
              during your consultation.
            </div>
          </div>
        </div>
      </div>
      <ScanHistory analyses={analyses} refresh={refresh} notify={notify} />
    <DataControls notify={notify} refresh={refresh} onLogout={onLogout} />
    </div>
  );
}

export default PatProfile;