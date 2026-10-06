import React from 'react';
import DocDash from './DocDash';
import DocAppts from './DocAppts';
import DocPatients from './DocPatients';
import DocRx from './DocRx';
import DocProfile from './DocProfile';
import DocPayments from './DocPayments';

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
    return <DocPayments notify={notify} />;
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