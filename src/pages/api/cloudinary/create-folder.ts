import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { folderPath } = req.body;

    if (!folderPath) {
      return res.status(400).json({ message: 'Folder path is required' });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // First check if folder already exists by searching for any resources
    const searchResult = await cloudinary.search
      .expression(`folder=${folderPath}`)
      .max_results(1)
      .execute();

    // If resources exist in this folder, it already exists
    if (searchResult.total_count > 0) {
      console.log(`Folder ${folderPath} already exists, skipping creation`);
      return res.status(200).json({ 
        message: `Folder ${folderPath} already exists`,
        path: folderPath,
        created: false
      });
    }

    console.log(`Creating folder: ${folderPath}`);

    // Create the folder by uploading a tiny transparent pixel
    const uploadResult = await cloudinary.uploader.upload(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      {
        folder: folderPath,
        public_id: 'folder-creator-temp',
        resource_type: 'image',
      }
    );

    // Delete the temporary file but keep the folder
    await cloudinary.uploader.destroy(uploadResult.public_id);

    return res.status(201).json({ 
      message: `Folder ${folderPath} created successfully`,
      path: folderPath,
      created: true
    });
  } catch (error) {
    console.error('Error managing folder:', error);
    return res.status(500).json({ 
      message: 'Error managing folder',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}