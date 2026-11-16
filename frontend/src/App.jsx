import { lazy, Suspense, useState, useEffect, useCallback, useRef } from "react";
import { styles } from "./styles/styles";
import { STORE_PRODUCTS } from "./data/mockData";
import API from "./api";
import AppIcon from "./components/shared/AppIcon";

import Topbar from "./components/shared/Topbar";
import Sidebar from "./components/shared/Sidebar";
import PatientApp from "./components/patient/PatientApp";

const Landing = lazy(() => import("./components/landing/landing.jsx"));
const AuthScreen = lazy(() => import("./components/auth/AuthScreen"));
const AdminApp = lazy(() => import("./components/admin/AdminApp"));
const DoctorApp = lazy(() => import("./components/doctor/DoctorApp"));

const AUTH_PATHS = { signin: "/home/signin", signup: "/home/signup" };
const PORTAL_PATHS = new Map([
  ["admin", "/admin"],
  ["dermatologist", "/doctor"],
  ["patient", "/patient"],
]);

function authModeFromAddress() {
  const { pathname, search } = window.location;
  if (new URLSearchParams(search).has("resetToken")) return "signin";
  return Object.keys(AUTH_PATHS).find((mode) => AUTH_PATHS[mode] === pathname) || null;
}

function isPortalAddress() {
  return [...PORTAL_PATHS.values()].includes(window.location.pathname);
}

function changeAddress(path, replace, authState = null) {
  const { pathname, search, hash } = window.location;
  if (!path || (path === pathname && !search && !hash)) return;
  if (replace) window.history.replaceState(authState, "", path);
  else window.history.pushState(authState, "", path);
  if (!authState) window.scrollTo({ top: 0, behavior: "instant" });
}

function authHistoryState(replace) {
  const previousDepth = window.history.state?.authDepth;
  if (previousDepth) return { authDepth: previousDepth + (replace ? 0 : 1) };
  return { authDepth: replace || authModeFromAddress() ? 0 : 1 };
}

function ToastMessage({ message }) {
  const statuses = [
    ["✅", "check"],
    ["❌", "closeCircle"],
    ["⚠️", "alert"],
  ];
  const status = statuses.find(([symbol]) => message.startsWith(symbol));
  if (!status) return message;
  return <><AppIcon name={status[1]} /> {message.slice(status[0].length).trimStart()}</>;
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }} role="status">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}><AppIcon name="bottle" /></div>
        <div style={{ color: "var(--text2)" }}>Loading AcneCare AI…</div>
      </div>
    </div>
  );
}

function fetchPortalList(url, signal) {
  return API.get(url, { signal })
    .then(({ data }) => data)
    .catch((error) => {
      if (!signal.aborted) {
        console.error("Data request failed:", url, error.response?.status || error.message);
      }
      return null;
    });
}

function fetchPatientLists(signal) {
  return {
    appointments: fetchPortalList("/appointments/my", signal),
    prescriptions: fetchPortalList("/prescriptions/my", signal),
    analyses: fetchPortalList("/scans/my", signal),
  };
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const dataRequest = useRef(null);
  const patientPrefetch = useRef(null);
  const [authMode, setAuthMode] = useState(authModeFromAddress);
  const [page, setPortalPage] = useState(() => localStorage.getItem("page") || "dashboard");
  const [notificationTarget, setNotificationTarget] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationSequence = useRef(0);
  const portalContent = useRef(null);
  const setPage = useCallback((nextPage) => {
    setNotificationsOpen(false);
    setNotificationTarget(null);
    setPortalPage(nextPage);
  }, []);
  // server se aane wala data
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // abhi backend nahi hai — local hi rahega
  const [products] = useState(STORE_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [toast, setToast] = useState({ show: false, msg: "" });

  const [menuOpen, setMenuOpen] = useState(false);

  const notify = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  };

  const navigateAuth = useCallback((mode, replace = false) => {
    changeAddress(mode ? AUTH_PATHS[mode] : "/home", replace, mode ? authHistoryState(replace) : null);
    setAuthMode(mode);
  }, []);

  const dismissAuth = () => {
    const depth = window.history.state?.authDepth;
    if (depth) {
      setAuthMode(null);
      window.history.go(-depth);
    } else {
      navigateAuth(null, true);
    }
  };

  const enterPortal = useCallback((user) => {
    changeAddress(PORTAL_PATHS.get(user.role), true);
    setAuthMode(null);
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      if (currentUser) changeAddress(PORTAL_PATHS.get(currentUser.role), true);
      else if (isPortalAddress()) navigateAuth("signin", true);
      else setAuthMode(authModeFromAddress());
    };

    window.addEventListener("popstate", syncAuth);
    return () => window.removeEventListener("popstate", syncAuth);
  }, [currentUser, navigateAuth]);

  /* ---------- session restore (page refresh par logged in raho) ---------- */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("resetToken")) {
      setBooting(false);
      return;
    }
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      if (isPortalAddress()) navigateAuth("signin", true);
      setBooting(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const session = API.get("/auth/me", { signal });
    // Patient endpoints enforce ownership, and the UI waits for the verified role.
    const patientController = window.location.pathname === PORTAL_PATHS.get("patient")
      ? new AbortController()
      : null;
    const lists = patientController ? fetchPatientLists(patientController.signal) : null;

    session
      .then((res) => {
        if (signal.aborted) return;
        if (patientController && res.data.role === "patient") {
          patientPrefetch.current = { controller: patientController, lists };
        } else {
          patientController?.abort();
        }
        enterPortal(res.data);
      })
      .catch(() => {
        patientController?.abort();
        if (signal.aborted) return;
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        if (isPortalAddress()) navigateAuth("signin", true);
      })
      .finally(() => {
        if (!signal.aborted) setBooting(false);
      });
    return () => {
      controller.abort();
      patientController?.abort();
    };
  }, [enterPortal, navigateAuth]);
