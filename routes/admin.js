import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express from 'express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import SQLiteStore from 'connect-sqlite3';
import session from 'express-session';
import path from 'path';
import bcrypt from 'bcrypt';

//const PORT = 5000;

// Initialize Prisma Client
const prisma = new PrismaClient();

AdminJS.registerAdapter({ Database, Resource });

//const app = express();

const admin = new AdminJS({
  resources: [
    {
      resource: { model: getModelByName('User'), client: prisma },
      options: {
        label: 'Users',
        properties: {
          password: {
            isVisible: { list: false, edit: true, show: false },
          },
          hashedPassword: {
            type: 'string',
            isVisible: { list: true, edit: false, show: true },
          },
          isActive: {
            type: 'boolean',
          },
        },
        listProperties: ['id', 'name', 'email', 'isActive', 'otp'],
        editProperties: ['name', 'email', 'password', 'bio', 'isActive', 'profilePicture', 'otp'],
        showProperties: ['id', 'name', 'email', 'hashedPassword', 'bio', 'isActive', 'profilePicture', 'otp'],
      },
    },
    {
      resource: { model: getModelByName('Recipe'), client: prisma },
      options: {
        label: 'Recipes',
        properties: {
          image: {
            type: 'string',
            isVisible: { list: true, edit: true, show: true },
          },
          createdAt: {
            type: 'date',
          },
        },
        listProperties: ['id', 'title', 'email', 'createdAt', 'visibility'],
        editProperties: ['title', 'ingredients', 'instructions', 'image', 'videoLink', 'email', 'createdAt', 'visibility'],
        showProperties: ['id', 'title', 'ingredients', 'instructions', 'image', 'videoLink', 'email', 'createdAt', 'visibility'],
      },
    },
    {
      resource: { model: getModelByName('Admin'), client: prisma },
      options: {
        label: 'Admins',
        properties: {
          password: {
            isVisible: { list: false, edit: true, show: false },
          },
          hashedPassword: {
            type: 'string',
            isVisible: { list: true, edit: false, show: true },
          },
          createdAt: {
            type: 'date',
          },
        },
        listProperties: ['id', 'email', 'hashedPassword', 'name', 'createdAt', 'updatedAt'],
        editProperties: ['email', 'password', 'name', 'createdAt', 'updatedAt'],
        showProperties: ['id', 'email', 'hashedPassword', 'name', 'createdAt', 'updatedAt'],
      },
    },
  ],
  rootPath: '/admin',
});

// Fetch admin credentials from the database
const DEFAULT_ADMIN = await prisma.admin.findFirst();

const authenticate = async (email, password) => {
  if (DEFAULT_ADMIN) {
    const admin = await prisma.admin.findUnique({
      where: { email: DEFAULT_ADMIN.email },
    });
    
    if (admin && await bcrypt.compare(password, admin.password)) {
      return Promise.resolve(admin);
    }
  }
  return null;
};

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: 'adminjs',
    cookiePassword: 'sessionsecret',
  },
  null,
);







export { admin, adminRouter, prisma };
