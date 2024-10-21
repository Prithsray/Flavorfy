const express = require('express');
const prisma = require('../prismaClient');
const upload = require('../middleware/upload');

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
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(id) }
    });
    if (recipe) {
      console.log(recipe);
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

// POST a new recipe with image upload
router.post('/', upload.single('image'), async (req, res) => {
  const { title, ingredients, instructions, videoLink } = req.body; // Include videoLink
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
  }

  try {
    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        instructions,
        image,
        videoLink, // Save the video link to the database
      },
    });
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

module.exports = router;
