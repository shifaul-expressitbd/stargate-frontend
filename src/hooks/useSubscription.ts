import { useEffect, useState } from 'react'

// Utility function to validate dates
function isValidDate(dateString: string | Date): boolean {
  const d = new Date(dateString)
  return !isNaN(d.getTime())
}

// Format date to readable string (e.g., "August 22, 2025, 7:59 AM")
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return date.toLocaleDateString('en-US', options)
}

// Calculate time remaining in both human-readable format and numeric value
function getTimeRemaining(endDate: Date): {
  text: string
  value: number
  unit: 'days' | 'hours' | 'minutes' | 'seconds'
} {
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()

  if (diff <= 0) return { text: 'Expired', value: 0, unit: 'days' }

  // Calculate time units
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // Return the largest meaningful unit
  if (days > 0)
    return {
      text: `${days} day${days !== 1 ? 's' : ''} remaining`,
      value: days,
      unit: 'days',
    }
  if (hours > 0)
    return {
      text: `${hours} hour${hours !== 1 ? 's' : ''} remaining`,
      value: hours,
      unit: 'hours',
    }
  if (minutes > 0)
    return {
      text: `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`,
      value: minutes,
      unit: 'minutes',
    }
  return {
    text: `${seconds} second${seconds !== 1 ? 's' : ''} remaining`,
    value: seconds,
    unit: 'seconds',
  }
}

// Main hook function
export function useSubscription(expiryDate?: string | Date) {
  const [status, setStatus] = useState({
    isExpired: false,
    formattedDate: '',
    remainingTime: {
      text: '',
      value: 0,
      unit: 'days' as 'days' | 'hours' | 'minutes' | 'seconds',
    },
    isExpiringSoon: false,
  })

  useEffect(() => {
    if (!expiryDate) return

    if (!isValidDate(expiryDate)) {
      console.error('Invalid expiry date')
      return
    }

    const expiry = new Date(expiryDate)
    const now = new Date()
    const isExpired = expiry.getTime() < now.getTime()
    const timeRemaining = isExpired
      ? { text: 'Expired', value: 0, unit: 'days' as const }
      : getTimeRemaining(expiry)

    setStatus({
      isExpired,
      formattedDate: formatDate(expiry),
      remainingTime: timeRemaining,
      isExpiringSoon:
        !isExpired &&
        (timeRemaining.unit === 'days' ? timeRemaining.value <= 7 : true),
    })

    // Update every minute if not expired
    if (!isExpired) {
      const interval = setInterval(() => {
        const updatedRemaining = getTimeRemaining(expiry)
        setStatus((prev) => ({
          ...prev,
          remainingTime: updatedRemaining,
          isExpiringSoon:
            updatedRemaining.unit === 'days'
              ? updatedRemaining.value <= 7
              : true,
        }))
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [expiryDate])

  return status
}
