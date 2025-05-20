import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/pages/api/firebase/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

// Define proper types for the activity data
interface Activity {
  id: string;
  type: "appointment" | "service" | "gallery" | string;
  message: string;
  time: string;
  status: "success" | "pending" | "error" | string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the timestamp for 48 hours ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    // Query activities collection for recent entries
    const activitiesSnap = await adminDb.collection("activities")
      .where("timestamp", ">=", twoDaysAgo)
      .orderBy("timestamp", "desc")
      .limit(10)
      .get();

    // If we have a dedicated activities collection
    if (!activitiesSnap.empty) {
      const activities: Activity[] = activitiesSnap.docs.map(doc => {
        const data = doc.data();
        
        // Safely convert Firestore timestamp to Date
        let timestamp: Date;
        try {
          timestamp = data.timestamp instanceof Timestamp
            ? data.timestamp.toDate()
            : new Date(data.timestamp);
        } catch (error) {
          console.warn(`Invalid timestamp for activity ${doc.id}:`, error);
          timestamp = new Date(); // Fallback to current time
        }
        
        const timeAgo = getTimeAgo(timestamp);
        
        return {
          id: doc.id,
          type: data.type || "appointment", // Default to appointment type if missing
          message: data.message || "Activity recorded",
          time: timeAgo,
          status: data.status || "success" // Default to success if missing
        };
      });
      
      return res.status(200).json({ activities });
    } 
    
    // If no activities collection or it's empty, generate activities from recent data
    else {
      const activities: Activity[] = [];

      try {
        // Get recent appointments
        const appointmentsSnap = await adminDb.collection("appointments")
          .where("createdAt", ">=", twoDaysAgo)
          .orderBy("createdAt", "desc")
          .limit(5)
          .get();
          
        appointmentsSnap.forEach(doc => {
          const data = doc.data();
          if (data && data.createdAt) {
            try {
              const createdAt = data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(data.createdAt);
                
              activities.push({
                id: doc.id,
                type: "appointment",
                message: `New appointment scheduled: ${data.patientName || 'Patient'}`,
                time: getTimeAgo(createdAt),
                status: "success"
              });
            } catch (error) {
              console.warn(`Invalid timestamp for appointment ${doc.id}:`, error);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }

      try {
        // Get recent service updates
        const servicesSnap = await adminDb.collection("services")
          .where("updatedAt", ">=", twoDaysAgo)
          .orderBy("updatedAt", "desc")
          .limit(3)
          .get();
          
        servicesSnap.forEach(doc => {
          const data = doc.data();
          if (data && data.updatedAt) {
            try {
              const updatedAt = data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate()
                : new Date(data.updatedAt);
                
              activities.push({
                id: doc.id,
                type: "service",
                message: `Service updated: ${data.name || 'Unknown service'}`,
                time: getTimeAgo(updatedAt),
                status: "success"
              });
            } catch (error) {
              console.warn(`Invalid timestamp for service ${doc.id}:`, error);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching services:", error);
      }

      try {
        // Get recent gallery updates
        const gallerySnap = await adminDb.collection("gallery")
          .where("uploadedAt", ">=", twoDaysAgo)
          .orderBy("uploadedAt", "desc")
          .limit(2)
          .get();
          
        gallerySnap.forEach(doc => {
          const data = doc.data();
          if (data && data.uploadedAt) {
            try {
              const uploadedAt = data.uploadedAt instanceof Timestamp
                ? data.uploadedAt.toDate()
                : new Date(data.uploadedAt);
                
              activities.push({
                id: doc.id,
                type: "gallery",
                message: "New gallery image uploaded",
                time: getTimeAgo(uploadedAt),
                status: "success"
              });
            } catch (error) {
              console.warn(`Invalid timestamp for gallery item ${doc.id}:`, error);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      }

      // Sort activities by timestamp (newest first)
      activities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      return res.status(200).json({ activities: activities.slice(0, 10) });
    }
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return res.status(500).json({ error: "Failed to fetch activity data" });
  }
}

// Helper function to get relative time strings
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Helper function to parse time ago strings for sorting
function parseTimeAgo(timeAgo: string): number {
  if (timeAgo === "just now") return 0;
  
  const matches = timeAgo.match(/(\d+)\s+(\w+)\s+ago/);
  if (!matches) return Number.MAX_SAFE_INTEGER;
  
  const value = parseInt(matches[1], 10);
  const unit = matches[2].toLowerCase();
  
  if (unit.startsWith("minute")) return value * 60 * 1000;
  if (unit.startsWith("hour")) return value * 60 * 60 * 1000;
  if (unit.startsWith("day")) return value * 24 * 60 * 60 * 1000;
  
  return Number.MAX_SAFE_INTEGER;
}