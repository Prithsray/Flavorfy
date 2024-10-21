import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import styled from 'styled-components';

const RecipeListContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #28a745;
  text-align: center;
`;

const RecipeListGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const RecipeCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
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
  text-align: center;
`;

const RecipeTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
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
    text-decoration: underline;
  }
`;

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/recipes`)
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
    <>
      <Header />
      <RecipeListContainer>
        <PageTitle>Our Recipes</PageTitle>
        <RecipeListGrid>
          {recipes && recipes.length > 0 ? (
            recipes.map(recipe => (
              <RecipeCard key={recipe.id}>
                <RecipeImage
                  src={recipe.image ? `${API_BASE_URL}${recipe.image}` : 'https://via.placeholder.com/300x200'}
                  alt={recipe.title}
                />
                <RecipeContent>
                  <RecipeTitle>{recipe.title}</RecipeTitle>
                  <RecipeLink href={`/recipes/${recipe.id}`}>View Recipe</RecipeLink>
                </RecipeContent>
              </RecipeCard>
            ))
          ) : (
            <p>No recipes available.</p>
          )}
        </RecipeListGrid>
      </RecipeListContainer>
    
    </>
  );
};

export default RecipeList;
