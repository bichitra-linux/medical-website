import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/admin-layout";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash,
  Check,
  X,
  UploadCloud,
  User,
  AlertCircle,
  Briefcase,
  Award,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { debounce } from "lodash";

// Define types
type StaffRole =
  | "select_role"
  // Executive/Management
  | "managing_director"
  | "finance_director"
  | "store_manager"
  // Medical Doctors & Specialists
  | "general_physician"
  | "pathologist"
  | "dermatologist"
  | "anesthetist"
  | "radiologist"
  | "cardiologist"
  | "psychiatrist"
  | "orthopedic"
  | "Orthodontics"
  // Allied Health Professionals
  | "physiotherapist"
  | "pharmacist"
  | "nurse"
  // Laboratory & Technical Staff
  | "lab_staff"
  | "bmlt"
  | "cmlt"
  | "cma"
  | "s_ha"
  | "technician"
  | "radiographer"
  // Administrative & Support
  | "admin"
  | "documentation"
  | "reporting_officer"
  | "reception"
  | "marketing"
  | "cleaner";
interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  specialization?: string;
  qualifications: string;
  nmcNumber: string; // Add this field
  experience: string;
  bio: string;
  contactEmail: string;
  contactPhone?: string;
  isActive: boolean;
  image?: string;
  joinDate: string;
  updatedAt: string;
}

interface StaffFormData {
  name: string;
  role: StaffRole;
  specialization: string;
  qualifications: string;
  nmcNumber: string; // Add this field
  experience: string;
  bio: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  image: string;
}

