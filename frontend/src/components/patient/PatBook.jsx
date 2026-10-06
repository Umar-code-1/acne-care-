// src/components/patient/PatBook.jsx
import React, { useState } from "react";
import API from "../../api";
import AppIcon from "../shared/AppIcon";

function PatBook({
  user,
  doctors = [],
  latestAn,
  appointments = [],
  setAppointments,
  refresh,
  notify,
}) {
  const [saving, setSaving] = useState(false);
  const [shakeDate, setShakeDate] = useState(false);
  const [step, setStep] = useState(1);
  const [selDoc, setSelDoc] = useState(null);
  const [type, setType] = useState("");
  const [plat, setPlat] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);

  const ALL_PLATFORMS = [
    { id: "zoom", ic: "🎥", n: "Zoom" },
    { id: "google_meet", ic: "📹", n: "Google Meet" },
    { id: "whatsapp", ic: "💬", n: "WhatsApp" },
  ];

  // sirf woh platforms jo doctor offer karta hai
  const platforms = selDoc?.platforms?.length
    ? ALL_PLATFORMS.filter((p) => selDoc.platforms.includes(p.n))
    : ALL_PLATFORMS;

  // doctor ke working hours se slots banao
  const buildSlots = (start, end) => {
    const [sh] = (start || "09:00").split(":").map(Number);
    const [eh] = (end   || "17:00").split(":").map(Number);
    const out = [];
    for (let h = sh; h < eh; h++) {
      const ampm = h >= 12 ? "PM" : "AM";
      const hr = h % 12 === 0 ? 12 : h % 12;
      out.push(`${hr}:00 ${ampm}`);
    }
    return out;
  };

   const times = selDoc ? buildSlots(selDoc.startTime, selDoc.endTime) : [];

    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayOf = (dateStr) => {
    if (!dateStr) return "";
    return DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()];
  };

  const dayAllowed = (dateStr) => {
    if (!dateStr || !selDoc?.days?.length) return true;
    return selDoc.days.includes(dayOf(dateStr));
  };

  const dateOk = dayAllowed(date);

