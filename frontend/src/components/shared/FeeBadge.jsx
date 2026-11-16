import { FEE_STATUS } from "./platformFee";

export default function FeeBadge({ status }) {
  const s = FEE_STATUS[status] || { label: status, cls: "b-pending" };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
