import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../cloudinary/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { folderName } = req.body;
  if (!folderName) return res.status(400).json({ message: "folderName is required" });

  try {
    await cloudinary.api.create_folder("staffs").catch(() => {});

    const fullPath = `staffs/${folderName}`;
    // check existence
    const search = await cloudinary.search
      .expression(`folder=${fullPath}`)
      .max_results(1)
      .execute();

    if (search.total_count > 0) {
      return res.status(200).json({ path: fullPath, created: false });
    }

    // create by uploading 1px GIF
    await cloudinary.uploader.upload(
      "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
      { folder: fullPath, public_id: "_init" }
    );

    return res.status(201).json({ path: fullPath, created: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to create folder" });
  }
}
