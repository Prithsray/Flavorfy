import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Home from './components/Home';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import AddRecipe from './components/AddRecipe';
import Profile from './components/Profile';


function App() {
  return (
    <><Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
