import { useState, useEffect, useCallback } from "react";
import { styles } from "./styles/styles";
import { STORE_PRODUCTS } from "./data/mockData";
import API from "./api";
import AppIcon from "./components/shared/AppIcon";

import Landing from "./components/landing/landing.jsx";
import AuthScreen from "./components/auth/AuthScreen";
import Topbar from "./components/shared/Topbar";
import Sidebar from "./components/shared/Sidebar";
import AdminApp from "./components/admin/AdminApp";
import DoctorApp from "./components/doctor/DoctorApp";
import PatientApp from "./components/patient/PatientApp";

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

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [view, setView] = useState("landing");
  const [authMode, setAuthMode] = useState("signin");
const [page, setPage] = useState(() => localStorage.getItem("page") || "dashboard");
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

  const openAuth = (mode = "signin") => {
    setAuthMode(mode);
    setView("auth");
  };

  /* ---------- session restore (page refresh par logged in raho) ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setBooting(false); return; }

    API.get("/auth/me")
      .then((res) => setCurrentUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setBooting(false));
  }, []);
useEffect(() => {
    localStorage.setItem("page", page);
    setMenuOpen(false);
  }, [page]);
  /* ---------- role ke hisab se data lao ---------- */
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingData(true);

const grab = (url) =>
      API.get(url)
        .then(r => { console.log("✅", url, r.data); return r.data; })
        .catch(e => { console.error("❌", url, e.response?.status, e.response?.data?.message || e.message); return []; });
    try {
      if (currentUser.role === "patient") {
        const [appts, rx, scans, docs] = await Promise.all([
          grab("/appointments/my"),
          grab("/prescriptions/my"),
          grab("/scans/my"),
          grab("/appointments/doctors"),
        ]);
        setAppointments(appts);
        setPrescriptions(rx);
        setAnalyses(scans);
        setDoctors(docs);
      }

      if (currentUser.role === "dermatologist") {
        const [appts, rx] = await Promise.all([
          grab("/appointments/doctor"),
          grab("/prescriptions/doctor"),
        ]);
        setAppointments(appts);
        setPrescriptions(rx);
        setAnalyses([]);
      }

      if (currentUser.role === "admin") {
        const [appts, rx, scans, allUsers] = await Promise.all([
          grab("/appointments/all"),
          grab("/prescriptions"),
          grab("/scans"),
          grab("/users"),
        ]);
        setAppointments(appts);
        setPrescriptions(rx);
        setAnalyses(scans);
        setUsers(allUsers);
        setDoctors(allUsers.filter(u => u.role === "dermatologist"));
      }
    } finally {
      setLoadingData(false);
    }
  }, [currentUser]);

  useEffect(() => { loadData(); }, [loadData]);
  

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
    setCurrentUser(user);
    localStorage.removeItem("page");
    setPage("dashboard");
    setView("landing");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("page");
    setCurrentUser(null);
    setAppointments([]); setPrescriptions([]); setAnalyses([]);
    setUsers([]); setDoctors([]); setCart([]);
    setPage("dashboard");
    setView("landing");
  };

  /* ---------- screens ---------- */
  if (booting) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}><AppIcon name="bottle" /></div>
            <div style={{ color: "var(--text2)" }}>Loading AcneCare AI…</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      {!currentUser && view === "landing" && (
        <Landing onLogin={() => openAuth("signin")} onSignUp={() => openAuth("signup")} />
      )}

      {!currentUser && view === "auth" && (
        <AuthScreen onLogin={login} onBack={() => setView("landing")} initialMode={authMode} />
      )}

      {currentUser && (
        <>
          <div className={`toast ${toast.show ? "show" : ""}`}><ToastMessage message={toast.msg} /></div>

          <div className="app-layout">
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
                cart={cart}
                onMenu={() => setMenuOpen(true)}
              />
              <div className="content">

                {loadingData && (
                  <div className="alert al-info"><AppIcon name="clock" /> Loading your data…</div>
                )}

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
                    doctors={doctors}
                    users={doctors}
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

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
