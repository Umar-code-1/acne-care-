import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PLATFORMS = ["Zoom", "Google Meet", "WhatsApp"];

export default function ProfessionalDetails({ user, notify, refresh }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [f, setF] = useState({
    spec:      user?.spec || "",
    qual:      user?.qual || "",
    exp:       user?.exp || "",
    fee:       user?.fee || "",
    ofee:      user?.ofee || "",
    bio:       user?.bio || "",

    days:      (user?.days || []).filter(Boolean),
    available: user?.available !== false,
    platforms: user?.platforms?.length ? user.platforms : PLATFORMS,
    startTime: user?.startTime || "09:00",
    endTime:   user?.endTime || "17:00",
  });

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const toggleIn = (k, v) =>
    setF((p) => ({
      ...p,
      [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v],
    }));
const fail = (msg) => {
    setError(msg);
    setShake(false);
    setTimeout(() => setShake(true), 10);
  };
const save = async () => {
    console.log("DAYS:", f.days, "notify?", typeof notify);   
    console.log("SAVE CLICKED — days:", f.days, "length:", f.days.length); 
   if (!f.fee || !f.ofee) return fail("Please set both consultation fees");
    if (f.days.length === 0) return fail("Please select at least one available day");
    setError("");
    setShake(false);

    setBusy(true);
    try {
     await API.put("/auth/profile", {
        ...f,
        days: f.days.filter(Boolean),
        platforms: f.platforms.filter(Boolean),
        exp:  Number(f.exp) || 0,
        fee:  Number(f.fee) || 0,
        ofee: Number(f.ofee) || 0,
      });
      notify?.("✅ Professional details updated");
      setEditing(false);
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Could not save"));
    } finally {
      setBusy(false);
    }
  };

  const Row = ({ label, value }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", gap: "0.75rem",
      fontSize: "0.83rem", padding: "0.45rem 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ color: "var(--text2)", flexShrink: 0 }}>{label}</span>
      <strong style={{ textAlign: "right" }}>{value || "—"}</strong>
    </div>
  );

  return (
    <div className="card">
      <div className="card-h">
        <div className="card-t"><AppIcon name="doctor" /> Professional Details</div>
        {!editing && (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
            <AppIcon name="edit" /> Edit
          </button>
        )}
      </div>

      <div className="card-b">
        {!editing ? (
          <>
            <Row label="Specialisation" value={f.spec} />
            <Row label="Qualification" value={f.qual} />
            <Row label="Experience" value={f.exp ? `${f.exp} years` : ""} />
            <Row label="Physical Fee" value={f.fee ? `PKR ${Number(f.fee).toLocaleString()}` : ""} />
            <Row label="Online Fee" value={f.ofee ? `PKR ${Number(f.ofee).toLocaleString()}` : ""} />
            <Row label="Working Hours" value={`${f.startTime} – ${f.endTime}`} />

            <div style={{ padding: "0.65rem 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.83rem", color: "var(--text2)", marginBottom: "0.4rem" }}>
                Available Days
              </div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {DAYS.map((d) => (
                  <span key={d} className="badge"
                    style={f.days.includes(d)
                      ? { background: "var(--ok-l)", color: "var(--ok)" }
                      : { background: "var(--bg)", color: "var(--text3)" }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: "0.65rem 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.83rem", color: "var(--text2)", marginBottom: "0.4rem" }}>
                Online Platforms
              </div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {f.platforms.map((p) => (
                  <span key={p} className="badge b-online">{p}</span>
                ))}
              </div>
            </div>

            {f.bio && (
              <div style={{ paddingTop: "0.75rem" }}>
                <div style={{ fontSize: "0.83rem", color: "var(--text2)", marginBottom: "0.3rem" }}>
                  About
                </div>
                <div style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text2)" }}>
                  {f.bio}
                </div>
              </div>
            )}

            <div className={`alert ${f.available ? "al-ok" : "al-warn"}`}
              style={{ marginTop: "1rem", marginBottom: 0 }}>
              {f.available
                ? <><AppIcon name="check" /> Currently available for new appointments</>
                : <><AppIcon name="clock" /> Not accepting new appointments — you're hidden from patient search</>}
            </div>
          </>
        ) : (
          <>
            <div className="g2">
              <div className="form-g">
                <label className="form-l">Specialisation</label>
                <input className="form-i" value={f.spec} onChange={set("spec")}
                  placeholder="e.g. Dermatology" />
              </div>
              <div className="form-g">
                <label className="form-l">Experience (years)</label>
                <input className="form-i" type="number" value={f.exp}
                  onChange={set("exp")} placeholder="8" />
              </div>
            </div>

            <div className="form-g">
              <label className="form-l">Qualification</label>
              <input className="form-i" value={f.qual} onChange={set("qual")}
                placeholder="e.g. MBBS, FCPS Dermatology" />
            </div>

            <div className="g2">
              <div className="form-g">
                <label className="form-l">Physical Visit Fee (PKR)</label>
                <input className="form-i" type="number" value={f.fee}
                  onChange={set("fee")} placeholder="2500" />
              </div>
              <div className="form-g">
                <label className="form-l">Online Consultation Fee (PKR)</label>
                <input className="form-i" type="number" value={f.ofee}
                  onChange={set("ofee")} placeholder="1500" />
              </div>
            </div>

            <div className="form-g">
              <label className="form-l">Available Days</label>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {DAYS.map((d) => (
                  <div key={d}
                    className={`radio-item ${f.days.includes(d) ? "sel" : ""}`}
                    style={{ padding: "0.4rem 0.75rem" }}
                    onClick={() => toggleIn("days", d)}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="g2">
              <div className="form-g">
                <label className="form-l">Start Time</label>
                <input className="form-i" type="time" value={f.startTime}
                  onChange={set("startTime")} />
              </div>
              <div className="form-g">
                <label className="form-l">End Time</label>
                <input className="form-i" type="time" value={f.endTime}
                  onChange={set("endTime")} />
              </div>
            </div>

            <div className="form-g">
              <label className="form-l">Online Platforms</label>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {PLATFORMS.map((p) => (
                  <div key={p}
                    className={`radio-item ${f.platforms.includes(p) ? "sel" : ""}`}
                    style={{ padding: "0.4rem 0.75rem" }}
                    onClick={() => toggleIn("platforms", p)}>
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-g">
              <label className="form-l">About You</label>
              <textarea className="form-i" value={f.bio} onChange={set("bio")}
                placeholder="Brief description shown to patients browsing doctors..." />
              <div className="form-hint">
                This appears on your card when patients choose a dermatologist.
              </div>
            </div>

            <div
              className={`check-item ${f.available ? "sel" : ""}`}
              style={{ marginBottom: "1rem" }}
              onClick={() => setF((p) => ({ ...p, available: !p.available }))}>
              <span>{f.available ? <AppIcon name="check" /> : "○"}</span>
              Accepting new appointments
            </div>
        {error && (
              <div className={`auth-err ${shake ? "shake" : ""}`}
                style={{ fontWeight: 600 }}>
                <AppIcon name="alert" /> {error}
              </div>
              )}  
                        <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-pri" onClick={save} disabled={busy}>
                {busy ? "Saving…" : "Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
