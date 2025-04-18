import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserButton } from '@clerk/nextjs';
import { Menu, X, Home, Settings } from 'lucide-react';

export default function AdminHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [router.pathname]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-expanded={showMobileMenu}
              aria-controls="mobile-menu"
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Go to dashboard"
            >
              <span className="text-blue-600 font-bold text-xl">Purna Chandra Diagnostic Center Admin</span>
            </Link>
          </div>

          {/* User Profile - Clerk UserButton */}
          <div className="flex items-center">
            <UserButton 
              afterSignOutUrl="/admin/login" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9",
                  userButtonTrigger: "focus:shadow-outline-blue focus:outline-none"
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-200 ease-in-out ${showMobileMenu ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        id="mobile-menu"
      >
        <div className="border-t border-gray-200 px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/admin/dashboard" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname === '/admin/dashboard' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-current={router.pathname === '/admin/dashboard' ? 'page' : undefined}
          >
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2" aria-hidden="true" />
              Dashboard
            </div>
          </Link>
          <Link 
            href="/admin/settings" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname === '/admin/settings' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-current={router.pathname === '/admin/settings' ? 'page' : undefined}
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2" aria-hidden="true" />
              Settings
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}