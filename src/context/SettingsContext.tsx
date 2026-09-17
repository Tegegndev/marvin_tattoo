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
          return { ...DEFAULT_SITE_SETTINGS, ...parsed };
        }
      } catch {
        // fallback to default
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Apply document title when studioName changes
  useEffect(() => {
    if (typeof document !== 'undefined' && settings.studioName) {
      document.title = settings.studioName;
    }
  }, [settings.studioName]);

  const refreshSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSiteSettings();
      if (data && data.studioName) {
        setSettings(data);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Failed to refresh site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (payload: Partial<SiteSettingData>): Promise<SiteSettingData> => {
    const updated = await adminUpdateSettings(payload);
    const merged = { ...DEFAULT_SITE_SETTINGS, ...updated };
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
