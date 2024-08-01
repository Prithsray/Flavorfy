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
  width: 50%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
`;

const RecipeContent = styled.div`
  padding: 1.5rem;
`;

const RecipeTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: #333;
`;

const RecipeSection = styled.section`
  margin-top: 2rem;
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
        </RecipeContent>
      </RecipeDetailContainer>
      <Footer />
    </>
  );
};

export default RecipeDetail;
