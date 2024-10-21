// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Fetch all users
async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log(users); // This will display all users in the console
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the main function
main();
