import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/pages/api/firebase/firebase-admin"; // Use Admin SDK for server-side
import {
  Timestamp,
  FieldValue,
} from "firebase-admin/firestore";

// Helper to check Clerk admin (expand as needed)
function isAdmin(user: any) {
  // You can check Clerk publicMetadata or roles here
  return true; // All signed-in users are admins in your current setup
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId || !isAdmin(sessionClaims)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const servicesRef = adminDb.collection("services");

  try {
    if (req.method === "GET") {
      // List all services
      const querySnapshot = await servicesRef.get();
      const services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ services });
    }

    if (req.method === "POST") {
      // Create a new service
      const data = req.body;
      const docRef = await servicesRef.add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const newDoc = await docRef.get();
      return res.status(201).json({ id: docRef.id, ...newDoc.data() });
    }

    if (req.method === "PUT") {
      // Update a service
      const { id, ...data } = req.body;
      if (!id) return res.status(400).json({ error: "Missing service ID" });
      const serviceRef = servicesRef.doc(id);
      await serviceRef.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
      const updatedDoc = await serviceRef.get();
      return res.status(200).json({ id, ...updatedDoc.data() });
    }

    if (req.method === "DELETE") {
      // Delete a service
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Missing service ID" });
      await servicesRef.doc(id).delete();
      return res.status(200).json({ id });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}