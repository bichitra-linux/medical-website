import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { publicId, destinationFolder } = req.body;

    if (!publicId || !destinationFolder) {
      return res.status(400).json({ error: 'Public ID and destination folder are required' });
    }

    // Debug logging
    console.log(`Move request: Moving ${publicId} to ${destinationFolder}`);

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Extract the filename from the original publicId
    const parts = publicId.split('/');
    const filename = parts[parts.length - 1];
    
    // Create the new public ID with the correct folder structure
    const newPublicId = `${destinationFolder}/${filename}`;
    
    console.log(`Moving image from ${publicId} to ${newPublicId}`);

    // First check if the source image exists
    try {
      await cloudinary.api.resource(publicId);
    } catch (error) {
      console.error('Source image not found:', error);
      return res.status(404).json({ 
        error: 'Source image not found',
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }

    // Create destination folder if needed (this is optional but helpful)
    try {
      await cloudinary.api.create_folder(destinationFolder);
      console.log(`Created or confirmed destination folder: ${destinationFolder}`);
    } catch (folderError) {
      // Ignore folder creation errors as it might already exist
      console.log('Folder operation note:', folderError instanceof Error ? folderError.message : 'Unknown error');
    }

    // Now try the rename operation
    try {
      const result = await cloudinary.uploader.rename(publicId, newPublicId, {
        overwrite: true,
        invalidate: true
      });

      console.log('Move successful:', result.public_id);

      return res.status(200).json({ 
        message: 'Image moved successfully',
        publicId: result.public_id,
        secure_url: result.secure_url
      });
    } catch (moveError) {
      console.error('Move operation failed:', moveError instanceof Error ? moveError.message : 'Unknown error');
      
      // Try alternative approach - copy then delete
      try {
        // Get the source image data
        const source = await cloudinary.api.resource(publicId);
        
        // Try to use the Cloudinary Admin API to copy the resource
        return res.status(500).json({
          error: 'Failed to move image',
          details: moveError instanceof Error ? moveError.message : 'Move operation failed'
        });
      } catch (sourceCheckError: unknown) {
        const errorMessage = sourceCheckError instanceof Error ? sourceCheckError.message : 'Unknown error';
        return res.status(404).json({
          error: 'Source image not found or inaccessible', 
          details: errorMessage
        });
      }
    }
  } catch (error: unknown) {
    console.error('Error in move operation:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ 
      error: 'Failed to move image',
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}