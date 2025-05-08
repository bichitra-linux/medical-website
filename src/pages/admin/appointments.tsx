import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Plus, Edit, Trash, X, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppointmentsSwitch } from "@/context/AppointmentSwitchContext";

// Type definition for appointments
type Appointment = {
  id: string;
  patientName: string;
  service: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  phone: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const {
    appointmentsEnabled,
    toggleAppointments,
    isLoading: isLoadingSwitch,
  } = useAppointmentsSwitch();

  // Load mock appointment data
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            patientName: "John Doe",
            service: "General Checkup",
            date: "2025-04-17",
            time: "09:00 AM",
            status: "scheduled",
            phone: "(555) 123-4567",
          },
          {
            id: "2",
            patientName: "Jane Smith",
            service: "Dental Cleaning",
            date: "2025-04-17",
            time: "10:30 AM",
            status: "scheduled",
            phone: "(555) 234-5678",
          },
          {
            id: "3",
            patientName: "Robert Johnson",
            service: "Blood Test",
            date: "2025-04-17",
            time: "01:15 PM",
            status: "completed",
            phone: "(555) 345-6789",
          },
          {
            id: "4",
            patientName: "Emily Davis",
            service: "X-Ray",
            date: "2025-04-18",
            time: "09:45 AM",
            status: "scheduled",
            phone: "(555) 456-7890",
          },
          {
            id: "5",
            patientName: "Michael Wilson",
            service: "Consultation",
            date: "2025-04-16",
            time: "03:30 PM",
            status: "cancelled",
            phone: "(555) 567-8901",
          },
        ];

        setAppointments(mockAppointments);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load appointments. Please try again.");
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Filter appointments by status
  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter((appointment) => appointment.status === statusFilter);

  // Handle marking an appointment as completed
  const handleMarkCompleted = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update state
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: "completed" } : appointment
        )
      );
    } catch (err) {
      setError("Failed to update appointment status. Please try again.");
    }
  };

  // Handle appointment cancellation
  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Update state
        setAppointments(
          appointments.map((appointment) =>
            appointment.id === id ? { ...appointment, status: "cancelled" } : appointment
          )
        );
      } catch (err) {
        setError("Failed to cancel appointment. Please try again.");
      }
    }
  };

  // Handle deleting an appointment
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Remove from state
        setAppointments(appointments.filter((appointment) => appointment.id !== id));
      } catch (err) {
        setError("Failed to delete appointment. Please try again.");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Head>
        <title>Appointments | Medical Admin</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl text-gray-600 font-bold">Appointments</h1>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 w-full md:w-auto">
          {/* Switch Card */}
          <div className="flex items-center bg-slate-50 border rounded-lg p-6 space-x-4 w-full md:w-auto">
            <Switch
              id="appointments-enabled-switch"
              checked={appointmentsEnabled}
              onCheckedChange={toggleAppointments}
              disabled={isLoadingSwitch}
              aria-label="Toggle appointment booking for visitors"
            />
            <Label
              htmlFor="appointments-enabled-switch"
              className="text-sm font-medium text-gray-700"
            >
              {appointmentsEnabled ? "Booking ON" : "Booking OFF"} for visitors
            </Label>
          </div>

          {/* Filter + New Button */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full md:w-auto bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by status"
              >
                <option value="all">All Appointments</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Calendar size={16} className="text-gray-500" />
              </div>
            </div>

            {/* New Appointment Button */}
            <Link
              href="/admin/appointments/new"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <Plus size={18} className="mr-2" />
              New Appointment
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
          <X size={20} className="mr-2" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="animate-pulse p-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-gray-100 rounded mb-2"></div>
            <div className="h-24 bg-gray-100 rounded mb-2"></div>
            <div className="h-24 bg-gray-100 rounded"></div>
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <Calendar size={48} className="text-gray-300" />
          </div>
          <p className="text-gray-500 mb-4">No appointments found</p>
          <Link
            href="/admin/appointments/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Schedule a new appointment
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                    <div className="text-sm text-gray-500">{appointment.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(appointment.date)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {appointment.status === "scheduled" && (
                        <>
                          <button
                            onClick={() => handleMarkCompleted(appointment.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                            title="Mark as completed"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                            title="Cancel appointment"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <Link
                        href={`/admin/appointments/${appointment.id}`}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
