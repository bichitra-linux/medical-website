import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../cloudinary/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ error: 'publicId required' });

  try {
    await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({ deleted: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Delete failed' });
  }
}