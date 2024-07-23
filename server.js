const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/recipes', recipeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
