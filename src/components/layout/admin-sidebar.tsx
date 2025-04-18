import { JSX, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Image, 
  Settings, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Define types for navigation items
type NavItem = {
  name: string;
  href: string;
  icon: JSX.Element;
  children?: NavSubItem[];
};

type NavSubItem = {
  name: string;
  href: string;
};

// Navigation categories
type NavCategory = {
  title?: string;
  items: NavItem[];
};

export default function AdminSidebar() {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Navigation items with icons
  const navCategories: NavCategory[] = [
    {
      items: [
        { 
          name: 'Dashboard', 
          href: '/admin/dashboard', 
          icon: <LayoutDashboard size={20} /> 
        },
      ]
    },
    {
      title: 'Management',
      items: [
        { 
          name: 'Appointments', 
          href: '/admin/appointments', 
          icon: <Calendar size={20} />,
          children: [
            { name: 'All Appointments', href: '/admin/appointments' },
            { name: 'Create New', href: '/admin/appointments/new' },
          ]
        },
        { 
          name: 'Services', 
          href: '/admin/services', 
          icon: <FileText size={20} />,
          children: [
            { name: 'All Services', href: '/admin/services' },
            { name: 'Add Service', href: '/admin/services/new' },
          ]
        },
        { 
          name: 'Gallery', 
          href: '/admin/gallery', 
          icon: <Image size={20} /> 
        },
      ]
    },
    {
      title: 'System',
      items: [
        { 
          name: 'Settings', 
          href: '/admin/settings', 
          icon: <Settings size={20} /> 
        },
      ]
    }
  ];

  // Function to check if a link is active
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  // Toggle expanded state for items with children
  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => 
      prev.includes(name) 
        ? prev.filter(item => item !== name) 
        : [...prev, name]
    );
  };

  // Check if an item should be expanded
  const isExpanded = (name: string, href: string) => {
    return expandedItems.includes(name) || router.pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block h-full">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav aria-label="Admin navigation">
            {navCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-6">
                {category.title && (
                  <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {category.title}
                  </h2>
                )}
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      {item.children ? (
                        // Item with dropdown
                        <div>
                          <button
                            onClick={() => toggleExpand(item.name)}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md ${
                              isActive(item.href)
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            aria-expanded={isExpanded(item.name, item.href)}
                            aria-controls={`${item.name}-submenu`}
                          >
                            <div className="flex items-center">
                              <span className="mr-3">{item.icon}</span>
                              {item.name}
                            </div>
                            {isExpanded(item.name, item.href) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          
                          {/* Submenu */}
                          {isExpanded(item.name, item.href) && (
                            <ul 
                              id={`${item.name}-submenu`} 
                              className="ml-9 mt-1 space-y-1"
                            >
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className={`block px-4 py-1.5 text-sm rounded-md ${
                                      isActive(subItem.href)
                                        ? 'text-blue-600 font-medium'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    aria-current={isActive(subItem.href) ? 'page' : undefined}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        // Regular item
                        <Link
                          href={item.href}
                          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}