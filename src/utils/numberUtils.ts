/**
 * Formats a date string for invoice display.
 * @param dateString - The date string
 * @param locale - The locale (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
) {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, options);
}

/**
 * Formats a number as currency for invoice display.
 * @param amount - The amount
 * @param currency - The currency code (e.g., 'USD', 'BDT')
 * @returns Formatted currency string
 */

export const formatCurrency = (amount: number, currencyCode: string) => {
  // Map currency codes to their symbols
  const currencySymbols: Record<string, string> = {
    USD: "$",
    BDT: "৳",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
    MYR: "RM",
    CNY: "¥",
    PKR: "₨",
    RUB: "₽",
    TRY: "₺",
    AED: "د.إ",
    SAR: "﷼",
    KWD: "د.ك",
    QAR: "ر.ق",
    ZAR: "R",
    NGN: "₦",
    THB: "฿",
    VND: "₫",
    PHP: "₱",
    IDR: "Rp",
    KRW: "₩",
    HKD: "HK$",
    TWD: "NT$",
    MXN: "$",
    BRL: "R$",
    CHF: "Fr",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    HUF: "Ft",
    CZK: "Kč",
    ILS: "₪",
    EGP: "£",
    LKR: "Rs",
    NPR: "₨",
    BGN: "лв",
    RON: "lei",
    UAH: "₴",
    COP: "$",
    ARS: "$",
    CLP: "$",
    PEN: "S/",
    NZD: "NZ$",
    MAD: "د.م.",
    JOD: "د.ا",
    OMR: "ر.ع.",
    BHD: "ب.د",
    KES: "KSh",
    GHS: "₵",
    UGX: "USh",
    TZS: "TSh",
    MUR: "₨",
    MMK: "K",
    LAK: "₭",
  };

  // Default to $ if currency not found
  const symbol = currencySymbols[currencyCode] || "$";

  return `${symbol} ${amount.toFixed(2)}`;
};

export const formatCurrencyToBengali = (amount: number, currencyCode: string) => {
  // Map currency codes to their Bengali names and symbols
  const currencyInfo: Record<string, { symbol: string; name: string }> = {
    BDT: { symbol: "৳", name: "টাকা" },
    USD: { symbol: "$", name: "ডলার" },
    EUR: { symbol: "€", name: "ইউরো" },
    GBP: { symbol: "£", name: "পাউন্ড" },
    INR: { symbol: "₹", name: "রুপি" },
    JPY: { symbol: "¥", name: "ইয়েন" },
    CNY: { symbol: "¥", name: "ইয়ুয়ান" },
    AED: { symbol: "د.إ", name: "দিরহাম" },
    SAR: { symbol: "﷼", name: "রিয়াল" },
    MYR: { symbol: "RM", name: "রিংগিট" },
    SGD: { symbol: "S$", name: "সিঙ্গাপুর ডলার" },
    PKR: { symbol: "₨", name: "পাকিস্তানি রুপি" },
    LKR: { symbol: "Rs", name: "শ্রীলঙ্কান রুপি" },
    NPR: { symbol: "₨", name: "নেপালি রুপি" },
    // Add more currencies as needed
  };

  // Get currency info or default to BDT
  const currency = currencyInfo[currencyCode] || { symbol: "৳", name: "টাকা" };

  // Format the amount with Bengali numerals
  const formattedAmount = translateNumberToBengali(amount.toFixed(2));

  // Return different formats based on currency
  if (currencyCode === "BDT") {
    return `${formattedAmount} ${currency.name}`; // "১০০.০০ টাকা"
  } else {
    return `${currency.symbol} ${formattedAmount} (${currency.name})`; // "$ ১০০.০০ (ডলার)"
  }
};

/**
 * Converts English numbers to Bengali numerals
 * @param num The number to convert (can be number or string)
 * @returns The Bengali numeral string
 */
export const translateNumberToBengali = (num: number | string): string => {
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const bengaliNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return num
    .toString()
    .split("")
    .map((char) => {
      const index = englishNumbers.indexOf(char);
      return index !== -1 ? bengaliNumbers[index] : char;
    })
    .join("");
};

/**
 * Translates an ISO date string to Bengali with flexible formatting
 * @param isoDateString The ISO date string (e.g., "2025-07-03T10:01:31.769Z")
 * @param options Formatting options
 * @returns Formatted Bengali date string
 */
export const translateISODateToBengali = (
  isoDateString: string,
  options: {
    showTime?: boolean;
    showDayName?: boolean;
    shortMonth?: boolean;
  } = {}
): string => {
  const date = new Date(isoDateString);

  // Return empty string if invalid date
  if (isNaN(date.getTime())) return "";

  // Bengali translations
  const monthMap = {
    long: {
      January: "জানুয়ারি",
      February: "ফেব্রুয়ারি",
      March: "মার্চ",
      April: "এপ্রিল",
      May: "মে",
      June: "জুন",
      July: "জুলাই",
      August: "আগস্ট",
      September: "সেপ্টেম্বর",
      October: "অক্টোবর",
      November: "নভেম্বর",
      December: "ডিসেম্বর",
    },
    short: {
      January: "জানু",
      February: "ফেব",
      March: "মার্চ",
      April: "এপ্রি",
      May: "মে",
      June: "জুন",
      July: "জুল",
      August: "আগ",
      September: "সেপ্ট",
      October: "অক্টো",
      November: "নভে",
      December: "ডিসে",
    },
  };

  const dayMap = {
    Sunday: "রবিবার",
    Monday: "সোমবার",
    Tuesday: "মঙ্গলবার",
    Wednesday: "বুধবার",
    Thursday: "বৃহস্পতিবার",
    Friday: "শুক্রবার",
    Saturday: "শনিবার",
  };

  // Get English components
  const englishMonth = date.toLocaleString("en-US", { month: "long" });
  const englishDayName = date.toLocaleString("en-US", { weekday: "long" });

  // Translate components
  const bengaliDay = translateNumberToBengali(date.getDate());
  const bengaliMonth = options.shortMonth
    ? monthMap.short[englishMonth as keyof typeof monthMap.short]
    : monthMap.long[englishMonth as keyof typeof monthMap.long];
  const bengaliYear = translateNumberToBengali(date.getFullYear());
  const bengaliDayName = dayMap[englishDayName as keyof typeof dayMap];

  // Time components
  let timePart = "";
  if (options.showTime) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const bengaliHours = translateNumberToBengali(hours % 12 || 12);
    const bengaliMinutes = translateNumberToBengali(minutes);
    timePart = `, ${bengaliHours}:${bengaliMinutes} ${ampm}`;
  }

  // Build final string
  const dateParts: string[] = [];

  if (options.showDayName) {
    dateParts.push(bengaliDayName);
  }

  dateParts.push(`${bengaliDay} ${bengaliMonth}, ${bengaliYear}`);

  return dateParts.join(" - ") + timePart;
};
