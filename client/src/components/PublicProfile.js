import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';

// Styled components
const ProfileContainer = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  max-width: 700px;
  margin: auto;
  margin-bottom: 2px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
  border: 4px solid #28a745;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ProfileEmail = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProfileDetailsContainer = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 1rem;
  max-width: 500px;
`;

const ProfileDetail = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
`;

const CountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 1rem 0;
`;

const CountBox = styled.div`
  text-align: center;
  cursor: pointer; /* Change cursor to pointer */
`;

const CountText = styled.h3`
  font-size: 1.5rem;
  color: #28a745;
`;

const NamesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NameItem = styled.li`
  font-size: 1rem;
  color: #555;
`;

const RecipesContainer = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 110%;
`;

const RecipeCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 250px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const RecipeTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0.5rem 0;
`;

const RecipeLink = styled(Link)`
  display: block;
  padding: 0.5rem;
  color: #28a745;
  text-decoration: none;
  font-weight: bold;
  margin-top: auto;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: #007bff;
`;

const ErrorText = styled.p`
  font-size: 1.5rem;
  color: #dc3545;
`;

const FollowButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: ${props => (props.isFollowing ? '#dc3545' : '#28a745')};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => (props.isFollowing ? '#c82333' : '#218838')};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const ModalCloseButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/public-profile/${userId}`);
      console.log(response.data);
      setUser(response.data); // Store user data directly
    } catch (err) {
      setError('Failed to fetch user profile');
    }
  };

  // Check follow status
  const checkFollowStatus = async (followerEmail) => {
    if (!followerEmail || !user) return; // Early return if conditions are not met

    try {
      const followingResponse = await axios.get(`${API_BASE_URL}/api/public-profile/user/isFollowing`, {
        params: {
          userEmail: followerEmail,
          followEmail: user.user.email, // Adjusted to match the new structure
        },
      });
      setIsFollowing(followingResponse.data.alreadyFollowing);
    } catch (err) {
      setError('Failed to check follow status');
    }
  };

  // Follow a user
  const followUser = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/public-profile/follow`, {
        userEmail: sessionStorage.getItem('email'),
        followEmail: user.user.email, // Adjusted to match the new structure
      });
      setIsFollowing(true);
    } catch (err) {
      setError('Failed to follow user');
    }
  };

  // Unfollow a user
  const unfollowUser = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/public-profile/unfollow`, {
        userEmail: sessionStorage.getItem('email'),
        unfollowEmail: user.user.email, // Adjusted to match the new structure
      });
      setIsFollowing(false);
    } catch (err) {
      setError('Failed to unfollow user');
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
  
      try {
        await fetchUserProfile(); // Fetch user profile
      } catch (err) {
        setError("Failed to fetch user profile");
      }
  
      setLoading(false);
    };
  
    fetchProfile();
  }, [userId]);
  
  useEffect(() => {
    const checkStatus = async () => {
      const followerEmail = sessionStorage.getItem("email");
      if (followerEmail && user) {
        try {
          await checkFollowStatus(followerEmail); // Check follow status only if follower email is available
        } catch (err) {
          setError("Failed to check follow status");
        }
      }
    };
  
    checkStatus();
  }, [user]); // This runs when 'user' is updated after 'fetchUserProfile'
  

  const handleFollowToggle = () => {
    const followerEmail = sessionStorage.getItem('email');

    if (followerEmail == user.user.email) {
      return; // Do nothing, follow button will not be displayed anyway
    }


    if (isFollowing) {
      unfollowUser(); // Unfollow user
    } else {
      followUser(); // Follow user
    }
  };

  const handleFollowersClick = () => {
    setShowFollowersModal(true);
  };

  const handleFollowingClick = () => {
    setShowFollowingModal(true);
  };

  const handleCloseModal = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
  };

  if (loading) return <LoadingText>Loading profile...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <>
      <Header />
      <ProfileContainer>
        <ProfileImage src={user.user.profilePicture || 'https://via.placeholder.com/100'} alt="Profile" />
        <ProfileName>{user.user.name}</ProfileName>
        <ProfileEmail>{user.user.email}</ProfileEmail>
        <ProfileDetailsContainer>
          <CountContainer>
            <CountBox onClick={handleFollowersClick}>
              <CountText>{user.user.followers.length}</CountText>
              <ProfileDetail>Followers</ProfileDetail>
            </CountBox>
            <CountBox onClick={handleFollowingClick}>
              <CountText>{user.user.following.length}</CountText>
              <ProfileDetail>Following</ProfileDetail>
            </CountBox>
          </CountContainer>
          <ProfileDetail>Bio: {user.user.bio || 'No bio available'}</ProfileDetail>
        </ProfileDetailsContainer>
        {sessionStorage.getItem('email') && sessionStorage.getItem('email') !== user.user.email && (
    <FollowButton onClick={handleFollowToggle} isFollowing={isFollowing}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </FollowButton>
  )}

        <RecipesContainer>
          {user.recipes.length > 0 ? (
            user.recipes.map(recipe => (
              <RecipeCard key={recipe.id}>
                <RecipeImage src={recipe.image} alt={recipe.title} />
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeLink to={`/recipes/${recipe.id}`}>View Recipe</RecipeLink>
              </RecipeCard>
            ))
          ) : (
            <ProfileDetail>No recipes found.</ProfileDetail>
          )}
        </RecipesContainer>

        {showFollowersModal && (
  <Modal>
    <ModalContent>
      <h2>Followers</h2>
      <NamesList>
        {user.user.followers.length > 0 ? (
          user.user.followers.map((follower) => (
            <NameItem key={follower.email}>{follower.name || follower.email}</NameItem> // Assuming 'name' is available
          ))
        ) : (
          <ProfileDetail>No followers yet.</ProfileDetail>
        )}
      </NamesList>
      <ModalCloseButton onClick={handleCloseModal}>Close</ModalCloseButton>
    </ModalContent>
  </Modal>
)}

{showFollowingModal && (
  <Modal>
    <ModalContent>
      <h2>Following</h2>
      <NamesList>
        {user.user.following.length > 0 ? (
          user.user.following.map((following) => (
            <NameItem key={following.id}>{following.name || following.email}</NameItem> // Display name or email
          ))
        ) : (
          <ProfileDetail>Not following anyone yet.</ProfileDetail>
        )}
      </NamesList>
      <ModalCloseButton onClick={handleCloseModal}>Close</ModalCloseButton>
    </ModalContent>
  </Modal>
)}

      </ProfileContainer>
    </>
  );
};

export default Profile;