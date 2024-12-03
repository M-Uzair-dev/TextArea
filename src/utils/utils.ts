export function getCookie(name: string) {
  const value = `; ${document.cookie};`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(";")?.shift();
}
export function formatDate(dateString: string) {
  const date = new Date(dateString);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  // Format the time
  const time = `${hours}:${minutes}${isPM ? "pm" : "am"}`;

  // Format the date
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${time} - ${day}/${month}/${year}`;
}
export function formatDate2(isoDate: string) {
  const date = new Date(isoDate); // Convert ISO string to Date object

  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with 0 if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

  return `${day}/${month}/${year}`;
}
