import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

export default function DocAppts({ appts = [], appointments = [], refresh, notify }) {
  const list = appts.length ? appts : appointments;

  const [tab, setTab] = useState("all");
  const [busy, setBusy] = useState(null);
  const [linkFor, setLinkFor] = useState(null);
  const [link, setLink] = useState("");

  const TABS = [
    { k: "all",       l: "All" },
    { k: "pending",   l: "Pending" },
    { k: "confirmed", l: "Confirmed" },
    { k: "completed", l: "Completed" },
    { k: "cancelled", l: "Cancelled" },
  ];
const isNew = (a) => {
    if (a.status !== "pending") return false;
    if (!a.createdAt) return false;
    const hours = (Date.now() - new Date(a.createdAt)) / 36e5;
    return hours < 24;
  };
  
  const shown = tab === "all" ? list : list.filter((a) => a.status === tab);

  const update = async (id, body, msg) => {
    setBusy(id);
    try {
      await API.put(`/appointments/${id}`, body);
      notify?.(msg);
      refresh?.();
      setLinkFor(null);
      setLink("");
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Update failed"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="ph">
        <div className="pt">My Appointments</div>
        <div className="ps">Confirm bookings, share meeting links, and mark visits complete</div>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.k}
            className={`tab ${tab === t.k ? "act" : ""}`}
            onClick={() => setTab(t.k)}
          >
            {t.l} ({t.k === "all" ? list.length : list.filter((a) => a.status === t.k).length})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty">
          <div className="empty-ic"><AppIcon name="calendar" /></div>
          <div className="empty-t">No {tab === "all" ? "" : tab} appointments</div>
          <div className="empty-s">Bookings from patients will appear here.</div>
        </div>
      ) : (
        shown.map((a) => (
          <div key={a._id || a.id} className="card">
            <div className="card-b">

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
                <div className="doc-av av-p">{a.pname?.[0]?.toUpperCase() || "?"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{a.pname || "Unknown patient"}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text2)" }}>
                    {a.pphone || "No contact"}
                  </div>
                </div>
<div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                  {isNew(a) && (
                    <span className="badge" style={{ background: "var(--pri)", color: "#fff" }}>
                      NEW
                    </span>
                  )}
                  <span className={`badge b-${a.status}`}>{a.status}</span>
                  <span className={`badge b-${a.payment || "unpaid"}`}>
                      {a.payment === "paid" ? <><AppIcon name="check" /> Paid</>
                        : a.payment === "pending_verification" ? <><AppIcon name="search" /> Verifying</>
                        : a.payment === "rejected" ? <><AppIcon name="closeCircle" /> Rejected</>
                        : <><AppIcon name="alert" /> Unpaid</>}
                    </span>
                </div>              </div>

              <div className="g2" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
                {[
                  ["Date", a.date],
                  ["Time", a.time],
                  ["Type", a.type === "online" ? (a.plat || "Online") : "Physical"],
                  ["Fee", a.fee ? `Rs ${a.fee}` : "—"],
                  ["Acne Type", a.atype || "—"],
                  ["Severity", a.sev || "—"],
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
              </div>

              {a.link && (
                <div className="alert al-info" style={{ wordBreak: "break-all" }}>
                  <AppIcon name="arrowRight" /> <a href={a.link} target="_blank" rel="noreferrer">{a.link}</a>
                </div>
              )}

              {linkFor === (a._id || a.id) && (
                <div className="form-g">
                  <label className="form-l">Meeting Link</label>
                  <input
                    className="form-i"
                    placeholder="https://zoom.us/j/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      className="btn btn-pri btn-sm"
                      disabled={!link.trim() || busy === (a._id || a.id)}
                      onClick={() => update(a._id || a.id, { meetingLink: link.trim() }, "✅ Meeting link shared")}
                    >
                      Save Link
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setLinkFor(null); setLink(""); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {a.status === "pending" && (
                  <button
                    className="btn btn-pri btn-sm"
                    disabled={busy === (a._id || a.id)}
                    onClick={() => update(a._id || a.id, { status: "confirmed" }, "✅ Appointment confirmed")}
                  >
                    Confirm
                  </button>
                )}

                {a.status === "confirmed" && (
                  <button
                    className="btn btn-sec btn-sm"
                    disabled={busy === (a._id || a.id)}
                    onClick={() => update(a._id || a.id, { status: "completed" }, "✅ Marked as completed")}
                  >
                    Mark Completed
                  </button>
                )}

                {a.type === "online" && ["pending", "confirmed"].includes(a.status) && linkFor !== (a._id || a.id) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setLinkFor(a._id || a.id); setLink(a.link || ""); }}
                  >
                    {a.link ? "Edit Link" : "Add Meeting Link"}
                  </button>
                )}

                {["pending", "confirmed"].includes(a.status) && (
                  <button
                    className="btn btn-dan btn-sm"
                    disabled={busy === (a._id || a.id)}
                    onClick={() => update(a._id || a.id, { status: "cancelled" }, "Appointment cancelled")}
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </div>
        ))
      )}
    </div>
  );
}
