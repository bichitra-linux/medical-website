import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Return the user's profile data
  // In a real application, you might fetch this from a database
  return res.status(200).json({
    id: userId,
    name: "Admin User",
    role: "admin",
    permissions: ["manage_appointments", "manage_services", "manage_gallery"],
  });
}