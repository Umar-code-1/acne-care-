import React from "react";
import AppIcon from "../shared/AppIcon";
import AdminDash from "./AdminDash";
import AdminUsers from "./AdminUsers";
import AdminAppts from "./AdminAppts";
import AdminAnalyses from "./AdminAnalyses";
import AdminRx from "./AdminRx";
import AdminProfile from "./AdminProfile";
import AdminVerify from "./AdminVerify";
import AdminPlatformFees from "./AdminPlatformFees";

export default function AdminApp({
  page,
  setPage,
  user,
  users = [],
  setUsers,
  doctors = [],
  appointments = [],
  analyses = [],
  prescriptions = [],
  refresh,
  notify,
}) {
  switch (page) {
    case "dashboard":
      return (
        <AdminDash
          users={users}
          doctors={doctors}
          appointments={appointments}
          analyses={analyses}
          prescriptions={prescriptions}
          setPage={setPage}
        />
      );

    case "users":
      return (
        <AdminUsers
          users={users}
          setUsers={setUsers}
          refresh={refresh}
          notify={notify}
        />
      );

    case "appointments":
      return <AdminAppts appointments={appointments} />;

    case "analyses":
      return <AdminAnalyses analyses={analyses} />;

    case "prescriptions":
      return <AdminRx prescriptions={prescriptions} />;

    case "profile":
      return <AdminProfile user={user} notify={notify} />;

      case "verify":
      return <AdminVerify users={users} refresh={refresh} notify={notify} />;

    case "platform-fees":
      return <AdminPlatformFees notify={notify} />;

    default:
      return (
        <div className="empty">
          <div className="empty-ic"><AppIcon name="activity" /></div>
          <div className="empty-t">Page not found</div>
          <div className="empty-s">
            Sidebar sent page = "{page}" but AdminApp has no case for it.
          </div>
        </div>
      );
  }
}
