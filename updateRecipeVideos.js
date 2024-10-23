const prisma = require('./prismaClient'); // Adjust the path as necessary

// Example data: replace this with your actual data
const emails = [
 
  { id: 4, email:'prithsray@gmail.com' },

  { id: 5, email: 'prithsray@gmail.com' },

  { id: 6, email: 'prithsray@gmail.com' },

  { id: 7,email: 'prithsray@gmail.com'  },

  { id: 8, email: 'prithsray@gmail.com' },

  { id: 9, email: 'prithsray@gmail.com' },

  { id: 10, email: 'prithsray@gmail.com' },

  { id: 11, email: 'prithsray@gmail.com' },
  { id: 12, email: 'prithsray@gmail.com' },

  { id: 13, email: 'prithsray@gmail.com' },
  { id: 14, email: 'prithsray@gmail.com' },

  { id: 21,email: 'prithsray@gmail.com' },


  
  
  // Add more records as necessary
];

async function updateVideoLinks() {
  for (const { id, email } of emails) {
    try {
      await prisma.recipe.update({
        where: { id },
        data: { email }, // Update the videoLink field
      });
      console.log(`Updated recipe with ID ${id} to include video link: ${email}`);
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
