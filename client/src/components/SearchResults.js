import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';

const SearchResultsContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
`;

const PageTitle = styled.h1`
  font-size: 2.0rem;
  margin-bottom: 2rem;
  color: #28a745;
  text-align: center;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${({ isActive }) => (isActive ? '#28a745' : '#e0e0e0')};
  color: ${({ isActive }) => (isActive ? 'white' : '#333')};
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#218838' : '#c0c0c0')};
  }
`;


const ResultListGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const NoResultsMessage = styled.p`
  color: #6c757d;
  font-size: 1.2rem;
  text-align: center;
`;

// Recipe Card Component
const RecipeCard = ({ recipe }) => (
  <StyledCard>
    <CardImage src={recipe.image || 'https://via.placeholder.com/300x200'} alt={recipe.title} />
    <CardContent>
      <CardTitle>{recipe.title}</CardTitle>
      <StyledLink to={`/recipes/${recipe.id}`}>View Recipe</StyledLink>
    </CardContent>
  </StyledCard>
);

// Person Card Component
const PersonCard = ({ person }) => (
  <Link to={`/profile/${person.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <StyledCard>
      <CardImage src={person.profilePicture || 'https://via.placeholder.com/300x200'} alt={person.name} />
      <CardContent>
        <CardTitle>{person.name}</CardTitle>
      </CardContent>
    </StyledCard>
  </Link>
);

// Styled Components for Cards
const StyledCard = styled.div`
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

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const StyledLink = styled(Link)`
  display: block;
  margin-top: 1rem;
  font-size: 1rem;
  color: #28a745;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: #218838;
  }
`;

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query');
  const [results, setResults] = useState({ recipes: [], people: [] });
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      axios.get(`${API_BASE_URL}/api/search?query=${encodeURIComponent(searchQuery)}`)
        .then(response => {
          setResults({
            recipes: response.data.recipes || [],
            people: response.data.people || [],
          });
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

  const renderActiveTabResults = () => {
    const data = activeTab === 'recipes' ? results.recipes : results.people;

    return data.length > 0 ? (
      <ResultListGrid>
        {data.map((item) =>
          activeTab === 'recipes' ? (
            <RecipeCard key={item.id} recipe={item} />
          ) : (
            <PersonCard key={item.id} person={item} />
          )
        )}
      </ResultListGrid>
    ) : (
      <NoResultsMessage>No results found for this category.</NoResultsMessage>
    );
  };

  return (
    <>
      <Header />
      <SearchResultsContainer>
        <PageTitle>Search Results for "{searchQuery}"</PageTitle>
        
        <TabsContainer>
          <TabButton isActive={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')}>Recipes</TabButton>
          <TabButton isActive={activeTab === 'people'} onClick={() => setActiveTab('people')}>People</TabButton>
        </TabsContainer>
        
        {renderActiveTabResults()}
      </SearchResultsContainer>
    </>
  );
};

export default SearchResults;
