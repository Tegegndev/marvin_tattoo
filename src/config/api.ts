/// <reference types="vite/client" />
import type { SyntheticEvent } from "react";

/**
 * Global API configuration using Vite Environment Variables
 */
export const API_BASE_URL: string = (
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  ""
).replace(/\/+$/, "");

export const CDN_BASE_URL: string = "https://images.tegegn.com.et";

export const PLACEHOLDERS = {
  hero: "https://images.tegegn.com.et/uploads/shop/1789826343_hero-banner_e85bc2ae224b5ab6.png",
  avatar: "https://images.tegegn.com.et/uploads/team/1789826344_marvin-founder_b2cc1a27311c8a00.png",
  portfolio: "https://images.tegegn.com.et/uploads/portfolio/1789826350_portrait-elder-woman_e2c751d34cb83dd2.png",
  product: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80",
  service: "https://images.tegegn.com.et/uploads/shop/1789826343_hero-banner_e85bc2ae224b5ab6.png",
};

const LEGACY_IMAGE_MAP: Record<string, string> = {
  "/images/hero-banner.png": "https://images.tegegn.com.et/uploads/shop/1789826343_hero-banner_e85bc2ae224b5ab6.png",
  "/images/hero.webp": "https://images.tegegn.com.et/uploads/shop/1789826343_hero-banner_e85bc2ae224b5ab6.png",
  "/images/marvin-founder.png": "https://images.tegegn.com.et/uploads/team/1789826344_marvin-founder_b2cc1a27311c8a00.png",
  "/images/portfolio/script-abdul-collarbone.png": "https://images.tegegn.com.et/uploads/portfolio/1789826346_script-abdul-collarbone_e1ab970708f4d4a5.png",
  "/images/portfolio/cosmetic-eyebrow-pmu.png": "https://images.tegegn.com.et/uploads/portfolio/1789826347_cosmetic-eyebrow-pmu_ef2585dee08a45cf.png",
  "/images/portfolio/back-portrait-man.png": "https://images.tegegn.com.et/uploads/portfolio/1789826349_back-portrait-man_54b71acab7c9cecf.png",
  "/images/portfolio/portrait-elder-woman.png": "https://images.tegegn.com.et/uploads/portfolio/1789826350_portrait-elder-woman_e2c751d34cb83dd2.png",
  "/images/portfolio/spider-navel-piercing.png": "https://images.tegegn.com.et/uploads/portfolio/1789826351_spider-navel-piercing_119a9a950efa3f23.png",
  "/logo.png": "https://images.tegegn.com.et/uploads/branding/1789826352_logo_93aae80f6e7e2507.png",
  "/logo-black.png": "https://images.tegegn.com.et/uploads/branding/1789826353_logo-black_2c9e69789b595c45.png",
};

/**
 * Returns the fully qualified or relative URL for any backend API endpoint
 */
export function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}

/**
 * Resolves static image URLs against the CDN / API base URL with fallback support
 */
export function formatImageUrl(
  url?: string | null,
  fallback: string = PLACEHOLDERS.portfolio
): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return fallback;
  }

  const trimmed = url.trim();

  // 1. Check direct legacy mapping
  if (LEGACY_IMAGE_MAP[trimmed]) {
    return LEGACY_IMAGE_MAP[trimmed];
  }

  // 2. If it's already an absolute or blob/data URL, keep as is
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // 3. If it starts with /uploads/ or uploads/, route to self-hosted cPanel CDN
  if (trimmed.startsWith("/uploads/")) {
    return `${CDN_BASE_URL}${trimmed}`;
  }
  if (trimmed.startsWith("uploads/")) {
    return `${CDN_BASE_URL}/${trimmed}`;
  }

  // 4. Default relative paths
  return trimmed;
}

/**
 * Event handler for onError on <img> tags to safely fallback without endless loops
 */
export function handleImageError(
  e: SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = PLACEHOLDERS.portfolio
): void {
  const target = e.currentTarget;
  if (!target || target.src === fallback) {
    return;
  }
  target.onerror = null; // Prevent secondary error loop
  target.src = fallback;
}
