import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled components for the modal
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 560px;
  height: 550px;
  display: flex;
  flex-direction: column;
`;

const ScrollableContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px; /* To ensure the scrollbar doesn't overlap content */
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  color:green;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const CheckboxLabel = styled.label`
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const RecipeImage = styled.img`
  width: 200px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom:10px;
`;

const EditModal = ({ recipe, onClose, onSuccess }) => {
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [videoLink, setVideoLink] = useState(recipe.videoLink);
  const [image, setImage] = useState(recipe.image);
  const [visibility, setVisibility] = useState(recipe.visibility);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile/recipes-edit/${recipe.id}`,
        {
          title,
          ingredients,
          instructions,
          videoLink,
          image,
          visibility,
          email: recipe.email, // Ensure email is passed
        }
      );

      if (response.status === 200) {
        // Call onSuccess to update parent state if needed
        onSuccess(response.data);
        alert('Recipe updated successfully!');
      }
    } catch (error) {
      setError('Failed to update the recipe.');
      console.error('Error updating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBackground>
      <ModalContainer>
        <ModalTitle>Edit Recipe</ModalTitle>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* Scrollable content container */}
        <ScrollableContainer>
        <RecipeImage src={recipe.image || '/placeholder-image.png'} alt={recipe.title} />
          <Label htmlFor="title">Recipe Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label htmlFor="ingredients">Recipe Ingredients</Label>
          <Textarea
            id="ingredients"
            rows="4"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />

          <Label htmlFor="instructions">Recipe Instructions</Label>
          <Textarea
            id="instructions"
            rows="4"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <Label htmlFor="videoLink">Video Link</Label>
          <Input
            id="videoLink"
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />

          {/* <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          /> */}

          <Label>Visibility</Label> 
          <CheckboxContainer>
            <CheckboxLabel>
              <input
                type="radio"
                value="PUBLIC"
                checked={visibility === 'PUBLIC'}
                onChange={handleVisibilityChange}
              />
              Public
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="radio"
                value="PRIVATE"
                checked={visibility === 'PRIVATE'}
                onChange={handleVisibilityChange}
              />
              Private
            </CheckboxLabel>
          </CheckboxContainer>
        </ScrollableContainer>

        {/* Fixed buttons at the bottom */}
        <ButtonContainer>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={onClose} style={{ backgroundColor: '#dc3545' }}>
            Cancel
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackground>
  );
};

export default EditModal;
