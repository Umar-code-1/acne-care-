import React from 'react';
import AppIcon from "../shared/AppIcon";
import VerificationBanner from "./VerificationBanner";

export default function DocDash({ user, appts = [], rx = [], setPage, refresh, notify }) {  const stats = [
    { v: appts.length, l: 'Total Appointments', c: 'pri', ic: 'calendar' },
    { v: appts.filter(a => a.status === 'pending').length, l: 'Pending', c: 'acc', ic: 'clock' },
    { v: appts.filter(a => a.status === 'completed').length, l: 'Completed', c: 'ok', ic: 'check' },
    { v: rx.length, l: 'Skincare Plans', c: 'info', ic: 'clipboard' }
  ];

  return (
    <div>
      <VerificationBanner user={user} notify={notify} refresh={refresh} />
      <div className="ph">
        <div className="pt">Good morning, {user.name}</div>
        <div className="ps">{user.qual} • {user.exp} years experience</div>
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
            <div className="card-t">Upcoming Appointments</div>
          </div>
          {appts.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length === 0 ? (
            <div className="empty" style={{ padding: '1.5rem' }}>
              <div className="empty-ic"><AppIcon name="calendar" /></div>
              <div className="empty-t">No upcoming appointments</div>
            </div>
          ) : (
            appts.filter(a => a.status !== 'completed' && a.status !== 'cancelled').slice(0, 5).map(a => (
              <div key={a.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem 1.1rem', 
                borderBottom: '1px solid var(--border)', 
                background: 'var(--bg2)' 
              }}>
                <div className="doc-av" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>{a.pname[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{a.pname}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{a.date} at {a.time}</div>
                </div>
                <span className={`badge b-${a.status}`}>{a.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-h">
            <div className="card-t">Profile Summary</div>
          </div>
          <div className="card-b">
            {[['Rating', `${user.rating}/5`], ['Physical Fee', `PKR ${user.fee}`], 
              ['Online Fee', `PKR ${user.ofee}`], ['Qualification', user.qual], 
              ['Working Days', user.days?.join(', ')]].map(([k, v]) => (
              <div key={k} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.55rem 0', 
                borderBottom: '1px solid var(--border)', 
                fontSize: '0.85rem' 
              }}>
                <span style={{ color: 'var(--text2)' }}>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
