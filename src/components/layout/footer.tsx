import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/context/SettingsContext";

export function Footer() {
  const pathname = usePathname();
  const { settings, isLoading } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const isAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isAdmin) {
    return null; // Prevent rendering if the component is not mounted
  }

  // Process copyright text to replace {year} placeholder with current year
  const processedCopyright = settings?.copyrightText
    ? settings.copyrightText.replace(/{year}/g, currentYear.toString())
    : `© ${currentYear} Medical Center. All rights reserved.`;

  // If settings are still loading, show a simplified footer
  if (isLoading) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-pulse">
            <div className="h-40 bg-gray-100 rounded"></div>
            <div className="h-40 bg-gray-100 rounded"></div>
            <div className="h-40 bg-gray-100 rounded"></div>
            <div className="h-40 bg-gray-100 rounded"></div>
          </div>
          <Separator className="my-8 bg-gray-200" />
          <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Logo and brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-gray-800">
                {settings?.title || "Medical Center"}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {settings?.footerTagline ||
                "Providing healthcare services with compassion and expertise."}
            </p>
            <div className="flex space-x-3">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </Button>
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </Button>
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </Button>
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </Button>
                </a>
              )}

              {settings?.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                    </svg>
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Footer Sections */}
          {settings?.footerSections?.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-800">{section.title}</h4>
              <nav className="flex flex-col space-y-2">
                {section.links
                  .filter((link) => link.enabled)
                  .map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.path}
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
              </nav>
            </div>
          ))}

          {/* Contact and Newsletter */}
          <div className="space-y-4">
            <div className="space-y-1.5 pt-4">
              <p className="text-sm font-semibold text-gray-800">Contact Us</p>
              {settings?.address && <p className="text-gray-600 text-sm">{settings.address}</p>}

              {settings?.phoneNumbers && settings.phoneNumbers.length > 0 && (
                <p className="text-gray-600 text-sm">Phone: {settings.phoneNumbers.join(", ")}</p>
              )}

              {settings?.contactEmails && settings.contactEmails.length > 0 && (
                <p className="text-gray-600 text-sm">Email: {settings.contactEmails.join(", ")}</p>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-200" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">{processedCopyright}</p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
