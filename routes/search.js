import express from 'express';
import prisma from '../prismaClient.js';
import fuzzysort from 'fuzzysort';

const router = express.Router();

router.get('/', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Transform and sanitize the query to lowercase and remove extra whitespace
    const sanitizedQuery = query.trim().replace(/\s+/g, ' ').toLowerCase();

    // Fetch recipes and users with partial matches to reduce database load
    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          { title: { contains: sanitizedQuery } },
          { ingredients: { contains: sanitizedQuery } },
        ],
      },
      select: {
        id: true,
        title: true,
        ingredients: true,
        image: true,
      },
    });

    const people = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: sanitizedQuery } },
          { email: { contains: sanitizedQuery } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
      },
    });

    // Apply fuzzysort on the database results
    const filteredRecipes = fuzzysort.go(sanitizedQuery, recipes, {
      keys: ['title', 'ingredients'],
      threshold: -500, // Adjusted threshold for tighter matching
      limit: 10, // Limit for performance
    }).map(result => result.obj);

    const filteredPeople = fuzzysort.go(sanitizedQuery, people, {
      keys: ['name', 'email'],
      threshold: -500,
      limit: 10,
    }).map(result => result.obj);

    res.json({ recipes: filteredRecipes, people: filteredPeople });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Error searching' });
  }
});

export default router;
