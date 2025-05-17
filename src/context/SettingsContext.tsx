import React, { createContext, useContext, useState, useEffect } from "react";

export type NavLink = {
  name: string;
  path: string;
  enabled: boolean;
};

export type FooterLink = {
  name: string;
  path: string;
  enabled: boolean;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export type SiteSettings = {
  title: string;
  logoUrl: string;
  phoneNumbers: string[];
  contactEmails: string[];
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  headerLinks: NavLink[];
  footerSections: FooterSection[];
  footerTagline: string;
  copyrightText: string;
};

type SiteSettingsContextType = {
  settings: SiteSettings | null;
  isLoading: boolean;
  updateSettings: (settings: SiteSettings) => Promise<void>;
};

const defaultSettings: SiteSettings = {
  title: "Purna Chandra Diagnostic",
  logoUrl: "/images/logo.png",
  phoneNumbers: ["+977-1-4562923"],
  contactEmails: ["purna554@gmail.com"],
  address: "Gaushala, Kathmandu, Nepal",
  socialLinks: {
    facebook: "https://facebook.com/…",
    twitter: "https://twitter.com/…",
    instagram: "https://instagram.com/…",
    linkedin: "https://linkedin.com/…",
    youtube: "https://youtube.com/…",
  },
  headerLinks: [
    { name: "Home", path: "/", enabled: true },
    { name: "About Us", path: "/about", enabled: true },
    { name: "Services", path: "/services", enabled: true },
    { name: "Gallery", path: "/gallery", enabled: true },
    { name: "Contact", path: "/contact", enabled: true },
  ],
  footerSections: [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/", enabled: true },
        { name: "About Us", path: "/about", enabled: true },
        { name: "Services", path: "/services", enabled: true },
        { name: "Doctors", path: "/doctors", enabled: true },
      ],
    },
    {
      title: "Patient Resources",
      links: [
        { name: "FAQs", path: "/faq", enabled: true },
        { name: "Privacy Policy", path: "/privacy", enabled: true },
      ],
    },
  ],
  footerTagline: "Providing exceptional healthcare services with compassion and expertise.",
  copyrightText: "© {year} Purna Chandra Diagnostic Center. All rights reserved.",
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  isLoading: true,
  updateSettings: async () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        // Fetch settings from API
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
          throw new Error('Failed to load settings');
        }
        
        const data = await response.json();
        
        // If we have data from the API, use it
        if (data && Object.keys(data).length > 0) {
          setSettings(data as SiteSettings);
        } else {
          // Otherwise use default settings
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Fallback to default settings
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: SiteSettings): Promise<void> => {
    setIsLoading(true);
    try {
      // Save settings via API
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);