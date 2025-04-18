import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  Image, 
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Settings,
  X
} from 'lucide-react';

// Define consistent types that match other components
type RecentActivity = {
  id: string;
  type: 'appointment' | 'service' | 'gallery' | 'settings';
  message: string;
  time: string;
  status: 'success' | 'warning' | 'error';
};

type DashboardAppointment = {
  id: string;
  patientName: string;
  service: string;
  time: string;
  date: string;
};

// Stats card component with proper typing
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string;
}) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className={`rounded-full p-4 ${color} text-white mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Action card component with proper typing
const ActionCard = ({ 
  title, 
  description, 
  icon, 
  href 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  href: string;
}) => (
  <Link 
    href={href} 
    className="bg-white rounded-lg shadow p-6 flex flex-col transition-all hover:shadow-md hover:-translate-y-1"
  >
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
    <div className="flex items-center mt-4 text-blue-600 text-sm font-medium">
      <span>View</span>
      <ArrowUpRight size={16} className="ml-1" />
    </div>
  </Link>
);

export default function Dashboard() {
  // Stats data with proper typing
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    services: 0,
    galleryImages: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<DashboardAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate data fetching - consistent with other admin pages' loading pattern
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay - same as other components
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data with consistent IDs and formats
        setStats({
          totalAppointments: 156,
          todayAppointments: 12,
          services: 24,
          galleryImages: 48
        });
        
        setRecentActivity([
          { 
            id: '1', 
            type: 'appointment', 
            message: 'New appointment scheduled', 
            time: '10 minutes ago', 
            status: 'success' 
          },
          { 
            id: '2', 
            type: 'service', 
            message: 'Service updated: X-Ray', 
            time: '2 hours ago', 
            status: 'success' 
          },
          { 
            id: '3', 
            type: 'gallery', 
            message: 'New gallery images uploaded', 
            time: '1 day ago', 
            status: 'success' 
          },
          { 
            id: '4', 
            type: 'appointment', 
            message: 'Appointment rescheduled', 
            time: '2 days ago', 
            status: 'warning' 
          }
        ]);
        
        setUpcomingAppointments([
          { 
            id: '1', 
            patientName: 'John Doe', 
            service: 'General Checkup', 
            time: '9:00 AM', 
            date: 'Today' 
          },
          { 
            id: '2', 
            patientName: 'Jane Smith', 
            service: 'Dental Cleaning', 
            time: '10:30 AM', 
            date: 'Today' 
          },
          { 
            id: '3', 
            patientName: 'Robert Johnson', 
            service: 'Blood Test', 
            time: '1:15 PM', 
            date: 'Today' 
          },
          { 
            id: '4', 
            patientName: 'Emily Davis', 
            service: 'X-Ray', 
            time: '9:45 AM', 
            date: 'Tomorrow' 
          }
        ]);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Medical Website</title>
        <meta name="description" content="Admin dashboard for medical website management" />
      </Head>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link 
          href="/admin/settings" 
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <Settings size={18} className="mr-1" />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
          <X size={20} className="mr-2" />
          {error}
        </div>
      )}
      
      {isLoading ? (
        // Loading state - consistent with other admin components
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 h-32 animate-pulse">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 bg-gray-200 mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Stats cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Appointments" 
            value={stats.totalAppointments} 
            icon={<Calendar size={24} />} 
            color="bg-blue-600"
          />
          <StatCard 
            title="Today's Appointments" 
            value={stats.todayAppointments} 
            icon={<Clock size={24} />} 
            color="bg-green-600"
          />
          <StatCard 
            title="Services" 
            value={stats.services} 
            icon={<FileText size={24} />} 
            color="bg-purple-600"
          />
          <StatCard 
            title="Gallery Images" 
            value={stats.galleryImages} 
            icon={<Image size={24} />} 
            color="bg-amber-600"
          />
        </div>
      )}
      
      {/* Quick Actions - now includes settings */}
      <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ActionCard 
          title="Manage Appointments" 
          description="View and manage upcoming patient appointments" 
          icon={<Calendar size={24} />}
          href="/admin/appointments"
        />
        <ActionCard 
          title="Update Services" 
          description="Add or edit medical services offered" 
          icon={<FileText size={24} />}
          href="/admin/services"
        />
        <ActionCard 
          title="Gallery Management" 
          description="Update your medical center's photo gallery" 
          icon={<Image size={24} />}
          href="/admin/gallery"
        />
        <ActionCard 
          title="Site Settings" 
          description="Update website information and preferences" 
          icon={<Settings size={24} />}
          href="/admin/settings"
        />
      </div>
      
      {/* Two column layout - fixed responsive behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500">No recent activity</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((item) => (
                  <li key={item.id} className="py-3 flex items-start">
                    <span className={`
                      mr-3 mt-1 
                      ${item.status === 'success' ? 'text-green-500' : 
                        item.status === 'warning' ? 'text-amber-500' : 
                        'text-red-500'}
                    `}>
                      {item.status === 'success' ? 
                        <CheckCircle size={16} /> : 
                        <AlertCircle size={16} />
                      }
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.message}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Upcoming Appointments</h2>
            <Link href="/admin/appointments" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                      <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                        {appointment.date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">{appointment.service}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {appointment.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}