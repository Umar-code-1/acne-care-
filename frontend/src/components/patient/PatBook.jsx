// src/components/patient/PatBook.jsx
import React, { useEffect, useRef, useState } from "react";
import API from "../../api";
import AppIcon from "../shared/AppIcon";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dateKey = (date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  .map((part) => String(part).padStart(2, "0")).join("-");

function BookingDatePicker({ value, min, onChange, invalid }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(`${value || min}T12:00:00`));
  const trigger = useRef(null);
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const changeMonth = (offset) => setMonth(new Date(year, monthIndex + offset, 1));
  const selectDay = (key) => {
    onChange(key);
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      <input className="form-i booking-date-native" type="date" aria-label="Choose date"
        value={value} min={min} aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)} />
      <div className="booking-date-mobile">
        <button ref={trigger} type="button" className="form-i booking-date-trigger"
          aria-expanded={open} aria-controls={open ? "booking-calendar" : undefined} aria-invalid={invalid}
          onClick={() => {
            if (!open) setMonth(new Date(`${value || min}T12:00:00`));
            setOpen(!open);
          }}>
          <span>{value ? new Date(`${value}T12:00:00`).toLocaleDateString() : "Choose a date"}</span>
          <AppIcon name="calendar" />
        </button>
        {open && (
          <div id="booking-calendar" className="booking-calendar">
            <div className="booking-calendar-heading">
              <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}
                disabled={dateKey(new Date(year, monthIndex, 1)).slice(0, 7) <= min.slice(0, 7)}>‹</button>
              <strong aria-live="polite">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong>
              <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
            </div>
            <div className="booking-calendar-days">
              {DAY_NAMES.map((day) => <span key={day} aria-hidden="true">{day}</span>)}
              {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}
              {Array.from({ length: dayCount }, (_, index) => {
                const day = new Date(year, monthIndex, index + 1);
                const key = dateKey(day);
                return <button key={key} type="button" disabled={key < min} aria-pressed={key === value}
                  aria-label={day.toLocaleDateString(undefined, { dateStyle: "full" })}
                  onClick={() => selectDay(key)}>{index + 1}</button>;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function PatBook({
  user,
  latestAn,
  appointments = [],
  setAppointments,
  refresh,
  notify,
}) {
  const [directory, setDirectory] = useState({ status: "loading", doctors: [] });
  const [saving, setSaving] = useState(false);
  const [shakeDate, setShakeDate] = useState(false);
  const [step, setStep] = useState(1);
  const [selDoc, setSelDoc] = useState(null);
  const [reviewDoc, setReviewDoc] = useState(null);
  const [type, setType] = useState("");
  const [plat, setPlat] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);
  const confirmationTitle = useRef(null);

  useEffect(() => {
    if (done) confirmationTitle.current?.focus();
  }, [done]);

  useEffect(() => {
    if (directory.status !== "loading") return;
    const controller = new AbortController();
    const { signal } = controller;
    API.get("/appointments/doctors", { signal })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Invalid dermatologist list");
        if (!signal.aborted) setDirectory({ status: "ready", doctors: data });
      })
      .catch(() => {
        if (!signal.aborted) setDirectory({ status: "error", doctors: [] });
      });
    return () => controller.abort();
  }, [directory.status]);

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
      <div className="booking-confirmation">
        <div className="ph">
          <div className="pt">Book Appointment</div>
        </div>

        <div className="confirm-box">
          <div className="confirm-icon"><AppIcon name="check" /></div>
          <h2 className="confirm-title" ref={confirmationTitle} tabIndex={-1}>Appointment Booked!</h2>
          <p className="confirm-message">Your request has been sent to {selDoc?.name}.</p>

          <dl className="confirm-details">
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
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          {type === "online" && (
            <div className="confirm-meeting-note">
              Meeting link will be sent after doctor confirms.
            </div>
          )}

          <button
            className="btn btn-sm confirm-again"
            onClick={reset}
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
          <span>Your analysis will be shared with your dermatologist. <strong>{latestAn.atype} · {latestAn.sev} severity</strong></span>
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
                  aria-current={step === i + 1 ? "step" : undefined}
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
          {directory.status === "loading" && (
            <div className="alert al-info" role="status">Loading dermatologists…</div>
          )}
          {directory.status === "error" && (
            <div className="alert al-dan" role="alert">
              <span>Could not load dermatologists.</span>
              <button type="button" className="btn btn-sm" onClick={() => setDirectory({ status: "loading", doctors: [] })}>
                Try again
              </button>
            </div>
          )}
          {directory.status === "ready" && directory.doctors.length === 0 && (
            <div className="alert al-info">No dermatologists are currently available.</div>
          )}
          <div className="doc-grid">
          {directory.doctors.map((doc) => (
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
                    <div className="doc-review-link-row">
                      <span className="doc-rating">{doc.rating}/5</span>
                      <button type="button" className="doc-review-link" onClick={(event) => { event.stopPropagation(); setReviewDoc(doc); }}>View Reviews</button>
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
              <div className="type-c-icon">
                <AppIcon name="medicalKit" />
              </div>
              <div className="type-c-title">
                Physical Visit
              </div>
              <div className="type-c-price type-c-price-physical">
                PKR {selDoc?.fee}
              </div>
            </div>

            <div
              className={`type-c ${type === "online" ? "sel" : ""}`}
              onClick={() => setType("online")}
            >
              <div className="type-c-icon">
                <AppIcon name="activity" />
              </div>
              <div className="type-c-title">
                Online Consultation
              </div>
              <div className="type-c-price type-c-price-online">
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
                    <div className="plat-c-icon">
                      <AppIcon emoji={p.ic} />
                    </div>
                    <div className="plat-c-name">
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
              <BookingDatePicker value={date} min={dateKey(new Date())} invalid={!!date && !dateOk}
                onChange={(value) => { setDate(value); setShakeDate(false); }} />
              {selDoc?.days?.length > 0 && (
                <div className="doctor-availability-note">
                  <span><strong>{selDoc.name}</strong> is available on</span>
                  <strong className="doctor-availability-days">{selDoc.days.join(", ")}</strong>
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
      {reviewDoc && (
        <div className="doctor-reviews-backdrop" onMouseDown={() => setReviewDoc(null)}>
          <section className="doctor-reviews-dialog" role="dialog" aria-modal="true" aria-labelledby="doctor-reviews-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="doctor-reviews-header">
              <div>
                <h2 id="doctor-reviews-title">Reviews for {reviewDoc.name}</h2>
                <div className="doctor-reviews-rating"><AppIcon name="star" /> {reviewDoc.rating}/5 average rating</div>
              </div>
              <button type="button" className="doctor-reviews-close" onClick={() => setReviewDoc(null)} aria-label="Close reviews">×</button>
            </div>
            {Array.isArray(reviewDoc.reviews) && reviewDoc.reviews.length > 0 ? (
              <div className="doctor-review-list">
                {reviewDoc.reviews.map((review, index) => (
                  <article className="doctor-review" key={review._id || index}>
                    <div className="doctor-review-topline">
                      <strong>{review.patientName || review.name || "Patient"}</strong>
                      <span><AppIcon name="star" /> {review.rating}/5</span>
                    </div>
                    <p>{review.comment || review.text}</p>
                    {review.createdAt && <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>}
                  </article>
                ))}
              </div>
            ) : (
              <div className="doctor-reviews-empty">No written patient reviews are available for this dermatologist yet.</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default PatBook;
