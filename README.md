# Flavorfy - Comprehensive Documentation


Built with React.js for a user-friendly interface and Express.js for a robust backend, this app lets users find, add, and save new recipes
effortlessly. Prisma ORM manages SQLite for efficient data handling, ensuring fast and reliable access to recipes. Enjoy seamless
and intuitive recipe management with this modern, full-stack solution.



## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Configuration](#configuration)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [Frontend Guide](#frontend-guide)
10. [Development Guide](#development-guide)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Flavorfy** is a full-stack recipe discovery and management application that allows users to:
- Find and explore recipes
- Create and save personal recipes
- Share recipes with visibility controls (public/private)
- Follow other users and discover their recipes
- Engage with comments and notifications
- Manage user profiles with profile pictures and bios

**Live Demo**: https://flavorfy.vercel.app/

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v18.3.1)
- **Routing**: React Router DOM (v6.25.1)
- **Styling**: Styled Components (v6.1.12)
- **UI Components**: React Icons (v5.2.1), React Modal (v3.16.1)
- **Carousel**: React Slick (v0.30.2)
- **HTTP Client**: Axios (v1.6.0)
- **Testing**: Jest & React Testing Library

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js (v4.21.1)
- **Database ORM**: Prisma (v5.21.1)
- **Database**: SQLite
- **Admin Panel**: AdminJS (v7.8.13) with Prisma integration
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **Security**: bcrypt (v5.1.1)
- **File Storage**: Cloudinary (v2.5.1)
- **File Upload**: Multer (v1.4.5-lts.1)
- **Email**: Nodemailer (v6.9.15)
- **Search**: FuzzySort (v3.1.0)
- **CORS**: CORS (v2.8.5)
- **Session Management**: Express Session

---

## ✨ Features

### User Management
- **Registration**: Email-based registration with password hashing
- **OTP Verification**: Email OTP verification for account activation
- **Authentication**: JWT-based authentication
- **Profile Management**: User bios, profile pictures (Cloudinary)
- **Password Reset**: Forgot password flow with OTP verification
- **Account Status**: Active/Inactive user states

### Recipe Management
- **Create Recipes**: Add recipes with images, ingredients, instructions, and video links
- **Visibility Control**: Public/Private recipe visibility
- **Recipe Discovery**: Browse all public recipes
- **Recipe Details**: View complete recipe with creator information
- **Image Upload**: Direct upload to Cloudinary

### Social Features
- **Comments System**: Nested comments and replies on recipes
- **Notifications**: Real-time notifications for recipe interactions
- **Follow System**: Follow other users and their recipes
- **Public Profiles**: View other users' public recipes and information
- **Search**: Fuzzy search for recipes and users

### Admin Dashboard
- **AdminJS Interface**: Web-based admin dashboard
- **User Management**: Create, edit, view user accounts
- **Recipe Management**: Manage all recipes and their visibility
- **Admin Management**: Manage admin accounts

---

## 📁 Project Structure

```plaintext
Flavorfy/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── routes/                          # Express Routes
│   ├── admin.js                    # AdminJS configuration
│   ├── recipes.js                  # Recipe CRUD operations
│   ├── register.js                 # User registration
│   ├── login.js                    # User authentication
│   ├── profile.js                  # User profile management
│   ├── public_profile.js           # Public profile viewing
│   ├── search.js                   # Recipe & user search
│   ├── otp.js                      # OTP verification
│   ├── comments.js                 # Comment management
│   ├── notification.js             # Notification system
│   └── profile_old.js              # Legacy profile route
│
├── middleware/                     # Express Middleware
│   ├── auth.js                     # JWT authentication
│   └── ...
│
├── utils/                          # Utility Functions
│   ├── otpMailer.js               # OTP generation & email
│   └── ...
│
├── prisma/                         # Database Configuration
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
│
├── uploads/                        # Local file uploads (backup)
├── .adminjs/                       # AdminJS configuration files
├── server.js                       # Express server entry point
├── prismaClient.js                 # Prisma client initialization
├── package.json                    # Backend dependencies
├── .gitignore
├── README.md
└── [Utility Scripts]
    ├── adminuseradd.js            # Add admin users
    ├── viewRecords.js             # View database records
    ├── updateRecipeVideos.js      # Update recipe video links
    └── update_file.js             # Utility for file updates
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn
- SQLite3
- Cloudinary account (for image uploads)
- Email service credentials (for OTP sending)

### Step 1: Clone Repository
```bash
git clone https://github.com/Prithsray/Flavorfy.git
cd Flavorfy
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Database
DATABASE_URL="file:./dev.db"
```

#### Initialize Database
```bash
npx prisma migrate dev --name init
```

This will create the SQLite database and apply schema migrations.

#### Run Backend
```bash
npm start
```

The server will start on `http://localhost:5000`

### Step 3: Frontend Setup

Navigate to the client directory:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_ADMIN_URL=http://localhost:5000/admin
```

Run the frontend:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Step 4: Full Development Mode
From the root directory, run both server and client concurrently:
```bash
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)


### Prisma Configuration
Edit `prisma/schema.prisma` to modify database models and relationships.

---

## 🔌 API Reference

### Authentication Routes (`/api/login`)

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully! Please check your email for the OTP."
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Forgot Password
```http
POST /api/login/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/login/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword"
}
```

### OTP Routes (`/api/otp`)

#### Verify OTP
```http
POST /api/otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Resend OTP
```http
POST /api/otp/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Recipe Routes (`/api/recipes`)

#### Get All Public Recipes
```http
GET /api/recipes
```

#### Get Single Recipe
```http
GET /api/recipes/:id
```

