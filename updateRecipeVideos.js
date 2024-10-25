const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateExistingRecords() {
  

  await prisma.recipe.updateMany({
    where: {
      visibility: null
    },
    data: {
      visibility: 'PUBLIC'
    }
  });

  console.log('Updated existing records with default email and createdAt date.');
}

updateExistingRecords()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
