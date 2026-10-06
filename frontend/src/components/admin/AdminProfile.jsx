import React from 'react';

export default function AdminProfile() {
  return (
    <div>
      <div className="ph">
        <div className="pt">Admin Settings</div>
      </div>

      <div className="profile-hero" style={{ background: 'linear-gradient(135deg,var(--adm),#522a6b)' }}>
        <div className="p-av">A</div>
        <div>
          <div className="p-name">Admin User</div>
          <div className="p-email">admin@acnecare.com</div>
          <div className="p-badges">
            <div className="p-badge">System Administrator</div>
            <div className="p-badge">Full Access</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-b">
          <div className="alert al-info">
            Admin system settings would be fully configurable in the production environment.
          </div>
        </div>
      </div>
    </div>
  );
}