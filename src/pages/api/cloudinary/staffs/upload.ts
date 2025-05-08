import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../cloudinary/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const file = (req.body.file as string) ?? req.body;
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'staffs',
    });
    return res.status(200).json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Upload failed' });
  }
}