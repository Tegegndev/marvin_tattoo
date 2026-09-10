/// <reference types="vite/client" />

/**
 * Global API configuration using Vite Environment Variables
 * If VITE_API_URL is not set, it defaults to "" (relative path, using current domain or Vite proxy)
 * Example: VITE_API_URL=https://api.yourdomain.com
 */

export const API_BASE_URL: string = (
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  ""
).replace(/\/+$/, "");

/**
 * Returns the fully qualified or relative URL for any backend API endpoint
 */
export function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}

/**
 * Resolves static image URLs (e.g. /uploads/image.webp) against the API base URL if needed
 */
export function formatImageUrl(url?: string | null): string {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  if (url.startsWith("/uploads") && API_BASE_URL) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
}
