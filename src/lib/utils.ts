import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function generateManifestCode(
  origin: string,
  destination: string,
  parkCode: string
): string {
  const timestamp = Date.now().toString()
  return `NURTW-${origin.toUpperCase()}-${destination.toUpperCase()}-${parkCode}-${timestamp}`
}

export function generateAgentCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
