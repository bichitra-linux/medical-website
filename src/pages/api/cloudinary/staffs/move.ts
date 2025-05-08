import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../cloudinary/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { publicId, toFolder = "staffs" } = req.body;
  if (!publicId) return res.status(400).json({ error: "publicId required" });

  try {
    await cloudinary.api.create_folder("staffs").catch(() => {});
    // ensure the target
    await cloudinary.api.create_folder(toFolder).catch(() => {});
    const fileName = publicId.split("/").pop();
    const newId = `${toFolder}/${fileName}`;
    await cloudinary.uploader.rename(publicId, newId, { overwrite: true, invalidate: true });
    return res.status(200).json({ publicId: newId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Move failed" });
  }
}
