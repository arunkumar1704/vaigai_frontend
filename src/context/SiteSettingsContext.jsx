import { createContext, useContext, useEffect, useState } from "react";
import { getSiteSettings } from "../api";

const DEFAULT_SITE_SETTINGS = {
  logo: "/logovaigai.jpeg",
  address: "Raja Mill Road, Simmakal, Madurai, Tamil Nadu - 625001",
  phone: "+91 8778958663",
  email: "vaigaitourism@gmail.com",
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com/vaigai_tourism",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.me/918778958663",
  },
};

const SiteSettingsContext = createContext({
  settings: DEFAULT_SITE_SETTINGS,
  refreshSettings: async () => {},
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  const refreshSettings = async () => {
    try {
      const { data } = await getSiteSettings();
      setSettings({
        ...DEFAULT_SITE_SETTINGS,
        ...(data || {}),
        socialLinks: {
          ...DEFAULT_SITE_SETTINGS.socialLinks,
          ...(data?.socialLinks || {}),
        },
      });
    } catch {
      setSettings(DEFAULT_SITE_SETTINGS);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
