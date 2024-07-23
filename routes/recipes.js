const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Load sample JSON data
const dataPath = path.join(__dirname, '../data/recipes.json');
let recipes = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// GET all recipes
router.get('/', (req, res) => {
  res.json(recipes);
});

// POST a new recipe
router.post('/', (req, res) => {
  const { title, ingredients, instructions } = req.body;
  const newRecipe = {
    id: (recipes.length + 1).toString(),
    title,
    ingredients,
    instructions
  };

  recipes.push(newRecipe);
  fs.writeFileSync(dataPath, JSON.stringify(recipes, null, 2), 'utf-8');
  res.status(201).json(newRecipe);
});

module.exports = router;
