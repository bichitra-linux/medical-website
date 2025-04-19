import { SignIn } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  return (
    <>
      <Head>
        <title>Admin Login | Medical Center</title>
        <meta
          name="description"
          content="Secure admin login for the medical center management system"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="min-h-screen flex flex-col">
        {/* Background with gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 z-0" />

        {/* Login container */}
        <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-10">
            {/* Logo and header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-lg border border-gray-100 mb-6">
                <div className="relative h-14 w-14">
                  <Image
                    src="/images/image.png"
                    alt="Medical Center Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Portal</h1>
              <p className="mt-3 text-base text-gray-500">
                Secure access to the website management system
              </p>
            </div>

            {/* Clerk SignIn component with custom appearance - UPDATED with hash routing */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 p-6">
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md transition-colors",
                    card: "bg-white shadow-none",
                    headerTitle: "text-2xl font-bold text-gray-800",
                    headerSubtitle: "text-gray-600",
                    formFieldLabel: "text-sm font-medium text-gray-700",
                    formFieldInput:
                      "border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500",
                    footer: "hidden",
                  },
                }}
                routing="hash"
                signUpUrl="/admin/register"
                redirectUrl="/admin/dashboard"
              />
            </div>

            {/* Back to website link */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 
                         bg-white py-2 px-4 border border-gray-200 rounded-md shadow-sm
                         hover:bg-gray-50 transition-colors duration-150"
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to website
              </Link>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Purna Chandra Diagnostic Center. All rights reserved.
              </p>
              <div className="mt-2 flex justify-center space-x-4">
                <Link
                  href="/privacy-policy"
                  className="text-xs text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-xs text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  className="text-xs text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Contact
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}