#### Create Recipe
```http
POST /api/recipes
Content-Type: multipart/form-data
Headers: email: user@example.com

Fields:
- title: "Pasta Carbonara"
- ingredients: "pasta, eggs, bacon, cheese"
- instructions: "Cook pasta, mix eggs with cheese..."
- image: [file]
- videoLink: "https://youtube.com/watch?v=..."
- visibility: "PUBLIC" or "PRIVATE"
```

### Profile Routes (`/api/profile`)

#### Get User Profile
```http
GET /api/profile
Headers: email: user@example.com
```

#### Update Profile
```http
PUT /api/profile
Content-Type: multipart/form-data
Headers: email: user@example.com

Fields:
- bio: "Food enthusiast"
- profilePicture: [file]
```

### Search Routes (`/api/search`)

#### Search Recipes & Users
```http
GET /api/search?query=pasta
```

**Response:**
```json
{
  "recipes": [
    {
      "id": 1,
      "title": "Pasta Carbonara",
      "ingredients": "pasta, eggs, bacon",
      "image": "https://cloudinary.com/..."
    }
  ],
  "people": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "https://cloudinary.com/...",
      "bio": "Food enthusiast"
    }
  ]
}
```

### Comments Routes (`/api/comments`)

#### Get Comments
```http
GET /api/comments?recipeId=1
```

#### Add Comment
```http
POST /api/comments
Content-Type: application/json

{
  "content": "Delicious recipe!",
  "userEmail": "user@example.com",
  "recipeId": 1,
  "parentId": null
}
```

#### Add Reply
```http
POST /api/comments
Content-Type: application/json

{
  "content": "Thanks for the feedback!",
  "userEmail": "user@example.com",
  "recipeId": 1,
  "parentId": 5
}
```

### Notifications Routes (`/api/notifications`)

#### Get User Notifications
```http
GET /api/notifications/:email
```

#### Create Notification
```http
POST /api/notifications
Content-Type: application/json

{
  "userEmail": "recipient@example.com",
  "senderEmail": "sender@example.com",
  "content": "liked your recipe",
  "type": "like",
  "recipeId": 1
}
```

---

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id              Int      @id @default(autoincrement())
  name            String
  email           String   @unique
  password        String
  bio             String?
  profilePicture  String?
  isActive        Boolean  @default(false)
  otp             String?
  createdAt       DateTime @default(now())
}
```

### Recipe Model
```prisma
model Recipe {
  id           Int      @id @default(autoincrement())
  title        String
  ingredients  String
  instructions String
  image        String?
  videoLink    String?
  email        String
  visibility   String   @default("PUBLIC")
  createdAt    DateTime @default(now())
}
```

### Comment Model
```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  userEmail String
  recipeId  Int
  parentId  Int?
  createdAt DateTime @default(now())
}
```

### Notification Model
```prisma
model Notification {
  id          Int      @id @default(autoincrement())
  userEmail   String
  senderEmail String
  content     String
  type        String
  recipeId    Int?
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

### Follow Model
```prisma
model Follow {
  id              Int    @id @default(autoincrement())
  followerEmail   String
  followingEmail  String
}
```

---

## 🎨 Frontend Guide

### Key Components & Pages
- **RecipeList**: Display all public recipes
- **RecipeDetail**: View single recipe with comments
- **CreateRecipe**: Form to create new recipes
- **UserProfile**: User's recipes and settings
- **PublicProfile**: View other users' profiles
- **Search**: Search recipes and users
- **NotificationCenter**: User notifications
- **AdminDashboard**: Access via `/admin`

### Styling
Uses **Styled Components** for CSS-in-JS styling. All components have consistent theming.

---

## 👨‍💻 Development Guide

### Adding a New Route

1. Create file in `routes/` directory (e.g., `routes/likes.js`)
2. Define Express router:
   ```javascript
   import express from 'express';
   import prisma from '../prismaClient.js';
   
   const router = express.Router();
   
   router.get('/', async (req, res) => {
     // Implementation
   });
   
   export default router;
   ```
3. Import and use in `server.js`:
   ```javascript
   import likesRoutes from './routes/likes.js';
   app.use('/api/likes', likesRoutes);
   ```

### Adding a New Database Model

1. Update `prisma/schema.prisma`:
   ```prisma
   model Like {
     id        Int     @id @default(autoincrement())
     userId    Int
     recipeId  Int
   }
   ```
2. Run migration:
   ```bash
   npx prisma migrate dev --name add_likes
   ```

### Testing Routes
Use Postman, Thunder Client, or curl to test API endpoints.

---

## 🚀 Deployment

### Backend (Vercel/Railway/Heroku)

1. Set up environment variables on platform
2. Ensure `DATABASE_URL` uses a remote database (PostgreSQL/MySQL)
3. Deploy `package.json` and all source files

### Frontend (Vercel/Netlify)

1. Set `REACT_APP_API_BASE_URL` to production backend URL
2. Run `npm run build` to create production build
3. Deploy `build/` folder

### Database Migration
```bash
npx prisma migrate deploy
```

---

## 🐛 Troubleshooting

### Common Issues

#### "Cannot find module '@prisma/client'"
```bash
npm install @prisma/client
npx prisma generate
```

#### CORS Error
Check `FRONTEND_URL` in `.env` matches your frontend domain.

#### OTP Not Sending
Verify Gmail/Email credentials and enable "Less secure app access" or use app-specific passwords.

#### Image Upload Fails
Check Cloudinary credentials and API key validity.

#### Database Connection Error
Ensure `DATABASE_URL` is correct and database file exists at specified path.

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please create a feature branch and submit a pull request.

---

## 📞 Support

For issues, questions, or suggestions, please create an issue on GitHub.

---

**Last Updated**: March 15, 2026
