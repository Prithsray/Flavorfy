import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Using Link for navigation
import axios from 'axios';
import Header from './Header';
import CommentSection from './CommentSection';
import styled from 'styled-components';
import LoadingScreen from "./Loading";

const RecipeDetailContainer = styled.div`
background-color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 1200px;
  margin: auto;
  flex-wrap: wrap; /* Allow items to wrap on small screens */
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
  flex: 3; /* Allow content to take more space */
  max-width: 800px;
  width: 100%;
`;

const Sidebar = styled.div`
background-color: #fff;
  padding: 1rem;
  flex: 1; /* Sidebar should take less space */
  
  margin-left: 2rem;
  border-radius: 8px;
  width: 90%;
  margin-top: 1rem;
  @media (min-width: 768px) {
    margin-top: 0; /* No margin on larger screens */
    margin-left: 0.5rem;
  }
`;

const RecipeTitle = styled.h1`
  font-size: 1.8rem;
  margin: 1rem 0 1rem;
  color: #333;
  text-align: center;
`;

const RecipeSection = styled.section`
  margin-top: 2rem;

  h2 {
    font-size: 1.3rem;
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
  height: 350px; /* Set a height for the video player */
  border: none; /* Remove border for a cleaner look */
  border-radius: 8px; /* Rounded corners */
  margin-top: 1rem; /* Add some space above the video player */
`;

const PostedByText = styled.p`
  font-size: 0.875rem;
  color: #888;
  text-align: right;
  margin-top: 0.9rem;
`;

const RecipeSuggestion = styled.div`
  margin-bottom: 1rem;
  text-align: center;
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.1); /* Add shadow for a card-like effect */
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px); /* Lift up the card on hover */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Increase shadow on hover */
  }
`;

const RecipeSuggestionImage = styled.img`
  width: 100%;
  height: 150px;
  max-width:300px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
`;

const RecipeSuggestionTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 1rem 0;
`;

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch the specific recipe details
    axios.get(`${API_BASE_URL}/api/recipes/${id}`)
      .then(response => {
        const recipe = response.data.recipe;
        if (!recipe) {
          alert('This recipe does not exist.');
          window.location.href = '/recipes';
          setLoading(false);
          return;
        }
        setRecipeData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
        alert("Recipe doesn't exist.");
        window.location.href = '/recipes';
        setError('Failed to fetch recipe');
        setLoading(false);
      });

    // Fetch all recipes to display random ones
    axios.get(`${API_BASE_URL}/api/recipes`)
      .then(response => {
        const allRecipes = response.data;
        const shuffledRecipes = allRecipes.sort(() => 0.5 - Math.random()); // Shuffle the array
        const randomSelection = shuffledRecipes.slice(0, 7); // Get 4-5 random recipes
        setRandomRecipes(randomSelection);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, [id]);

  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    if (videoId) {
      const ampersandPosition = videoId.indexOf('&');
      return ampersandPosition !== -1
        ? `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`
        : `https://www.youtube.com/embed/${videoId}`;
    }
    return '';
  };

  if (loading) return <LoadingScreen/>;
  if (error) return <p>{error}</p>;

  const { recipe, user } = recipeData;

  return (
    <>
      <Header />
      <RecipeDetailContainer>
        <RecipeContent>
          <RecipeImage src={recipe.image ? recipe.image : 'https://via.placeholder.com/800x400'} alt={recipe.title} />
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
              <VideoPlayer src={getEmbedUrl(recipe.videoLink)} allowFullScreen title="Cooking Video" />
            </RecipeSection>
          )}
          <PostedByText>Posted By: {user.name}</PostedByText>

          {/* Comment section */}
          <CommentSection recipeId={id} postuserEmail={user.email} recipeName={recipe.title} />
        </RecipeContent>

        <Sidebar>
          <h2 style={{ marginBottom: '20px' }}>Some More Recipes</h2>
          {randomRecipes.length > 0 ? (
            randomRecipes.map((suggestedRecipe) => (
              <Link to={`/recipes/${suggestedRecipe.id}`} key={suggestedRecipe.id} style={{ textDecoration: 'none' }}>
                <RecipeSuggestion>
                  <RecipeSuggestionImage
                    src={suggestedRecipe.image || 'https://via.placeholder.com/200'}
                    alt={suggestedRecipe.title}
                  />
                  <RecipeSuggestionTitle>{suggestedRecipe.title}</RecipeSuggestionTitle>
                </RecipeSuggestion>
              </Link>
            ))
          ) : (
            <p>No suggestions available</p>
          )}
        </Sidebar>
      </RecipeDetailContainer>
    </>
  );
};

export default RecipeDetail;
