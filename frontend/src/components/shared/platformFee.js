// Shared helpers for the Platform Fee pages (doctor + admin)
import API from "../../api";

export const pkr = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK")}`;

export const monthLabel = (month) => {
  if (!month) return "";
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
};

export const dateLabel = (ymd) => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

export const FEE_STATUS = {
  running:              { label: "This month",   cls: "b-completed" },
  due:                  { label: "Due",          cls: "b-pending" },
  overdue:              { label: "Overdue",      cls: "b-unpaid" },
  pending_verification: { label: "Under review", cls: "b-pending" },
  paid:                 { label: "Paid",         cls: "b-paid" },
  no_fee:               { label: "No fee",       cls: "b-cancelled" },
};

// receipt blob -> { url, type } for the preview dialog
export const loadFeeReceipt = async (id) => {
  const res = await API.get(`/platform-fees/${id}/proof`, { responseType: "blob" });
  const type = (res.headers["content-type"] || res.data.type || "").split(";")[0].trim().toLowerCase();
  if (!type.startsWith("image/") && type !== "application/pdf") throw new Error("Unsupported receipt format");
  return { url: URL.createObjectURL(res.data), type };
};
