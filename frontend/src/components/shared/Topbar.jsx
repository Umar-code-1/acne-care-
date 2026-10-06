// src/components/shared/Topbar.jsx
import React from "react";
import AppIcon from "./AppIcon";

function Topbar({ user, cart, onMenu }) {
    const roleLabel =
    user.role === "admin"
      ? "Admin Panel"
      : user.role === "dermatologist"
      ? "Doctor Portal"
      : "Patient Portal";

  const avCls =
    user.role === "admin"
      ? "av-a"
      : user.role === "dermatologist"
      ? "av-d"
      : "av-p";

  const cartCount =
    user.role === "patient"
      ? cart.reduce((a, i) => a + i.qty, 0)
      : 0;

  return (
    <div className="topbar">
      <button className="burger" onClick={onMenu} aria-label="Menu"><AppIcon name="menu" /></button>
      <div className="topbar-t"></div>
      <div className="topbar-t"> {roleLabel}</div>
      <div className="topbar-r">
        {user.role === "patient" && cartCount > 0 && (
          <div style={{ position: "relative", cursor: "pointer" }}>
            <AppIcon name="bag" />
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -8,
                background: "var(--pri)",
                color: "#fff",
                borderRadius: 50,
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default Topbar;
