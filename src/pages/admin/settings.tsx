import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "@/components/layout/admin-layout";
import { Save, X, AlertCircle, Globe, User, Bell } from "lucide-react";

// Types for settings
type SiteSettings = {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
};

type UserSettings = {
  name: string;
  email: string;
  role: string;
};

type NotificationSettings = {
  emailNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
};

export default function SettingsPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("site");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load mock settings data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setSiteSettings({
          siteName: "Medical Center",
          contactEmail: "contact@medicalcenter.com",
          phoneNumber: "(555) 123-4567",
          address: "123 Healthcare Ave, Medical City, MC 12345",
          socialLinks: {
            facebook: "https://facebook.com/medicalcenter",
            twitter: "https://twitter.com/medicalcenter",
            instagram: "https://instagram.com/medicalcenter",
          },
        });

        setUserSettings({
          name: "Admin User",
          email: "admin@medicalcenter.com",
          role: "Administrator",
        });

        setNotificationSettings({
          emailNotifications: true,
          appointmentReminders: true,
          marketingEmails: false,
        });

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load settings. Please try again.");
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle saving settings
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccessMessage("Settings saved successfully!");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle site settings changes
  const handleSiteSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested properties (like socialLinks.facebook)
      const [parent, child] = name.split(".");
      setSiteSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle top-level properties
      setSiteSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle notification setting changes
  const handleNotificationSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <>
      <Head>
        <title>Settings | Medical Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-600 font-bold">Settings</h1>
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-2.5 px-5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm disabled:opacity-70"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save size={18} className="mr-1" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2" />
          {successMessage}
        </div>
      )}

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-100">
      <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("site")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "site"
                  ? "border-indigo-500 text-indigo-600" // Changed from blue-500/600
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Globe size={16} className="inline mr-2" />
              Site Settings
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "user"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User size={16} className="inline mr-2" />
              Account
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "notifications"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Bell size={16} className="inline mr-2" />
              Notifications
            </button>
          </nav>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="animate-pulse p-6">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {/* Site Settings */}
          {activeTab === "site" && siteSettings && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    value={siteSettings.siteName}
                    onChange={handleSiteSettingChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={siteSettings.contactEmail}
                    onChange={handleSiteSettingChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={siteSettings.phoneNumber}
                    onChange={handleSiteSettingChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    rows={2}
                    value={siteSettings.address}
                    onChange={handleSiteSettingChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    name="socialLinks.facebook"
                    value={siteSettings.socialLinks.facebook}
                    onChange={handleSiteSettingChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="text"
                    name="socialLinks.twitter"
                    value={siteSettings.socialLinks.twitter}
                    onChange={handleSiteSettingChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* User Settings */}
          {activeTab === "user" && userSettings && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={userSettings.name}
                    disabled
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">Contact support to change your name</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userSettings.email}
                    disabled
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">Contact support to change your email</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={userSettings.role}
                    disabled
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Change Password</h3>
                      <p className="text-xs text-blue-600 mt-1">
                        For security reasons, password changes are handled through a separate
                        process
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && notificationSettings && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationSettingChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive email notifications about system updates and important events
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="appointmentReminders"
                      name="appointmentReminders"
                      type="checkbox"
                      checked={notificationSettings.appointmentReminders}
                      onChange={handleNotificationSettingChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="appointmentReminders" className="font-medium text-gray-700">
                      Appointment Reminders
                    </label>
                    <p className="text-gray-500">Receive reminders about upcoming appointments</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketingEmails"
                      name="marketingEmails"
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationSettingChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                      Marketing Emails
                    </label>
                    <p className="text-gray-500">Receive promotional emails and newsletters</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
