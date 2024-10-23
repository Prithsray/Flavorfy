import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const SearchResultsContainer = styled.div`
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

const NoResultsMessage = styled.p`
  color: #6c757d; /* Grey color for no results */
  font-size: 1.2rem;
  text-align: center;
`;

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query'); // Get the search query from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (searchQuery) {
      axios.get(`${API_BASE_URL}/api/search?query=${encodeURIComponent(searchQuery)}`)
        .then(response => {
          setResults(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch search results');
          setLoading(false);
        });
    }
  }, [searchQuery]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <SearchResultsContainer>
        <PageTitle>Search Results for "{searchQuery}"</PageTitle>
        <RecipeListGrid>
          {results && results.length > 0 ? (
            results.map(recipe => (
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
            <NoResultsMessage>No results found.</NoResultsMessage>
          )}
        </RecipeListGrid>
      </SearchResultsContainer>
      
    </>
  );
};

export default SearchResults;
