import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from './Header';
import EditRecipeModal from './EditRecipeModal';

// Styled Components
const Container = styled.div`
  padding: 50px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ProfileContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: #333;
  font-size: 18px;
`;

const ScrollableTableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #eaeaea;
  }
`;

const TableHeader = styled.th`
  padding: 14px;
  border: 1px solid #ddd;
  text-align: left;
  font-weight: bold;
  color: #333;
`;

const TableCell = styled.td`
  padding: 14px;
  border: 1px solid #ddd;
  text-align: left;
  word-wrap: break-word;
  max-width: 300px; /* limit long text */
`;

const RecipeImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const SearchInput = styled.input`
  width: 26%;
  min-width: 160px;
  padding: 12px;
  border: 1px solid #c4d1dc;
  border-radius: 8px;
  font-size: 13px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;
const SearchInputLabel = styled.label`
  font-size: 14px; /* Adjusted font size */
  color: #444;
  margin-right: 1px; /* Space between label and input */
  display: flex;
  gap:10px;
  align-items: center; /* Center label vertically with input */
`;


const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  padding: 25px;
  background-color: #e9f0f7;
  border-radius: 12px;
  border: 2px solid #c4d1dc;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #444;
  font-weight: 500;
  margin-right: 15px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 6px;
  border: 1px solid #c4d1dc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #ffffff;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.p`
  font-size: 16px;
  color: #28a745;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #dc3545;
  text-align: center;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  
`;


const ToggleText = styled.p`
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
  margin: 0;
`;

const Title = styled.h1`
  text-align: left;
  margin-bottom: 2rem;
  color: #28a745;
  font-size: 2rem;
