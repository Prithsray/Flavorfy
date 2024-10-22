// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Delete the user with id:5
async function main() {
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: 30,
      },
    });
    console.log('Deleted User:', deleteUser); // This will display the deleted user's details
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the main function
main();
