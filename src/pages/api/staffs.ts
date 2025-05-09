import type { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase";

// exactly the same doctor‐role list used in src/pages/api/doctors.ts
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
] as const;
type DoctorRole = (typeof DOCTOR_ROLES)[number];

// labels for all non‐doctor roles
const STAFF_ROLE_LABELS: Record<string, string> = {
  // Allied Health Professionals
  physiotherapist: "Physiotherapist",
  pharmacist: "Pharmacist",
  nurse: "Nurse",

  // Laboratory & Technical
  lab_staff: "Laboratory Staff",
  bmlt: "BMLT",
  cmlt: "CMLT",
  cma: "CMA",
  s_ha: "S.Ha",
  technician: "Technician",
  radiographer: "Radiographer",

  // Administrative & Support
  admin: "Administrative Staff",
  documentation: "Documentation Officer",
  reporting_officer: "Reporting Officer",
  reception: "Receptionist",
  marketing: "Marketing Executive",
  cleaner: "Cleaner",

  // any other custom non‐doctor roles may go here...
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const snap = await getDocs(collection(db, "staffs"));
    const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    // exclude any document whose role is in the DOCTOR_ROLES list
    const staff = all
      .filter((s) => !DOCTOR_ROLES.includes(s.role as DoctorRole))
      .map((s) => ({
        ...s,
        // attach a human‐readable label for each staff role
        roleLabel: STAFF_ROLE_LABELS[s.role] || s.role,
      }));

    return res.status(200).json({
      activeStaffs: staff.filter((s) => s.isActive),
      formerStaffs: staff.filter((s) => !s.isActive),
    });
  } catch (err) {
    console.error("staffs API error:", err);
    return res.status(500).json({ error: "Unable to load staffs" });
  }
}
