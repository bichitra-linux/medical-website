import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../cloudinary/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { publicId, metadata } = req.body;
  if (!publicId || !metadata) return res.status(400).json({ error: 'publicId & metadata required' });

  try {
    const contextStr = Object.entries(metadata)
      .map(([k, v]) => `${k}=${String(v).replace(/\|/g, '')}`)
      .join('|');
    await cloudinary.uploader.add_context(contextStr, [publicId]);
    return res.status(200).json({ updated: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Metadata update failed' });
  }
}