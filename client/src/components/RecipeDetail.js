import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

const RecipeDetailContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
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

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/recipes/${id}`)
      .then(response => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
        setError('Failed to fetch recipe');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <RecipeDetailContainer>
        <RecipeImage
          src={recipe.image ? `http://localhost:5000${recipe.image}` : 'https://via.placeholder.com/800x400'}
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
          <BackButton href="/recipes">Back to Recipes</BackButton>
        </RecipeContent>
      </RecipeDetailContainer>
      <Footer />
    </>
  );
};

export default RecipeDetail;
