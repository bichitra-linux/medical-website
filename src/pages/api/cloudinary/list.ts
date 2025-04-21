import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { folder } = req.query;

    if (!folder || typeof folder !== 'string') {
      return res.status(400).json({ error: 'Valid folder parameter is required' });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log(`Searching for resources in folder: ${folder}`);
    
    // Try direct folder listing first since it's more reliable for our use case
    console.log(`Listing resources with prefix ${folder}/`);
    try {
      const folderListing = await cloudinary.api.resources({
        type: 'upload',
        prefix: `${folder}/`, // Important: include the trailing slash
        max_results: 100,
        context: true
      });
      
      console.log(`Found ${folderListing?.resources?.length || 0} resources with folder listing`);
      
      // Check if we have resources
      if (folderListing?.resources?.length > 0) {
        return res.status(200).json({ resources: folderListing.resources });
      }
    } catch (listError) {
      console.error('Error listing resources by prefix:', listError);
      // Continue to search API as fallback
    }
    
    // If folder listing failed or returned no results, try the search API
    try {
      console.log(`Searching using expression 'folder=${folder}'`);
      const searchResult = await cloudinary.search
        .expression(`folder:${folder}`)
        .with_field('context')
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();
        
      console.log(`Found ${searchResult?.resources?.length || 0} resources with search API`);
      return res.status(200).json(searchResult);
    } catch (searchError) {
      console.error('Error searching resources:', searchError);
      return res.status(200).json({ resources: [] }); // Return empty array instead of error
    }
  } catch (error) {
    console.error('Error listing Cloudinary resources:', error);
    return res.status(500).json({ 
      error: 'Failed to list images',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}