useEffect(() => {
    localStorage.setItem("page", page);
    setMenuOpen(false);
  }, [page]);
  /* ---------- role ke hisab se data lao ---------- */
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    dataRequest.current?.abort();
    const prefetched = patientPrefetch.current;
    patientPrefetch.current = null;
    const controller = prefetched?.controller || new AbortController();
    dataRequest.current = controller;
    const { signal } = controller;
    setLoadingData(true);

    const grab = (url) => fetchPortalList(url, signal);
    try {
      if (currentUser.role === "patient") {
        const lists = prefetched?.lists || fetchPatientLists(signal);
        const loadList = async (request, setList) => {
          const list = await request;
          if (!signal.aborted && Array.isArray(list)) setList(list);
        };
        await Promise.all([
          loadList(lists.appointments, setAppointments),
          loadList(lists.prescriptions, setPrescriptions),
          loadList(lists.analyses, setAnalyses),
        ]);
      }

      if (currentUser.role === "dermatologist") {
        const [appts, rx] = await Promise.all([
          grab("/appointments/doctor"),
          grab("/prescriptions/doctor"),
        ]);
        if (signal.aborted) return;
        if (Array.isArray(appts)) setAppointments(appts);
        if (Array.isArray(rx)) setPrescriptions(rx);
        setAnalyses([]);
      }

      if (currentUser.role === "admin") {
        const [appts, rx, scans, allUsers] = await Promise.all([
          grab("/appointments/all"),
          grab("/prescriptions"),
          grab("/scans"),
          grab("/users"),
        ]);
        if (signal.aborted) return;
        if (Array.isArray(appts)) setAppointments(appts);
        if (Array.isArray(rx)) setPrescriptions(rx);
        if (Array.isArray(scans)) setAnalyses(scans);
        if (Array.isArray(allUsers)) {
          setUsers(allUsers);
          setDoctors(allUsers.filter(u => u.role === "dermatologist"));
        }
      }
    } finally {
      if (!signal.aborted) setLoadingData(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
    return () => dataRequest.current?.abort();
  }, [loadData]);

  const openNotification = (notification) => {
    const destination = notification.targetPage || "dashboard";
    const isPlan = destination === "prescriptions";
    setNotificationTarget({
      sequence: ++notificationSequence.current,
      attribute: isPlan && notification.prescription ? "prescription" : isPlan ? "plan-appointment" : "appointment",
      id: isPlan && notification.prescription ? notification.prescription : notification.appointment,
    });
    setPortalPage(destination);
    setMenuOpen(false);
    if (destination !== "payments") loadData();
  };

  useEffect(() => {
    const content = portalContent.current;
    if (!content || !notificationTarget?.id) return;

    const { attribute, id } = notificationTarget;
    const selector = `[data-notification-${attribute}="${CSS.escape(String(id))}"]`;
    let highlighted;
    let highlightTimer;
    const reveal = () => {
      const card = content.querySelector(selector);
      if (!card) return;
      highlighted = card;
      card.classList.add("notification-target-highlight");
      card.focus({ preventScroll: true });
      card.scrollIntoView({ block: "center", inline: "nearest" });
      observer.disconnect();
      highlightTimer = window.setTimeout(() => card.classList.remove("notification-target-highlight"), 5000);
    };
    const observer = new MutationObserver(reveal);
    observer.observe(content, { childList: true, subtree: true });
    reveal();
    return () => {
      observer.disconnect();
      window.clearTimeout(highlightTimer);
      highlighted?.classList.remove("notification-target-highlight");
    };
  }, [notificationTarget]);
  

  /* ---------- cart (local) ---------- */
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    notify(`✅ ${product.name} added to cart`);
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, delta) => setCart((prev) =>
    prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );

  /* ---------- auth ---------- */
 const login = (user) => {
    enterPortal(user);
    localStorage.removeItem("page");
    setPage("dashboard");
  };

  const logout = () => {
    dataRequest.current?.abort();
    setLoadingData(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("page");
    setCurrentUser(null);
    setAppointments([]); setPrescriptions([]); setAnalyses([]);
    setUsers([]); setDoctors([]); setCart([]);
    setPage("dashboard");
    navigateAuth(null, true);
  };

  /* ---------- screens ---------- */
  if (booting) {
    return (
      <>
        <style>{styles}</style>
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      {!currentUser && (
        <>
          <Suspense fallback={<LoadingScreen />}>
            <Landing onLogin={() => navigateAuth("signin")} onSignUp={() => navigateAuth("signup")} />
          </Suspense>
          {authMode && (
            <Suspense fallback={null}>
              <AuthScreen
                onLogin={login}
                onClose={dismissAuth}
                initialMode={authMode}
                onModeChange={navigateAuth}
              />
            </Suspense>
          )}
        </>
      )}

      {currentUser && (
        <>
          <div className={`toast ${toast.show ? "show" : ""}`}><ToastMessage message={toast.msg} /></div>

          <div className={`app-layout ${currentUser.role === "patient" ? "patient-app-layout" : ""}`}>
            <div
              className={`scrim ${menuOpen ? "show" : ""}`}
              onClick={() => setMenuOpen(false)}
            />
            <Sidebar
              user={currentUser}
              page={page}
              setPage={setPage}
              onLogout={logout}
              appointments={appointments}
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
            />
            <div className="main-col">
              <Topbar
                user={currentUser}
                notificationsOpen={notificationsOpen}
                setNotificationsOpen={setNotificationsOpen}
                onOpenNotification={openNotification}
                onPaymentReceipt={currentUser.role === "dermatologist" ? loadData : undefined}
                cart={cart}
                onMenu={() => setMenuOpen(true)}
                setPage={setPage}
                onLogout={logout}
              />
              <div className="content" ref={portalContent}>

                {loadingData && (
                  currentUser.role === "patient" && page === "dashboard" ? (
                    <span className="sr-only" role="status">Loading your data…</span>
                  ) : (
                    <div className="alert al-info"><AppIcon name="clock" /> Loading your data…</div>
                  )
                )}

                <Suspense key={notificationTarget?.sequence} fallback={<div className="alert al-info" role="status">Loading page…</div>}>
                  {currentUser.role === "admin" && (
                    <AdminApp
                      page={page}
                      setPage={setPage}
                      user={currentUser}
                      users={users}
                      setUsers={setUsers}
                      doctors={doctors}
                      appointments={appointments}
                      analyses={analyses}
                      prescriptions={prescriptions}
                      refresh={loadData}
                      notify={notify}
                    />
                  )}

                  {currentUser.role === "dermatologist" && (
                    <DoctorApp
                      page={page}
                      setPage={setPage}
                      user={currentUser}
                      appointments={appointments}
                      setAppointments={setAppointments}
                      prescriptions={prescriptions}
                      setPrescriptions={setPrescriptions}
                      analyses={analyses}
                      refresh={loadData}
                      notify={notify}
                    />
                  )}

                  {currentUser.role === "patient" && (
                    <PatientApp
                      page={page}
                      setPage={setPage}
                      user={currentUser}
                      setUser={setCurrentUser}
                      appointments={appointments}
                      setAppointments={setAppointments}
                      prescriptions={prescriptions}
                      analyses={analyses}
                      setAnalyses={setAnalyses}
                      products={products}
                      onLogout={logout}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                      updateQty={updateQty}
                      orders={orders}
                      setOrders={setOrders}
                      refresh={loadData}
                      notify={notify}
                    />
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
