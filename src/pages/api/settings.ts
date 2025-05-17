import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/pages/api/firebase/firebase"; // Use regular Firebase client for public endpoints

import { collection, doc, getDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for public endpoints
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Get settings from Firestore
    const settingsDoc = await getDoc(doc(db, "settings", "site"));
    
    if (!settingsDoc.exists()) {
      return res.status(200).json({});
    }
    
    return res.status(200).json(settingsDoc.data());
  } catch (error) {
    console.error("Settings API error:", error);
    return res.status(500).json({ error: "Failed to fetch settings" });
  }
}