import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
      // Fetch the user data using the id (assuming id is the email)
      const user = await prisma.user.findUnique({
          where: { id: parseInt(id) }, // Adjust this line if the id is not an integer
          select: {
              name: true,
              email: true,
              bio: true,
              profilePicture: true,
          },
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Fetch public recipes associated with the user's email
      const recipes = await prisma.recipe.findMany({
          where: {
              email: user.email,
              visibility: 'PUBLIC',
          },
          select: {
              id: true,
              title: true,
              ingredients: true,
              instructions: true,
              image: true,
              videoLink: true,
              createdAt: true,
          },
      });

      // Fetch followers and following counts using email
      const followersCount = await prisma.follow.count({
          where: {
              followingEmail: user.email, // Change to followingEmail
          },
      });

      const followingCount = await prisma.follow.count({
          where: {
              followerEmail: user.email, // Change to followerEmail
          },
      });

      // Fetch follower names using email
      const followers = await prisma.follow.findMany({
          where: {
              followingEmail: user.email, // Change to followingEmail
          },
          select: {
              follower: {
                  select: {
                      id: true,
                      name: true,
                      email: true, // Include email if needed
                  },
              },
          },
      });

      // Fetch following names using email
      const following = await prisma.follow.findMany({
          where: {
              followerEmail: user.email, // Change to followerEmail
          },
          select: {
              following: {
                  select: {
                      id: true,
                      name: true,
                      email: true, // Include email if needed
                  },
              },
          },
      });

      // Construct the response with user data and public recipes
      const response = {
          user: {
              name: user.name,
              email: user.email,
              bio: user.bio,
              profilePicture: user.profilePicture,
              followersCount,
              followingCount, // Include following count
              followers: followers.map(f => f.follower),
              following: following.map(f => f.following),
          },
          recipes,
      };

      res.json(response);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user data' });
  }
});


// Follow a user
router.post('/follow', async (req, res) => {
  const { userEmail, followEmail } = req.body; // userEmail is the email of the user performing the action, followEmail is the email of the user to follow

  console.log('Follow Request:', { userEmail, followEmail });

  if (!userEmail || !followEmail) {
      return res.status(400).json({ message: 'User emails are required' });
  }

  try {
      const existingFollow = await prisma.follow.findFirst({
          where: {
              followerEmail: userEmail,
              followingEmail: followEmail,
          },
      });

      if (existingFollow) {
          return res.status(200).json({ message: 'You are already following this user', alreadyFollowing: true });
      }

      const follow = await prisma.follow.create({
          data: {
              followerEmail: userEmail,
              followingEmail: followEmail,
          },
      });

      res.status(201).json({ message: 'Followed successfully', alreadyFollowing: false, follow });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error following user' });
  }
});


// Unfollow a user
// Unfollow a user
router.post('/unfollow', async (req, res) => {
  const { userEmail, unfollowEmail } = req.body; // userEmail is the email of the user performing the action, unfollowEmail is the email of the user to unfollow

  console.log('Unfollow Request:', { userEmail, unfollowEmail });

  if (!userEmail || !unfollowEmail) {
      return res.status(400).json({ message: 'User emails are required' });
  }

  try {
      const unfollow = await prisma.follow.deleteMany({
          where: {
              followerEmail: userEmail,
              followingEmail: unfollowEmail,
          },
      });

      if (unfollow.count === 0) {
          return res.status(404).json({ message: 'You are not following this user' });
      }

      res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error unfollowing user' });
  }
});


// Check if user is following another user
// Check if user is following another user
router.get('/user/isFollowing', async (req, res) => {
  const { userEmail, followEmail } = req.query; // userEmail is the email of the user checking, followEmail is the email of the user to check

  console.log('Check Following Request:', { userEmail, followEmail },req.query);

  if (!userEmail || !followEmail) {
      return res.status(400).json({ message: 'User emails are required' });
  }

  try {
      const existingFollow = await prisma.follow.findFirst({
          where: {
              followerEmail: userEmail,
              followingEmail: followEmail,
          },
      });
      console.log("res->",existingFollow);
      res.status(200).json({ alreadyFollowing: !!existingFollow });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error checking following status' });
  }
});


export default router;
