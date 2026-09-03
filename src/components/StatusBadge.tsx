export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    PENDING: "bg-brand-50 text-brand-700",
    ACCEPTED: "bg-brand-100 text-brand-700",
    COMPLETED: "bg-surface-muted text-ink-muted",
    DECLINED: "bg-surface-muted text-ink-muted",
    CANCELLED: "bg-surface-muted text-ink-muted",
  };

  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${
        tone[status] ?? "bg-surface-muted text-ink-muted"
      }`}
    >
      {status.toLowerCase()}
    </span>
  );
}
