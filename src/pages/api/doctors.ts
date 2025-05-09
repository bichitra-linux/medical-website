import type { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase";

const DOCTOR_ROLES = [
  "general_physician",
  "pathologist",
  "dermatologist",
  "anesthetist",
  "radiologist",
  "cardiologist",
  "psychiatrist",
  "orthopedic",
  "Orthodontics",
];
const ROLE_LABELS: Record<string, string> = {
  general_physician: "General Physician",
  pathologist: "Pathologist",
  dermatologist: "Dermatologist",
  anesthetist: "Anesthetist",
  radiologist: "Radiologist",
  cardiologist: "Cardiologist",
  psychiatrist: "Psychiatrist",
  orthopedic: "Orthopedic Specialist",
  Orthodontics: "Orthodontist",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const snap = await getDocs(collection(db, "staffs"));
    const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    const doctors = all
      .filter((s) => DOCTOR_ROLES.includes(s.role))
      .map((s) => ({
        ...s,
        specialty: s.specialization || ROLE_LABELS[s.role] || s.role,
      }));
    return res.status(200).json({
      activeDoctors: doctors.filter((d) => d.isActive),
      formerDoctors: doctors.filter((d) => !d.isActive),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to load doctors" });
  }
}
