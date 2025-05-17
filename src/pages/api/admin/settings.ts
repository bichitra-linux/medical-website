import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/pages/api/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Helper to check Clerk admin (consistent with other admin APIs)
function isAdmin(user: any) {
  // You can check Clerk publicMetadata or roles here
  return true; // All signed-in users are admins in your current setup
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId || !isAdmin(sessionClaims)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Reference to the settings document
  const settingsRef = adminDb.collection("settings").doc("site");

  try {
    if (req.method === "GET") {
      // Get settings
      const doc = await settingsRef.get();
      if (!doc.exists) {
        // If no settings exist yet, return empty object
        return res.status(200).json({});
      }
      return res.status(200).json(doc.data());
    }

    if (req.method === "POST" || req.method === "PUT") {
      // Update settings
      const data = req.body;
      await settingsRef.set({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      
      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Settings API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}