import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/pages/api/firebase/firebase"; // Use regular Firebase client
import { collection, getDocs, query, where } from "firebase/firestore";

// Define types to match your Firestore data structure
type ServiceCategory =
  | "diagnostic"
  | "consultation"
  | "specialist"
  | "laboratory"
  | "foreign_medical";

// Raw service data from Firestore
interface ServiceData {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: ServiceCategory;
  duration: string;
  isPopular: boolean;
  isActive: boolean;
  image?: string;
  createdAt: any;
  updatedAt: any;
}

// Transformed service for frontend consumption
interface TransformedService {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  category: string;
  color: string;
  icon: string;
  badge?: string | null;
}

// Category data structure
interface CategoryData {
  id: string;
  name: string;
  color: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for public endpoints
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Get the services collection reference
    const servicesRef = collection(db, "services");

    // Create a query for only active services
    const servicesQuery = query(servicesRef, where("isActive", "==", true));

    // Fetch the services
    const querySnapshot = await getDocs(servicesQuery);

    // Map the services to an array of objects
    const services: ServiceData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert any Firestore timestamps to ISO strings for JSON serialization
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : null,
      } as ServiceData; // Type assertion to tell TypeScript this is a ServiceData
    });

    // Transform services data to match the format expected by the frontend
    const transformedServices: TransformedService[] = services.map((service) => ({
      id: service.id,
      title: service.name || "",
      description: service.shortDescription || "",
      features: (service.description || "")
        .split("\n")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim()),
      category: service.category,
      price: service.price,
      color: getCategoryColor(service.category),
      icon: getCategoryIcon(service.category),
      badge: service.isPopular ? "Popular" : null,
    }));

    // Structure categories the way frontend expects
    const categories: CategoryData[] = [
      { id: "all", name: "All Services", color: "blue" },
      { id: "diagnostic", name: "Diagnostic", color: "blue" },
      { id: "consultation", name: "Consultation", color: "green" },
      { id: "specialist", name: "Specialist", color: "amber" },
      { id: "laboratory", name: "Laboratory", color: "purple" },
      { id: "foreign_medical", name: "Foreign Medical", color: "red" },
    ];

    // Return the data in the format expected by the frontend
    return res.status(200).json({
      services: transformedServices,
      categories,
    });
  } catch (error) {
    console.error("Public services API error:", error);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
}

// Helper function to map categories to colors
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    diagnostic: "blue",
    consultation: "green",
    specialist: "amber",
    laboratory: "purple",
    foreign_medical: "red",
  };

  return colorMap[category] || "blue";
}

// Helper function to map categories to icons
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    diagnostic: "stethoscope",
    consultation: "clipboardList",
    specialist: "userPlus",
    laboratory: "testTube",
    foreign_medical: "globe",
  };

  return iconMap[category] || "activity";
}
