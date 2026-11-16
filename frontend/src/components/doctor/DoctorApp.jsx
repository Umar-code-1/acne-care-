import React, { useState } from 'react';
import DocDash from './DocDash';
import DocAppts from './DocAppts';
import DocPatients from './DocPatients';
import DocRx from './DocRx';
import DocProfile from './DocProfile';
import DocPayments from './DocPayments';
import DocPlatformFee from './DocPlatformFee';

export default function DoctorApp({
  page,
  setPage,
  user,
  appointments = [],
  setAppointments,
  prescriptions = [],
  setPrescriptions,
  analyses = [],
  refresh,
  notify,
}) {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  // Backend pehle hi sirf is doctor ka data bhejta hai — dobara filter ki zaroorat nahi
  const myAppts = appointments;
  const myRx = prescriptions;

  if (page === 'dashboard') {
    return (
      <DocDash
        user={user}
        appts={myAppts}
        rx={myRx}
        setPage={setPage}
        refresh={refresh}
        notify={notify}
      />
    );
  }

  if (page === 'appointments') {
    return (
      <DocAppts
        user={user}
        appts={myAppts}
        appointments={myAppts}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        setAppointments={setAppointments}
        refresh={refresh}
        notify={notify}
      />
    );
  }

  if (page === 'patients') {
    return (
      <DocPatients
        appts={myAppts}
        analyses={analyses}
        setPage={setPage}
        setSelectedPatientId={setSelectedPatientId}
      />
    );
  }

  if (page === 'prescriptions') {
    return (
      <DocRx
        user={user}
        appts={myAppts}
        rx={myRx}
        prescriptions={myRx}
        setPrescriptions={setPrescriptions}
        analyses={analyses}
        refresh={refresh}
        notify={notify}
      />
    );
  }

  if (page === 'payments') {
    return <DocPayments notify={notify} refresh={refresh} />;
  }

  if (page === 'platform-fee') {
    return <DocPlatformFee notify={notify} />;
  }

  if (page === 'profile') {
    return (
      <DocProfile
        user={user}
        appts={myAppts}
        notify={notify}
        refresh={refresh}
      />
    );
  }

  // default
  return (
    <DocDash
      user={user}
      appts={myAppts}
      rx={myRx}
      setPage={setPage}
      refresh={refresh}
      notify={notify}
    />
  );
}
