// src/components/shared/Sidebar.jsx
import React from "react";
import AppIcon from "./AppIcon";

function Sidebar({ user, page, setPage, appointments = [], open, onClose }) {
    const pending = appointments.filter((a) => a.status === "pending").length;
  const myPending = user.role === "dermatologist" ? pending : 0;

  const adminNav = [
    { id: "dashboard", ic: "chart", lb: "Dashboard" },
    { id: "users", ic: "users", lb: "Manage Users" },
    { id: "appointments", ic: "calendar", lb: "Appointments", badge: pending },
    { id: "analyses", ic: "search", lb: "Analyses" },
    { id: "prescriptions", ic: "bottle", lb: "Skincare Plans" },
    { id: "profile", ic: "settings", lb: "Settings" },
    { id: "verify", ic: "shieldCheck", lb: "Verify Doctors",
      badge: appointments.length ? undefined : undefined },
    { id: "platform-fees", ic: "card", lb: "Platform Fees" },
  ];

  const doctorNav = [
    { id: "dashboard", ic: "chart", lb: "Dashboard" },
    { id: "appointments", ic: "calendar", lb: "Appointments", badge: myPending || undefined },
    { id: "patients", ic: "users", lb: "My Patients" },
    { id: "prescriptions", ic: "bottle", lb: "Skincare Plans" },
    { id: "payments", ic: "wallet", lb: "Payments", badge: appointments.filter((a) => a.payment === "pending_verification").length },
    { id: "platform-fee", ic: "card", lb: "Platform Fee" },
  ];

  const patientNav = [
    { id: "dashboard", ic: "home", lb: "Dashboard" },
    { id: "scan", ic: "faceScan", lb: "Skin Analysis" },
    { id: "diet", ic: "leaf", lb: "Diet" },
    { id: "book", ic: "doctor", lb: "Book Appointment" },
    { id: "appointments", ic: "calendar", lb: "My Appointments" },
    { id: "skincare", ic: "bottle", lb: "Skincare" },
    { id: "store", ic: "bag", lb: "Skincare Store" },
  ];

  const nav =
    user.role === "admin"
      ? adminNav
      : user.role === "dermatologist"
      ? doctorNav
      : patientNav;

  return (
<div className={`sidebar ${open ? "open" : ""}`}>
        <div className="s-logo">
        <div className="s-logo-ic"><AppIcon name="bottle" /></div>
        <div className="s-logo-t">AcneCare AI</div>
      </div>

      <div className="s-sec">Navigation</div>

      {nav.map((item) => (
        <button
          key={item.id}
          className={`nav-i ${page === item.id ? "act" : ""}`}
onClick={() => { setPage(item.id); onClose?.(); }}        >
          <span className="nav-ic"><AppIcon name={item.ic} /></span>
          {item.lb}
          {item.badge ? (
            <span className="nav-badge">{item.badge}</span>
          ) : null}
        </button>
      ))}

    </div>
  );
}

export default Sidebar;
