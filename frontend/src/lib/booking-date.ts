// The clinic schedules appointments in Lima, regardless of the visitor's timezone.
export function getNextBookingDays(count: number, now = new Date()): { date: string; label: string; dayName: string }[] {
  const result: { date: string; label: string; dayName: string }[] = []
  const limaNow = new Date(now.getTime() - 5 * 60 * 60 * 1000)
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  for (let i = 1; i <= count; i++) {
    const d = new Date(limaNow)
    d.setUTCDate(limaNow.getUTCDate() + i)
    if (d.getUTCDay() !== 0) {
      const year = d.getUTCFullYear()
      const month = String(d.getUTCMonth() + 1).padStart(2, '0')
      const day = String(d.getUTCDate()).padStart(2, '0')
      result.push({ date: `${year}-${month}-${day}`, label: `${d.getUTCDate()} ${months[d.getUTCMonth()]}`, dayName: days[d.getUTCDay()] })
    }
  }
  return result.slice(0, 9)
}

export function dateInLima(instant: string): string | null {
  const value = new Date(instant).getTime()
  if (!Number.isFinite(value)) return null
  return new Date(value - 5 * 60 * 60 * 1000).toISOString().slice(0, 10)
}
