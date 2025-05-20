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

    // Query for upcoming appointments (today and future)
    const appointmentsSnap = await adminDb.collection("appointments")
      .where("status", "==", "scheduled")
      .orderBy("date", "asc")
      .orderBy("time", "asc")
      .limit(10)
      .get();

    const appointments = appointmentsSnap.docs.map(doc => {
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

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ error: "Failed to fetch upcoming appointments" });
  }
}