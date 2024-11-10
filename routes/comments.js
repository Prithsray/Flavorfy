import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

// Get all comments for a specific recipe (with nesting)
router.get('/', async (req, res) => {
  const { recipeId } = req.query;
  if (!recipeId) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  try {
    // Fetch all comments for the given recipe
    const comments = await prisma.comment.findMany({
      where: { recipeId: parseInt(recipeId) },
      orderBy: { createdAt: 'asc' },
    });

    // Get unique userEmails from the comments
    const uniqueUserEmails = [...new Set(comments.map(comment => comment.userEmail))];

    // Fetch the names and userIds for each unique userEmail from the User table
    const users = await prisma.user.findMany({
      where: { email: { in: uniqueUserEmails } },
      select: { email: true, name: true, id: true }, // Add userId (id) to the selection
    });

    // Create a mapping of userEmail to user name and userId
    const userMap = users.reduce((acc, user) => {
      acc[user.email] = { name: user.name, id: user.id }; // Include userId
      return acc;
    }, {});

    // Helper function to nest replies under their parent comments
    const nestComments = (comments, parentId = null) =>
      comments
        .filter(comment => comment.parentId === parentId)
        .map(comment => ({
          ...comment,
          userName: userMap[comment.userEmail]?.name || 'Unknown User', // Add user name
          userId: userMap[comment.userEmail]?.id || null, // Add userId
          replies: nestComments(comments, comment.id),
        }));

    res.json(nestComments(comments));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  const { content, userEmail, recipeId, parentId } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        userEmail,
        recipeId: parseInt(recipeId),
        parentId,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Update a comment by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment or reply by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { parentId } = req.query;  // Check if it's a reply by checking the parentId

  try {
    // If it's a reply, delete only the reply
    if (parentId) {
      await prisma.comment.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: 'Reply deleted successfully' });
    } else {
      // If it's a parent comment, first delete the replies, then the parent comment
      await prisma.comment.deleteMany({
        where: {
          parentId: parseInt(id),
        },
      });

      // Then delete the parent comment itself
      await prisma.comment.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.json({ message: 'Comment and its replies deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment and replies' });
  }
});


export default router;
