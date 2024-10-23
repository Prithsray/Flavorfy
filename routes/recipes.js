const express = require('express');
const prisma = require('../prismaClient'); // Assuming Prisma client setup is in this file
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
require('dotenv').config(); // Load environment variables

// Initialize Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer for handling file uploads, storing files in memory
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
});

const router = express.Router();

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// GET a single recipe by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the recipe
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id) }
    });

    if (recipe) {
      // Fetch the user based on the email in the recipe
      const user = await prisma.user.findUnique({
        where: { email: recipe.email }
      });

      // Combine the recipe and user information
      const response = {
        recipe,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          // Include other user fields as needed
        } : null, // Handle case where user might not be found
      };

      console.log(response); // For debugging
      res.json(response);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

// POST a new recipe with image upload to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  const { title, ingredients, instructions, videoLink } = req.body;
  const email = req.headers.email; // Retrieve email from request headers

  // Check for required fields
  if (!title || !ingredients || !instructions || !email) {
    return res.status(400).json({ message: 'Title, ingredients, instructions, and email are required' });
  }

  try {
    let imageUrl = null;

    // Handle file upload if present
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'recipes', // Optionally specify a folder in Cloudinary
            resource_type: 'image', // Specify the resource type
          },
          (error, result) => {
            if (error) {
              return reject(new Error('Error uploading to Cloudinary: ' + error.message));
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer); // Pipe the file buffer to the upload stream
      });

      // Get the secure URL from Cloudinary's result
      imageUrl = uploadResult.secure_url;
    }

    // Save the recipe with image URL and email in the database
    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        instructions,
        image: imageUrl, // Image URL from Cloudinary
        videoLink, // Save video link if provided
        email, // Save the email of the user who added the recipe
      },
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

module.exports = router;
