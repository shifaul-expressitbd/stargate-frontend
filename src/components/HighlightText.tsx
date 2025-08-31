import React from 'react'


function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

interface HighlightTextProps {
  text: string
  query: string
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
  const capitalizedText = capitalizeWords(text)
  if (!query) return <>{capitalizedText}</>

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escapedQuery, 'gi')

  const matches = [...capitalizedText.matchAll(regex)]
  if (matches.length === 0) return <>{capitalizedText}</>

  const result: React.ReactNode[] = []
  let lastIndex = 0

  matches.forEach((match, index) => {
    const start = match.index ?? 0
    const end = start + match[0].length

    // Add non-matching part
    if (lastIndex < start) {
      result.push(capitalizedText.slice(lastIndex, start))
    }

    // Add matched part with highlight
    result.push(
      <mark key={index} className="bg-yellow-300 dark:bg-yellow-200">
        {capitalizedText.slice(start, end)}
      </mark>
    )

    lastIndex = end
  })

  // Add any remaining part after the last match
  if (lastIndex < capitalizedText.length) {
    result.push(capitalizedText.slice(lastIndex))
  }

  return <>{result}</>
}
