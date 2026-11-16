// src/components/shared/RxCard.jsx
import React, { useEffect, useState } from "react";
import AppIcon from "./AppIcon";
import PrescriptionChat from "./PrescriptionChat";

function RxCard({ rx, showPatient, showDoctor, instructionMode }) {
  const [openChannel, setOpenChannel] = useState("");
  const [unreadChatCount, setUnreadChatCount] = useState(rx.unreadChatCount || 0);
  useEffect(() => setUnreadChatCount(rx.unreadChatCount || 0), [rx.unreadChatCount]);
  const date = rx.date ? new Date(`${rx.date}T12:00:00`) : null;
  const formattedDate = date && !Number.isNaN(date.valueOf())
    ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date)
    : "Date unavailable";
  const planId = String(rx.id || "").slice(-8).toUpperCase();
  const instructionCount = rx.inst
    ? String(rx.inst).split(/[.!?\n]+/).filter(Boolean).length
    : 0;
  return (
    <div className="rx-card" data-notification-prescription={rx._id || rx.id}
      data-notification-plan-appointment={rx.apid || undefined} tabIndex={-1}>
      <div className="rx-h">
        <div className="rx-heading">
          <div className="rx-document-icon"><AppIcon name="document" /></div>
          <div className="rx-heading-copy">
          <div className="rx-t">Skincare Plan{planId && ` #SKP-${planId}`}</div>
          {showPatient && (
            <div className="rx-d rx-patient-meta">
              Patient <strong>{rx.pname}</strong>
            </div>
          )}
          {showDoctor && (
            <div className="rx-d">
              <AppIcon name="profile" /> Dr <strong>{rx.dname}</strong>
              {rx.dqual && <><span className="rx-meta-divider">|</span>{rx.dqual}</>}
            </div>
          )}
          </div>
        </div>
        <div className="rx-date"><AppIcon name="calendar" /> {formattedDate}</div>
      </div>

      {instructionMode && <div className="rx-actions-row">
        <div className="rx-tabs rx-instructions-only">
          <button
            type="button"
            className="rx-tab active rx-instructions-trigger"
            onClick={() => setOpenChannel("instructions")}
          >
            <AppIcon name="document" />
            <span>Instructions</span>
            <span className="rx-tab-count">{instructionCount}</span>
          </button>
        </div>
        <button type="button" className="rx-reply-button" onClick={() => { setUnreadChatCount(0); setOpenChannel("chat"); }}>
          <AppIcon name="chat" /> {instructionMode === "doctor" ? "Chat with Patient" : "Chat with Doctor"}
          {unreadChatCount > 0 && <span className="rx-chat-unread-count" aria-label={`${unreadChatCount} unread messages`}>{unreadChatCount > 99 ? "99+" : unreadChatCount}</span>}
        </button>
      </div>}

      {openChannel && <PrescriptionChat
        prescriptionId={rx._id || rx.id}
        recipientName={instructionMode === "doctor" ? rx.pname : `Dr. ${rx.dname || "your doctor"}`}
        initialInstruction={openChannel === "instructions" ? rx.inst : ""}
        channel={openChannel}
        readOnly={openChannel === "instructions" && instructionMode !== "doctor"}
        sendLabel={openChannel === "instructions" ? "Send Instructions" : "Send Message"}
        onClose={() => setOpenChannel("")}
      />}
    </div>
  );
}

export default RxCard;
