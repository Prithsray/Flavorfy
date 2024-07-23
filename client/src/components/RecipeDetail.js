import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/recipes/${id}`)
      .then(response => setRecipe(response.data))
      .catch(error => console.error(error));
  }, [id]);

  return (
    <><Header /><div>
      <h1>{recipe.title}</h1>
      <h2>Ingredients</h2>
      <p>{recipe.ingredients}</p>
      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
    </div><Footer /></>
  );
};

export default RecipeDetail;
