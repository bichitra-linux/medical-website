import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Image as ImageIcon,
  Upload,
  Trash,
  Plus,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

// Define category types
type Category = "facility" | "team" | "events";
type CategoryFilter = "all" | Category;

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  category: Category;
  uploadedAt?: string;
  publicId: string;
};

type GalleryData = {
  facility: GalleryImage[];
  team: GalleryImage[];
  events: GalleryImage[];
};

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState<GalleryData>({
    facility: [],
    team: [],
    events: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [newImage, setNewImage] = useState<{
    title: string;
    alt: string;
    category: Category;
  }>({
    title: "",
    alt: "",
    category: "facility", // Default to a valid category
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(12);
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Ensure category folders exist
  const ensureCategoryFolders = async (): Promise<void> => {
    try {
      console.log("Checking and creating category folders...");
      const folders = ["facility", "team", "events"];
      await Promise.all(
        folders.map(async (folder) => {
          const response = await fetch("/api/cloudinary/create-folder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folderPath: `gallery/${folder}` }),
          });
          const data = await response.json();
          if (!response.ok) {
            console.error(`Error with folder gallery/${folder}: ${data.message}`);
          } else {
            console.log(`Folder gallery/${folder} ${data.created ? "created" : "exists"}`);
          }
        })
      );
    } catch (error) {
      console.error("Error managing folders:", error);
      setError("Failed to set up folders.");
    }
  };

  // Reload gallery data
  const reloadGalleryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [facilityData, teamData, eventsData] = await Promise.all([
        fetchCloudinaryImages("facility"),
        fetchCloudinaryImages("team"),
        fetchCloudinaryImages("events"),
      ]);
      setGalleryData({
        facility: facilityData,
        team: teamData,
        events: eventsData,
      });
    } catch (err) {
      console.error("Error reloading gallery:", err);
      setError("Failed to reload gallery.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const loadGallery = async () => {
      await ensureCategoryFolders();
      await reloadGalleryData();
    };
    loadGallery();
  }, []);

  // Fetch images by category
  const fetchCloudinaryImages = async (category: Category): Promise<GalleryImage[]> => {
    try {
      const response = await fetch(`/api/cloudinary/list?folder=gallery/${category}`);
      if (!response.ok) throw new Error(`Failed to fetch ${category} images`);
      const data = await response.json();
      if (!data.resources || !Array.isArray(data.resources)) return [];
      return data.resources.map((resource: any) => ({
        id: resource.public_id,
        src: resource.secure_url,
        alt: resource.context?.alt || resource.public_id,
        title: resource.context?.caption || resource.public_id.split("/").pop(),
        width: resource.width,
        height: resource.height,
        category,
        uploadedAt: new Date(resource.created_at).toISOString().split("T")[0],
        publicId: resource.public_id,
      }));
    } catch (error) {
      console.error(`Error fetching ${category} images:`, error);
      return [];
    }
  };

  // Get all images for "all" filter
  const getAllImages = (): GalleryImage[] => {
    return [...galleryData.facility, ...galleryData.team, ...galleryData.events];
  };

  // Filter images
  const filteredImages =
    selectedCategory === "all" ? getAllImages() : galleryData[selectedCategory];

  // Handle delete
  const handleDelete = async (publicId: string, category: Category) => {
    if (confirm("Delete this image?")) {
      try {
        setError(null);
        const response = await fetch("/api/cloudinary/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
        if (!response.ok) throw new Error("Failed to delete image");
        await reloadGalleryData();
      } catch (err) {
        console.error("Error deleting image:", err);
        setError("Failed to delete image.");
      }
    }
  };

  // Handle file select
  const handleFileSelect = () => {
    const categoryToSet = selectedCategory !== "all" ? (selectedCategory as Category) : "facility";
    setNewImage({
      title: "",
      alt: "",
      category: categoryToSet,
    });
    setShowImageForm(true);
  };

  // Handle upload success
  const handleUploadSuccess = async (result: any) => {
    try {
      const imageInfo = result.info;
      const selectedCategory = newImage.category;
      console.log("Upload completed. Assigned category:", selectedCategory);

      const uploadedImage: GalleryImage = {
        id: imageInfo.public_id,
        src: imageInfo.secure_url,
        alt: newImage.alt || imageInfo.original_filename,
        title: newImage.title || imageInfo.original_filename,
        width: imageInfo.width,
        height: imageInfo.height,
        category: selectedCategory,
        uploadedAt: new Date().toISOString().split("T")[0],
        publicId: imageInfo.public_id,
      };

      await updateCloudinaryMetadata(imageInfo.public_id, {
        alt: uploadedImage.alt,
        title: uploadedImage.title,
        category: selectedCategory,
      });

      // Update local state immediately to reflect the new image
      setGalleryData((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], uploadedImage],
      }));

      setNewImage({
        title: "",
        alt: "",
        category: selectedCategory,
      });
      setShowImageForm(false);
      setIsUploading(false);
      // Full reload to ensure consistency with Cloudinary
      await reloadGalleryData();
    } catch (error) {
      console.error("Error handling upload:", error);
      setError("Failed to process image.");
      setIsUploading(false);
    }
  };

  // Update metadata
  const updateCloudinaryMetadata = async (
    publicId: string,
    metadata: { alt?: string; title?: string; category?: string }
  ) => {
    try {
      const response = await fetch("/api/cloudinary/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId,
          metadata: {
            alt: metadata.alt,
            caption: metadata.title,
            category: metadata.category,
          },
        }),
      });
      if (!response.ok) throw new Error("Metadata update failed");
      return await response.json();
    } catch (error) {
      console.error("Error updating metadata:", error);
      throw error;
    }
  };

  // Cancel upload
  const handleCancelUpload = () => {
    setNewImage({ title: "", alt: "", category: newImage.category });
    setShowImageForm(false);
  };

  // Sync form category with filter
  useEffect(() => {
    if (showImageForm && selectedCategory !== "all") {
      setNewImage((prev) => ({ ...prev, category: selectedCategory }));
    }
  }, [showImageForm, selectedCategory]);

  const paginateImages = (images: GalleryImage[]) => {
    const startIndex = (currentPage - 1) * imagesPerPage;
    return images.slice(startIndex, startIndex + imagesPerPage);
  };

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Handle viewing an image
  const handleViewImage = (image: GalleryImage) => {
    setActiveImage(image);
  };

  // Close image modal
  const handleCloseModal = () => {
    setActiveImage(null);
    setEditMode(false);
  };

  return (
    <>
      <Head>
        <title>Gallery Management | Medical Admin</title>
      </Head>

      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">Gallery Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {selectedCategory === "all"
                ? `Showing all images (${filteredImages.length})`
                : `Showing ${selectedCategory} images (${filteredImages.length})`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <label htmlFor="category-filter" className="sr-only">
                Filter by category
              </label>
              <div className="relative">
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
                  className="appearance-none pl-10 pr-9 py-2.5 w-full border border-gray-200 bg-white/50 text-gray-600 backdrop-blur-sm rounded-xl shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="facility">Facility</option>
                  <option value="team">Team</option>
                  <option value="events">Events</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronLeft size={16} className="text-gray-400 rotate-270" />
                </div>
              </div>
            </div>
            <button
              onClick={handleFileSelect}
              disabled={isUploading || showImageForm}
              className="flex items-center px-4 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg font-medium shadow-sm transition-all disabled:opacity-60 disabled:pointer-events-none text-sm"
            >
              {isUploading ? (
                <div className="flex items-center">
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
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <Plus size={16} className="mr-1.5" strokeWidth={2.5} />
                  <span>Add New Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
          <X size={20} className="mr-2" />
          {error}
        </div>
      )}

      {showImageForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 animate-fadeIn">
          <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-3">
            <h2 className="text-xl font-semibold text-gray-800">Add New Image</h2>
            <button
              onClick={handleCancelUpload}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-50"
              disabled={isUploading}
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl text-center flex-grow transition-all hover:border-blue-300">
                <CldUploadWidget
                  key={newImage.category}
                  uploadPreset="medical_gallery"
                  onSuccess={handleUploadSuccess}
                  options={{
                    sources: ["local", "url", "camera"],
                    multiple: false,
                    folder: `gallery/${newImage.category}`,
                    clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                    maxFileSize: 5000000,
                    showUploadMoreButton: false,
                    showAdvancedOptions: false,
                  }}
                  onQueuesStart={() => {
                    console.log("Starting upload to:", `gallery/${newImage.category}`);
                    setIsUploading(true);
                  }}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open()}
                      className="cursor-pointer hover:bg-blue-50/50 p-8 h-full flex flex-col items-center justify-center transition-all rounded-xl"
                    >
                      <Upload className="mx-auto h-14 w-14 text-blue-400 mb-3" />
                      <p className="font-medium text-blue-600 mb-2">
                        Click to select or drag and drop an image
                      </p>
                      <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  placeholder="Image title (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                <input
                  type="text"
                  value={newImage.alt}
                  onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-gray-600"
                  placeholder="Image description (optional)"
                />
                <p className="text-xs text-gray-500 mt-1.5">For accessibility</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={newImage.category}
                    onChange={(e) => {
                      console.log("Category selected:", e.target.value);
                      setNewImage({ ...newImage, category: e.target.value as Category });
                    }}
                    className="appearance-none pl-10 pr-9 py-2.5 w-full border border-gray-200 bg-white/50 text-gray-600 backdrop-blur-sm rounded-xl shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200"
                    required
                  >
                    <option value="facility">Facility</option>
                    <option value="team">Team</option>
                    <option value="events">Events</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronLeft size={16} className="text-gray-400 rotate-270" />
                  </div>
                </div>
                <div className="mt-4 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Currently uploading to:</strong> gallery/{newImage.category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <ImageIcon size={48} className="text-gray-300" />
          </div>
          <p className="text-gray-500 mb-4">No images found in this category</p>
          <button
            onClick={handleFileSelect}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Upload your first image
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginateImages(filteredImages).map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow overflow-hidden group transition-all hover:shadow-md"
              >
                <div
                  className="relative h-40 cursor-pointer"
                  onClick={() => handleViewImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(image.publicId, image.category);
                        }}
                        className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                        title="Delete image"
                        aria-label="Delete image"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{image.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 rounded-full px-2 py-0.5 bg-gray-100 capitalize">
                      {image.category}
                    </span>
                    {image.uploadedAt && (
                      <span className="text-xs text-gray-500">{image.uploadedAt}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {filteredImages.length > imagesPerPage && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {Math.ceil(filteredImages.length / imagesPerPage)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(filteredImages.length / imagesPerPage), p + 1)
                    )
                  }
                  disabled={currentPage >= Math.ceil(filteredImages.length / imagesPerPage)}
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Image modal */}
          {activeImage && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] flex items-center justify-center p-4 overscroll-contain">
              <div
                className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                  <h3 className="text-lg font-medium text-gray-800">{activeImage.title}</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-1.5 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-full flex justify-center mb-4 bg-gray-50 rounded-md overflow-hidden">
                    <img
                      src={activeImage.src}
                      alt={activeImage.alt}
                      className="max-h-[65vh] object-contain"
                      loading="eager"
                      onError={(e) => {
                        console.error("Image failed to load:", activeImage.src);
                        e.currentTarget.src = "/placeholder-image.jpg"; // Fallback image
                        e.currentTarget.classList.add("error-image");
                      }}
                    />
                  </div>

                  <div className="mt-4 text-sm text-gray-700 w-full p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="mb-2">
                          <span className="font-semibold text-gray-800">Category:</span>
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                            {activeImage.category}
                          </span>
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold text-gray-800">Description:</span>
                          <span className="ml-2 text-gray-600">
                            {activeImage.alt || "No description"}
                          </span>
                        </p>
                      </div>
                      <div>
                        {activeImage.uploadedAt && (
                          <p className="mb-2">
                            <span className="font-semibold text-gray-800">Uploaded:</span>
                            <span className="ml-2 text-gray-600">{activeImage.uploadedAt}</span>
                          </p>
                        )}
                        <p className="mb-2">
                          <span className="font-semibold text-gray-800">Dimensions:</span>
                          <span className="ml-2 text-gray-600">
                            {activeImage.width} × {activeImage.height}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
