// src/components/patient/PatProfile.jsx
import React, { useState } from "react";
import API from "../../api";
import AppIcon from "../shared/AppIcon";
import Disclaimer from "../shared/Disclaimer";
import ScanHistory from "../shared/ScanHistory";
import DataControls from "../shared/DataControls";
function PatProfile({ user, setUser, appts = [], analyses = [], refresh, notify, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || "");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", avatar: user.avatar || "" });
  const totalAppts = appts.length;
  const completed = appts.filter((a) => a.status === "completed").length;
  const upcoming = appts.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;
  const latestAn = analyses.length ? analyses[analyses.length - 1] : null;
  const isImageAvatar = /^(data:image\/|https?:\/\/)/i.test(form.avatar || "");
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await API.put("/auth/profile", {
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar,
      });
      setUser?.(response.data);
      setForm({ name: response.data.name, email: response.data.email, avatar: response.data.avatar || "" });
      setSelectedAvatar(response.data.avatar || "");
      setEditing(false);
      notify?.("✅ Profile updated");
    } catch (error) {
      notify?.("❌ " + (error.response?.data?.message || "Could not update profile"));
    } finally {
      setSaving(false);
    }
  };

  const applyAvatar = () => {
    setForm((current) => ({ ...current, avatar: selectedAvatar }));
    setAvatarPickerOpen(false);
  };

  return (
    <div>
      <div className="ph">
        <div className="pt">My Profile</div>
      </div>

      <section className="profile-card">
        <div className="profile-cover" aria-hidden="true" />
        {!editing && <button type="button" className="profile-edit-button" onClick={() => setEditing(true)} aria-label="Edit profile" title="Edit profile"><AppIcon name="edit" /><span>Edit</span></button>}
        <div className="profile-avatar-wrap">
          <button type="button" className={`p-av profile-avatar-trigger ${editing ? "is-editing" : ""}`} onClick={() => { if (!editing) return; setSelectedAvatar(form.avatar || user.name?.[0]?.toUpperCase() || ""); setAvatarPickerOpen(true); }} aria-label={editing ? "Choose profile avatar" : "Profile photo"} title={editing ? "Choose profile avatar" : "Profile photo"} disabled={!editing}>
            {isImageAvatar ? <img className="profile-avatar-image" src={form.avatar} alt="" /> : form.avatar || user.name?.[0]?.toUpperCase()}
          </button>
          {!editing && <button type="button" className="profile-avatar-edit-mark" onClick={() => { setEditing(true); setSelectedAvatar(form.avatar || user.name?.[0]?.toUpperCase() || ""); setAvatarPickerOpen(true); }} aria-label="Edit profile photo" title="Edit profile photo"><AppIcon name="edit" /></button>}
        </div>
        <div className="profile-form">
          {editing ? (
            <>
              <label>Name<span className="profile-input-wrap"><AppIcon name="profile" /><input value={form.name} onChange={updateField("name")} maxLength={100} required /></span></label>
              <label>Email<span className="profile-input-wrap"><span aria-hidden="true" className="profile-at-sign">@</span><input type="email" value={form.email} onChange={updateField("email")} required /></span></label>
              <div className="profile-form-actions">
                <button type="button" className="btn btn-pri" onClick={saveProfile} disabled={saving || !form.name.trim() || !emailIsValid}>{saving ? "Saving…" : <><AppIcon name="clipboard" /> Save changes</>}</button>
                <button type="button" className="btn btn-ghost" onClick={() => { setForm({ name: user.name || "", email: user.email || "", avatar: user.avatar || "" }); setEditing(false); }}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-display-field"><span>Name</span><div className="profile-input-wrap"><AppIcon name="profile" /><span>{user.name}</span></div></div>
              <div className="profile-display-field"><span>Email</span><div className="profile-input-wrap"><span aria-hidden="true" className="profile-at-sign">@</span><span>{user.email}</span></div></div>
            </>
          )}
          <div className="profile-account-type"><span>Account Type</span><div className="p-badge p-badge-patient"><AppIcon name="profile" /> Patient</div></div>
        </div>
      </section>

      <div className="g2">
        <div className="card">
          <div className="card-h">
            <div className="card-t">Account Summary</div>
            <button type="button" className="profile-collapse-button" onClick={() => setSummaryOpen((open) => !open)} aria-expanded={summaryOpen} aria-label={`${summaryOpen ? "Collapse" : "Expand"} account summary`}><AppIcon name="arrowDown" className={summaryOpen ? "open" : ""} /></button>
          </div>
          {summaryOpen && <div className="card-b">
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
          </div>}
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
    {avatarPickerOpen && (
      <div className="avatar-picker-backdrop" onMouseDown={() => setAvatarPickerOpen(false)}>
        <section className="avatar-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="avatar-picker-title" onMouseDown={(event) => event.stopPropagation()}>
          <h2 id="avatar-picker-title">Update your profile photo</h2>
          <div className="avatar-picker-options">
            {["🌿", "🌸", "✨"].map((avatar) => (
              <button type="button" key={avatar} className={selectedAvatar === avatar ? "selected" : ""} onClick={() => setSelectedAvatar(avatar)} aria-label={`Choose ${avatar} avatar`} aria-pressed={selectedAvatar === avatar}>{avatar}</button>
            ))}
          </div>
          <div className="avatar-picker-actions">
            <button type="button" className="btn btn-pri" onClick={applyAvatar} disabled={!selectedAvatar}>Use avatar</button>
            <button type="button" className="btn btn-ghost" onClick={() => setAvatarPickerOpen(false)}>Cancel</button>
          </div>
        </section>
      </div>
    )}
    </div>
  );
}

export default PatProfile;
