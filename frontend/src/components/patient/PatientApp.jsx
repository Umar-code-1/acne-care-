// src/components/patient/PatientApp.jsx
import { lazy } from "react";

import PatDash from "./PatDash";

const PatScan = lazy(() => import("./PatScan"));
const PatDiet = lazy(() => import("./PatDiet"));
const PatAppts = lazy(() => import("./PatAppts"));
const PatBook = lazy(() => import("./PatBook"));
const PatRx = lazy(() => import("./PatRx"));
const PatStore = lazy(() => import("./PatStore"));
const PatProfile = lazy(() => import("./PatProfile"));

function PatientApp({
  page,
  setPage,
  user,
  setUser,
  appointments = [],
  setAppointments,
  prescriptions = [],
  analyses= [],
  setAnalyses,
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

  if (page === "appointments") {
return <PatAppts appts={myAppts} refresh={refresh} notify={notify} />;
  }

  if (page === "book") {
    return (
      <PatBook
        user={user}
        latestAn={latestAn}
        appointments={myAppts}
        setAppointments={setAppointments}
        refresh={refresh}
        setPage={setPage}
        notify={notify}
      />
    );
  }

  if (page === "skincare" || page === "routine" || page === "prescriptions") {
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
        setUser={setUser}
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
