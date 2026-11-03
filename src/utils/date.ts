export function formatDate(dateInput: Date | string | number | { seconds: number } | null | undefined): string {
  if (!dateInput) return "";

  let date: Date;
  if (typeof dateInput === "object" && "seconds" in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput as any);
  }

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(dateInput: Date | string | number | { seconds: number } | null | undefined): string {
  if (!dateInput) return "";

  let date: Date;
  if (typeof dateInput === "object" && "seconds" in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput as any);
  }

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(dateInput: Date | string | number | { seconds: number } | null | undefined): string {
  const d = formatDate(dateInput);
  const t = formatTime(dateInput);
  return d && t ? `${d}, ${t}` : d || t;
}
