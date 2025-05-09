import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File as FormidableFile } from "formidable";
import cloudinary from "../../cloudinary/config";

// Disable Next’s default body parsing so formidable can handle the multipart
export const config = {
  api: {
    bodyParser: false,
  },
};

// helper to run formidable as a promise
function parseForm(req: NextApiRequest): Promise<{ files: Record<string, FormidableFile | FormidableFile[]> }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(req, (err, _fields, files) => {
      if (err) return reject(err);
      resolve({ files: files as any });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    // 1) parse the multipart form
    const { files } = await parseForm(req);

    // 2) unwrap a possible array and grab the actual File object
    let uploaded = files.file as FormidableFile | FormidableFile[];
    if (Array.isArray(uploaded)) uploaded = uploaded[0];

    // 3) get the temp‐file path (v2 uses `.filepath`, older versions `.path`)
    const filePath = (uploaded as any).filepath || (uploaded as any).path;
    if (!filePath) {
      return res.status(400).json({ error: "Invalid upload: no temp file path" });
    }

    // 4) ensure the root "staffs" folder exists (idempotent)
    await cloudinary.api.create_folder("settings").catch(() => {});

    // 5) hand the temp‐file directly to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "settings",
    });

    return res.status(200).json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}