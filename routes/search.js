import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Transform the query to lowercase
    const lowerCaseQuery = query.toLowerCase();

    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          {
            title: {
              contains: lowerCaseQuery,
            },
          },
          {
            ingredients: {
              contains: lowerCaseQuery,
            },
          },
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
          { name: { contains: lowerCaseQuery } },
          { email: { contains: lowerCaseQuery } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
      },
    });

    res.json({ recipes, people });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Error searching' });
  }
});

export default router;
