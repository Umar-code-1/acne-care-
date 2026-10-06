// src/components/patient/PatAppts.jsx
import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";
import PatPayment from "./PatPayment";
function PatAppts({ appts = [], refresh, notify }) {
  const [filter, setFilter] = useState("all");
const [payingFor, setPayingFor] = useState(null);
  const fil =
    filter === "all"
      ? appts
      : appts.filter((a) => a.status === filter);

      if (payingFor) {
    return (
      <PatPayment
        appt={payingFor}
        onBack={() => setPayingFor(null)}
        refresh={refresh}
        notify={notify}
      />
    );
  }
  return (
    <div>
      <div className="ph">
        <div className="pt">My Appointments</div>
        <div className="ps">Track all your consultations</div>
      </div>

      <div className="tab-bar">
        {["all", "pending", "confirmed", "completed", "cancelled"].map(
          (s) => (
            <button
              key={s}
              className={`tab ${filter === s ? "act" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}{" "}
              {s === "all"
                ? appts.length
                : appts.filter((a) => a.status === s).length}
            </button>
          )
        )}
      </div>

      {fil.length === 0 ? (
        <div className="empty">
          <div className="empty-ic"><AppIcon name="calendar" /></div>
          <div className="empty-t">No appointments found</div>
          <div className="empty-s">
            Book an appointment with a dermatologist to start your treatment.
          </div>
        </div>
      ) : (
        fil.map((a) => (
          <div key={a.id} className="card">
            <div className="card-b">
              <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    {a.dname}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text2)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {a.date} at {a.time}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      marginTop: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="badge b-online">
                      {a.type === "online" ? a.plat : "Physical"}
                    </span>
                    <span className={`badge b-${a.status}`}>
                      {a.status}
                    </span>
                    <span className={`badge b-${a.payment || "unpaid"}`}>
                      {a.payment === "paid" ? <><AppIcon name="check" /> Paid</>
                        : a.payment === "pending_verification" ? <><AppIcon name="search" /> Verifying</>
                        : a.payment === "rejected" ? <><AppIcon name="closeCircle" /> Rejected</>
                        : <><AppIcon name="alert" /> Unpaid</>}
                    </span>
                    {a.sev && (
                      <span
                        className={`badge b-${a.sev.toLowerCase()}`}
                      >
                        {a.sev}
                      </span>
                    )}
                  </div>
                  {a.atype && (
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text2)",
                        marginTop: "0.35rem",
                      }}
                    >
                      {a.atype} acne
                    </div>
                  )}
                  {a.payment !== "paid" && a.status !== "cancelled" && (
                    <button className="btn btn-pri btn-sm"
                      style={{ marginTop: "0.6rem" }}
                      onClick={() => setPayingFor(a)}>
                      {a.payment === "pending_verification"
                        ? <><AppIcon name="search" /> View payment status</>
                        : a.payment === "rejected"
                        ? <><AppIcon name="alert" /> Retry payment</>
                        : <><AppIcon name="card" /> Pay PKR {a.fee?.toLocaleString() || 0}</>}
                    </button>
                  )}
                </div>
              </div>

              {a.type === "online" &&
                a.link &&
                a.status === "confirmed" && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sec btn-sm"
                    style={{ alignSelf: "flex-start", marginTop: "0.6rem" }}
                  >
                    Join Meeting
                  </a>
                )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PatAppts;
