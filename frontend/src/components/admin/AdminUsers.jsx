// src/components/admin/AdminUsers.jsx
import React, { useState } from "react";
import AppIcon from "../shared/AppIcon";
import API from "../../api";

const EMPTY_USER = { name: "", email: "", password: "", role: "patient", pmdcNumber: "" };

function AdminUsers({ users, setUsers, notify }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_USER);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = users.filter((u) => {
    const matchRole = filter === "all" ? true : u.role === filter;
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const add = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError("");
    try {
      const { data } = await API.post("/users", form);
      setUsers((prev) => [data, ...prev.filter((user) => user.id !== data.id)]);
      setFilter(data.role);
      setSearch("");
      setShowForm(false);
      setForm(EMPTY_USER);
      notify("User added!");
    } catch (error) {
      setFormError(error.response?.data?.message || "Could not create the account. Please try again.");
    } finally {
      setSaving(false);
    }
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
        <div className="card-h admin-users-toolbar">
          <input className="form-i admin-users-search" aria-label="Search users"
            placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="admin-users-actions">
            {["all", "dermatologist", "patient", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={filter === r}
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
            <button type="button" className="btn btn-pri btn-sm" aria-expanded={showForm} disabled={saving}
              onClick={() => setShowForm(!showForm)}>
              {showForm ? "Close Form" : "Add User"}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={add}
            className="card-b"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="g2">
              {["name", "email", "password"].map((f) => (
                <div className="form-g" key={f}>
                  <label className="form-l" htmlFor={`admin-new-${f}`}>
                    {f === "name" ? "Full name" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </label>
                  <input
                    className="form-i"
                    id={`admin-new-${f}`}
                    type={f === "name" ? "text" : f}
                    autoComplete={f === "password" ? "new-password" : f}
                    minLength={f === "password" ? 6 : undefined}
                    required
                    placeholder={`Enter ${f}`}
                    value={form[f]}
                    onChange={(e) =>
                      setForm({ ...form, [f]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div className="form-g">
                <label className="form-l" htmlFor="admin-new-role">Role</label>
                <div className="admin-user-role-select">
                  <select id="admin-new-role" className="form-i" value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="patient">Patient</option>
                    <option value="dermatologist">Dermatologist</option>
                  </select>
                  <AppIcon name="arrowDown" />
                </div>
              </div>
              {form.role === "dermatologist" && (
                <div className="form-g">
                  <label className="form-l" htmlFor="admin-new-id">PMDC registration number</label>
                  <input id="admin-new-id" className="form-i" value={form.pmdcNumber} placeholder="12345-P"
                    pattern="[0-9]{4,6}-[A-Za-z]" title="Use 4 to 6 digits, a hyphen, and one letter" required
                    onChange={(e) => setForm({ ...form, pmdcNumber: e.target.value })} />
                </div>
              )}
            </div>
            {formError && <div className="alert al-dan" role="alert">{formError}</div>}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-pri btn-sm"
                type="submit" disabled={saving}
              >
                {saving ? "Adding…" : "Add User"}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                type="button" disabled={saving}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
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
                          {u.role === "patient" && (u._id || u.id) && (
                            <small style={{ overflowWrap: "anywhere" }}>ID {u._id || u.id}</small>
                          )}
                          {u.role === "dermatologist" && u.pmdcNumber && <small>PMDC {u.pmdcNumber}</small>}
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