const goToReview = () => {
    if (!dateOk) {
      setShakeDate(false);
      setTimeout(() => setShakeDate(true), 10);
      return;
    }
    setShakeDate(false);
    setStep(4);
  };

  const confirm = async () => {
    if (!selDoc || !type || !date || !time || (type === "online" && !plat)) return;
    setSaving(true);
    try {
      await API.post("/appointments", {
        doctorId: selDoc._id,
        type,
        platform: type === "online" ? plat : "",
        date,
        time,
        severity: latestAn?.sev || "",
        acneType: latestAn?.atype || "",
      });
      setDone(true);
      notify?.("✅ Appointment booked successfully!");
      refresh?.();
    } catch (err) {
      notify?.("❌ " + (err.response?.data?.message || "Booking failed"));
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelDoc(null);
    setType("");
    setPlat("");
    setDate("");
    setTime("");
    setDone(false);
  };

  if (done) {
    return (
      <div>
        <div className="ph">
          <div className="pt">Book Appointment</div>
        </div>

        <div className="confirm-box">
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}><AppIcon name="check" /></div>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              fontSize: "1.3rem",
              marginBottom: "0.5rem",
            }}
          >
            Appointment Booked!
          </div>
          <div
            style={{
              opacity: 0.8,
              marginBottom: "0.85rem",
            }}
          >
            Your request has been sent to {selDoc?.name}.
          </div>

          <div className="confirm-details">
            {[
              ["Doctor", selDoc?.name],
              ["Specialization", selDoc?.spec],
              ["Date", date],
              ["Time", time],
              ["Type", type === "online" ? "Online" : "Physical Visit"],
              [
                "Fee",
                `PKR ${type === "online" ? selDoc?.ofee : selDoc?.fee}`,
              ],
              ["Status", "Pending Confirmation"],
            ].map(([k, v]) => (
              <div key={k} className="confirm-row">
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          {type === "online" && (
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: "var(--r2)",
                padding: "0.75rem",
                fontSize: "0.84rem",
                marginTop: "0.5rem",
              }}
            >
              Meeting link will be sent after doctor confirms.
            </div>
          )}

          <button
            className="btn btn-sm"
            onClick={reset}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              marginTop: "1rem",
            }}
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ph">
        <div className="pt">Book Appointment</div>
        <div className="ps">Schedule a consultation with a dermatologist</div>
      </div>

      {latestAn && (
        <div className="alert al-info">
          Your analysis will be shared{" "}
          <strong>{latestAn.atype}</strong> /
          <strong>{latestAn.sev}</strong> severity.
        </div>
      )}

      {/* Step indicator */}
      <div className="bk-steps">
        {["Select Doctor", "Type", "Date & Time", "Confirm"].map(
          (lb, i) => (
            <div
              key={lb}
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
              }}
            >
              {i > 0 && (
                <div className={`bk-line ${step > i + 1 ? "done" : ""}`} />
              )}
              <div className="bk-step">
                <div
                  className={`bk-sn ${
                    step > i + 1 ? "done" : step === i + 1 ? "act" : ""
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`bk-sl ${step === i + 1 ? "act" : ""}`}
                >
                  {lb}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* STEP 1: Choose doctor */}
      {step === 1 && (
        <>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              marginBottom: "0.85rem",
            }}
          >
            Choose a Dermatologist
          </div>
          <div className="doc-grid">
          {doctors.map((doc) => (
              <div
                key={doc._id}
                className={`doc-card ${selDoc?._id === doc._id ? "sel" : ""}`}
                onClick={() => setSelDoc(doc)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div className="doc-av">{doc.avatar}</div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.92rem",
                      }}
                    >
                      {doc.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text2)",
                      }}
                    >
                      {doc.spec}
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--acc)",
                      }}
                    >
                      {doc.rating}/5
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text2)",
                    marginBottom: "0.65rem",
                    lineHeight: 1.6,
                  }}
                >
                  {doc.bio}
                </div>
                <div
                  style={{
                    fontSize: "0.76rem",
                    color: "var(--text3)",
                    marginBottom: "0.65rem",
                  }}
                >
                  {doc.days?.join(", ")} • {doc.qual}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      background: "var(--pri-l)",
                      color: "var(--pri)",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.65rem",
                      borderRadius: 20,
                    }}
                  >
                    PKR {doc.fee} Physical
                  </div>
                  <div
                    style={{
                      background: "var(--sec-l)",
                      color: "var(--sec)",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.65rem",
                      borderRadius: 20,
                    }}
                  >
                    PKR {doc.ofee} Online
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-pri"
            disabled={!selDoc}
            onClick={() => setStep(2)}
            style={{ marginTop: "0.85rem" }}
          >
            Next: Choose Type
          </button>
        </>
      )}

      {/* STEP 2: Choose type */}
      {step === 2 && (
        <>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              marginBottom: "0.85rem",
            }}
          >
            Choose Appointment Type
          </div>

          <div className="type-cards">
            <div
              className={`type-c ${type === "physical" ? "sel" : ""}`}
              onClick={() => {
                setType("physical");
                setPlat("");
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.65rem" }}>
                <AppIcon name="medicalKit" />
              </div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "0.3rem",
                }}
              >
                Physical Visit
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text2)",
                  marginBottom: "0.65rem",
                }}
              >
                Visit the clinic in person for direct examination.
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--pri)",
                  fontSize: "1rem",
                }}
              >
                PKR {selDoc?.fee}
              </div>
            </div>

            <div
              className={`type-c ${type === "online" ? "sel" : ""}`}
              onClick={() => setType("online")}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.65rem" }}>
                <AppIcon name="activity" />
              </div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "0.3rem",
                }}
              >
                Online Consultation
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text2)",
                  marginBottom: "0.65rem",
                }}
              >
                Video call from the comfort of your home.
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--sec)",
                  fontSize: "1rem",
                }}
              >
                PKR {selDoc?.ofee}
              </div>
            </div>
          </div>

          {type === "online" && (
            <>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "0.6rem",
                  fontSize: "0.88rem",
                  marginTop: "0.75rem",
                }}
              >
                Select Platform
              </div>
              <div className="plat-grid">
                {platforms.map((p) => (
                  <div
                    key={p.id}
                    className={`plat-c ${plat === p.id ? "sel" : ""}`}
                    onClick={() => setPlat(p.id)}
                  >
                    <div
                      style={{
                        fontSize: "1.75rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <AppIcon emoji={p.ic} />
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      {p.n}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.85rem" }}>
            <button
              className="btn btn-ghost"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="btn btn-pri"
              disabled={!type || (type === "online" && !plat)}
              onClick={() => setStep(3)}
            >
              Next: Pick Date
            </button>
          </div>
        </>
      )}

      {/* STEP 3: Date & Time */}
      {step === 3 && (
        <>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              marginBottom: "0.85rem",
            }}
          >
            Select Date & Time
          </div>

          <div className="g2" style={{ marginBottom: "1.25rem" }}>
            <div>
              <div
                className="form-l"
                style={{ marginBottom: "0.5rem" }}
              >
                Choose Date
              </div>
              <input
                className="form-i"
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => { setDate(e.target.value); setShakeDate(false); }}
                style={date && !dateOk ? { borderColor: "var(--dan)" } : {}}
              />
              {selDoc?.days?.length > 0 && (
                <div className="form-hint">
                  Dr. {selDoc.name?.split(" ").slice(-1)} is available on:{" "}
                  <strong>{selDoc.days.join(", ")}</strong>
                </div>
              )}
              {date && !dateOk && (
                <div className={`auth-err ${shakeDate ? "shake" : ""}`}
                  style={{ marginTop: "0.5rem", fontWeight: 600 }}>
                  <AppIcon name="alert" /> {dayOf(date)} is not available. Please choose{" "}
                  {selDoc.days.join(", ")}.
                </div>
              )}
            </div>
            <div>
              <div className="form-l" style={{ marginBottom: "0.5rem" }}>
                Choose Time Slot
                {selDoc?.startTime && (
                  <span style={{ fontWeight: 400, color: "var(--text3)", fontSize: "0.76rem" }}>
                    {" "}({selDoc.startTime} – {selDoc.endTime})
                  </span>
                )}
              </div>
              <div className="time-grid">
                {times.map((t) => (
                  <div
                    key={t}
                    className={`time-slot ${time === t ? "sel" : ""}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.65rem" }}>
            <button
              className="btn btn-ghost"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="btn btn-pri"
              disabled={!date || !time}
              onClick={goToReview}
            >
              Review Booking
            </button>
          </div>
        </>
      )}

      {/* STEP 4: Review & Confirm */}
      {step === 4 && (
        <>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              marginBottom: "0.85rem",
            }}
          >
            Review & Confirm
          </div>

          <div className="card" style={{ marginBottom: "1rem" }}>
            <div className="card-b">
              {[
                ["Doctor", selDoc?.name],
                ["Qualification", selDoc?.qual],
                ["Date", date],
                ["Time", time],
                [
                  "Type",
                  type === "online" ? `Online (${plat})` : "Physical Visit",
                ],
                [
                  "Fee",
                  `PKR ${
                    type === "online" ? selDoc?.ofee : selDoc?.fee
                  }`,
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.55rem 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--text2)" }}>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.65rem" }}>
            <button
              className="btn btn-ghost"
              onClick={() => setStep(3)}
            >
              Back
            </button>
            <button
              className="btn btn-pri"
              onClick={confirm}
              disabled={saving}
            >
              {saving ? <><AppIcon name="clock" /> Booking...</> : "Confirm Booking"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PatBook;
