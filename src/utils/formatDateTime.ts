export function formatDate(date: string) {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}