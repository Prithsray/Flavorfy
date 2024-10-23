// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Fetch all records from the recipe table
async function main() {
  try {
    const allRecipes = await prisma.recipe.findMany();
    console.log('All Recipes:', allRecipes); // This will display all recipes
  } catch (error) {
    console.error('Error fetching recipes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the main function
main();
