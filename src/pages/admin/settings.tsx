import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "@/components/layout/admin-layout";
import { Save, AlertCircle, Globe, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
};

type NotificationSettings = {
  emailNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"site" | "notifications">("site");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: "",
    logoUrl: "",
    phoneNumbers: [""],
    contactEmails: [""],
    address: "",
    socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "", youtube: "" },
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

  useEffect(() => {
    async function load() {
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
      });
      setNotificationSettings({
        emailNotifications: true,
        appointmentReminders: true,
        marketingEmails: false,
      });
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // simulate save…
      await new Promise((r) => setTimeout(r, 800));
      setSuccess("Settings saved!");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  // Site changes
  const updateField = (key: keyof SiteSettings, value: any) =>
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
  const toggleNotif = (key: keyof NotificationSettings) =>
    setNotificationSettings((n) => ({ ...n, [key]: !n[key] }));

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

        {/* Content */}
        {isLoading ? (
          <div className="h-64 animate-pulse bg-white rounded-lg shadow-sm" />
        ) : activeTab === "site" ? (
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
        ) : (
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
      </div>
    </>
  );
}
