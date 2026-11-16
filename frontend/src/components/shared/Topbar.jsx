// src/components/shared/Topbar.jsx
import React, { useEffect, useRef, useState } from "react";
import AppIcon from "./AppIcon";
import API from "../../api";

function Topbar({ user, cart, onMenu, setPage, onLogout, onPaymentReceipt, onOpenNotification, notificationsOpen, setNotificationsOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotificationsOpenedAt, setLastNotificationsOpenedAt] = useState(0);
  const lastPaymentReceipt = useRef(null);
  const notificationsArea = useRef(null);
  const notificationsList = useRef(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  useEffect(() => {
    const list = notificationsList.current;
    if (!notificationsOpen || !showAllNotifications || !list) return;

    const update = () => setHasMoreBelow(list.scrollHeight - list.clientHeight - list.scrollTop > 1);
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", update);
    };
  }, [notificationsOpen, showAllNotifications, notifications]);

  useEffect(() => {
    if (!notificationsOpen) return;

    const dismissFromOutside = (event) => {
      if (!notificationsArea.current?.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener("click", dismissFromOutside, true);
    document.addEventListener("scroll", dismissFromOutside, true);
    return () => {
      document.removeEventListener("click", dismissFromOutside, true);
      document.removeEventListener("scroll", dismissFromOutside, true);
    };
  }, [notificationsOpen, setNotificationsOpen]);

  useEffect(() => {
    if (!user?._id) return undefined;
    let active = true;
    const loadNotifications = async () => {
      try {
        const { data } = await API.get(`/notifications${showAllNotifications ? "?all=true" : ""}`);
        if (active) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
          const receipt = data.notifications?.find((item) => item.type === "payment_proof");
          if (onPaymentReceipt && receipt && receipt._id !== lastPaymentReceipt.current) {
            lastPaymentReceipt.current = receipt._id;
            onPaymentReceipt();
          }
        }
      } catch {
        // Keep the dashboard usable while notification requests retry on the next poll.
      }
    };
    loadNotifications();
    const refreshNotifications = () => {
      if (document.visibilityState === "visible") loadNotifications();
    };
    const intervalId = window.setInterval(refreshNotifications, 10000);
    document.addEventListener("visibilitychange", refreshNotifications);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshNotifications);
    };
  }, [user?._id, showAllNotifications, onPaymentReceipt]);

  const openNotification = async (notification) => {
    setNotificationsOpen(false);
    if (!notification.read) {
      setNotifications((items) => items.map((item) => item._id === notification._id ? { ...item, read: true } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
      API.put(`/notifications/${notification._id}/read`).catch(() => {});
    }
    onOpenNotification(notification);
  };

  const markAllNotificationsRead = async () => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
    try {
      await API.put("/notifications/read-all");
    } catch {
      // The next poll restores the server state if this update fails.
    }
  };

  const toggleNotifications = () => {
    const opening = !notificationsOpen;
    setNotificationsOpen(opening);
    if (opening) setLastNotificationsOpenedAt(Date.now());
    setShowAllNotifications(false);
    setProfileOpen(false);
  };
  const hasUnopenedNotification = notifications.some((notification) =>
    !notification.read && new Date(notification.createdAt).getTime() > lastNotificationsOpenedAt
  );
  useEffect(() => {
    if (!profileOpen) return undefined;

    const closeMenu = () => setProfileOpen(false);
    const timeoutId = window.setTimeout(closeMenu, 4000);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [profileOpen]);

  const portalLabel = user.role === "admin"
    ? "Admin Portal"
    : user.role === "dermatologist"
    ? "Dermatologist Portal"
    : "Patient Portal";
  const roleLabel = user.role === "admin"
    ? "Administrator"
    : user.role === "dermatologist"
    ? "Dermatologist"
    : "Patient";
  const portalIcon = user.role === "admin"
    ? "shield"
    : user.role === "dermatologist"
    ? "doctor"
    : "home";

  const avCls = user.role === "admin"
    ? "av-a"
    : user.role === "dermatologist"
    ? "av-d"
    : "av-p";

  const cartCount =
    user.role === "patient"
      ? cart.reduce((a, i) => a + i.qty, 0)
      : 0;

  return (
    <>
    <div className="topbar">
      <div className="topbar-left">
        <button className="burger" onClick={onMenu} aria-label="Open navigation"><AppIcon name="menu" /></button>
        <div className={`portal-chip portal-chip-${user.role}`}>
          <AppIcon name={portalIcon} />
          <span>{portalLabel}</span>
        </div>
      </div>
      <div className="topbar-r">
        {user.role === "patient" && cartCount > 0 && (
          <button className="topbar-cart" type="button" onClick={() => setPage("store")} aria-label={`Shopping cart, ${cartCount} items`}>
            <AppIcon name="bag" />
            <span>{cartCount}</span>
          </button>
        )}
        <div className="topbar-notifications-wrap" ref={notificationsArea}>
          <button
            className={`topbar-notifications-button${hasUnopenedNotification && !notificationsOpen ? " is-notifying" : ""}`}
            type="button"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
            {unreadCount > 0 && <span className="topbar-notifications-badge" aria-hidden="true" />}
          </button>
          {notificationsOpen && (
            <section
              className="topbar-notifications-menu"
              aria-label="Notifications"
            >
              <header className="topbar-notifications-header">
                <strong>{showAllNotifications ? "All notifications" : "Notifications"}</strong>
                <span className="topbar-notifications-header-actions">
                  {showAllNotifications && <button type="button" onClick={() => setShowAllNotifications(false)}>Recent</button>}
                  {unreadCount > 0 && <button type="button" onClick={markAllNotificationsRead}>Mark all read</button>}
                </span>
              </header>
              {notifications.length ? (
                <div key={showAllNotifications ? "all" : "recent"} ref={notificationsList}
                  className="topbar-notifications-list" tabIndex={showAllNotifications ? 0 : undefined}
                  role={showAllNotifications ? "region" : undefined} aria-label={showAllNotifications ? "Notification history" : undefined}>
                  {(showAllNotifications ? notifications : notifications.slice(0, 4)).map((notification) => (
                    <button
                      type="button"
                      className={`topbar-notification-item ${notification.read ? "is-read" : "is-unread"}`}
                      key={notification._id}
                      onClick={() => openNotification(notification)}
                    >
                      <span className="topbar-notification-dot" aria-hidden="true" />
                      <span className="topbar-notification-copy">
                        <strong>{notification.title}</strong>
                        <span>{notification.message}</span>
                        <time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString()}</time>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="topbar-notifications-empty" role="status">You’re all caught up.</p>
              )}
              {showAllNotifications && notifications.length > 0 && hasMoreBelow && (
                <div className="topbar-notifications-scroll-hint"><AppIcon name="arrowDown" /> Scroll for older notifications</div>
              )}
              {!showAllNotifications && (
                <button className="topbar-notifications-view-all" type="button" onClick={() => setShowAllNotifications(true)}>
                  View all notifications
                </button>
              )}
            </section>
          )}
        </div>
        <div className="topbar-profile-wrap">
          <button
            className="topbar-profile"
            type="button"
            aria-expanded={profileOpen}
            aria-label={`User profile options for ${user.name}`}
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span className={`topbar-avatar ${avCls}`}>{/^(data:image\/|https?:\/\/)/i.test(user.avatar || "") ? <img className="topbar-avatar-image" src={user.avatar} alt="" /> : user.avatar || user.name?.[0]?.toUpperCase() || "U"}</span>
            <span className="topbar-user-copy">
              <span className="topbar-user-name">{user.name}</span>
              <span className="topbar-user-role">{roleLabel}</span>
            </span>
            <AppIcon className={`topbar-chevron ${profileOpen ? "open" : ""}`} name="arrowDown" />
          </button>
          {profileOpen && (
            <div className="topbar-profile-menu">
              <button type="button" onClick={() => { setPage("profile"); setProfileOpen(false); }}>
                View Profile
              </button>
              <button type="button" onClick={() => { setProfileOpen(false); setLogoutConfirm(true); }}>
                <AppIcon name="logout" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    {logoutConfirm && (
      <div className="logout-modal-backdrop" onMouseDown={() => setLogoutConfirm(false)}>
        <section className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title" onMouseDown={(event) => event.stopPropagation()}>
          <h2 id="logout-title">Log out of AcneCare?</h2>
          <div className="logout-account">
            <span className={`topbar-avatar ${avCls}`}>{/^(data:image\/|https?:\/\/)/i.test(user.avatar || "") ? <img className="topbar-avatar-image" src={user.avatar} alt="" /> : user.avatar || user.name?.[0]?.toUpperCase() || "U"}</span>
            <span><strong>{user.name}</strong><small>{user.email}</small></span>
          </div>
          <p>You’ll need to log in again to access your account.</p>
          <button type="button" className="logout-confirm-button" onClick={onLogout}>Log out</button>
          <button type="button" className="logout-cancel-button" onClick={() => setLogoutConfirm(false)}>Cancel</button>
        </section>
      </div>
    )}
    </>
  );
}

export default Topbar;
