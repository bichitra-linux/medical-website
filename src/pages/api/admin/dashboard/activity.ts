import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/pages/api/firebase/firebase-admin";

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
      const activities = activitiesSnap.docs.map(doc => {
        const data = doc.data();
        // Format the relative time based on timestamp
        const timestamp = data.timestamp.toDate();
        const timeAgo = getTimeAgo(timestamp);
        
        return {
          id: doc.id,
          type: data.type || "appointment", // Default to appointment type if missing
          message: data.message,
          time: timeAgo,
          status: data.status || "success" // Default to success if missing
        };
      });
      
      return res.status(200).json({ activities });
    } 
    
    // If no activities collection or it's empty, generate activities from recent data
    else {
      // Get recent appointments, services, and gallery updates
      const [appointmentsSnap, servicesSnap, gallerySnap] = await Promise.all([
        adminDb.collection("appointments")
          .where("createdAt", ">=", twoDaysAgo)
          .orderBy("createdAt", "desc")
          .limit(5)
          .get(),
        adminDb.collection("services")
          .where("updatedAt", ">=", twoDaysAgo)
          .orderBy("updatedAt", "desc")
          .limit(3)
          .get(),
        adminDb.collection("gallery")
          .where("uploadedAt", ">=", twoDaysAgo)
          .orderBy("uploadedAt", "desc")
          .limit(2)
          .get(),
      ]);

      const activities = [];

      // Process appointments
      appointmentsSnap.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: "appointment",
          message: `New appointment scheduled: ${data.patientName}`,
          time: getTimeAgo(data.createdAt.toDate()),
          status: "success"
        });
      });

      // Process services
      servicesSnap.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: "service",
          message: `Service updated: ${data.name}`,
          time: getTimeAgo(data.updatedAt.toDate()),
          status: "success"
        });
      });

      // Process gallery updates
      gallerySnap.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: "gallery",
          message: "New gallery image uploaded",
          time: getTimeAgo(data.uploadedAt.toDate()),
          status: "success"
        });
      });

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