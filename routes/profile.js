import express from 'express';
import multer from 'multer';
import path from 'path';
import cloudinary from 'cloudinary';
import prisma from '../prismaClient.js';
import dotenv from 'dotenv';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';


dotenv.config(); // Load environment variables

const router = express.Router();

// Set up Cloudinary with credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for file uploads (in-memory storage to stream directly to Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// GET profile data
router.get('/', async (req, res) => {
  const email = req.headers.email.replace(/"/g, ''); // Retrieve email from headers
  console.log(email);

  try {
    // Fetch the user data using email
    const user = await prisma.user.findUnique({
      where: { email }, // Use email to find the user
      select: {
        name: true,
        email: true,
        bio: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch followers and following counts using email
    const followersCount = await prisma.follow.count({
      where: {
        followingEmail: user.email, // Change to followingEmail
      },
    });

    const followingCount = await prisma.follow.count({
      where: {
        followerEmail: user.email, // Change to followerEmail
      },
    });

    // Fetch follower names using email
    const followers = await prisma.follow.findMany({
      where: {
        followingEmail: user.email, // Change to followingEmail
      },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true, // Include email if needed
          },
        },
      },
    });

    // Fetch following names using email
    const following = await prisma.follow.findMany({
      where: {
        followerEmail: user.email, // Change to followerEmail
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            email: true, // Include email if needed
          },
        },
      },
    });

    // Construct the response with user data
    const response = {
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount,
        followingCount, // Include following count
        followers: followers.map(f => f.follower),
        following: following.map(f => f.following),
      },
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});



// GET profile by ID with public recipes



// PUT profile update
router.put('/', upload.single('profilePicture'), async (req, res) => {
  const email = req.headers.email.replace(/"/g, ''); // Retrieve email from headers
  const { bio } = req.body;

  const updateData = { bio };

  // If a new profile picture was uploaded, upload to Cloudinary and save the URL
  if (req.file) {
    console.log(req.file);

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: 'profiles', // Optionally specify a folder in Cloudinary
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

      // Set the profile picture URL in the update data
      updateData.profilePicture = uploadResult.secure_url;
    } catch (error) {
      console.error('Error uploading profile picture to Cloudinary:', error);
      return res.status(500).json({ message: 'Error uploading profile picture' });
    }
  }

  console.log(email);

  try {
    // Update the user profile in the database
    const user = await prisma.user.update({
      where: { email }, // Use email to update the user
      data: updateData, // Update the bio and profile picture URL if present
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// GET user recipes
router.get('/recipes', async (req, res) => {
  const { email } = req.query;
  console.log(email);
  try {
    const recipes = await prisma.recipe.findMany({
      where: { email },
    });
    console.log(recipes);
    res.json(recipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// PUT recipe edit
router.put('/recipes-edit/:id', async (req, res) => {
  console.log(req.params, req.body);
  const { id } = req.params;
  const { title, ingredients, instructions, videoLink, email, visibility } = req.body;

  try {
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id: parseInt(id) },
      data: {
        title,
        ingredients,
        instructions,
        videoLink,
        email,
        visibility,
        createdAt: existingRecipe.createdAt,
      },
    });

    res.json(updatedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the recipe' });
  }
});

// DELETE recipes
router.delete('/recipes-delete', async (req, res) => {
  console.log(req.body);
  const { recipeIds } = req.body;

  if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
    return res.status(400).json({ error: 'Please provide a valid array of recipe IDs.' });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        id: { in: recipeIds.map(id => parseInt(id)) }
      },
      select: { id: true, image: true },
    });

    for (const recipe of recipes) {
      const imageUrl = recipe.image;
      if (imageUrl) {
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        console.log(publicId);
        try {
          await cloudinary.v2.uploader.destroy(`recipes/${publicId}`);
          console.log(`Deleted image with public_id: recipes/${publicId}`);
        } catch (error) {
          console.error(`Failed to delete image: ${publicId}`, error);
        }
      }
    }

    const deleteResult = await prisma.recipe.deleteMany({
      where: {
        id: { in: recipeIds.map(id => parseInt(id)) }
      }
    });

    res.json({ message: `Successfully deleted ${deleteResult.count} recipes and their images.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting recipes and images' });
  }
});

router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const email = req.headers.email; // Get email from request headers

  try {
      // Find user by email
      const user = await prisma.user.findUnique({
          where: { email: email }
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the current password matches
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
          return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      await prisma.user.update({
          where: { email: email },
          data: { password: hashedNewPassword }
      });

      res.json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Error updating password' });
  }
});

// Deactivate Account Route
router.delete('/deactivate-profile', authenticateToken, async (req, res) => {
  const email = req.headers.email; // Get email from request headers

  try {
      // Find recipes that are currently PUBLIC
      const publicRecipes = await prisma.recipe.findMany({
          where: {
               email: email , // Use email to find associated recipes
              visibility: 'PUBLIC' // Look for PUBLIC recipes
          }
      });

      // If any PUBLIC recipes are found, update their visibility to PRIVATE
      if (publicRecipes.length > 0) {
          await prisma.recipe.updateMany({
              where: {
                   email: email, // Only update those that are currently PUBLIC
                  visibility: 'PUBLIC'
              },
              data: {
                  visibility: 'PRIVATE' // Set visibility to PRIVATE
              }
          });
      }

      // Update the user's account to deactivate
      await prisma.user.update({
          where: { email: email },
          data: {
              isActive: false,
              // Optionally reset the password or perform other clean-up actions
          }
      });

      res.json({ message: 'Account has been deactivated.' });
  } catch (error) {
      console.error('Error deactivating account:', error);
      res.status(500).json({ message: 'Error deactivating account' });
  }
});


export default router;



