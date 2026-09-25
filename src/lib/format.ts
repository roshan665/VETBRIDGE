/** Formatting / display helpers shared across pages. */

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/** 2026-09-28 -> "28 Sep 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

/** 2026-09-28 -> "28 Sep" */
export function formatDayMonth(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
}

/** 2026-09-22 -> "Mon" */
export function formatWeekday(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return WEEKDAYS_SHORT[date.getDay()]
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`
}

export function formatMonthYear(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

/** ISO timestamp -> "2 hours ago" / "Yesterday" / "28 Sep 2026" */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.round(diffMs / 60000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return formatDate(iso)
}

/** Time-of-day greeting used on dashboards, e.g. "Good Morning". */
export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

/** "Prem Kumar Sharma" -> "Prem" */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

/** "Prem Kumar Sharma" -> "PK" */
export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'JR'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
}

export function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join(' ')
}

/** 14 -> "1y 2m" */
export function formatAge(months: number): string {
  const years = Math.floor(months / 12)
  const remainder = months % 12
  if (years === 0) return `${remainder}m`
  if (remainder === 0) return `${years}y`
  return `${years}y ${remainder}m`
}
