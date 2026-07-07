interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = status.toLowerCase();
  
  let colorClass = "bg-glass-light text-text-muted"; // Default / Pending
  
  if (s === "active" || s === "paid" || s === "success" || s === "completed") {
    colorClass = "bg-status-success/10 text-status-success border-status-success/20";
  } else if (s === "churned" || s === "expired" || s === "overdue" || s === "canceled" || s === "failed") {
    colorClass = "bg-status-danger/10 text-status-danger border-status-danger/20";
  } else if (s === "pending" || s === "scheduled" || s === "trialing") {
    colorClass = "bg-status-warning/10 text-status-warning border-status-warning/20";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass} capitalize`}>
      {status}
    </span>
  );
}
