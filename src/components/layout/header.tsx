import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import contactData from "@/lib/contact.json"; // Adjust the import path as necessary
import { usePathname } from "next/navigation";
import { useAppointmentsSwitch } from "@/context/AppointmentSwitchContext"; // Adjust the import path as necessary
import { useSiteSettings } from "@/context/SettingsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { appointmentsEnabled } = useAppointmentsSwitch();
  const { settings, isLoading } = useSiteSettings();

  const isAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  // Handle scroll effect for enhanced header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.asPath]);

  // Get primary phone number for display
  const primaryPhone = settings?.phoneNumbers?.[0] || "";

  if (isAdmin) {
    return null; // Prevent rendering if the component is not mounted
  }

  // If settings are still loading, show a simplified header
  if (isLoading) {
    return (
      <header className="bg-white sticky top-0 z-50 shadow-sm py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="h-16 w-24 bg-gray-100 animate-pulse rounded"></div>
            <div className="hidden md:block">
              <div className="flex space-x-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-20 h-4 bg-gray-100 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md py-2" : "shadow-sm py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-16 w-24">
                <Image
                  src={settings?.logoUrl || "/images/image.png"}
                  alt={`${settings?.title || "Medical Center"} Logo`}
                  fill
                  className="object-contain"
                  priority
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="text-blue-600 text-2xl font-bold">
                {settings?.title || "Medical Center"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {settings?.headerLinks
              .filter((item) => item.enabled)
              .map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`py-2 px-1 border-b-2 ${
                    router.pathname === item.path
                      ? "border-blue-600 text-blue-600 font-medium"
                      : "border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300 font-medium"
                  } transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          {/* Contact & Appointment Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-600 text-sm">Contact: </p>
              <a href={`tel:${primaryPhone}`} className="text-blue-600 font-bold hover:underline">
                {primaryPhone}
              </a>
            </div>
            {appointmentsEnabled && (
              <Link
                href="/appointment"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-300 shadow-sm hover:shadow"
              >
                Book Appointment
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-md"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100 mt-3 pb-3" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-3">
            {settings?.headerLinks
              .filter(item => item.enabled)
              .map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-2 py-2 rounded-md ${
                    router.pathname === item.path
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            <div className="pt-3 px-2">
              <p className="text-gray-600 text-sm">
                Contact: <span className="text-blue-600 font-bold">{primaryPhone}</span>
              </p>
              {appointmentsEnabled && (
              <Link
                href="/appointment"
                className="block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-center transition duration-300 shadow-sm hover:shadow"
              >
                Book Appointment
              </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
