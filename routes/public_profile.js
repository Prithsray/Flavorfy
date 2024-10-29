import express from 'express';
import multer from 'multer';
import path from 'path';
import cloudinary from 'cloudinary';
import prisma from '../prismaClient.js';
import dotenv from 'dotenv';


const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the user data
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) }, // Use ID to find the user
        select: { // Select only necessary fields
          name: true,
          email: true,
          bio: true,
          profilePicture: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch public recipes associated with the user's email
      const recipes = await prisma.recipe.findMany({
        where: {
          email: user.email,
          visibility: 'PUBLIC', // Ensure the recipe is public
        },
        select: { // Select only necessary fields from Recipe
          id: true,
          title: true,
          ingredients: true,
          instructions: true,
          image: true,
          videoLink: true,
          createdAt: true,
        },
      });
  
      // Construct the response with user data and public recipes
      const response = {
        user: {
          name: user.name,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
        recipes, // Attach the public recipes
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user data' });
    }
  });

  export default router;