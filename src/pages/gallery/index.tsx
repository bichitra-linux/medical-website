import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { InstagramEmbed, TwitterEmbed, FacebookEmbed } from "react-social-media-embed";
import { X, ChevronLeft, ChevronRight, Instagram, Facebook, Twitter, Loader } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Type definitions for gallery data
type Category = "facility" | "team" | "events";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  category: Category;
};

type GalleryData = {
  [key in Category]: GalleryImage[];
};

// Social media posts to embed
const socialMediaPosts = {
  instagram: "https://www.instagram.com/p/CdJA9M4JnKQ/",
  twitter: "https://twitter.com/WHO/status/1516096550220591105",
  facebook:
    "https://www.facebook.com/WHO/posts/pfbid02LkgfC9Bh8dz1wJhyBxnJYad1HmNPUsmfxpELewS6auZcigTKJcLa2rvPJpXoMBKDl",
};

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState<GalleryData>({
    facility: [],
    team: [],
    events: [],
  });
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category>("facility");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch gallery images from Cloudinary
  useEffect(() => {
    const fetchAllImages = async () => {
      setIsLoading(true);
      setLoadingError(null);

      try {
        const [facilityData, teamData, eventsData] = await Promise.all([
          fetchCategoryImages("facility"),
          fetchCategoryImages("team"),
          fetchCategoryImages("events"),
        ]);

        setGalleryData({
          facility: facilityData,
          team: teamData,
          events: eventsData,
        });
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setLoadingError("Failed to load gallery images. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllImages();
  }, []);

  // Function to fetch images for a specific category
  const fetchCategoryImages = async (category: Category): Promise<GalleryImage[]> => {
    try {
      const response = await fetch(`/api/cloudinary/list?folder=gallery/${category}`);
      if (!response.ok) throw new Error(`Failed to fetch ${category} images`);

      const data = await response.json();
      if (!data.resources || !Array.isArray(data.resources)) return [];

      return data.resources.map((resource: any) => ({
        id: resource.public_id,
        src: resource.secure_url,
        alt: resource.context?.alt || resource.public_id.split("/").pop(),
        title: resource.context?.caption || resource.public_id.split("/").pop(),
        width: resource.width,
        height: resource.height,
        category: category,
      }));
    } catch (error) {
      console.error(`Error fetching ${category} images:`, error);
      return [];
    }
  };

  // Function to open the lightbox
  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    // Allow scrolling again
    document.body.style.overflow = "auto";
  };

  // Navigate to next image in lightbox
  const nextImage = () => {
    if (!selectedImage) return;

    const currentImages = galleryData[currentCategory];
    const currentIndex = currentImages.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % currentImages.length;
    setSelectedImage(currentImages[nextIndex]);
  };

  // Navigate to previous image in lightbox
  const prevImage = () => {
    if (!selectedImage) return;

    const currentImages = galleryData[currentCategory];
    const currentIndex = currentImages.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    setSelectedImage(currentImages[prevIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentCategory]);

  const handleCategoryChange = (index: number) => {
    const categories: Category[] = ["facility", "team", "events"];
    setCurrentCategory(categories[index]);
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
  };

  return (
    <>
      <Head>
        <title>Photo Gallery | Purna Chandra Diagnostic Center</title>
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Gallery</h1>
            <p className="text-lg text-gray-600 mb-8">
              Take a tour of our facilities, meet our team, and see our events through our photo
              gallery.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tab.Group onChange={handleCategoryChange}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1 mb-10">
              {Object.keys(galleryData).map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                    ${
                      selected
                        ? "bg-white text-blue-700 shadow"
                        : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    }`
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {Object.values(galleryData).map((images, idx) => (
                <Tab.Panel key={idx} className="focus:outline-none">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-500">Loading gallery images...</p>
                    </div>
                  ) : loadingError ? (
                    <div className="text-center py-12">
                      <p className="text-red-500">{loadingError}</p>
                      <button
                        onClick={() => {
                          setIsLoading(true);
                          setLoadingError(null);
                          fetchCategoryImages(currentCategory)
                            .then((images) => {
                              setGalleryData((prev) => ({
                                ...prev,
                                [currentCategory]: images,
                              }));
                              setIsLoading(false);
                            })
                            .catch((err) => {
                              console.error("Error reloading images:", err);
                              setLoadingError("Failed to reload images.");
                              setIsLoading(false);
                            });
                        }}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : images.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No images found in this category.</p>
                    </div>
                  ) : (
                    <div className="px-4 md:px-10">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {images.map((image) => (
                            <CarouselItem
                              key={image.id}
                              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="h-full p-2"
                              >
                                <div
                                  className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
                                  onClick={() => openLightbox(image)}
                                >
                                  <div className="relative h-72 flex-grow">
                                    <Image
                                      src={image.src}
                                      alt={image.alt}
                                      fill
                                      className="object-cover transition-transform duration-500 hover:scale-105"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      onError={handleImageError}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex justify-center gap-2 mt-6">
                          <CarouselPrevious className="static transform-none mr-2 bg-blue-600 hover:bg-blue-700 text-white border-none" />
                          <CarouselNext className="static transform-none ml-2 bg-blue-600 hover:bg-blue-700 text-white border-none" />
                        </div>
                      </Carousel>
                    </div>
                  )}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>

      {/* Social Media Embeds Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Connect With Us</h2>
            <p className="text-gray-600">
              Follow us on social media to stay updated with our latest news, health tips, and
              community events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4 text-pink-600">
                <Instagram className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Instagram</h3>
              </div>
              <div className="overflow-hidden rounded-md">
                <InstagramEmbed url={socialMediaPosts.instagram} width="100%" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4 text-blue-400">
                <Twitter className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Twitter</h3>
              </div>
              <div className="overflow-hidden rounded-md">
                <TwitterEmbed url={socialMediaPosts.twitter} width="100%" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4 text-blue-600">
                <Facebook className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Facebook</h3>
              </div>
              <div className="overflow-hidden rounded-md">
                <FacebookEmbed url={socialMediaPosts.facebook} width="100%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div
              className="relative max-w-5xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1600px) 100vw, 1600px"
                    priority
                    onError={handleImageError}
                  />
                </div>
                <div className="bg-black bg-opacity-50 text-white p-4">
                  <h2 className="text-xl font-medium">{selectedImage.title}</h2>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
