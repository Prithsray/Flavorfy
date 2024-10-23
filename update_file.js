// Import required libraries
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Function to fetch all image files from Cloudinary folder and update the database
async function updateRecipeImages() {
  try {
    // Fetch all images from the 'recipe' folder in Cloudinary
    const resources = await cloudinary.api.resource('recipes');

    // Loop through each image and update the corresponding recipe in the database
    for (const resource of resources.resources) {
      const fileName = resource.public_id.split('/').pop(); // Get file name (without folder)
      const publicUrl = resource.secure_url; // Get the secure URL for the image

      // Log the public URL
      console.log(`Public URL for file '${fileName}':`, publicUrl);

      // Example: Uncomment the following lines to update the recipe in the database
      /*
      const recipe = await prisma.recipe.updateMany({
        where: {
          title: fileName, // Assuming title matches the file name
        },
        data: {
          image: publicUrl,
        },
      });

      console.log(`Updated Recipe with title '${fileName}':`, recipe);
      */
    }
  } catch (error) {
    console.error('Error updating recipe images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
updateRecipeImages();
