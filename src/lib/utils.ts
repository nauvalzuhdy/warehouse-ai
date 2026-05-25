import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with thousand separators
 * @param num - The number to format
 * @returns Formatted string with commas as thousand separators
 * 
 * @example
 * formatNumber(1000) // "1,000"
 * formatNumber(1000000) // "1,000,000"
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) {
    return "0"
  }
  return num.toLocaleString('id-ID')
}
