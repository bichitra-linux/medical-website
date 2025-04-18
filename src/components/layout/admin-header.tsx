import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, User, LogOut, Home, Settings } from 'lucide-react';

export default function AdminHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current && 
        userButtonRef.current && 
        !userMenuRef.current.contains(event.target as Node) && 
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [router.pathname]);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    // Example: signOut() from next-auth or Firebase
    // router.push('/admin/login');
  };

  // Handle keyboard navigation for the user dropdown
  const handleUserMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowUserMenu(false);
      userButtonRef.current?.focus();
    }
  };

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
              <span className="text-blue-600 font-bold text-xl">Medical Admin</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center">
            <div className="relative">
              <button
                ref={userButtonRef}
                type="button"
                className="flex items-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-5 w-5" aria-hidden="true" />
                </div>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div 
                  ref={userMenuRef}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                  onKeyDown={handleUserMenuKeyDown}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    role="menuitem"
                    tabIndex={0}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
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