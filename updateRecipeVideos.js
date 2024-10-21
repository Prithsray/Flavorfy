const prisma = require('./prismaClient'); // Adjust the path as necessary

// Example data: replace this with your actual data
const videoLinks = [
 
  { id: 5, videoLink: 'https://www.youtube.com/watch?v=TzYACT9nT7A' },
  
  // Add more records as necessary
];

async function updateVideoLinks() {
  for (const { id, videoLink } of videoLinks) {
    try {
      await prisma.recipe.update({
        where: { id },
        data: { videoLink }, // Update the videoLink field
      });
      console.log(`Updated recipe with ID ${id} to include video link: ${videoLink}`);
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error);
    }
  }
}

updateVideoLinks()
  .then(() => {
    console.log('Video link update complete.');
    prisma.$disconnect(); // Disconnect from the database
  })
  .catch((error) => {
    console.error('Error during update:', error);
    prisma.$disconnect(); // Disconnect from the database on error
  });
