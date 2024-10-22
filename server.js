const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); // Import express-session

const recipeRoutes = require('./routes/recipes');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const searchRoutes = require('./routes/search');
const otpRoutes=require('./routes/otp')


const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_API_BASE_URL = process.env.FRONTEND_URL;

console.log(FRONTEND_API_BASE_URL);

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: `${FRONTEND_API_BASE_URL}`, credentials: true })); // Enable CORS for specific origin
app.use(express.json());
app.use(session({
  secret: 'your_session_secret', // Change this to a more secure secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/otp', otpRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
