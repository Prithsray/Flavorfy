import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import styled from 'styled-components';

const RecipeDetailContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const RecipeImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
  border-radius: 8px;
`;

const RecipeContent = styled.div`
  padding: 1.5rem;
`;

const RecipeTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 1rem;
  color: #333;
  text-align: center;
`;

const RecipeSection = styled.section`
  margin-top: 2rem;

  h2 {
    font-size: 1.75rem;
    color: #28a745;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
  }
`;

const VideoPlayer = styled.iframe`
  width: 100%;
  height: 400px; /* Set a height for the video player */
  border: none; /* Remove border for a cleaner look */
  border-radius: 8px; /* Rounded corners */
  margin-top: 1rem; /* Add some space above the video player */
`;

const BackButton = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-top: 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #28a745;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const PostedByText = styled.p`
  font-size: 0.875rem; /* Smaller font size */
  color: #888; /* Lighter color for the email */
  text-align: right; /* Align text to the right */
  margin-top: 0.9rem; /* Add some space above */
`;

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/recipes/${id}`)
      .then(response => {
        setRecipeData(response.data); // Set the entire response
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
        setError('Failed to fetch recipe');
        setLoading(false);
      });
  }, [id]);

  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    if (videoId) {
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return '';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Destructure recipe and user from recipeData
  const { recipe, user } = recipeData;

  return (
    <>
      <Header />
      <RecipeDetailContainer>
        <RecipeImage
          src={recipe.image ? `${recipe.image}` : 'https://via.placeholder.com/800x400'}
          alt={recipe.title}
        />
        <RecipeContent>
          <RecipeTitle>{recipe.title}</RecipeTitle>
          <RecipeSection>
            <h2>Ingredients</h2>
            <p>{recipe.ingredients}</p>
          </RecipeSection>
          <RecipeSection>
            <h2>Instructions</h2>
            <p>{recipe.instructions}</p>
          </RecipeSection>
          {recipe.videoLink && (
            <RecipeSection>
              <h2>How to cook</h2>
              {/* Embed the video using an iframe */}
              <VideoPlayer src={getEmbedUrl(recipe.videoLink)} allowFullScreen title="Cooking Video" />
            </RecipeSection>
          )}
          {/* Display the user information */}
          <PostedByText>Posted By: {user.name}</PostedByText>
          <BackButton href="/recipes">Back to Recipes</BackButton>
        </RecipeContent>
      </RecipeDetailContainer>
      {/* <Footer /> */}
    </>
  );
};

export default RecipeDetail;
