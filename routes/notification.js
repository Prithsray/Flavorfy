import express from 'express';
import prisma from '../prismaClient.js'; // Adjust the path to your Prisma client
const router = express.Router();

// API to fetch notifications for a user
// API to fetch notifications for a user
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where: {
        userEmail: email,
      },
      orderBy: {
        createdAt: 'desc', // Fetch most recent notifications first
      },
    });

    // Fetch sender emails and recipe images based on recipeId
    const senderEmails = notifications.map((notification) => notification.senderEmail);
    const recipeIds = notifications.map((notification) => notification.recipeId).filter((id) => id !== null); // Remove null values

    // Fetch users for all the sender emails
    const users = await prisma.user.findMany({
      where: {
        email: { in: senderEmails }, // Fetch users whose emails are in senderEmail array
      },
      select: {
        email: true,
        id: true, // Select the user id
        profilePicture: true, // Fetch the user's profile picture
      },
    });

    // Fetch recipes only for the valid recipeIds (not null)
    const recipes = recipeIds.length > 0 ? await prisma.recipe.findMany({
      where: {
        id: { in: recipeIds }, // Fetch recipes whose ids are in the recipeId array
      },
      select: {
        id: true,
        image: true, // Fetch the recipe image
      },
    }) : []; // If no valid recipeId, don't query recipes

    // Create a response with notifications, corresponding sender IDs, profile pictures, and recipe images
    const notificationsWithDetails = notifications.map((notification) => {
      const sender = users.find(user => user.email === notification.senderEmail);
      const recipe = recipes.find(recipe => recipe.id === notification.recipeId);

      return {
        content: notification.content,
        senderId: sender ? sender.id : null, // If sender exists, attach id, otherwise null
        isRead: notification.isRead, // Include the isRead field
        profilePicture: sender ? sender.profilePicture : null, // Attach sender's profile picture
        recipeImage: recipe ? recipe.image : null, // Attach recipe image, if available
        recipeId: recipe ? recipe.id : null, // Attach recipe id, if available
      };
    });

    res.status(200).json(notificationsWithDetails);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// API to create a new notification
router.post('/', async (req, res) => {
  const { userEmail, content, type,senderEmail,recipeId  } = req.body;

  try {
    const notification = await prisma.notification.create({
      data: {
        userEmail,
        senderEmail,
        content,
        type,       // Notification type field
        recipeId: parseInt(recipeId)
      }
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Backend endpoint to mark notifications as read
router.post('/read', async (req, res) => {
  const { email } = req.body;

  try {
    // Update all unread notifications as read
    await prisma.notification.updateMany({
      where: {
        userEmail: email,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;
