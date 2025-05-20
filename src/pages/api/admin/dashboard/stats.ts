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
    // Fetch stats from Firestore collections
    const [appointmentsSnap, servicesSnap, gallerySnap] = await Promise.all([
      adminDb.collection("appointments").get(),
      adminDb.collection("services").get(),
      adminDb.collection("gallery").get()
    ]);

    // Calculate today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    // Count today's appointments by filtering all appointments
    const todayAppointments = appointmentsSnap.docs.filter(doc => {
      const data = doc.data();
      return data.date === todayStr && data.status !== "cancelled";
    }).length;

    const statsData = {
      totalAppointments: appointmentsSnap.size,
      todayAppointments: todayAppointments,
      services: servicesSnap.size,
      galleryImages: gallerySnap.size
    };

    return res.status(200).json(statsData);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
}