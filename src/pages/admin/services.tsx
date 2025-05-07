import { useState, useEffect } from "react";
import Head from "next/head";
import { Plus, Edit, Trash, Check, X, Filter, Clock, Tag } from "lucide-react";
import { db } from "@/pages/api/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

// Define types that align with the user-facing services page
type ServiceCategory =
  | "diagnostic"
  | "consultation"
  | "specialist"
  | "laboratory"
  | "foreign_medical";

// Complete service type with all necessary fields
type Service = {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: ServiceCategory;
  duration: string; // e.g., "30 min", "1 hour"
  isPopular: boolean;
  isActive: boolean;
  image?: string; // Optional image path
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

// Type definition for services data structure
type ServicesData = {
  [key in ServiceCategory]: Service[];
};

// Define a reference to the Firestore services collection
const servicesCollectionRef = collection(db, "services");

// Option 1: Define the props interface for NPRSymbol
interface NPRSymbolProps {
  size?: number;
  className?: string;
}

function isServiceCategory(category: string): category is ServiceCategory {
  return [
    "diagnostic",
    "consultation",
    "specialist",
    "laboratory",
    "foreign_medical",
  ].includes(category);
}

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState<ServicesData>({
    diagnostic: [],
    consultation: [],
    specialist: [],
    laboratory: [],
    foreign_medical: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | ServiceCategory>("all");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for new/edit service
  const [serviceForm, setServiceForm] = useState<{
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    category: ServiceCategory;
    duration: string;
    isPopular: boolean;
    isActive: boolean;
  }>({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    category: "diagnostic",
    duration: "30 min",
    isPopular: false,
    isActive: true,
  });

  // Format Firestore timestamp for display
  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) return "N/A";
    return timestamp.toDate().toLocaleDateString();
  };
  // Load services data on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(servicesCollectionRef);
        const loadedServices: ServicesData = {
          diagnostic: [],
          consultation: [],
          specialist: [],
          laboratory: [],
          foreign_medical: [],
        };
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const service: Service = {
            id: doc.id,
            name: data.name,
            description: data.description,
            shortDescription: data.shortDescription,
            price: data.price,
            category: data.category as ServiceCategory,
            duration: data.duration,
            isPopular: data.isPopular,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
          loadedServices[service.category].push(service);
        });
        setServicesData(loadedServices);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading services:", err);
        setError("Failed to load services. Please try again.");
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  // Get all services as a flat array for filtering
  const getAllServices = (): Service[] => {
    return [
      ...servicesData.diagnostic,
      ...servicesData.consultation,
      ...servicesData.specialist,
      ...servicesData.laboratory,
      ...servicesData.foreign_medical,
    ];
  };

  // Filter services by category
  const filteredServices =
  selectedCategory === "all"
    ? getAllServices()
    : isServiceCategory(selectedCategory)
    ? servicesData[selectedCategory]
    : [];
  // Open form to add a new service
  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: "",
      description: "",
      shortDescription: "",
      price: 0,
      category: "diagnostic",
      duration: "30 min",
      isPopular: false,
      isActive: true,
    });
    setShowServiceForm(true);
  };

  // Open form to edit an existing service
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription,
      price: service.price,
      category: service.category,
      duration: service.duration,
      isPopular: service.isPopular,
      isActive: service.isActive,
    });
    setShowServiceForm(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setServiceForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "price") {
      // Ensure price is always a number
      setServiceForm((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setServiceForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // --- API CALL HELPERS ---
  async function apiCall(method: "POST" | "PUT" | "DELETE", body: any) {
    const res = await fetch("/api/admin/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "API error");
    }
    return await res.json();
  }

  // Handle form submission (create or update)
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (!serviceForm.name.trim()) throw new Error("Service name is required");
      if (!serviceForm.description.trim()) throw new Error("Service description is required");
      if (!serviceForm.shortDescription.trim()) throw new Error("Short description is required");
      if (serviceForm.price <= 0) throw new Error("Price must be greater than zero");

      // Handle popular service logic (same as before)
      if (serviceForm.isPopular) {
        const existingPopularService = getAllServices().find(
          (service) => service.isPopular && (!editingService || service.id !== editingService.id)
        );
        if (existingPopularService) {
          const confirmChange = confirm(
            `"${existingPopularService.name}" is already marked as popular. Only one service can be popular at a time. Do you want to make "${serviceForm.name}" the popular service instead?`
          );
          if (!confirmChange) {
            setServiceForm((prev) => ({
              ...prev,
              isPopular: false,
            }));
            setIsSaving(false);
            return;
          } else {
            // Unpopularize the existing popular service via API
            await apiCall("PUT", {
              id: existingPopularService.id,
              isPopular: false,
            });
            setServicesData((prev) => {
              const updated = { ...prev };
              updated[existingPopularService.category] = updated[
                existingPopularService.category
              ].map((service) =>
                service.id === existingPopularService.id
                  ? { ...service, isPopular: false }
                  : service
              );
              return updated;
            });
          }
        }
      }

      if (editingService) {
        // Update existing service via API
        const updated = await apiCall("PUT", {
          id: editingService.id,
          ...serviceForm,
        });
        setServicesData((prev) => {
          const newState = { ...prev };
          // Remove from old category if changed
          if (editingService.category !== updated.category) {
            newState[editingService.category] = newState[editingService.category].filter(
              (s) => s.id !== editingService.id
            );
          } else {
            newState[updated.category] = newState[updated.category].filter(
              (s: { id: any; }) => s.id !== updated.id
            );
          }
          newState[updated.category] = [...newState[updated.category], updated];
          return newState;
        });
        setSuccess(`Service "${updated.name}" updated successfully!`);
      } else {
        // Create new service via API
        const created = await apiCall("POST", serviceForm);
        setServicesData((prev) => ({
          ...prev,
          [created.category]: [...prev[created.category], created],
        }));
        setSuccess(`Service "${created.name}" created successfully!`);
      }
      setShowServiceForm(false);
      setEditingService(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggling service active status
  const handleToggleStatus = async (id: string, category: ServiceCategory) => {
    try {
      const serviceToUpdate = servicesData[category].find((service) => service.id === id);
      if (!serviceToUpdate) throw new Error("Service not found");
      const updated = await apiCall("PUT", {
        id,
        isActive: !serviceToUpdate.isActive,
      });
      setServicesData((prev) => ({
        ...prev,
        [category]: prev[category].map((service) =>
          service.id === id ? { ...service, isActive: updated.isActive, updatedAt: updated.updatedAt } : service
        ),
      }));
      setSuccess(
        `Service "${serviceToUpdate.name}" ${
          updated.isActive ? "activated" : "deactivated"
        } successfully!`
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service status.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle deleting a service
  const handleDeleteService = async (id: string, category: ServiceCategory) => {
    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      try {
        const serviceName =
          servicesData[category].find((service) => service.id === id)?.name || "Service";
        await apiCall("DELETE", { id });
        setServicesData((prev) => ({
          ...prev,
          [category]: prev[category].filter((service) => service.id !== id),
        }));
        setSuccess(`Service "${serviceName}" deleted successfully!`);
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete service.");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const NPRSymbol = ({ className = "" }: NPRSymbolProps) => (
    <span
      className="flex items-center justify-center text-gray-800 font-medium text-sm"
      style={{ lineHeight: 1 }}
    >
      रू
    </span>
  );
  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <>
      <Head>
        <title>Services Management | Medical Admin</title>
      </Head>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Services</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="appearance-none pl-10 pr-9 py-2.5 w-full border border-gray-200 bg-white/50 text-gray-600 backdrop-blur-sm rounded-xl shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="diagnostic">Diagnostic</option>
              <option value="consultation">Consultation</option>
              <option value="specialist">Specialist</option>
              <option value="laboratory">Laboratory</option>
              <option value="foreign_medical">Foreign Medical</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleAddService}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-2.5 px-5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm disabled:opacity-70"
          >
            <Plus size={18} className="mr-1" />
            Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
          <X size={20} className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 text-gray-600 border-green-500 p-4 rounded-md flex items-start">
          <Check size={20} className="mr-2" />
          {success}
        </div>
      )}

      {/* Service Form */}
      {showServiceForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mb-8 border border-gray-100 relative">
          {/* Form Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editingService
                  ? "Update the details of this service"
                  : "Fill in the details to create a new service"}
              </p>
            </div>
            <button
              onClick={() => setShowServiceForm(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSaving}
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleServiceSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="service-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="service-name"
                    type="text"
                    name="name"
                    value={serviceForm.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                    required
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="category"
                      name="category"
                      value={serviceForm.category}
                      onChange={handleInputChange}
                      className="appearance-none pl-10 pr-9 py-2.5 w-full border border-gray-200 bg-white/50 text-gray-600 backdrop-blur-sm rounded-xl shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200"
                      required
                    >
                      <option value="diagnostic">Diagnostic</option>
                      <option value="consultation">Consultation</option>
                      <option value="specialist">Specialist</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="foreign_medical">Foreign Medical</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="short-description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="short-description"
                    type="text"
                    name="shortDescription"
                    value={serviceForm.shortDescription}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <span className="mr-1">Brief description (max 100 characters)</span>
                    <span className="ml-auto">{serviceForm.shortDescription.length}/100</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (NPR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <NPRSymbol size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="price"
                      type="number"
                      name="price"
                      value={serviceForm.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="pl-19 w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="duration"
                      type="text"
                      name="duration"
                      value={serviceForm.duration}
                      onChange={handleInputChange}
                      className="pl-19 w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                      placeholder="e.g. 30 min, 1 hour"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Description Section */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Detailed Description</h3>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={serviceForm.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  required
                ></textarea>
              </div>
            </div>

            {/* Image and Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Service Options */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Service Options</h3>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isPopular"
                        name="isPopular"
                        type="checkbox"
                        checked={serviceForm.isPopular}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isPopular" className="font-medium text-gray-700">
                        Mark as popular service
                      </label>
                      <p className="text-gray-500">
                        Only one service can be marked as popular at a time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={serviceForm.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isActive" className="font-medium text-gray-700">
                        Service is active
                      </label>
                      <p className="text-gray-500">Inactive services will not be shown to users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="pt-5 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowServiceForm(false)}
                disabled={isSaving}
                className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-2.5 px-5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : editingService ? (
                  "Update Service"
                ) : (
                  "Create Service"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        // Loading state
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="animate-pulse p-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-gray-100 rounded mb-2"></div>
            <div className="h-24 bg-gray-100 rounded mb-2"></div>
            <div className="h-24 bg-gray-100 rounded"></div>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        // Empty state
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <Tag size={48} className="text-gray-300" />
          </div>
          <p className="text-gray-500 mb-4">No services found in this category</p>
          <button
            onClick={handleAddService}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-2.5 px-5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm disabled:opacity-70"
          >
            Add your first service
          </button>
        </div>
      ) : (
        // Services table
        <div className="bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className={`transition-colors hover:bg-gray-50/50 ${
                      !service.isActive
                        ? "bg-gray-50/70"
                        : service.isPopular
                        ? "bg-yellow-50/30"
                        : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex flex-wrap items-center gap-2 mb-1">
                          <span className="truncate max-w-[200px]">{service.name}</span>
                          {service.isPopular && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {service.shortDescription}
                        </div>
                        {service.duration && (
                          <div className="text-xs text-gray-500 flex items-center mt-1.5">
                            <Clock size={12} className="mr-1.5 text-gray-400" />
                            {service.duration}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(service.price)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          service.isActive
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-1 items-center">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.category)}
                          className={`p-1.5 rounded-full transition-colors ${
                            service.isActive
                              ? "text-green-600 hover:bg-green-50 hover:shadow-sm"
                              : "text-gray-400 hover:bg-gray-50 hover:shadow-sm"
                          }`}
                          title={service.isActive ? "Deactivate" : "Activate"}
                          aria-label={service.isActive ? "Deactivate service" : "Activate service"}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors hover:shadow-sm"
                          title="Edit service"
                          aria-label="Edit service"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id, service.category)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors hover:shadow-sm"
                          title="Delete service"
                          aria-label="Delete service"
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
        </div>
      )}
    </>
  );
}
