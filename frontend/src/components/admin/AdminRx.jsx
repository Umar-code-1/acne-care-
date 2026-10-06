import React from 'react';
import RxCard from '../shared/RxCard';
import AppIcon from '../shared/AppIcon';

export default function AdminRx({ prescriptions }) {
  return (
    <div>
      <div className="ph">
        <div className="pt">Skincare Plans</div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="empty">
          <div className="empty-ic"><AppIcon name="clipboard" /></div>
          <div className="empty-t">No plans yet</div>
        </div>
      ) : (
        prescriptions.map(p => (
          <RxCard key={p.id} rx={p} showPatient showDoctor />
        ))
      )}
    </div>
  );
}
