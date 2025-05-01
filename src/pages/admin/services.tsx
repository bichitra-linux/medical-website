import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "@/components/layout/admin-layout";
import { Plus, Edit, Trash, Check, X, Filter, Clock, DollarSign, Tag } from "lucide-react";

// Define types that align with the user-facing services page
type ServiceCategory = "diagnostic" | "consultation" | "specialist" | "laboratory";

// Complete service type with all necessary fields
type Service = {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: ServiceCategory;
  duration: string; // e.g., "30 min", "1 hour"
  isPopular: boolean;
  isActive: boolean;
  image?: string; // Optional image path
  createdAt: string;
  updatedAt: string;
};

// Type definition for services data structure
type ServicesData = {
  [key in ServiceCategory]: Service[];
};

// Option 1: Define the props interface for NPRSymbol
interface NPRSymbolProps {
  size?: number;
  className?: string;
}

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState<ServicesData>({
    diagnostic: [],
    consultation: [],
    specialist: [],
    laboratory: [],
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
    image: string;
  }>({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    category: "diagnostic",
    duration: "30 min",
    isPopular: false,
    isActive: true,
    image: "",
  });

  // Load services data on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call to fetch services

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data that follows the structure needed by the user view
        const mockServicesData: ServicesData = {
          diagnostic: [
            {
              id: 1,
              name: "General Health Checkup",
              description:
                "Comprehensive health assessment including blood work, vital signs, and consultation with a physician.",
              shortDescription: "Complete physical examination and consultation",
              price: 150.0,
              category: "diagnostic",
              duration: "1 hour",
              isPopular: true,
              isActive: true,
              image: "/images/services/health-checkup.jpg",
              createdAt: "2023-01-15",
              updatedAt: "2023-04-10",
            },
            {
              id: 2,
              name: "X-Ray Imaging",
              description:
                "Digital X-ray imaging services for diagnosis of bone fractures, joint issues, and chest conditions.",
              shortDescription: "Digital X-ray for bone and chest diagnosis",
              price: 200.0,
              category: "diagnostic",
              duration: "30 min",
              isPopular: true,
              isActive: true,
              image: "/images/services/xray.jpg",
              createdAt: "2023-01-18",
              updatedAt: "2023-04-10",
            },
          ],
          consultation: [
            {
              id: 3,
              name: "Primary Care Consultation",
              description:
                "One-on-one consultation with a primary care physician for general health concerns and preventive care.",
              shortDescription: "Meet with a primary care doctor",
              price: 100.0,
              category: "consultation",
              duration: "45 min",
              isPopular: true,
              isActive: true,
              image: "/images/services/primary-care.jpg",
              createdAt: "2023-01-20",
              updatedAt: "2023-03-05",
            },
          ],
          specialist: [
            {
              id: 4,
              name: "Cardiology Consultation",
              description:
                "Consultation with a cardiologist for heart-related concerns, including ECG and heart health assessment.",
              shortDescription: "Heart health assessment with specialist",
              price: 250.0,
              category: "specialist",
              duration: "1 hour",
              isPopular: false,
              isActive: true,
              image: "/images/services/cardiology.jpg",
              createdAt: "2023-02-01",
              updatedAt: "2023-02-01",
            },
          ],
          laboratory: [
            {
              id: 5,
              name: "Complete Blood Count",
              description:
                "Comprehensive blood test that evaluates overall health and detects various disorders including anemia, infection, and leukemia.",
              shortDescription: "Comprehensive blood analysis",
              price: 80.0,
              category: "laboratory",
              duration: "15 min",
              isPopular: true,
              isActive: true,
              image: "/images/services/blood-test.jpg",
              createdAt: "2023-02-10",
              updatedAt: "2023-03-15",
            },
            {
              id: 6,
              name: "Lipid Profile",
              description:
                "Blood test that measures lipids—fats and fatty substances used as a source of energy by your body.",
              shortDescription: "Cholesterol and triglycerides test",
              price: 60.0,
              category: "laboratory",
              duration: "15 min",
              isPopular: false,
              isActive: true,
              image: "/images/services/lipid-test.jpg",
              createdAt: "2023-02-15",
              updatedAt: "2023-02-15",
            },
          ],
        };

        setServicesData(mockServicesData);
        setIsLoading(false);
      } catch (err) {
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
    ];
  };

  // Filter services by category
  const filteredServices =
    selectedCategory === "all" ? getAllServices() : servicesData[selectedCategory];

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
      image: "",
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
      image: service.image || "",
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

  // Handle form submission (create or update)
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      if (!serviceForm.name.trim()) {
        throw new Error("Service name is required");
      }

      if (!serviceForm.description.trim()) {
        throw new Error("Service description is required");
      }

      if (!serviceForm.shortDescription.trim()) {
        throw new Error("Short description is required");
      }

      if (serviceForm.price <= 0) {
        throw new Error("Price must be greater than zero");
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingService) {
        // Update existing service
        const updatedService: Service = {
          ...editingService,
          ...serviceForm,
          updatedAt: new Date().toISOString().split("T")[0],
        };

        // Update state by replacing the service in the specific category
        setServicesData((prev) => ({
          ...prev,
          [updatedService.category]: prev[updatedService.category].map((service) =>
            service.id === updatedService.id ? updatedService : service
          ),
        }));

        setSuccess(`Service "${updatedService.name}" updated successfully!`);
      } else {
        // Create new service
        const newService: Service = {
          id: Math.floor(Math.random() * 10000), // In real app, this would come from the backend
          ...serviceForm,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };

        // Add to the correct category in the services data
        setServicesData((prev) => ({
          ...prev,
          [newService.category]: [...prev[newService.category], newService],
        }));

        setSuccess(`Service "${newService.name}" created successfully!`);
      }

      // Close form after successful submission
      setShowServiceForm(false);
      setEditingService(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save service. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggling service active status
  const handleToggleStatus = async (id: number, category: ServiceCategory) => {
    try {
      // Find the service
      const serviceToUpdate = servicesData[category].find((service) => service.id === id);

      if (!serviceToUpdate) {
        throw new Error("Service not found");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Toggle the status
      const updatedService: Service = {
        ...serviceToUpdate,
        isActive: !serviceToUpdate.isActive,
        updatedAt: new Date().toISOString().split("T")[0],
      };

      // Update state
      setServicesData((prev) => ({
        ...prev,
        [category]: prev[category].map((service) => (service.id === id ? updatedService : service)),
      }));

      setSuccess(
        `Service "${updatedService.name}" ${
          updatedService.isActive ? "activated" : "deactivated"
        } successfully!`
      );

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update service status. Please try again.");
      }
      // Auto-hide error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle deleting a service
  const handleDeleteService = async (id: number, category: ServiceCategory) => {
    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      try {
        // Simulate API call for deletion
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get service name before deletion for success message
        const serviceName =
          servicesData[category].find((service) => service.id === id)?.name || "Service";

        // Update state by removing the service from the specific category
        setServicesData((prev) => ({
          ...prev,
          [category]: prev[category].filter((service) => service.id !== id),
        }));

        setSuccess(`Service "${serviceName}" deleted successfully!`);

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete service. Please try again.");

        // Auto-hide error message after 3 seconds
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
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm min-w-[180px]"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="diagnostic">Diagnostic</option>
              <option value="consultation">Consultation</option>
              <option value="specialist">Specialist</option>
              <option value="laboratory">Laboratory</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleAddService}
            className="flex items-center px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium shadow-sm transition-all disabled:opacity-60 disabled:pointer-events-none text-sm"
          >
            <Plus size={18} className="mr-1" />
            Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
          <X size={20} className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6 flex items-center">
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
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="pl-9 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      required
                    >
                      <option value="diagnostic">Diagnostic</option>
                      <option value="consultation">Consultation</option>
                      <option value="specialist">Specialist</option>
                      <option value="laboratory">Laboratory</option>
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
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="pl-9 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="pl-9 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                ></textarea>
              </div>
            </div>

            {/* Image and Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Image Upload */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">Service Image</h3>
                <div>
                  <label
                    htmlFor="image-url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Image URL
                  </label>
                  <input
                    id="image-url"
                    type="text"
                    name="image"
                    value={serviceForm.image}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="/images/services/service-name.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Path to the service image (optional)</p>
                </div>

                {serviceForm.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm w-full h-48 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={serviceForm.image}
                        alt="Service preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

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
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isPopular" className="font-medium text-gray-700">
                        Mark as popular service
                      </label>
                      <p className="text-gray-500">
                        Popular services will be highlighted on the website
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
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
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
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
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
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Add your first service
          </button>
        </div>
      ) : (
        // Services table
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
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
                      !service.isActive ? "bg-gray-50/70" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        {service.image && (
                          <div className="flex-shrink-0 h-12 w-12 mr-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              className="h-12 w-12 rounded-md object-cover ring-1 ring-gray-200"
                              src={service.image}
                              alt={service.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        )}
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
