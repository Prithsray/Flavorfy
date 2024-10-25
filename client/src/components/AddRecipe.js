import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from './Header';
import { FaUtensils, FaVideo, FaImage } from 'react-icons/fa'; // Add icons

const AddRecipeContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  background: linear-gradient(135deg, #f9f9f9, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ProfileContainer = styled.div`
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
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;

  svg {
    margin-right: 0.5rem; // Space between icon and text
    color: #28a745;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #28a745;
    outline: none;
    box-shadow: 0 0 5px rgba(40, 167, 69, 0.5), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #28a745;
    outline: none;
    box-shadow: 0 0 5px rgba(40, 167, 69, 0.5), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Title = styled.h1`
  text-align: left;
  margin-bottom: 2rem;
  color: #28a745;
  font-size: 2rem;
`;

const SmallText = styled.span`
  font-size: 0.875rem;
  color: #555;
  margin-left: 0.5rem; /* Space between checkbox and text */
`;

const CheckboxContainer = styled.div`
  max-width: 100px;
  display: inline-flex; /* Make the checkbox and text inline */
  align-items: center; /* Vertically align them in the middle */
`;
const AddRecipe = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [isPrivate, setIsPrivate] = useState(false); // New state for visibility

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = sessionStorage.getItem('email');
    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('videoLink', videoLink);
    if (image) {
      formData.append('image', image);
    }

    // Set visibility based on checkbox state
    formData.append('visibility', isPrivate ? 'PRIVATE' : 'PUBLIC');
    
    try {
      await axios.post(`${API_BASE_URL}/api/recipes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Email': email,
        },
      });
      // Clear form fields
      setTitle('');
      setIngredients('');
      setInstructions('');
      setVideoLink('');
      setImage(null);
      setIsPrivate(false); // Reset checkbox state
      alert('Recipe added successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const email = sessionStorage.getItem('email'); // Get email from session storage

  // Check if email exists
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

  return (
    <>
      <Header />
      <AddRecipeContainer>
        <Title>Add Recipe</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <FaUtensils /> Title:
            </Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter recipe title"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FaUtensils /> Ingredients:
            </Label>
            <TextArea
              rows="5"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              placeholder="List the ingredients"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FaUtensils /> Instructions:
            </Label>
            <TextArea
              rows="5"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              placeholder="Write the cooking instructions"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FaImage /> Image:
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <FaVideo /> Cooking Video Link (If Any):
            </Label>
            <Input
              type="url"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=example"
            />
          </FormGroup>
          <FormGroup>
            <CheckboxContainer>
              <Input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
                style={{ marginRight: '0.5rem' }} // Adjust spacing
              />
              <SmallText>Private </SmallText>
            </CheckboxContainer>
            <br />
            <SmallText>(Check this to set your post private) </SmallText>
          </FormGroup>
          <Button type="submit">Add Recipe</Button>
        </form>
      </AddRecipeContainer>
    </>
  );
};

export default AddRecipe;
