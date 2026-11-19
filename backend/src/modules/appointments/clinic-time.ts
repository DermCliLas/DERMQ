// Peru uses UTC-05:00. Keep appointment calendar calculations independent
// of the server's operating-system time zone.
const LIMA_OFFSET_MS = 5 * 60 * 60 * 1000;

export function limaWallTime(date: Date): Date {
  return new Date(date.getTime() - LIMA_OFFSET_MS);
}

export function limaDayStart(date: Date): Date {
  const local = limaWallTime(date);
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 5));
}

export function limaDayEnd(date: Date): Date {
  return new Date(limaDayStart(date).getTime() + 24 * 60 * 60 * 1000 - 1);
}

export function limaTimeOnDay(date: Date, hour: number, minute: number): Date {
  return new Date(limaDayStart(date).getTime() + (hour * 60 + minute) * 60 * 1000);
}