export default function StaffsPage() {
  // State management
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"all" | StaffRole>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const router = useRouter();

  // Form state
  const [staffForm, setStaffForm] = useState<StaffFormData>({
    name: "",
    role: "select_role",
    specialization: "",
    qualifications: "",
    nmcNumber: "", // Add this field
    experience: "",
    bio: "",
    contactEmail: "",
    contactPhone: "",
    isActive: true,
    image: "",
  });

  // Load staff data on component mount
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Filter staff when search query or role filter changes
  useEffect(() => {
    filterStaff();
  }, [searchQuery, selectedRole, staffList]);

  // Fetch staff data from API
  const fetchStaffData = async () => {
    try {
      setIsLoading(true);

      // In a real app, you would fetch data from your API
      // For demo purposes, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockStaffData: Staff[] = [
        {
          id: "1",
          name: "Dr. Arun Kumar",
          role: "cardiologist", // Changed from "doctor" to specific role
          specialization: "Interventional Cardiology",
          qualifications: "MBBS, MD Cardiology",
          nmcNumber: "NMC123456",
          experience: "10 years",
          bio: "Dr. Kumar is a specialist in cardiovascular diseases with extensive experience in interventional cardiology.",
          contactEmail: "arun.kumar@medical.com",
          contactPhone: "977-01-4521345",
          isActive: true,
          image: "/images/staff/doctor1.jpg",
          joinDate: "2020-05-15",
          updatedAt: "2023-02-10",
        },
        {
          id: "2",
          name: "Sita Sharma",
          role: "nurse",
          qualifications: "BSc Nursing",
          specialization: "Critical Care",
          nmcNumber: "NMC654321",
          experience: "5 years",
          bio: "Sita is an experienced nurse specializing in critical care and emergency medicine.",
          contactEmail: "sita.sharma@medical.com",
          contactPhone: "977-01-4521346",
          isActive: true,
          joinDate: "2021-03-10",
          updatedAt: "2023-01-05",
        },
        {
          id: "3",
          name: "Ram Shrestha",
          role: "admin", // This is valid in StaffRole
          qualifications: "MBA Healthcare Management",
          specialization: "Operations Management",
          nmcNumber: "NMC789012",
          experience: "8 years",
          bio: "Ram handles administrative operations and ensures the smooth functioning of the medical center.",
          contactEmail: "ram.shrestha@medical.com",
          contactPhone: "977-01-4521347",
          isActive: true,
          image: "/images/staff/admin1.jpg",
          joinDate: "2019-11-20",
          updatedAt: "2022-12-15",
        },
        {
          id: "4",
          name: "Anita Thapa",
          role: "technician", // This is valid in StaffRole
          qualifications: "Diploma in Medical Laboratory Technology",
          specialization: "Radiology",
          nmcNumber: "NMC345678",
          experience: "4 years",
          bio: "Anita is skilled in operating various diagnostic equipment and conducting laboratory tests.",
          contactEmail: "anita.thapa@medical.com",
          isActive: false,
          joinDate: "2021-06-05",
          updatedAt: "2023-01-20",
        },
      ];

      setStaffList(mockStaffData);
      setFilteredStaff(mockStaffData);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch staff data:", err);
      setError("Failed to load staff data. Please try again.");
      setIsLoading(false);
    }
  };

  // Filter staff based on search query and selected role
  const filterStaff = () => {
    let filtered = [...staffList];

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((staff) => staff.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(query) ||
          staff.qualifications.toLowerCase().includes(query) ||
          (staff.specialization && staff.specialization.toLowerCase().includes(query)) ||
          staff.bio.toLowerCase().includes(query)
      );
    }

    setFilteredStaff(filtered);
  };

  // Create debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setStaffForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setStaffForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In a real app, you'd upload to your backend or cloud storage
      // For demo, we'll simulate a delay and use a local URL
      await new Promise((resolve) => setTimeout(resolve, 1500));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create a local URL for the image (in a real app, this would be the URL from your server)
      const imageUrl = URL.createObjectURL(file);

      setStaffForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Open form to add new staff
  const handleAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({
      name: "",
      role: "select_role",
      specialization: "",
      qualifications: "",
      nmcNumber: "", // Add this field
      experience: "",
      bio: "",
      contactEmail: "",
      contactPhone: "",
      isActive: true,
      image: "",
    });
    setShowStaffForm(true);
  };

  // Open form to edit existing staff
  const handleEditStaff = (staff: Staff) => {
    setEditingStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      specialization: staff.specialization || "",
      qualifications: staff.qualifications,
      nmcNumber: staff.nmcNumber, // Add this field
      experience: staff.experience,
      bio: staff.bio,
      contactEmail: staff.contactEmail,
      contactPhone: staff.contactPhone || "",
      isActive: staff.isActive,
      image: staff.image || "",
    });
    setShowStaffForm(true);
  };

  const isDoctorRole = (role: StaffRole): boolean => {
    return [
      "general_physician",
      "pathologist",
      "dermatologist",
      "anesthetist",
      "radiologist",
      "cardiologist",
      "psychiatrist",
      "orthopedic",
      "Orthodontics",
    ].includes(role);
  };

  // Handle form submission (create or update staff)
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!staffForm.name.trim()) {
      setError("Staff name is required");
      return;
    }

    if (!staffForm.qualifications.trim()) {
      setError("Qualifications are required");
      return;
    }

    if (!staffForm.bio.trim()) {
      setError("Bio is required");
      return;
    }

    if (!staffForm.contactEmail.trim()) {
      setError("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(staffForm.contactEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // NMC validation only for doctor roles
    if (isDoctorRole(staffForm.role) && !staffForm.nmcNumber.trim()) {
      setError("NMC number is required for doctors");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingStaff) {
        // Update existing staff
        const updatedStaff: Staff = {
          ...editingStaff,
          name: staffForm.name,
          role: staffForm.role,
          specialization: isDoctorRole(staffForm.role) ? staffForm.specialization : undefined,
          qualifications: staffForm.qualifications,
          nmcNumber: isDoctorRole(staffForm.role) ? staffForm.nmcNumber : "", // Only include for doctors
          experience: staffForm.experience,
          bio: staffForm.bio,
          contactEmail: staffForm.contactEmail,
          contactPhone: staffForm.contactPhone || undefined,
          isActive: staffForm.isActive,
          image: staffForm.image || undefined,
          updatedAt: new Date().toISOString().split("T")[0],
        };

        // Update staff in list
        setStaffList((prev) =>
          prev.map((staff) => (staff.id === updatedStaff.id ? updatedStaff : staff))
        );

        setSuccess(`${updatedStaff.name} has been updated successfully`);
      } else {
        // Create new staff
        const newStaff: Staff = {
          id: Date.now().toString(), // In real app, this would come from the server
          name: staffForm.name,
          role: staffForm.role,
          specialization: isDoctorRole(staffForm.role) ? staffForm.specialization : undefined,
          qualifications: staffForm.qualifications,
          nmcNumber: isDoctorRole(staffForm.role) ? staffForm.nmcNumber : "", // Only include for doctors
          experience: staffForm.experience,
          bio: staffForm.bio,
          contactEmail: staffForm.contactEmail,
          contactPhone: staffForm.contactPhone || undefined,
          isActive: staffForm.isActive,
          image: staffForm.image || undefined,
          joinDate: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };

        // Add new staff to list
        setStaffList((prev) => [...prev, newStaff]);

        setSuccess(`${newStaff.name} has been added successfully`);
      }

      // Close form after successful submission
      setShowStaffForm(false);

      // Auto-hide success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error("Failed to save staff:", err);
      setError("Failed to save staff. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Open delete confirmation modal
  const handleDeleteConfirm = (staff: Staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  // Handle staff deletion
  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove staff from list
      setStaffList((prev) => prev.filter((staff) => staff.id !== staffToDelete.id));

      setSuccess(`${staffToDelete.name} has been deleted successfully`);

      // Close modal and reset state
      setShowDeleteModal(false);
      setStaffToDelete(null);

      // Auto-hide success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error("Failed to delete staff:", err);
      setError("Failed to delete staff. Please try again.");
    }
  };

  // Handle toggling staff active status
  const handleToggleStatus = async (staff: Staff) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400));

      const updatedStaff: Staff = {
        ...staff,
        isActive: !staff.isActive,
        updatedAt: new Date().toISOString().split("T")[0],
      };

      // Update staff in list
      setStaffList((prev) =>
        prev.map((item) => (item.id === updatedStaff.id ? updatedStaff : item))
      );

      setSuccess(
        `${updatedStaff.name} has been ${
          updatedStaff.isActive ? "activated" : "deactivated"
        } successfully`
      );

      // Auto-hide success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error("Failed to update staff status:", err);
      setError("Failed to update staff status. Please try again.");
    }
  };

  // Get display text for role
  const getRoleDisplayText = (role: StaffRole): string => {
    const roleMap: Record<StaffRole, string> = {
      // Default placeholder
      select_role: "Select Role",

      // Executive/Management
      managing_director: "Managing Director",
      finance_director: "Finance Director",
      store_manager: "Store Manager",

      // Medical Doctors & Specialists
      general_physician: "General Physician",
      pathologist: "Pathologist",
      dermatologist: "Dermatologist",
      anesthetist: "Anesthetist",
      radiologist: "Radiologist",
      cardiologist: "Cardiologist",
      psychiatrist: "Psychiatrist",
      orthopedic: "Orthopedic Specialist",
      Orthodontics: "Orthodontist",

      // Allied Health Professionals
      physiotherapist: "Physiotherapist",
      pharmacist: "Pharmacist",
      nurse: "Nurse",

      // Laboratory & Technical Staff
      lab_staff: "Laboratory Staff",
      bmlt: "BMLT",
      cmlt: "CMLT",
      cma: "CMA",
      s_ha: "S.Ha",
      technician: "Technician",
      radiographer: "Radiographer",

      // Administrative & Support
      admin: "Administrative Staff",
      documentation: "Documentation Officer",
      reporting_officer: "Reporting Officer",
      reception: "Receptionist",
      marketing: "Marketing Executive",
      cleaner: "Cleaner",
    };

    return roleMap[role] || role.replace(/_/g, " ");
  };

  return (
    <>
      <Head>
        <title>Staff Management | Medical Admin</title>
      </Head>

      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Role filter - enhanced styling */}
            <div className="relative flex-grow sm:flex-grow-0 sm:max-w-[240px]">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="appearance-none pl-10 pr-9 py-2.5 w-full border border-gray-200 bg-white/50 text-gray-600 backdrop-blur-sm rounded-xl shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200"
                aria-label="Filter by role"
              >
                <option value="all">All Staff</option>

                <optgroup label="Executive/Management">
                  <option value="managing_director">Managing Director</option>
                  <option value="finance_director">Finance Director</option>
                  <option value="store_manager">Store Manager</option>
                </optgroup>

                <optgroup label="Medical Doctors & Specialists">
                  <option value="general_physician">General Physician</option>
                  <option value="pathologist">Pathologist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="anesthetist">Anesthetist</option>
                  <option value="radiologist">Radiologist</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="psychiatrist">Psychiatrist</option>
                  <option value="orthopedic">Orthopedic</option>
                  <option value="Orthodontics">Orthodontics</option>
                </optgroup>

                <optgroup label="Allied Health Professionals">
                  <option value="physiotherapist">Physiotherapist</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="nurse">Nurse</option>
                </optgroup>

                <optgroup label="Laboratory & Technical Staff">
                  <option value="lab_staff">Laboratory Staff</option>
                  <option value="bmlt">BMLT</option>
                  <option value="cmlt">CMLT</option>
                  <option value="cma">CMA</option>
                  <option value="s_ha">S.Ha</option>
                  <option value="technician">Technician</option>
                  <option value="radiographer">Radiographer</option>
                </optgroup>

                <optgroup label="Administrative & Support">
                  <option value="admin">Administrative</option>
                  <option value="documentation">Documentation</option>
                  <option value="reporting_officer">Reporting Officer</option>
                  <option value="reception">Reception</option>
                  <option value="marketing">Marketing</option>
                  <option value="cleaner">Cleaner</option>
                </optgroup>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Filter size={16} className="text-indigo-600/70" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Add staff button - enhanced styling */}
            <button
              onClick={handleAddStaff}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-2.5 px-5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm"
            >
              <div className="bg-white/20 rounded-full p-0.5 mr-2">
                <PlusCircle size={18} />
              </div>
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search staff..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Staff list */}
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStaff.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex justify-center">
              <User size={60} className="text-gray-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-700">No staff found</h3>
            <p className="mt-2 text-gray-500">
              {searchQuery || selectedRole !== "all"
                ? "No staff match your current filters. Try adjusting your search or filter."
                : "Get started by adding your first staff member."}
            </p>
            {!searchQuery && selectedRole === "all" && (
              <button
                onClick={handleAddStaff}
                className="mt-4 text-blue-600 font-medium hover:text-blue-800"
              >
                Add Staff Member
              </button>
            )}
          </div>
        ) : (
          // Staff list
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className={`bg-white rounded-lg shadow border overflow-hidden ${
                  !staff.isActive ? "opacity-70" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Staff image - FIXED TO PREVENT INFINITE LOOP */}
                  <div className="w-full sm:w-1/3 bg-blue-50">
                    {staff.image ? (
                      <div className="aspect-w-4 aspect-h-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={staff.image}
                          alt={staff.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Remove the error handler to prevent infinite loop
                            e.currentTarget.onerror = null;

                            // Use SVG data URI directly instead of another image file
                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23bfdbfe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3Cpath d='M16.5 17.5a4.5 4.5 0 0 0-9 0'%3E%3C/path%3E%3C/svg%3E`;

                            // Add a class for proper padding around the SVG
                            e.currentTarget.classList.add("p-6");
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full py-12">
                        <User size={80} className="text-blue-200" />
                      </div>
                    )}
                  </div>

                  {/* Staff info */}
                  <div className="w-full sm:w-2/3 p-5">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          {staff.name}
                          {!staff.isActive && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full border border-gray-200">
                              Inactive
                            </span>
                          )}
                        </h3>
                        <span className="inline-block mt-1 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                          {getRoleDisplayText(staff.role)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleToggleStatus(staff)}
                          className={`p-2 rounded-full ${
                            staff.isActive
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-50"
                          }`}
                          title={staff.isActive ? "Deactivate" : "Activate"}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleEditStaff(staff)}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(staff)}
                          className="p-2 rounded-full text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Staff details */}
                    <div className="mt-3 space-y-2">
                      {staff.specialization && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Specialization:</span>{" "}
                          {staff.specialization}
                        </p>
                      )}

                      <p className="text-sm flex items-center text-gray-600">
                        <Award size={14} className="mr-1.5 text-gray-400" />
                        {staff.qualifications}
                      </p>

                      {staff.nmcNumber && isDoctorRole(staff.role) && (
                        <p className="text-sm flex items-center text-gray-600">
                          <Award size={14} className="mr-1.5 text-gray-400" />
                          NMC: {staff.nmcNumber}
                        </p>
                      )}

                      {staff.experience && (
                        <p className="text-sm flex items-center text-gray-600">
                          <Clock size={14} className="mr-1.5 text-gray-400" />
                          {staff.experience}
                        </p>
                      )}

                      <p className="text-sm flex items-center text-gray-600">
                        <Mail size={14} className="mr-1.5 text-gray-400" />
                        {staff.contactEmail}
                      </p>

                      {staff.contactPhone && (
                        <p className="text-sm flex items-center text-gray-600">
                          <Phone size={14} className="mr-1.5 text-gray-400" />
                          {staff.contactPhone}
                        </p>
                      )}
                    </div>

                    {/* Bio */}
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{staff.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Staff form modal */}
      {showStaffForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Form header - Enhanced with gradient */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <div className="bg-indigo-100 rounded-full p-1.5 mr-3">
                  {editingStaff ? (
                    <Edit size={20} className="text-indigo-600" />
                  ) : (
                    <PlusCircle size={20} className="text-indigo-600" />
                  )}
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-900">
                  {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                </span>
              </h2>
              <button
                onClick={() => setShowStaffForm(false)}
                className="text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <X size={22} />
              </button>
            </div>

            {/* Staff form - Enhanced design */}
            <form onSubmit={handleStaffSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Basic Info Section */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-0.5 w-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                    <div className="h-0.5 flex-1 bg-gray-100 rounded-full"></div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={staffForm.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase size={16} className="text-indigo-600/70" />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={staffForm.role}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600 appearance-none"
                      required
                    >
                      <option value="select_role" disabled>
                        Select Role
                      </option>

                      <optgroup label="Executive/Management">
                        <option value="managing_director">Managing Director</option>
                        <option value="finance_director">Finance Director</option>
                        <option value="store_manager">Store Manager</option>
                      </optgroup>

                      <optgroup label="Medical Doctors & Specialists">
                        <option value="general_physician">General Physician</option>
                        <option value="pathologist">Pathologist</option>
                        <option value="dermatologist">Dermatologist</option>
                        <option value="anesthetist">Anesthetist</option>
                        <option value="radiologist">Radiologist</option>
                        <option value="cardiologist">Cardiologist</option>
                        <option value="psychiatrist">Psychiatrist</option>
                        <option value="orthopedic">Orthopedic</option>
                        <option value="Orthodontics">Orthodontics</option>
                      </optgroup>

                      <optgroup label="Allied Health Professionals">
                        <option value="physiotherapist">Physiotherapist</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="nurse">Nurse</option>
                      </optgroup>

                      <optgroup label="Laboratory & Technical Staff">
                        <option value="lab_staff">Laboratory Staff</option>
                        <option value="bmlt">BMLT</option>
                        <option value="cmlt">CMLT</option>
                        <option value="cma">CMA</option>
                        <option value="s_ha">S.Ha</option>
                        <option value="technician">Technician</option>
                        <option value="radiographer">Radiographer</option>
                      </optgroup>

                      <optgroup label="Administrative & Support">
                        <option value="admin">Administrative Staff</option>
                        <option value="documentation">Documentation Officer</option>
                        <option value="reporting_officer">Reporting Officer</option>
                        <option value="reception">Receptionist</option>
                        <option value="marketing">Marketing Executive</option>
                        <option value="cleaner">Cleaner</option>
                      </optgroup>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-500"
                      >
                        <path
                          d="M2.5 4.5L6 8L9.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Specialization (only for doctors) */}
                {(staffForm.role === "general_physician" ||
                  staffForm.role === "pathologist" ||
                  staffForm.role === "dermatologist" ||
                  staffForm.role === "anesthetist" ||
                  staffForm.role === "radiologist" ||
                  staffForm.role === "cardiologist" ||
                  staffForm.role === "psychiatrist" ||
                  staffForm.role === "orthopedic" ||
                  staffForm.role === "Orthodontics") && (
                  <div>
                    <label
                      htmlFor="specialization"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={staffForm.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g. Cardiology, Neurology"
                      className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600 placeholder-gray-400"
                    />
                  </div>
                )}

                {/* Qualifications */}
                <div
                  className={
                    // Change from a check for "doctor" to a check for any medical specialist role
                    [
                      "general_physician",
                      "pathologist",
                      "dermatologist",
                      "anesthetist",
                      "radiologist",
                      "cardiologist",
                      "psychiatrist",
                      "orthopedic",
                      "Orthodontics",
                    ].includes(staffForm.role)
                      ? ""
                      : "md:col-span-2"
                  }
                >
                  {" "}
                  <label
                    htmlFor="qualifications"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Qualifications <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="qualifications"
                    name="qualifications"
                    type="text"
                    value={staffForm.qualifications}
                    onChange={handleInputChange}
                    placeholder="e.g. MBBS, PhD, BSc Nursing"
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600 placeholder-gray-400"
                    required
                  />
                </div>
                {/* Nepal Medical Council Number - NEW FIELD */}
                {isDoctorRole(staffForm.role) && (
                  <div>
                    <label
                      htmlFor="nmcNumber"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Nepal Medical Council No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nmcNumber"
                      name="nmcNumber"
                      type="text"
                      value={staffForm.nmcNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 12345-A"
                      className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600 placeholder-gray-400"
                      required
                    />
                  </div>
                )}

                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="text"
                    value={staffForm.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 5 years"
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600 placeholder-gray-400"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-600 mb-1">
                    Professional Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={staffForm.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                    required
                  ></textarea>
                </div>

                {/* Contact Section */}
                <div className="md:col-span-2 pt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-0.5 w-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                    <div className="h-0.5 flex-1 bg-gray-100 rounded-full"></div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-indigo-600/70" />
                    </div>
                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={staffForm.contactEmail}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-indigo-600/70" />
                    </div>
                    <input
                      id="contactPhone"
                      name="contactPhone"
                      type="text"
                      value={staffForm.contactPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. 977-01-4521345"
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Image Section */}
                <div className="md:col-span-2 pt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-0.5 w-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Profile Image</h3>
                    <div className="h-0.5 flex-1 bg-gray-100 rounded-full"></div>
                  </div>
                </div>

                {/* Image upload */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Upload Image
                    </label>
                    <label className="cursor-pointer block">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-lg p-6 bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
                        <UploadCloud size={32} className="text-indigo-500 mb-2" />
                        <span className="text-sm text-gray-600 mb-1">Click to upload</span>
                        <span className="text-xs text-gray-500">JPG, PNG, WebP (max 2MB)</span>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>

                    {/* Upload progress */}
                    {uploadProgress > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-right">
                          {uploadProgress < 100 ? `${uploadProgress}% uploaded` : "Upload complete"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Image preview - FIXED TO PREVENT INFINITE LOOP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Image Preview
                    </label>
                    <div className="border border-gray-300 rounded-lg bg-gray-50 h-[160px] flex items-center justify-center overflow-hidden">
                      {staffForm.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={staffForm.image}
                          alt="Staff preview"
                          className="h-full object-cover"
                          onError={(e) => {
                            // Remove the error handler to prevent infinite loop
                            e.currentTarget.onerror = null;

                            // Use SVG data URI directly instead of another image file
                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3Cpath d='M16.5 17.5a4.5 4.5 0 0 0-9 0'%3E%3C/path%3E%3C/svg%3E`;

                            // Add padding for better appearance
                            e.currentTarget.classList.add("p-4");
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <User size={48} className="text-indigo-200 mb-2" />
                          <span className="text-xs text-gray-600">No image selected</span>
                        </div>
                      )}
                    </div>

                    {/* Remove image button */}
                    {staffForm.image && (
                      <button
                        type="button"
                        className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                        onClick={() => setStaffForm((prev) => ({ ...prev, image: "" }))}
                      >
                        <Trash size={14} className="mr-1" />
                        Remove image
                      </button>
                    )}
                  </div>
                </div>

                {/* Active status */}
                <div className="md:col-span-2 mt-4">
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center h-5">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={staffForm.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isActive" className="font-medium text-gray-700">
                        Active Staff Member
                      </label>
                      <p className="text-gray-600">
                        Inactive staff will not be shown on the website
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowStaffForm(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center transition-colors"
                >
                  {isSaving && (
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
                  )}
                  {isSaving ? "Saving..." : editingStaff ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal - Enhanced design */}
      {showDeleteModal && staffToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            {/* Modal header with gradient */}
            <div className="bg-gradient-to-r from-red-50 to-white p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <div className="bg-red-100 rounded-full p-1.5 mr-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <span>Delete Staff Member</span>
              </h3>
            </div>

            <div className="p-6">
              <div className="text-gray-600">
                <p className="mb-2">Are you sure you want to delete this staff member?</p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="font-medium text-gray-800 block mb-1">{staffToDelete.name}</span>
                  <span className="text-sm text-gray-600 block">
                    {getRoleDisplayText(staffToDelete.role)}
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">
                    Member since {new Date(staffToDelete.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-4 text-sm text-red-600 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
                  This action cannot be undone. All data associated with this staff member will be
                  permanently deleted.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setStaffToDelete(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStaff}
                  className="px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                >
                  <Trash size={16} className="mr-1.5" />
                  Delete Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
