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
    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    // Get tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let appointments = [];
    
    try {
      // Try the original query first (requires composite index)
      const appointmentsSnap = await adminDb.collection("appointments")
        .where("status", "==", "scheduled")
        .orderBy("date", "asc")
        .orderBy("time", "asc")
        .limit(10)
        .get();
        
      appointments = appointmentsSnap.docs.map(doc => {
        const data = doc.data();
        
        // Format date as "Today", "Tomorrow", or the actual date
        let formattedDate = data.date;
        if (data.date === todayStr) {
          formattedDate = "Today";
        } else if (data.date === tomorrowStr) {
          formattedDate = "Tomorrow";
        }
        
        return {
          id: doc.id,
          patientName: data.patientName,
          service: data.service,
          time: data.time,
          date: formattedDate,
          phone: data.phone || ""
        };
      });
    } catch (error) {
      console.warn("Index not found, falling back to simpler query:", error);
      
      // Fallback query that doesn't require a composite index
      // Only filter by status and sort by one field
      const fallbackSnap = await adminDb.collection("appointments")
        .where("status", "==", "scheduled")
        .orderBy("date", "asc")  // Only sort by date
        .limit(20)  // Get more to ensure we have enough after manual sorting
        .get();
      
      // Process the results
      const allAppointments = fallbackSnap.docs.map(doc => {
        const data = doc.data();
        
        let formattedDate = data.date;
        if (data.date === todayStr) {
          formattedDate = "Today";
        } else if (data.date === tomorrowStr) {
          formattedDate = "Tomorrow";
        }
        
        return {
          id: doc.id,
          patientName: data.patientName,
          service: data.service,
          time: data.time,
          date: formattedDate,
          dateRaw: data.date, // Keep the raw date for manual sorting
          phone: data.phone || ""
        };
      });
      
      // Sort manually by date and then by time
      allAppointments.sort((a, b) => {
        // First sort by date
        if (a.dateRaw !== b.dateRaw) {
          return a.dateRaw.localeCompare(b.dateRaw);
        }
        // Then sort by time
        return a.time.localeCompare(b.time);
      });
      
      // Take the first 10 after sorting
      appointments = allAppointments.slice(0, 10).map(appt => {
        // Remove the dateRaw field that was only used for sorting
        const { dateRaw, ...rest } = appt;
        return rest;
      });
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);

    // Type check the error before accessing its properties
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    return res.status(500).json({ 
      error: "Failed to fetch upcoming appointments",
      details: errorMessage,
      solution: "Create the required index in the Firebase console"
    });
  }
}