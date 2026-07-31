const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS_RU[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatLength(length: string): string {
  const match = /^(\d+):(\d{2}):(\d{2})$/.exec(length);
  if (!match) return length;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ч`);
  if (minutes > 0) parts.push(`${minutes} мин`);
  return parts.join(" ") || "0 мин";
}