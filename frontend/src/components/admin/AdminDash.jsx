import React from 'react';
import AppIcon from "../shared/AppIcon";

export default function AdminDash({ users, appointments, analyses, prescriptions }) {
  const docs = users.filter(u => u.role === 'dermatologist');
  const pats = users.filter(u => u.role === 'patient');

  const stats = [
    { v: users.length, l: 'Total Users', c: 'adm', ic: 'users' },
    { v: docs.length, l: 'Dermatologists', c: 'sec', ic: 'doctor' },
    { v: pats.length, l: 'Patients', c: 'pri', ic: 'profile' },
    { v: appointments.length, l: 'Appointments', c: 'acc', ic: 'calendar' },
    { v: analyses.length, l: 'Skin Analyses', c: 'info', ic: 'activity' },
    { v: prescriptions.length, l: 'Skincare Plans', c: 'ok', ic: 'clipboard' }
  ];

  return (
    <div>
      <div className="ph">
        <div className="pt">Admin Dashboard</div>
        <div className="ps">Complete system overview and management</div>
      </div>

      <div className="stat-grid">
        {stats.map(({ v, l, c, ic }) => (
          <div key={l} className="stat-c">
            <div className="stat-ic" style={{ background: `var(--${c}-l)` }}><AppIcon name={ic} /></div>
            <div>
              <div className="stat-v" style={{ color: `var(--${c})` }}>{v}</div>
              <div className="stat-l">{l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-h">
            <div className="card-t">Recent Appointments</div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td>{a.pname}</td>
                    <td>{a.dname}</td>
                    <td>{a.date}</td>
                    <td><span className={`badge b-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <div className="card-t">Recent Analyses</div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map(a => (
                  <tr key={a.id}>
                    <td>{a.pname}</td>
                    <td>{a.atype}</td>
                    <td><span className={`badge b-${a.sev.toLowerCase()}`}>{a.sev}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
