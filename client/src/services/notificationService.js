// src/services/notificationService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL; // Ensure this is set in your .env file
const API_URL = `${API_BASE_URL}/api/notifications`;

// Function to post a notification
const postNotification = async (userEmail, content, type, senderEmail, recipeId = null) => {
    try {
      console.log(userEmail, content, type, senderEmail, recipeId);
      
      // Prepare the request payload with optional recipeId
      const payload = {
        userEmail,
        content,
        type,
        senderEmail,
      };
  
      if (recipeId) {
        payload.recipeId = recipeId;  // Include recipeId if provided
      }
  
      const response = await axios.post(API_URL, payload);
      
      return response.data;
    } catch (error) {
      console.error('Error posting notification:', error);
      throw error;
    }
  };
  

export default postNotification ;
