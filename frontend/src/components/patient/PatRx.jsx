import React from 'react';
import AppIcon from "../shared/AppIcon";
import Disclaimer from "../shared/Disclaimer";
import RxCard from '../shared/RxCard';

export default function PatRx({ rx = [] }) {
    return (
    <div>
      <div className="ph">
        <div className="pt">My Skincare Plans</div>
        <div className="ps">Doctor-prescribed medications and skincare routines</div>
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
<RxCard key={p._id || p.id} rx={p} showDoctor />        ))
      )}
    </div>
  );
}
