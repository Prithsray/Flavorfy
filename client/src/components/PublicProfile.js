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
  max-width: 600px;
  margin: auto;
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
  max-width: 500px;
`;

const ProfileDetail = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
`;

const RecipesContainer = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 130%;
`;

const RecipeCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column; /* Make it a column layout */
  align-items: center; /* Center items */
  justify-content: flex-start; /* Align items to start */
  height: 250px; /* Fixed height for uniformity */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 150px; /* Increased height for better visuals */
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
  color: #28a745; /* Change text color */
  text-decoration: none;
  font-weight:bold;
  margin-top: auto; /* Push the link to the bottom */

  &:hover {
    text-decoration: underline; /* Add underline on hover */
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

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <>
      <Header />
      <ProfileContainer>
        <ProfileImage
          src={user.user.profilePicture || 'https://via.placeholder.com/150'}
          alt={user.user.name}
        />
        <ProfileName>{user.user.name}</ProfileName>
        <ProfileEmail>{user.user.email}</ProfileEmail>
        <ProfileDetailsContainer>
          <ProfileDetail><strong>Bio:</strong> {user.user.bio || 'No bio available'}</ProfileDetail>
        </ProfileDetailsContainer>
        <h2>Recipes</h2>
        <RecipesContainer>
          {user.recipes.length > 0 ? (
            user.recipes.map(recipe => (
              <RecipeCard key={recipe.id}>
                {recipe.image && <RecipeImage src={recipe.image} alt={recipe.title} />}
                <RecipeTitle>{recipe.title}</RecipeTitle>
                <RecipeLink to={`/recipes/${recipe.id}`}>View Recipe</RecipeLink>
              </RecipeCard>
            ))
          ) : (
            <p>No public recipes available.</p>
          )}
        </RecipesContainer>
      </ProfileContainer>
    </>
  );
};

export default Profile;
