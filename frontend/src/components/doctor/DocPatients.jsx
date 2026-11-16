import React, { useState } from 'react';
import AppIcon from "../shared/AppIcon";
import ScanImage from '../shared/ScanImage';

export default function DocPatients({ appts = [], analyses = [], setPage, setSelectedPatientId, onSelectPatient }) {
  const [query, setQuery] = useState("");

  const ids = [...new Set(appts.map(a => a.pid).filter(Boolean))];

  const patients = ids.map(id => {
    const mine = appts.filter(a => a.pid === id);
    const latestAppt = [...mine].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
    const theirScans = analyses.filter(a => a.pid === id);
    const latestScan = [...theirScans].sort(
      (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
    )[0];

    return {
      id,
      name:      latestAppt?.pname || "Unknown Patient",
      phone:     latestAppt?.pphone || "",
      visits:    mine.length,
      completed: mine.filter(a => a.status === "completed").length,
      upcoming:  mine.filter(a => ["pending", "confirmed"].includes(a.status)).length,
      lastVisit: latestAppt?.date || "",
      analysis:  latestScan,
      scanCount: theirScans.length,
    };
  });

  const filtered = query
    ? patients.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : patients;

  return (
    <div>
      <div className="ph">
        <div className="pt">My Patients</div>
        <div className="ps">Overview of all your patients</div>
      </div>

      {patients.length > 0 && (
        <div className="section-row">
          <input
            className="form-i"
            style={{ maxWidth: 280 }}
            placeholder="Search patient by name or ID..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="ps">{filtered.length} of {patients.length} patients</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-ic"><AppIcon name="profile" /></div>
          <div className="empty-t">
            {patients.length === 0 ? "No patients yet" : "No matching patients"}
          </div>
          <div className="empty-s">
            {patients.length === 0
              ? "Patients will appear here once they book an appointment with you."
              : "Try a different search term."}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
          gap: '1rem'
        }}>
          {filtered.map(p => (
            <div key={p.id} className="card">
              <div className="card-b">

                {/* header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div className="doc-av av-p">{p.name?.[0]?.toUpperCase() || "?"}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text2)' }}>
                      {p.phone || `ID: ${String(p.id).slice(-6)}`}
                    </div>
                  </div>
                  {p.upcoming > 0 && (
                    <span className="badge b-pending">{p.upcoming} upcoming</span>
                  )}
                </div>

                {/* latest scan thumbnail */}
                {p.analysis && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem', background: 'var(--bg)',
                    borderRadius: 'var(--r2)', marginBottom: '0.75rem'
                  }}>
                    <ScanImage
                      scanId={p.analysis._id || p.analysis.id}
                      alt={`${p.name} latest scan`}
                      style={{
                        width: 52, height: 52, borderRadius: 8, objectFit: 'cover',
                        flexShrink: 0, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '0.65rem',
                        color: 'var(--text3)', background: 'var(--border)'
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                        {p.analysis.atype || "Analysis"}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text3)' }}>
                        {p.analysis.conf || 0}% confidence · {p.scanCount} scan{p.scanCount === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                )}

                {/* details */}
                {[
                  ['Total Visits', p.visits],
                  ['Completed', p.completed],
                  ['Last Visit', p.lastVisit || 'N/A'],
                  ['Acne Type', p.analysis?.atype || 'No scan yet'],
                  ['Skin Type', p.analysis?.skinType || 'N/A'],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    padding: '0.3rem 0',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <span style={{ color: 'var(--text2)' }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}

                {/* severity */}
                {p.analysis?.sev && (
                  <div style={{
                    marginTop: '0.6rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Severity</span>
                    <span className={`badge b-${String(p.analysis.sev).toLowerCase()}`}>
                      {p.analysis.sev}
                    </span>
                  </div>
                )}

                {/* actions */}
                {setPage && setSelectedPatientId && (
                  <button
                    className="btn btn-ghost btn-sm btn-full doctor-patient-appointments-button"
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setPage("appointments");
                    }}
                  >
                    <AppIcon name="calendar" /> View all appointments
                  </button>
                )}
                {onSelectPatient && (
                  <button
                    className="btn btn-pri btn-sm btn-full"
                    style={{ marginTop: '0.85rem' }}
                    onClick={() => {
                      onSelectPatient(p);
                      if (setPage) setPage("prescriptions");
                    }}
                  >
                    <AppIcon name="edit" /> Write Prescription
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
