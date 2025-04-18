import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Logo and brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-gray-800">Purna Chandra Diagnostic Center</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Providing exceptional healthcare services with compassion and expertise.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Facebook"
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
              <Button
                variant="ghost"
                size="icon"
                aria-label="Twitter"
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
              <Button
                variant="ghost"
                size="icon"
                aria-label="Instagram"
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
              <Button
                variant="ghost"
                size="icon"
                aria-label="LinkedIn"
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
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Services
              </Link>
              <Link
                href="/doctors"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Our Doctors
              </Link>
            </nav>
          </div>

          {/* Patient Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800">Patient Resources</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/faq"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                FAQs
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Contact and Newsletter */}
          <div className="space-y-4">
            <div className="space-y-1.5 pt-4">
              <p className="text-sm font-semibold text-gray-800">Contact Us</p>
              <p className="text-gray-600 text-sm">Gaushala, Kathmandu, Nepal</p>

              <p className="text-gray-600 text-sm">Phone: +977-1-4562923, +977-1-4620574</p>
              <p className="text-gray-600 text-sm">Email: purna554@gmail.com</p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-200" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Purna Chandra Diagnostic Center. All rights reserved. Made
            with ❤️ by{" "}
            <a href="https://bichitra.com.np" className="text-blue-600 hover:underline">
              Bichitra.
            </a>
          </p>
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
