import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';

import recipeRoutes from './routes/recipes.js';
import registerRoutes from './routes/register.js';
import loginRoutes from './routes/login.js';
import profileRoutes from './routes/profile.js';
import searchRoutes from './routes/search.js';
import otpRoutes from './routes/otp.js';
import { admin, adminRouter, prisma } from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_API_BASE_URL = process.env.FRONTEND_URL;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: FRONTEND_API_BASE_URL, credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/otp', otpRoutes);
app.use(admin.options.rootPath, adminRouter);

// Start server
const start = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start();