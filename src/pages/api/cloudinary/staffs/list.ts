import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../cloudinary/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'staffs/',
      max_results: 100,
      context: true,
    });
    return res.status(200).json(resources);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'List failed' });
  }
}