import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from './Header';

const AddRecipeContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem; /* Reduced space between label and input */
  font-weight: bold;
  font-size: 1.1rem; /* Increased font size */
  color: #333; /* Darker color for better readability */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem; /* Consistent font size */
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #28a745; /* Change border color on focus */
    outline: none; /* Remove default outline */
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem; /* Consistent font size */
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #28a745; /* Change border color on focus */
    outline: none; /* Remove default outline */
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838; /* Darker green on hover */
  }

  &:disabled {
    background-color: #ccc; /* Grey out button when disabled */
    cursor: not-allowed;
  }
`;

const Title = styled.h1`
  text-align: center; /* Center title */
  margin-bottom: 1.5rem; /* Space below title */
  color: #28a745; /* Matching title color with button */
`;

const AddRecipe = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [videoLink, setVideoLink] = useState(''); // New state for video link

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = sessionStorage.getItem('email'); // Get email from sessionStorage

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('videoLink', videoLink); // Append video link to formData
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/recipes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Email': email, // Send email in the headers
        },
      });
      setTitle('');
      setIngredients('');
      setInstructions('');
      setVideoLink(''); // Clear video link after submission
      setImage(null);
      alert('Recipe added successfully');
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <>
      <Header />
      <AddRecipeContainer>
        <Title>Add Recipe</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title:</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required // Make the field required
            />
          </FormGroup>
          <FormGroup>
            <Label>Ingredients:</Label>
            <TextArea
              rows="5"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required // Make the field required
            />
          </FormGroup>
          <FormGroup>
            <Label>Instructions:</Label>
            <TextArea
              rows="5"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required // Make the field required
            />
          </FormGroup>
          <FormGroup>
            <Label>Image:</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required // Make the field required
            />
          </FormGroup>
          <FormGroup>
            <Label> Cooking Video Link (If Any) :</Label>
            <Input
              type="url" // Use url type for validation
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=example" // Example placeholder
            />
          </FormGroup>
          <Button type="submit">Add Recipe</Button>
        </form>
      </AddRecipeContainer>
    </>
  );
};

export default AddRecipe;
