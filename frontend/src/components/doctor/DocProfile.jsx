import React from 'react';
import ProfessionalDetails from "./ProfessionalDetails";
import BankDetails from "./BankDetails";
import AppIcon from "../shared/AppIcon";

export default function DocProfile({ user, appts = [], notify, refresh }) {
  return (
    <div>
      <div className="ph">
        <div className="pt">My Profile</div>
        <div className="ps">Manage your professional and payment details</div>
      </div>

      <div className="profile-hero" style={{ background: 'linear-gradient(135deg,var(--sec),var(--sec-d))' }}>
        <div className="p-av">{user.avatar}</div>
        <div>
          <div className="p-name">{user.name}</div>
          <div className="p-email">{user.email}</div>
          <div className="p-badges">
            {user.spec && <div className="p-badge">{user.spec}</div>}
            {user.rating > 0 && <div className="p-badge"><AppIcon name="star" /> {user.rating}/5</div>}
            {user.exp && <div className="p-badge">{user.exp} yrs exp</div>}
            <div className="p-badge">
              <AppIcon name={user.isVerified ? "check" : "clock"} /> {user.isVerified ? "Verified" : "Pending verification"}
            </div>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        {[
          ["calendar", "Total Appointments", appts.length, "pri"],
          ["check", "Completed", appts.filter(a => a.status === 'completed').length, "ok"],
          ["clock", "Pending", appts.filter(a => a.status === 'pending').length, "acc"],
          ["users", "Unique Patients", new Set(appts.map(a => a.pid)).size, "info"],
        ].map(([ic, label, value, color]) => (
          <div className="stat-c" key={label}>
            <div className="stat-ic" style={{ background: `var(--${color}-l)` }}><AppIcon name={ic} /></div>
            <div>
              <div className="stat-v" style={{ color: `var(--${color})` }}>{value}</div>
              <div className="stat-l">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <ProfessionalDetails user={user} notify={notify} refresh={refresh} />

      <BankDetails user={user} notify={notify} refresh={refresh} />
    </div>
  );
}
