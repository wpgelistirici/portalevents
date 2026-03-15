"use client";

import { useFormatter } from "next-intl";

/**
 * Hook that returns locale-aware date/time formatters.
 * Use in Client Components anywhere you need to display event dates, times, or
 * relative timestamps in the user's locale.
 *
 * @example
 * const { formatEventDate, formatEventTime, formatRelative } = useEventDateFormatter();
 * formatEventDate("2026-03-15T21:00:00Z") // "Sun, Mar 15, 2026"  (en)  /  "15 Mar 2026 Paz"  (tr)
 */
export function useEventDateFormatter() {
  const formatter = useFormatter();

  return {
    /** Full date: weekday + day + month + year */
    formatEventDate: (isoDate: string) =>
      formatter.dateTime(new Date(isoDate), {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

    /** Time only: 24-hour HH:mm */
    formatEventTime: (isoDate: string) =>
      formatter.dateTime(new Date(isoDate), {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),

    /** Short date: day + month + year, no weekday */
    formatShortDate: (isoDate: string) =>
      formatter.dateTime(new Date(isoDate), {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

    /** Relative time: "3 days ago", "in 2 hours", etc. */
    formatRelative: (isoDate: string) =>
      formatter.relativeTime(new Date(isoDate)),
  };
}

/**
 * Locale-aware number/currency formatter hook.
 *
 * @example
 * const { formatCurrency } = useNumberFormatter();
 * formatCurrency(1200) // "₺1.200,00"  (tr)  /  "TRY 1,200.00"  (en)
 */
export function useNumberFormatter() {
  const formatter = useFormatter();

  return {
    /** Format an amount as Turkish Lira */
    formatCurrency: (amount: number) =>
      formatter.number(amount, {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),

    /** Format a plain number with locale-appropriate separators */
    formatNumber: (value: number) =>
      formatter.number(value),
  };
}
