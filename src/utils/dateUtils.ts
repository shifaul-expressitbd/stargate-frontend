export function getCurrentDateTime(): string {
  const now = new Date()
  return now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
}

// Helper functions to format date and time
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

export function formatDateTime12(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  let hour = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hour < 12 ? 'AM' : 'PM'
  hour = hour % 12
  if (hour === 0) hour = 12
  const hourStr = String(hour).padStart(2, '0')

  return `${day}-${month}-${year} ${hourStr}:${minutes} ${ampm}`
}

export const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  return formatDate(dateString)
}

export function formatDateTimeLocal(dateString: string | Date): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString

  if (isNaN(date.getTime())) return ''

  return date.toLocaleString('en-US', {
    month: 'short', // e.g. "Apr"
    day: 'numeric', // e.g. "29"
    year: 'numeric', // e.g. "2024"
    hour: 'numeric', // e.g. "4"
    minute: '2-digit', // e.g. "33"
    hour12: true, // use AM/PM format
  })
}


// in your date‐helpers file (e.g. helpers/dateFormats.ts)

export function formatDateTime12WithDay(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  return date.toLocaleString('en-US', {
    weekday: 'short',   // “Sunday”
    year: 'numeric',   // “2025”
    month: 'short',     // “July”
    day: 'numeric',    // “20”
    hour: 'numeric',   // “3”
    minute: '2-digit', // “45”
    hour12: true       // “PM”
  })
}
