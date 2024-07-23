import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

const RecipeListContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  background-color: #f8f9fa;
`;

const RecipeCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
`;

const RecipeContent = styled.div`
  padding: 1.5rem;
`;

const RecipeTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: #333;
`;

const RecipeLink = styled.a`
  text-decoration: none;
  color: #28a745;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #218838;
  }
`;

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes')
      .then(response => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch recipes');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
      <><div><Header /></div><RecipeListContainer>
      <h1>Recipes</h1>
      {recipes && recipes.length > 0 ? (
        recipes.map(recipe => (
          <RecipeCard key={recipe.id}>
            <RecipeImage src={recipe.image || 'https://via.placeholder.com/300x200'} alt={recipe.title} />
            <RecipeContent>
              <RecipeTitle>{recipe.title}</RecipeTitle>
              <RecipeLink href={`/recipes/${recipe.id}`}>View Recipe</RecipeLink>
            </RecipeContent>
          </RecipeCard>
        ))
      ) : (
        <p>No recipes available.</p>
      )}
    </RecipeListContainer><div> <Footer /></div></>  
  );
};

export default RecipeList;
