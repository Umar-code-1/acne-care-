import React from 'react';
import AppIcon from "../shared/AppIcon";

export default function AdminAppts({ appointments }) {
  const stats = [
    { s: 'pending', ic: '⏳', c: 'acc', l: 'Pending' },
    { s: 'confirmed', ic: '✓', c: 'ok', l: 'Confirmed' },
    { s: 'completed', ic: '✅', c: 'info', l: 'Completed' },
    { s: 'cancelled', ic: '✕', c: 'dan', l: 'Cancelled' }
  ];

  return (
    <div className="admin-appointments">
      <div className="ph">
        <div className="pt">All Appointments</div>
      </div>

      <div className="stat-grid admin-appointment-stats">
        {stats.map(({ s, ic, c, l }) => (
          <div key={s} className="stat-c">
            <div className="stat-ic" style={{ background: `var(--${c}-l)` }}><AppIcon emoji={ic} /></div>
            <div>
              <div className="stat-v" style={{ color: `var(--${c})` }}>
                {appointments.filter(a => a.status === s).length}
              </div>
              <div className="stat-l">{l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="admin-appointment-table" role="table" aria-label="All appointments">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {appointments.map(a => (
                <tr key={a.id} role="row" data-notification-appointment={a.id} tabIndex={-1}>
                  <td role="cell" style={{ fontWeight: 600 }}><span className="admin-appointment-label" aria-hidden="true">Patient</span>{a.pname}</td>
                  <td role="cell"><span className="admin-appointment-label" aria-hidden="true">Doctor</span>{a.dname}</td>
                  <td role="cell">
                    <span className="admin-appointment-label" aria-hidden="true">Date &amp; time</span>
                    <div style={{ fontWeight: 600 }}>{a.date}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text2)' }}>{a.time}</div>
                  </td>
                  <td role="cell">
                    <span className="admin-appointment-label" aria-hidden="true">Type</span>
                    <span className={`badge b-${a.type}`}>
                      {a.type === 'online' ? a.plat : 'Physical'}
                    </span>
                  </td>
                  <td role="cell"><span className="admin-appointment-label" aria-hidden="true">Severity</span>{a.sev ? <span className={`badge b-${a.sev.toLowerCase()}`}>{a.sev}</span> : "—"}</td>
                  <td role="cell"><span className="admin-appointment-label" aria-hidden="true">Status</span><span className={`badge b-${a.status}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
