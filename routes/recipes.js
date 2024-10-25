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
    const recipes = await prisma.recipe.findMany({
      where: {
        visibility: 'PUBLIC',
      },
    });
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
    console.log(req.params);
    // Fetch the recipe
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id),visibility:"PUBLIC" }
    });
    //console.log(recipe);

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

      //console.log(response); // For debugging
      res.json(response);
    } else {
      //console.log( res);
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.log('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

// POST a new recipe with image upload to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {

  console.log(req.body);
  const { title, ingredients, instructions, videoLink, visibility } = req.body; // Include visibility
  const email = req.headers.email;

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
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              return reject(new Error('Error uploading to Cloudinary: ' + error.message));
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // Save the recipe with image URL, email, and visibility in the database
    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        instructions,
        image: imageUrl,
        videoLink,
        email,
        visibility: visibility || 'PUBLIC', // Default to PUBLIC if not provided
      },
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});


module.exports = router;
