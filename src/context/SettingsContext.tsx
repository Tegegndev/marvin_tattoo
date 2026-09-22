import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettingData } from '../types';
import { DEFAULT_SITE_SETTINGS, fetchSiteSettings, adminUpdateSettings } from '../services/apiClient';

interface SettingsContextType {
  settings: SiteSettingData;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  saveSettings: (payload: Partial<SiteSettingData>) => Promise<SiteSettingData>;
}

const SETTINGS_STORAGE_KEY = 'marvin_studio_settings_cache';
const SETTINGS_EVENT = 'marvin_settings_updated';

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
  saveSettings: async () => DEFAULT_SITE_SETTINGS,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.metaTitle && parsed.metaTitle.includes('Piercing Atelier')) {
            parsed.metaTitle = 'Marvin Tattoo Studio | Kampala, Uganda';
          }
          if (parsed.studioName && (parsed.studioName.includes('Piercing') || parsed.studioName === 'Marvin Tattoos Atelier')) {
            parsed.studioName = 'Marvin Tattoo Studio';
          }
          const merged = { ...DEFAULT_SITE_SETTINGS, ...parsed };
          if (!merged.socialLinks || merged.socialLinks.length === 0) {
            merged.socialLinks = DEFAULT_SITE_SETTINGS.socialLinks;
          }
          return merged;
        }
      } catch {
        // fallback to default
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Apply document title and SEO meta tags when settings change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      let pageTitle = settings.metaTitle?.trim() || settings.studioName?.trim() || 'Marvin Tattoo Studio';
      if (pageTitle.includes('Piercing Atelier')) {
        pageTitle = 'Marvin Tattoo Studio | Kampala, Uganda';
      }
      document.title = pageTitle;

      // Update meta description
      if (settings.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', settings.metaDescription);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
          ogDesc = document.createElement('meta');
          ogDesc.setAttribute('property', 'og:description');
          document.head.appendChild(ogDesc);
        }
        ogDesc.setAttribute('content', settings.metaDescription);
      }

      // Update OG title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', pageTitle);

      // Update OG image if provided
      if (settings.ogImageUrl) {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (!ogImg) {
          ogImg = document.createElement('meta');
          ogImg.setAttribute('property', 'og:image');
          document.head.appendChild(ogImg);
        }
        ogImg.setAttribute('content', settings.ogImageUrl);
      }
    }
  }, [settings.studioName, settings.metaTitle, settings.metaDescription, settings.ogImageUrl]);

  const refreshSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSiteSettings();
      if (data && data.studioName) {
        if (data.metaTitle && data.metaTitle.includes('Piercing Atelier')) {
          data.metaTitle = 'Marvin Tattoo Studio | Kampala, Uganda';
        }
        if (data.studioName && (data.studioName.includes('Piercing') || data.studioName === 'Marvin Tattoos Atelier')) {
          data.studioName = 'Marvin Tattoo Studio';
        }
        const merged: SiteSettingData = {
          ...DEFAULT_SITE_SETTINGS,
          ...data,
          socialLinks:
            Array.isArray(data.socialLinks)
              ? data.socialLinks
              : DEFAULT_SITE_SETTINGS.socialLinks,
        };
        setSettings(merged);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Failed to refresh site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (payload: Partial<SiteSettingData>): Promise<SiteSettingData> => {
    const updated = await adminUpdateSettings(payload);
    if (updated.metaTitle && updated.metaTitle.includes('Piercing Atelier')) {
      updated.metaTitle = 'Marvin Tattoo Studio | Kampala, Uganda';
    }
    if (updated.studioName && (updated.studioName.includes('Piercing') || updated.studioName === 'Marvin Tattoos Atelier')) {
      updated.studioName = 'Marvin Tattoo Studio';
    }
    const merged: SiteSettingData = {
      ...DEFAULT_SITE_SETTINGS,
      ...updated,
      socialLinks:
        Array.isArray(updated.socialLinks)
          ? updated.socialLinks
          : Array.isArray(payload.socialLinks)
          ? payload.socialLinks
          : DEFAULT_SITE_SETTINGS.socialLinks,
    };
    setSettings(merged);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
    
    // Broadcast to any other listeners/tabs
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: merged }));
    }
    return merged;
  }, []);

  useEffect(() => {
    refreshSettings();

    const handleCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettingData>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings(parsed);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener(SETTINGS_EVENT, handleCustomUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleCustomUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  return useContext(SettingsContext);
}
