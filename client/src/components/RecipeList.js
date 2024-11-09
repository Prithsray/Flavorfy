import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

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
  transition: transform 0.5s ease;
  ${({ animate }) =>
    animate &&
    css`
      animation: ${fadeIn} 0.5s ease;
    `}
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

const PaginationButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #218838;
  }
`;

const PageNumber = styled.span`
  font-size: 1rem;
  color: #333;
`;

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [animate, setAnimate] = useState(false); // Track animation
  const recipesPerPage = 8;
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/recipes`)
      .then(response => {
        const publicRecipes = response.data;
        setRecipes(publicRecipes);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch recipes');
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const handlePageChange = (newPage) => {
    setAnimate(false); // Reset animation
    setTimeout(() => {
      setPage(newPage);
      setAnimate(true); // Trigger fade-in after page change
    }, 0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Get recipes for the current page
  const start = page * recipesPerPage;
  const displayedRecipes = recipes.slice(start, start + recipesPerPage);

  return (
    <>
      <Header />
      <RecipeListContainer>
        <PageTitle>Our Recipes</PageTitle>
        <RecipeListGrid animate={animate}>
          {displayedRecipes && displayedRecipes.length > 0 ? (
            displayedRecipes.map(recipe => (
              <RecipeCard key={recipe.id}>
                <RecipeImage
                  src={recipe.image ? `${recipe.image}` : 'https://via.placeholder.com/300x200'}
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
        
        {/* Pagination buttons with page number */}
        <PaginationButtons>
          <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
            Previous
          </PaginationButton>
          <PageNumber>
            Page {page + 1} of {totalPages}
          </PageNumber>
          <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
            Next
          </PaginationButton>
        </PaginationButtons>
      </RecipeListContainer>
    </>
  );
};

export default RecipeList;
