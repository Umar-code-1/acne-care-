import React, { useState } from "react";
import API from "../../api";
import AppIcon from "../shared/AppIcon";

export default function AdminVerify({ users = [], refresh, notify }) {
  const [busy, setBusy] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");
  const [viewing, setViewing] = useState(null);

  const pending = users.filter((u) => u.role === "dermatologist" && !u.isVerified);
  const verified = users.filter((u) => u.role === "dermatologist" && u.isVerified);

  const act = async (id, approve, why) => {
    setBusy(id);
    try {
      await API.put(`/users/${id}/verify`, { approve, reason: why });
      notify?.(approve ? "✅ Doctor approved" : "Doctor rejected");
      setRejectId(null);
      setReason("");
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Action failed"));
    } finally {
      setBusy("");
    }
  };

  const viewLicense = async (id) => {
    try {
      const res = await API.get(`/users/${id}/license`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank");
    } catch {
      notify?.("❌ No licence document on file");
    }
  };

  return (
    <div>
      <div className="ph">
        <div className="pt">Doctor Verification</div>
        <div className="ps">Review PMDC credentials before granting clinical access</div>
      </div>

      <div className="alert al-warn">
        <AppIcon name="alert" /> Verify each registration number on the official PMDC register before
        approving. An approved doctor can issue prescription medication.
      </div>

      <div className="card">
        <div className="card-h">
          <div className="card-t">Pending Review</div>
          <span className="badge b-pending">{pending.length}</span>
        </div>
        <div className="card-b">
          {pending.length === 0 ? (
            <div className="empty" style={{ padding: "1.5rem" }}>
              <div className="empty-ic"><AppIcon name="check" /></div>
              <div className="empty-t">No pending applications</div>
            </div>
          ) : (
            pending.map((d) => (
              <div key={d._id} style={{
                border: "1px solid var(--border)", borderRadius: "var(--r)",
                padding: "1rem", marginBottom: "0.75rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div className="doc-av av-d">{d.name?.[0]?.toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text2)" }}>{d.email}</div>
                  </div>
                </div>

                {[
                  ["PMDC Number", d.pmdcNumber || <><AppIcon name="closeCircle" /> Not provided</>],
                  ["Specialisation", d.spec || "—"],
                  ["Qualification", d.qual || "—"],
                  ["Experience", d.exp ? `${d.exp} years` : "—"],
                  ["Applied", d.joined || "—"],
                  ["Licence Document", d.licenseDoc ? <><AppIcon name="check" /> Uploaded</> : <><AppIcon name="closeCircle" /> Not uploaded</>],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "0.82rem", padding: "0.3rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <span style={{ color: "var(--text2)" }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.85rem" }}>
                  {d.licenseDoc && (
                    <button className="btn btn-ghost btn-sm" onClick={() => viewLicense(d._id)}>
                      <AppIcon name="document" /> View Licence
                    </button>
                  )}
                  <button className="btn btn-pri btn-sm"
                    disabled={busy === d._id || !d.licenseDoc}
                    onClick={() => act(d._id, true)}>
                    <AppIcon name="check" /> Approve
                  </button>
                  <button className="btn btn-dan btn-sm"
                    disabled={busy === d._id}
                    onClick={() => setRejectId(d._id)}>
                    <AppIcon name="close" /> Reject
                  </button>
                </div>

                {!d.licenseDoc && (
                  <div className="form-hint" style={{ marginTop: "0.5rem" }}>
                    Cannot approve until the doctor uploads their licence document.
                  </div>
                )}

                {rejectId === d._id && (
                  <div className="alert al-dan" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                    <div style={{ width: "100%" }}>
                      <div style={{ marginBottom: "0.5rem", fontWeight: 700 }}>Reason for rejection</div>
                      <input className="form-i" value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. PMDC number not found on register"
                        style={{ marginBottom: "0.5rem" }} />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-dan btn-sm"
                          onClick={() => act(d._id, false, reason)}>
                          Confirm Rejection
                        </button>
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => { setRejectId(null); setReason(""); }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div className="card-t">Verified Doctors</div>
          <span className="badge b-confirmed">{verified.length}</span>
        </div>
        <div className="card-b">
          {verified.length === 0 ? (
            <div className="empty" style={{ padding: "1.5rem" }}>
              <div className="empty-t">No verified doctors yet</div>
            </div>
          ) : (
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>PMDC</th>
                    <th>Specialisation</th>
                    <th>Verified</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {verified.map((d) => (
                    <tr key={d._id}>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td>{d.pmdcNumber || "—"}</td>
                      <td>{d.spec || "—"}</td>
                      <td>{d.verifiedAt ? String(d.verifiedAt).slice(0, 10) : "—"}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => act(d._id, false, "Verification revoked by admin")}>
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
