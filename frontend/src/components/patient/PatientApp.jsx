// src/components/patient/PatientApp.jsx
import React from "react";

import PatDash from "./PatDash";
import PatScan from "./PatScan";
import PatDiet from "./PatDiet";
import PatRoutine from "./PatRoutine";
import PatAppts from "./PatAppts";
import PatBook from "./PatBook";
import PatRx from "./PatRx";
import PatStore from "./PatStore";
import PatProfile from "./PatProfile";

function PatientApp({
  page,
  setPage,
  user,
  appointments = [],
  setAppointments,
  prescriptions = [],
  analyses= [],
  setAnalyses,
  users = [],
  doctors: doctorList = [],
  refresh,
  products = [],
  cart,
  addToCart,
  removeFromCart,
  updateQty,
  orders,
  setOrders,
  onLogout,
  notify,
}) {
  const myAppts = appointments;
  const myRx = prescriptions;
  const myAn = analyses;
const latestAn = myAn.length ? myAn[0] : null;
const doctors = doctorList.length ? doctorList : users; 
if (page === "dashboard") {
    return (
      <PatDash
        user={user}
        appts={myAppts}
        rx={myRx}
        analyses={myAn}
        latestAn={latestAn}
        setPage={setPage}
      />
    );
  }

  if (page === "scan") {
    return (
      <PatScan
        user={user}
        analyses={myAn}
        setAnalyses={setAnalyses}
        refresh={refresh}
        notify={notify}
        setPage={setPage}
      />
    );
  }

  if (page === "diet") {
     return <PatDiet setPage={setPage} />; 
     }

  if (page === "routine") {
    return (
      <PatRoutine
        rx={myRx}
        latestAn={latestAn}
        setPage={setPage}
      />
    );
  }

  if (page === "appointments") {
return <PatAppts appts={myAppts} refresh={refresh} notify={notify} />;
  }

  if (page === "book") {
    return (
      <PatBook
        user={user}
        doctors={doctors}
        latestAn={latestAn}
        appointments={myAppts}
        setAppointments={setAppointments}
        refresh={refresh}
        setPage={setPage}
        notify={notify}
      />
    );
  }

  if (page === "prescriptions") {
    return <PatRx rx={myRx} />;
  }

  if (page === "store") {
    return (
      <PatStore
        addToCart={addToCart}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQty={updateQty}
        latestAn={latestAn}
        user={user}
        orders={orders}
        setOrders={setOrders}
        notify={notify}
      />
    );
  }

  if (page === "profile") {
    return (
      <PatProfile
        user={user}
        appts={myAppts}
        analyses={myAn}
        refresh={refresh}
        notify={notify}
        onLogout={onLogout}
      />
    );
  }

  // default
  return (
    <PatDash
      user={user}
      appts={myAppts}
      rx={myRx}
      analyses={myAn}
      latestAn={latestAn}
      setPage={setPage}
    />
  );
}

export default PatientApp;