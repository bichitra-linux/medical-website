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

  const apptRef = adminDb.collection("appointments");
  try {
    if (req.method === "GET") {
      const snap = await apptRef.get();
      const appointments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ appointments });
    }

    if (req.method === "POST") {
      const data = req.body;
      const docRef = await apptRef.add({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const newDoc = await docRef.get();
      return res.status(201).json({ id: docRef.id, ...newDoc.data() });
    }

    if (req.method === "PUT") {
      const { id, ...data } = req.body;
      if (!id) return res.status(400).json({ error: "Missing appointment ID" });
      await apptRef.doc(id).update({ ...data, updatedAt: FieldValue.serverTimestamp() });
      const updated = await apptRef.doc(id).get();
      return res.status(200).json({ id, ...updated.data() });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Missing appointment ID" });
      await apptRef.doc(id).delete();
      return res.status(200).json({ id });
    }

    res.setHeader("Allow", ["GET","POST","PUT","DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Appointments API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}