import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
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
  X,
  RefreshCw,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

// Define consistent types that match other components
type RecentActivity = {
  id: string;
  type: "appointment" | "service" | "gallery" | "settings";
  message: string;
  time: string;
  status: "success" | "warning" | "error";
};

type DashboardAppointment = {
  id: string;
  patientName: string;
  service: string;
  time: string;
  date: string;
  phone?: string;
};

// Stats card component with enhanced styling
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center border border-gray-100">
    <div className={`rounded-full p-4 ${color} text-white mr-4`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Action card component with enhanced styling
const ActionCard = ({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) => (
  <Link
    href={href}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
  >
    <div className="text-indigo-600 mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-3">{description}</p>
    <div className="flex items-center mt-auto text-indigo-600 text-sm font-medium">
      <span>View</span>
      <ArrowUpRight size={16} className="ml-1" />
    </div>
  </Link>
);

export default function Dashboard() {
  // Stats data with proper typing
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    services: 0,
    galleryImages: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<DashboardAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Fetch stats data
      const statsResponse = await fetch('/api/admin/dashboard/stats');
      if (!statsResponse.ok) {
        throw new Error('Failed to load dashboard statistics');
      }
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/dashboard/activity');
      if (!activityResponse.ok) {
        throw new Error('Failed to load recent activity');
      }
      const activityData = await activityResponse.json();
      setRecentActivity(activityData.activities);

      // Fetch upcoming appointments
      /*const appointmentsResponse = await fetch('/api/admin/dashboard/appointments');
      if (!appointmentsResponse.ok) {
        throw new Error('Failed to load upcoming appointments');
      }
      const appointmentsData = await appointmentsResponse.json();
      setUpcomingAppointments(appointmentsData.appointments);*/

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
      
      // If API endpoints are not yet implemented, fall back to mock data
      setStats({
        totalAppointments: 156,
        todayAppointments: 12,
        services: 24,
        galleryImages: 48,
      });

      setRecentActivity([
        {
          id: "1",
          type: "appointment",
          message: "New appointment scheduled",
          time: "10 minutes ago",
          status: "success",
        },
        {
          id: "2",
          type: "service",
          message: "Service updated: X-Ray",
          time: "2 hours ago",
          status: "success",
        },
        {
          id: "3",
          type: "gallery",
          message: "New gallery images uploaded",
          time: "1 day ago",
          status: "success",
        },
        {
          id: "4",
          type: "appointment",
          message: "Appointment rescheduled",
          time: "2 days ago",
          status: "warning",
        },
      ]);

      setUpcomingAppointments([
        {
          id: "1",
          patientName: "John Doe",
          service: "General Checkup",
          time: "9:00 AM",
          date: "Today",
          phone: "(555) 123-4567",
        },
        {
          id: "2",
          patientName: "Jane Smith",
          service: "Dental Cleaning",
          time: "10:30 AM",
          date: "Today",
          phone: "(555) 234-5678",
        },
        {
          id: "3",
          patientName: "Robert Johnson",
          service: "Blood Test",
          time: "1:15 PM",
          date: "Today",
          phone: "(555) 345-6789",
        },
        {
          id: "4",
          patientName: "Emily Davis",
          service: "X-Ray",
          time: "9:45 AM",
          date: "Tomorrow",
          phone: "(555) 456-7890",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user, fetchDashboardData]);

  // Function to handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString === "Today" || dateString === "Tomorrow") {
      return dateString;
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Head>
        <title>Admin Dashboard | Purna Chandra Diagnostic Center</title>
        <meta name="description" content="Admin dashboard for medical website management" />
      </Head>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600 hidden md:inline-block">
              Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
            </span>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          
          <Link
            href="/admin/settings"
            className="flex items-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-center">
          <X size={20} className="text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {isLoading ? (
        // Enhanced loading state with consistent style
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-32 animate-pulse">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 bg-gray-200 mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Stats cards with enhanced styling
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<Calendar size={24} />}
            color="bg-gradient-to-br from-blue-600 to-blue-700"
          />
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={<Clock size={24} />}
            color="bg-gradient-to-br from-green-600 to-green-700"
          />
          <StatCard
            title="Services"
            value={stats.services}
            icon={<FileText size={24} />}
            color="bg-gradient-to-br from-indigo-600 to-indigo-700"
          />
          <StatCard
            title="Gallery Images"
            value={stats.galleryImages}
            icon={<Image size={24} />}
            color="bg-gradient-to-br from-amber-600 to-amber-700"
          />
        </div>
      )}

      {/* Quick Actions with enhanced styling */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            title="Staff Management"
            description="Manage medical and administrative staff"
            icon={<Users size={24} />}
            href="/admin/staffs" 
          />
          <ActionCard
            title="Gallery Management"
            description="Update your medical center's photo gallery"
            icon={<Image size={24} />}
            href="/admin/gallery" 
          />
        </div>
      </div>

      {/* Two column layout with improved styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity with enhanced styling */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Last 48 hours
            </span>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Clock size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentActivity.map((item) => (
                  <li key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start group">
                    <span
                      className={`
                      mr-3 mt-1 flex-shrink-0
                      ${
                        item.status === "success"
                          ? "text-green-500"
                          : item.status === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                      }
                    `}
                    >
                      {item.status === "success" ? (
                        <CheckCircle size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {item.message}
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Upcoming Appointments with enhanced styling */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Upcoming Appointments</h2>
            <Link 
              href="/admin/appointments" 
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
            >
              View all
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-3 first:pt-0 last:pb-0 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                      <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 border border-blue-100">
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock size={14} className="mr-1 text-indigo-400" />
                        {appointment.time}
                      </p>
                    </div>
                    <Link
                      href={`/admin/appointments/${appointment.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-800 mt-2 hidden group-hover:block"
                    >
                      View details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}