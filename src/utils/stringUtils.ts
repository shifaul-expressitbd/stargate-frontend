// src/utils/stringUtils.ts
export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))
