const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
const registerRoutes = require('./routes/register'); // Add this line to import the register routes
const loginRoutes = require('./routes/login'); // Import the login routes


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/register', registerRoutes); // Add this line to use the register routes
app.use('/api/login', loginRoutes); // Use the login route

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