`;

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPrivateFilter, setIsPrivateFilter] = useState(false);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [expandedIngredientIds, setExpandedIngredientIds] = useState(new Set());
  const [expandedInstructionIds, setExpandedInstructionIds] = useState(new Set());

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const email = sessionStorage.getItem('email');

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        if (!email) {
          setError('User is not logged in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/profile/recipes`, {
          params: { email },
        });

        setRecipes(response.data);
        setFilteredRecipes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipes.');
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [API_BASE_URL, email]);

  useEffect(() => {
    const filtered = recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrivateFilter = isPrivateFilter ? recipe.visibility === 'PRIVATE' : true;

      const createdAtDate = new Date(recipe.createdAt);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      const matchesDateRange =
        (!startDate || createdAtDate >= startDateObj) &&
        (!endDate || createdAtDate <= endDateObj);

      return matchesSearch && matchesPrivateFilter && matchesDateRange;
    });

    setFilteredRecipes(filtered);
  }, [searchQuery, recipes, isPrivateFilter, startDate, endDate]);

  const handleSelectRecipe = (id) => {
    if (selectedRecipeIds.includes(id)) {
      setSelectedRecipeIds(selectedRecipeIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedRecipeIds([...selectedRecipeIds, id]);
    }
  };

  const handleEditSelection = () => {
    if (selectedRecipeIds.length === 1) {
      const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeIds[0]);
      setCurrentRecipe(selectedRecipe);
      setShowEditModal(true);
    } else {
      alert('Select only one recipe for editing.');
    }
  };

  const handleUpdateSuccess = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe))
    );
    setShowEditModal(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedRecipeIds.length > 0) {
      try {
        const confirmDelete = window.confirm('Are you sure you want to delete the selected recipes?');
        if (!confirmDelete) return;

        const response = await axios.delete(`${API_BASE_URL}/api/profile/recipes-delete`, {
          data: { recipeIds: selectedRecipeIds },
        });

        if (response.status === 200) {
          alert(`${response.data.message}`);
          setRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => !selectedRecipeIds.includes(recipe.id))
          );
          setFilteredRecipes((prevFiltered) =>
            prevFiltered.filter((recipe) => !selectedRecipeIds.includes(recipe.id))
          );
          setSelectedRecipeIds([]);
        }
      } catch (error) {
        console.error('Error deleting recipes:', error);
        alert('Failed to delete the selected recipes.');
      }
    } else {
      alert('No recipes selected for deletion.');
    }
  };

  const toggleExpandIngredients = (id) => {
    setExpandedIngredientIds((prev) => {
      const newIds = new Set(prev);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const toggleExpandInstructions = (id) => {
    setExpandedInstructionIds((prev) => {
      const newIds = new Set(prev);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const isExpandedIngredients = (id) => expandedIngredientIds.has(id);
  const isExpandedInstructions = (id) => expandedInstructionIds.has(id);

  if (!email) {
    return (
      <>
        <Header />
        <ProfileContainer>
          <p>Please log in to view this page.</p>
        </ProfileContainer>
      </>
    );
  }

  // if (loading) {
  //   return (
  //     <>
  //       <Header />
  //       <ProfileContainer>
  //         <LoadingMessage>Loading your recipes...</LoadingMessage>
  //       </ProfileContainer>
  //     </>
  //   );
  // }

  if (error) {
    return (
      <>
        <Header />
        <ProfileContainer>
          <ErrorMessage>{error}</ErrorMessage>
        </ProfileContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <Title>My Recipes</Title>
        
        <FilterContainer>
          
        <SearchInputLabel>
    Search:
    <SearchInput
      type="text"
      placeholder="Search recipes..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </SearchInputLabel>
         
          <FilterSection>
            <FilterLabel>
              From Date: &nbsp;
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FilterLabel>
            <FilterLabel>
              To Date: &nbsp;
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FilterLabel>
            <FilterLabel>
            <Checkbox
              type="checkbox"
              checked={isPrivateFilter}
              onChange={(e) => setIsPrivateFilter(e.target.checked)}
            />
            Show Private Only
          </FilterLabel>
          </FilterSection>
          {selectedRecipeIds.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleDeleteSelected}>Delete</Button>
              {selectedRecipeIds.length === 1 && (
                <Button onClick={handleEditSelection}>Edit</Button>
              )}
            </div>
          )}
        </FilterContainer>

        <ScrollableTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Select</TableHeader>
                <TableHeader>#</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Image</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Ingredients</TableHeader>
                <TableHeader>Instructions</TableHeader>
                <TableHeader>Visibility</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe, index) => (
                  <TableRow key={recipe.id}>
                    <TableCell>
                      <Checkbox
                        type="checkbox"
                        checked={selectedRecipeIds.includes(recipe.id)}
                        onChange={() => handleSelectRecipe(recipe.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{new Date(recipe.createdAt).toLocaleDateString('en-US')}</TableCell>
                    <TableCell>
                      <RecipeImage src={recipe.image || '/placeholder-image.png'} alt={recipe.title} />
                    </TableCell>
                    <TableCell style={{fontWeight:"bold"}}>{recipe.title}</TableCell>
                   
                    
                    <TableCell>
                      {isExpandedIngredients(recipe.id) ? (
                        <>
                          {recipe.ingredients}
                          <ToggleText onClick={() => toggleExpandIngredients(recipe.id)}>Show Less</ToggleText>
                        </>
                      ) : (
                        <>
                          {recipe.ingredients.slice(0, 50)}...
                          <ToggleText  onClick={() => toggleExpandIngredients(recipe.id)}>Show More</ToggleText>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {isExpandedInstructions(recipe.id)  ? (
                        <>
                          {recipe.instructions}
                          <ToggleText onClick={() => toggleExpandInstructions(recipe.id)}>Show Less</ToggleText>
                        </>
                      ) : (
                        <>
                          {recipe.instructions.substring(0, 50)}...
                          <ToggleText onClick={() => toggleExpandInstructions(recipe.id)}>Show More</ToggleText>
                        </>
                      )}
                    </TableCell>
                    <TableCell style={{ color: 'green', fontWeight: 'bold' }}>
                      {recipe.visibility.toLowerCase()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="8">No recipes found.</TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </ScrollableTableContainer>
      </Container>

      {showEditModal && (
        <EditRecipeModal
          recipe={currentRecipe}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default RecipeList;