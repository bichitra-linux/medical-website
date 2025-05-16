import { useState, useEffect } from "react";
import Head from "next/head";
import { Save, AlertCircle, Globe, Bell, X, Menu, Layout, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/context/SettingsContext";

type NavLink = {
  name: string;
  path: string;
  enabled: boolean;
};

type FooterLink = {
  name: string;
  path: string;
  enabled: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};
// Types
type SiteSettings = {
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
  // Header settings
  headerLinks: NavLink[];
  // Footer settings
  footerSections: FooterSection[];
  footerTagline: string;
  copyrightText: string;
  // Notification settings
  notificationSettings?: NotificationSettings;
};

type NotificationSettings = {
  emailNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"site" | "header" | "footer" | "notifications">(
    "site"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { settings: contextSettings, updateSettings } = useSiteSettings();
  const year = new Date().getFullYear();

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: contextSettings?.title || "",
    logoUrl: contextSettings?.logoUrl || "",
    phoneNumbers: contextSettings?.phoneNumbers || [""],
    contactEmails: contextSettings?.contactEmails || [""],
    address: contextSettings?.address || "",
    socialLinks: contextSettings?.socialLinks || {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
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
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: false,
    appointmentReminders: false,
    marketingEmails: false,
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/cloudinary/settings/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.url) updateField("logoUrl", data.url);
    } catch (err) {
      console.error("Logo upload failed", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Load settings from context when available
  useEffect(() => {
    if (contextSettings && !isLoading) {
      setSiteSettings(contextSettings);
    }
  }, [contextSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Create a combined settings object that includes notification settings
      const combinedSettings = {
        ...siteSettings,
        notificationSettings: notificationSettings,
      };

      // Update the context with the combined settings
      await updateSettings(combinedSettings);
      setSuccess("Settings saved!");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const processYearPlaceholder = (text: string): string => {
    return text.replace(/{year}/g, year.toString());
  };

  useEffect(() => {
    async function load() {
      // If we already have valid context settings, use those instead
      if (contextSettings && Object.keys(contextSettings).length > 0) {
        setSiteSettings(contextSettings);
        // Also load notification settings if available
        // Use type checking to ensure the property exists
        if ("notificationSettings" in contextSettings && contextSettings.notificationSettings) {
          // Use type assertion to ensure TypeScript knows this is a NotificationSettings object
          const notifSettings = contextSettings.notificationSettings as NotificationSettings;

          // Create a properly typed object with all required properties
          setNotificationSettings({
            emailNotifications: Boolean(notifSettings.emailNotifications),
            appointmentReminders: Boolean(notifSettings.appointmentReminders),
            marketingEmails: Boolean(notifSettings.marketingEmails),
          });
        }
        setIsLoading(false);
        return;
      }
      // simulate fetch…
      await new Promise((r) => setTimeout(r, 800));
      setSiteSettings({
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
      });
      setNotificationSettings({
        emailNotifications: true,
        appointmentReminders: true,
        marketingEmails: false,
      });
      setIsLoading(false);
    }
    load();
  }, [contextSettings]);

  // Header navigation helpers
  const updateNavLink = (idx: number, field: keyof NavLink, value: string | boolean) => {
    setSiteSettings((s) => {
      const links = [...s.headerLinks];
      links[idx] = { ...links[idx], [field]: value };
      return { ...s, headerLinks: links };
    });
  };

  const addNavLink = () => {
    setSiteSettings((s) => ({
      ...s,
      headerLinks: [...s.headerLinks, { name: "", path: "", enabled: true }],
    }));
  };

  const removeNavLink = (idx: number) => {
    setSiteSettings((s) => ({
      ...s,
      headerLinks: s.headerLinks.filter((_, i) => i !== idx),
    }));
  };

  // Footer section helpers
  const updateFooterSection = (
    sectionIdx: number,
    field: keyof Omit<FooterSection, "links">,
    value: string
  ) => {
    setSiteSettings((s) => {
      const sections = [...s.footerSections];
      sections[sectionIdx] = { ...sections[sectionIdx], [field]: value };
      return { ...s, footerSections: sections };
    });
  };

  const updateFooterLink = (
    sectionIdx: number,
    linkIdx: number,
    field: keyof FooterLink,
    value: string | boolean
  ) => {
    setSiteSettings((s) => {
      const sections = [...s.footerSections];
      const links = [...sections[sectionIdx].links];
      links[linkIdx] = { ...links[linkIdx], [field]: value };
      sections[sectionIdx] = { ...sections[sectionIdx], links };
      return { ...s, footerSections: sections };
    });
  };

  const addFooterLink = (sectionIdx: number) => {
    setSiteSettings((s) => {
      const sections = [...s.footerSections];
      sections[sectionIdx] = {
        ...sections[sectionIdx],
        links: [...sections[sectionIdx].links, { name: "", path: "", enabled: true }],
      };
      return { ...s, footerSections: sections };
    });
  };

  const removeFooterLink = (sectionIdx: number, linkIdx: number) => {
    setSiteSettings((s) => {
      const sections = [...s.footerSections];
      sections[sectionIdx] = {
        ...sections[sectionIdx],
        links: sections[sectionIdx].links.filter((_, i) => i !== linkIdx),
      };
      return { ...s, footerSections: sections };
    });
  };

  const addFooterSection = () => {
    setSiteSettings((s) => ({
      ...s,
      footerSections: [
        ...s.footerSections,
        {
          title: "New Section",
          links: [{ name: "New Link", path: "/", enabled: true }],
        },
      ],
    }));
  };

  const removeFooterSection = (idx: number) => {
    setSiteSettings((s) => ({
      ...s,
      footerSections: s.footerSections.filter((_, i) => i !== idx),
    }));
  };

  // Site changes
  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSiteSettings((s) => ({ ...s, [key]: value }));

  const updateSocial = (key: keyof SiteSettings["socialLinks"], value: string) =>
    setSiteSettings((s) => ({
      ...s,
      socialLinks: { ...s.socialLinks, [key]: value },
    }));

  const updateArray = (arrKey: "phoneNumbers" | "contactEmails", idx: number, value: string) => {
    setSiteSettings((s) => {
      const arr = [...s[arrKey]];
      arr[idx] = value;
      return { ...s, [arrKey]: arr } as SiteSettings;
    });
  };

  const addArrayItem = (arrKey: "phoneNumbers" | "contactEmails") =>
    setSiteSettings((s) => ({ ...s, [arrKey]: [...s[arrKey], ""] }));

  const removeArrayItem = (arrKey: "phoneNumbers" | "contactEmails", idx: number) =>
    setSiteSettings((s) => {
      const arr = s[arrKey].filter((_, i) => i !== idx);
      return { ...s, [arrKey]: arr } as SiteSettings;
    });

  // Notification changes
  const toggleNotif = (key: keyof NotificationSettings) => {
    setNotificationSettings((prevSettings) => {
      const updatedSettings: NotificationSettings = {
        emailNotifications: prevSettings.emailNotifications,
        appointmentReminders: prevSettings.appointmentReminders,
        marketingEmails: prevSettings.marketingEmails,
        [key]: !prevSettings[key],
      };
      return updatedSettings;
    });
  };

  return (
    <>
      <Head>
        <title>Settings | Admin</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Settings</h1>
          <Button
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
                       text-white font-medium py-2.5 px-5 rounded-xl flex items-center justify-center
                       transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        {/* Error/Success messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {success}
          </div>
        )}

        {/* Tabs */}
        <nav className="flex space-x-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("site")}
            className={`pb-2 ${
              activeTab === "site"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <Globe className="inline-block mr-1 mb-1" />
            Site
          </button>
          <button
            onClick={() => setActiveTab("header")}
            className={`pb-2 ${
              activeTab === "header"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <Menu className="inline-block mr-1 mb-1" />
            Header
          </button>
          <button
            onClick={() => setActiveTab("footer")}
            className={`pb-2 ${
              activeTab === "footer"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <Layout className="inline-block mr-1 mb-1" />
            Footer
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-2 ${
              activeTab === "notifications"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <Bell className="inline-block mr-1 mb-1" />
            Notifications
          </button>
        </nav>

        {/* Loading state */}
        {isLoading && <div className="h-64 animate-pulse bg-white rounded-lg shadow-sm" />}

        {/* Content */}
        {!isLoading && activeTab === "site" && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
            {/* Site Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="font-medium text-gray-700">Site Title</label>
              <input
                value={siteSettings.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
              />
            </div>

            {/* Logo URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label htmlFor="logo-upload" className="font-medium text-gray-700">
                Site Logo
              </label>
              <div className="flex items-center space-x-4">
                {/* Styled button to trigger file input */}
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  {siteSettings.logoUrl ? "Change Logo" : "Upload Logo"}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingLogo}
                  onChange={handleLogoUpload}
                />

                {/* Uploading indicator */}
                {uploadingLogo && <span className="text-gray-500 text-sm">Uploading…</span>}

                {/* Preview with remove button */}
                {!uploadingLogo && siteSettings.logoUrl && (
                  <div className="relative inline-block">
                    <img
                      src={siteSettings.logoUrl}
                      alt="Logo preview"
                      className="h-12 w-auto rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => updateField("logoUrl", "")}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow"
                      aria-label="Remove logo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Phone Numbers</label>
              {siteSettings.phoneNumbers.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={p}
                    onChange={(e) => updateArray("phoneNumbers", i, e.target.value)}
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                  <button
                    onClick={() => removeArrayItem("phoneNumbers", i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem("phoneNumbers")}
                className="text-indigo-600 hover:underline"
              >
                + Add phone
              </button>
            </div>

            {/* Contact Emails */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Contact Emails</label>
              {siteSettings.contactEmails.map((e, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={e}
                    onChange={(ev) => updateArray("contactEmails", i, ev.target.value)}
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                  <button
                    onClick={() => removeArrayItem("contactEmails", i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem("contactEmails")}
                className="text-indigo-600 hover:underline"
              >
                + Add email
              </button>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="font-medium text-gray-700">Address</label>
              <textarea
                value={siteSettings.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="font-medium text-gray-700">Social Links</label>
              <div className="space-y-2">
                {(["facebook", "twitter", "instagram", "linkedin", "youtube"] as const).map(
                  (key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 capitalize">
                        {key}
                      </label>
                      <input
                        value={siteSettings.socialLinks[key]}
                        onChange={(e) => updateSocial(key, e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
        {/* Notifications Tab Content */}
        {!isLoading && activeTab === "notifications" && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
            {/* Notification Toggles */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={() => toggleNotif("emailNotifications")}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">Email Notifications</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.appointmentReminders}
                onChange={() => toggleNotif("appointmentReminders")}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">Appointment Reminders</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.marketingEmails}
                onChange={() => toggleNotif("marketingEmails")}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">Marketing Emails</span>
            </div>
          </div>
        )}
        {/* Header Tab Content */}
        {!isLoading && activeTab === "header" && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Navigation Links</h3>
            <p className="text-sm text-gray-500">
              Configure the navigation links that appear in the header.
            </p>

            <div className="space-y-4">
              {siteSettings.headerLinks.map((link, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">Link #{index + 1}</h4>
                    <button
                      onClick={() => removeNavLink(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateNavLink(index, "name", e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
                      <input
                        type="text"
                        value={link.path}
                        onChange={(e) => updateNavLink(index, "path", e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`link-enabled-${index}`}
                        checked={link.enabled}
                        onChange={(e) => updateNavLink(index, "enabled", e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`link-enabled-${index}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Enabled
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={addNavLink}
                variant="outline"
                className="flex items-center text-indigo-600 hover:text-indigo-700 justify-center w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Navigation Link
              </Button>
            </div>
          </div>
        )}

        {/* Footer Tab Content */}
        {!isLoading && activeTab === "footer" && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
            {/* Footer Tagline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="font-medium text-gray-700">Footer Tagline</label>
              <textarea
                value={siteSettings.footerTagline}
                onChange={(e) => updateField("footerTagline", e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
              />
            </div>

            {/* Copyright Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700">Copyright Text</label>
                <p className="text-xs text-gray-500">
                  {processYearPlaceholder(siteSettings.copyrightText)}
                </p>
              </div>
              <input
                value={siteSettings.copyrightText}
                onChange={(e) => updateField("copyrightText", e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
              />
            </div>

            {/* Footer Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Footer Sections</h3>
                <Button
                  onClick={addFooterSection}
                  variant="outline"
                  className="flex items-center text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              {siteSettings.footerSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateFooterSection(sectionIndex, "title", e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                      />
                    </div>
                    <button
                      onClick={() => removeFooterSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label="Remove section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm">Links</h4>

                    {section.links.map((link, linkIndex) => (
                      <div
                        key={linkIndex}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pl-4 border-l-2 border-gray-200"
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Link Name
                          </label>
                          <input
                            type="text"
                            value={link.name}
                            onChange={(e) =>
                              updateFooterLink(sectionIndex, linkIndex, "name", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Link Path
                          </label>
                          <input
                            type="text"
                            value={link.path}
                            onChange={(e) =>
                              updateFooterLink(sectionIndex, linkIndex, "path", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`footer-link-${sectionIndex}-${linkIndex}`}
                              checked={link.enabled}
                              onChange={(e) =>
                                updateFooterLink(
                                  sectionIndex,
                                  linkIndex,
                                  "enabled",
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`footer-link-${sectionIndex}-${linkIndex}`}
                              className="text-xs font-medium text-gray-600"
                            >
                              Enabled
                            </label>
                          </div>
                          <button
                            onClick={() => removeFooterLink(sectionIndex, linkIndex)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove link"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={() => addFooterLink(sectionIndex)}
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
