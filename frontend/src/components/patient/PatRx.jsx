import React, { useEffect, useState } from 'react';
import AppIcon from "../shared/AppIcon";
import Disclaimer from "../shared/Disclaimer";
import RxCard from '../shared/RxCard';
import API from "../../api";

export default function PatRx({ rx = [] }) {
  const [unreadChatCounts, setUnreadChatCounts] = useState(null);

  useEffect(() => {
    let active = true;
    let inFlight = false;
    const loadUnreadCounts = async () => {
      if (inFlight || document.visibilityState === "hidden") return;
      inFlight = true;
      try {
        const { data } = await API.get("/messages/unread-counts");
        if (active && data && typeof data === "object") setUnreadChatCounts(data);
      } catch {
        // Use unread counts returned with the patient’s skincare plans.
      } finally {
        inFlight = false;
      }
    };
    loadUnreadCounts();
    const intervalId = window.setInterval(loadUnreadCounts, 10000);
    document.addEventListener("visibilitychange", loadUnreadCounts);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", loadUnreadCounts);
    };
  }, []);

    return (
    <div>
      <div className="ph">
        <div className="pt">My Skincare</div>
        <div className="ps">Your doctor-prescribed skincare routines and treatment plans</div>
      </div>
      <Disclaimer variant="rx" />

      {rx.length === 0 ? (
        <div className="empty">
          <div className="empty-ic"><AppIcon name="clipboard" /></div>
          <div className="empty-t">No skincare plans yet</div>
          <div className="empty-s">Your doctor will send a plan after your consultation</div>
        </div>
      ) : (
        rx.map(p => (
          <RxCard key={p._id || p.id} rx={{
            ...p,
            unreadChatCount: unreadChatCounts?.[String(p._id || p.id)] ?? p.unreadChatCount ?? 0,
          }} showDoctor instructionMode="patient" />
        ))
      )}
    </div>
  );
}
