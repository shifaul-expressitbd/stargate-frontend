import { useMemo, useState } from 'react'

interface UseFormattedNumberOptions {
  value: string | number | null | undefined
  isCurrency?: boolean
}

function formatNumber(value: number): string {
  const absValue = Math.abs(value)
  let suffix = ''
  let shortValue = absValue

  if (absValue >= 1_000_000_000_000) {
    shortValue = absValue / 1_000_000_000_000
    suffix = 'T'
  } else if (absValue >= 1_000_000_000) {
    shortValue = absValue / 1_000_000_000
    suffix = 'B'
  } else if (absValue >= 1_000_000) {
    shortValue = absValue / 1_000_000
    suffix = 'M'
  } else if (absValue >= 1_000) {
    shortValue = absValue / 1_000
    suffix = 'K'
  } else {
    shortValue = absValue
  }

  // Format to 2 decimals, then remove trailing ".00"
  const formatted = Math.floor(shortValue * 100) / 100
  let formattedStr = formatted
    .toString()
    .replace(/\.00$/, '')
    .replace(/(\.\d)0$/, '$1')

  if (value < 0) formattedStr = `-${formattedStr}`

  return `${formattedStr}${suffix}`
}

export function useFormattedNumber({
  value,
  isCurrency = false,
}: UseFormattedNumberOptions) {
  const [showFull, setShowFull] = useState(false)

  const numericValue = useMemo(() => {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return value

    const cleaned = value.replace(/[^\d.-]/g, '') // keep digits, dot, minus
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }, [value])

  const fullDisplay = useMemo(() => {
    if (numericValue === null) return 'N/A'
    const formatted = new Intl.NumberFormat('en-IN').format(numericValue)
    return isCurrency ? `৳${formatted}` : formatted
  }, [numericValue, isCurrency])

  const shortDisplay = useMemo(() => {
    if (numericValue === null) return 'N/A'
    const formatted = formatNumber(numericValue)
    return isCurrency ? `৳${formatted}` : formatted
  }, [numericValue, isCurrency])

  const displayValue = showFull ? fullDisplay : shortDisplay

  return {
    displayValue,
    toggle: () => setShowFull((prev) => !prev),
    showFull,
    fullDisplay,
  }
}
