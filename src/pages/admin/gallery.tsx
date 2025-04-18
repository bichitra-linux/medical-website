import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/layout/admin-layout';
import { Image as ImageIcon, Upload, Trash, Plus, X, Filter, Edit } from 'lucide-react';

// Match the GalleryImage type from index.tsx to ensure compatibility
type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  category: 'facility' | 'team' | 'events';
  uploadedAt?: string; // Additional field for admin use
};

// Type definition for gallery data structure matching the user view
type GalleryData = {
  facility: GalleryImage[];
  team: GalleryImage[];
  events: GalleryImage[];
};

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState<GalleryData>({
    facility: [],
    team: [],
    events: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'facility' | 'team' | 'events'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [newImage, setNewImage] = useState<{
    title: string;
    alt: string;
    category: 'facility' | 'team' | 'events';
    file: File | null;
    previewUrl: string | null;
  }>({
    title: '',
    alt: '',
    category: 'facility',
    file: null,
    previewUrl: null
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load gallery data on component mount
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call to fetch the gallery data
        // For now, simulate loading the same data structure used in the user view
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - structured like in index.tsx
        const mockGalleryData: GalleryData = {
          facility: [
            {
              id: 1,
              src: "/images/gallery/facility-1.jpg",
              alt: "Reception area",
              title: "Modern Reception",
              width: 1200,
              height: 800,
              category: "facility",
              uploadedAt: "2023-04-15"
            },
            {
              id: 2,
              src: "/images/gallery/facility-2.jpg",
              alt: "Waiting room",
              title: "Comfortable Waiting Area",
              width: 1200,
              height: 800,
              category: "facility",
              uploadedAt: "2023-04-16"
            },
          ],
          team: [
            {
              id: 7,
              src: "/images/gallery/team-1.jpg",
              alt: "Doctor consultation",
              title: "Doctor Consultation",
              width: 1200,
              height: 800,
              category: "team",
              uploadedAt: "2023-04-17"
            },
            {
              id: 8,
              src: "/images/gallery/team-2.jpg",
              alt: "Medical team meeting",
              title: "Team Meeting",
              width: 1200,
              height: 800,
              category: "team",
              uploadedAt: "2023-04-18"
            },
          ],
          events: [
            {
              id: 11,
              src: "/images/gallery/event-1.jpg",
              alt: "Health camp",
              title: "Community Health Camp",
              width: 1200,
              height: 800,
              category: "events",
              uploadedAt: "2023-04-19"
            },
          ]
        };
        
        setGalleryData(mockGalleryData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load gallery. Please try again.');
        setIsLoading(false);
      }
    };

    loadGallery();
  }, []);

  // Get all images as a flat array for filtering
  const getAllImages = (): GalleryImage[] => {
    return [
      ...galleryData.facility,
      ...galleryData.team,
      ...galleryData.events
    ];
  };

  // Filter images by category
  const filteredImages = selectedCategory === 'all' 
    ? getAllImages() 
    : galleryData[selectedCategory];

  // Handle deleting an image
  const handleDelete = async (id: number, category: 'facility' | 'team' | 'events') => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        // Simulate API call for deletion
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update state by removing the image from the specific category
        setGalleryData(prev => ({
          ...prev,
          [category]: prev[category].filter(img => img.id !== id)
        }));
      } catch (err) {
        setError('Failed to delete image. Please try again.');
      }
    }
  };

  // Handle file selection for upload form
  const handleFileSelect = () => {
    setShowImageForm(true);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Get the filename as default title and alt text
    const defaultName = file.name.split('.')[0].replace(/-|_/g, ' ');
    
    setNewImage({
      title: defaultName,
      alt: defaultName,
      category: 'facility',
      file: file,
      previewUrl: previewUrl
    });
  };

  // Get image dimensions from a file
  const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src); // Clean up
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle form submission for new image
  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newImage.file || !newImage.previewUrl) {
      setError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Get image dimensions
      const { width, height } = await getImageDimensions(newImage.file);
      
      // In a real implementation, this would upload the file to a server/storage service
      // and get back a URL to use for the image source
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new image object
      const uploadedImage: GalleryImage = {
        // Generate a new ID - in a real app, this would come from the backend
        id: Math.floor(Math.random() * 10000),
        src: newImage.previewUrl, // In a real app, this would be the URL from the server
        alt: newImage.alt,
        title: newImage.title,
        width: width,
        height: height,
        category: newImage.category,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      
      // Add to the correct category in the gallery data
      setGalleryData(prev => ({
        ...prev,
        [newImage.category]: [...prev[newImage.category], uploadedImage]
      }));
      
      // Reset form
      setNewImage({
        title: '',
        alt: '',
        category: 'facility',
        file: null,
        previewUrl: null
      });
      
      setShowImageForm(false);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel image upload
  const handleCancelUpload = () => {
    if (newImage.previewUrl) {
      URL.revokeObjectURL(newImage.previewUrl);
    }
    setNewImage({
      title: '',
      alt: '',
      category: 'facility',
      file: null,
      previewUrl: null
    });
    setShowImageForm(false);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gallery Management | Medical Admin</title>
      </Head>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="facility">Facility</option>
              <option value="team">Team</option>
              <option value="events">Events</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter size={16} className="text-gray-500" />
            </div>
          </div>
          
          <button
            onClick={handleFileSelect}
            disabled={isUploading || showImageForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors disabled:bg-blue-400"
          >
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Plus size={18} className="mr-1" />
                Add Image
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
          <X size={20} className="mr-2" />
          {error}
        </div>
      )}
      
      {/* Image Upload Form */}
      {showImageForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Image</h2>
            <button 
              onClick={handleCancelUpload}
              className="text-gray-500 hover:text-gray-700"
              disabled={isUploading}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleImageSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {newImage.previewUrl ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={newImage.previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (newImage.previewUrl) {
                            URL.revokeObjectURL(newImage.previewUrl);
                          }
                          setNewImage({ ...newImage, file: null, previewUrl: null });
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to select or drag and drop an image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={newImage.alt}
                    onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Description of the image for accessibility
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value as 'facility' | 'team' | 'events' })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="facility">Facility</option>
                    <option value="team">Team</option>
                    <option value="events">Events</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCancelUpload}
                disabled={isUploading}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !newImage.file}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {isLoading ? (
        // Loading state
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
        // Empty state
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
        // Gallery grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden group">
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={() => handleDelete(image.id, image.category)}
                      className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Delete image"
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
      )}
    </AdminLayout>
  );
}