import type { NextApiRequest, NextApiResponse } from "next";

// This variable will hold the state in memory.
// It will reset if the serverless function instance restarts (e.g., on new deployments or after inactivity).
// For persistent storage, consider using a database (e.g., Vercel KV, Supabase, etc.).
let appointmentsEnabled = false;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json({ enabled: appointmentsEnabled });
  } else if (req.method === "POST") {
    appointmentsEnabled = !appointmentsEnabled;
    res.status(200).json({ enabled: appointmentsEnabled });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}