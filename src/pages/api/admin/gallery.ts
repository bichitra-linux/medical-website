import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/pages/api/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

function isAdmin(user: any) { return true; }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, sessionClaims } = getAuth(req);
  if (!userId || !isAdmin(sessionClaims)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const galleryRef = adminDb.collection("gallery");
  try {
    if (req.method === "GET") {
      const snap = await galleryRef.get();
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ items });
    }

    if (req.method === "POST") {
      // imageUrl uploaded by client
      const data = req.body;
      const docRef = await galleryRef.add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const newDoc = await docRef.get();
      return res.status(201).json({ id: docRef.id, ...newDoc.data() });
    }

    if (req.method === "PUT") {
      const { id, ...data } = req.body;
      if (!id) return res.status(400).json({ error: "Missing gallery item ID" });
      await galleryRef.doc(id).update({ ...data, updatedAt: FieldValue.serverTimestamp() });
      const updated = await galleryRef.doc(id).get();
      return res.status(200).json({ id, ...updated.data() });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Missing gallery item ID" });
      await galleryRef.doc(id).delete();
      return res.status(200).json({ id });
    }

    res.setHeader("Allow", ["GET","POST","PUT","DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Gallery API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}