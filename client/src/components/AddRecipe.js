import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const AddRecipeContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
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
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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
    background-color: #218838;
  }
`;

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newRecipe = { title, ingredients, instructions };

    axios.post('http://localhost:5000/api/recipes', newRecipe)
      .then(response => {
        setTitle('');
        setIngredients('');
        setInstructions('');
        alert('Recipe added successfully');
      })
      .catch(error => console.error(error));
  };

  return (
    <><Header /><AddRecipeContainer>
      <h1>Add Recipe</h1>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Ingredients:</Label>
          <TextArea
            rows="5"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Instructions:</Label>
          <TextArea
            rows="5"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)} />
        </FormGroup>
        <Button type="submit">Add Recipe</Button>
      </form>
    </AddRecipeContainer><Footer /></>
  );
};

export default AddRecipe;
