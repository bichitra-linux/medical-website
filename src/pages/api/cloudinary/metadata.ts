import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { publicId, metadata } = req.body;

    if (!publicId || !metadata) {
      return res.status(400).json({ error: 'Public ID and metadata are required' });
    }
    
    console.log("API: Updating metadata for", publicId, metadata);

    // Check if environment variables are available
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Missing Cloudinary credentials");
      return res.status(500).json({ error: 'Cloudinary credentials are missing' });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Sanitize metadata values
    const alt = String(metadata.alt || '').replace(/[|]/g, '');
    const caption = String(metadata.caption || '').replace(/[|]/g, '');
    const category = String(metadata.category || '').replace(/[|]/g, '');

    // Format context string for Cloudinary, including category if provided
    const contextStr = `alt=${alt}|caption=${caption}${category ? `|category=${category}` : ''}`;
    console.log("Context string:", contextStr);

    // Update image metadata
    const result = await cloudinary.uploader.add_context(contextStr, [publicId]);
    console.log("Cloudinary metadata update result:", result);

    // Reload the resource to verify the update
    const resource = await cloudinary.api.resource(publicId, { context: true });
    console.log("Resource after update:", resource.context);

    return res.status(200).json({ 
      message: 'Metadata updated successfully',
      result
    });
  } catch (error) {
    console.error('Error updating metadata:', error);
    return res.status(500).json({ 
      error: 'Failed to update metadata',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}