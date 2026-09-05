// Small formatting helpers shared across pages.

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function statusLabel(status: string): string {
  switch (status) {
    case "open":
      return "Registration open";
    case "upcoming":
      return "Coming soon";
    case "closed":
      return "Registration closed";
    case "past":
      return "Completed";
    default:
      return status;
  }
}
