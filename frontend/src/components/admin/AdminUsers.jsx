// src/components/admin/AdminUsers.jsx
import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";

function AdminUsers({ users, setUsers, notify }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const filtered = users.filter((u) => {
    const matchRole = filter === "all" ? true : u.role === filter;
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const add = () => {
    if (!form.name || !form.email || !form.password) return;
    setUsers((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...form,
        avatar: form.name[0]?.toUpperCase() || "U",
      },
    ]);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "patient" });
    notify("User added!");
  };

  const remove = (user) => {
    setUsers(users.filter((x) => x.id !== user.id));
    notify("User removed.");
  };

  return (
    <div>
      <div className="ph">
        <div className="pt">Manage Users</div>
        <div className="ps">Add, view, and remove system users</div>
      </div>

      <div className="card">
        <div className="card-h">
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <input
              style={{
                padding: "0.45rem 0.75rem",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--r2)",
                fontFamily: "var(--font)",
                fontSize: "0.84rem",
                background: "var(--bg)",
                outline: "none",
                minWidth: 180,
              }}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Filter buttons */}
            {["all", "dermatologist", "patient", "admin"].map((r) => (
              <button
                key={r}
                className={`btn btn-sm ${
                  filter === r ? "btn-pri" : "btn-ghost"
                }`}
                onClick={() => setFilter(r)}
              >
                {r === "all"
                  ? "All"
                  : r === "dermatologist"
                  ? "Doctors"
                  : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <button
            className="btn btn-pri btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "Add User"}
          </button>
        </div>

        {showForm && (
          <div
            className="card-b"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="g2">
              {["name", "email", "password"].map((f) => (
                <div className="form-g" key={f}>
                  <label className="form-l">
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </label>
                  <input
                    className="form-i"
                    type={f === "password" ? "password" : "text"}
                    placeholder={`Enter ${f}`}
                    value={form[f]}
                    onChange={(e) =>
                      setForm({ ...form, [f]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div className="form-g">
                <label className="form-l">Role</label>
                <select
                  className="form-i"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option value="patient">Patient</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-pri btn-sm"
                onClick={add}
              >
                Add User
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="card-b">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.65rem",
                        }}
                      >
                        <div
                          className={`uav ${
                            u.role === "admin"
                              ? "av-a"
                              : u.role === "dermatologist"
                              ? "av-d"
                              : "av-p"
                          }`}
                          style={{
                            width: 30,
                            height: 30,
                            fontSize: "0.8rem",
                          }}
                        >
                          {u.avatar}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.88rem",
                            }}
                          >
                            {u.name}
                          </div>
                          {u.spec && (
                            <div
                              style={{
                                fontSize: "0.74rem",
                                color: "var(--text2)",
                              }}
                            >
                              {u.spec}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text2)",
                      }}
                    >
                      {u.email}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "dermatologist"
                            ? "b-doc"
                            : u.role === "admin"
                            ? "b-adm"
                            : "b-pat"
                        }`}
                      >
                        {u.role === "dermatologist"
                          ? "Doctor"
                          : u.role}
                      </span>
                    </td>
                    <td>
                      {u.role !== "admin" && (
                        <button
                          className="btn btn-dan btn-sm"
                          onClick={() => remove(u)}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty" style={{ padding: "1.5rem" }}>
                        <div className="empty-ic"><AppIcon name="users" /></div>
                        <div className="empty-t">No users found</div>
                        <div className="empty-s">
                          Adjust filters or add a new user.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
