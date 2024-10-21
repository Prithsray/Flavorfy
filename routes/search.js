const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

// Search recipes by title or ingredients
router.get('/', async (req, res) => {
  const { query } = req.query; // Get the search query from the request
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query.toLowerCase(), // Convert query to lower case
              // Custom filtering using the "LOWER" function
              // Note: Using raw SQL might be necessary for case-insensitivity
            },
          },
          {
            ingredients: {
              contains: query.toLowerCase(), // Convert query to lower case
              // Custom filtering using the "LOWER" function
              // Note: Using raw SQL might be necessary for case-insensitivity
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        ingredients: true,
        instructions: true,
        image: true,
      },
    });

    res.json(recipes); // Return the matching recipes
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

module.exports = router;
