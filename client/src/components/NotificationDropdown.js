import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NotificationIcon = styled.div`
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 2rem;
  position: relative;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff6347;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
`;

const NotificationDropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 300px;
  padding: 10px 0;
  max-height: ${({ notificationsCount }) => (notificationsCount > 10 ? '300px' : 'auto')};
  overflow-y: ${({ notificationsCount }) => (notificationsCount > 10 ? 'auto' : 'visible')};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
  ${({ isOpen }) => isOpen && `opacity: 1;`}
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #333;
  cursor: pointer;
  font-size: 0.95rem;
  border-bottom: 1px solid #f1f1f1;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProfilePicture = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

const RecipeImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 5px;
  margin-left: 10px;
  object-fit: cover;
`;

const NotificationDropdown = ({ user, isOpen, onToggle }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Refs to the bell icon and the dropdown container
  const bellIconRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch notifications from API when component is mounted or user changes
  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/notifications/${user.email}`)
        .then((response) => {
          setNotifications(response.data);
          const unreadNotifications = response.data.filter((notification) => !notification.isRead);
          setUnreadCount(unreadNotifications.length);
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error);
        });
    }
  }, [user]);

  // Mark notifications as read when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      const unreadNotifications = notifications.filter((notification) => !notification.isRead);
      if (unreadNotifications.length > 0) {
        // Update notifications as read when dropdown is opened
        axios.post(`${API_BASE_URL}/api/notifications/read`, {
          email: user.email,
        }).then(() => {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => ({
              ...notification,
              isRead: true,
            }))
          );
          setUnreadCount(0); // Reset the unread count
        }).catch((error) => {
          console.error('Error marking notifications as read:', error);
        });
      }
    }
  }, [isOpen, notifications, user.email, API_BASE_URL]);

  // Function to format the notification content and add hyperlinks
  const formatContent = (content, recipeId) => {
    if (recipeId) {
      return (
        <Link to={`/recipes/${recipeId}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 'normal' }}>
          {content}
        </Link>
      );
    }
    return <span>{content}</span>; // If no recipeId, just display the content without a link
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          bellIconRef.current && !bellIconRef.current.contains(event.target)) {
        onToggle(); // Close dropdown
      }
    };

    // Add event listener on mount
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onToggle]);

  return (
    <NotificationIcon ref={bellIconRef} onClick={onToggle}>
      <FaBell />
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>} {/* Show unread count */}
      <NotificationDropdownContainer ref={dropdownRef} isOpen={isOpen} notificationsCount={notifications.length}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem key={notification.id}>
              {/* Link profile picture to public profile */}
              <Link to={`/profile/${notification.senderId}`}>
                <ProfilePicture src={notification.profilePicture} alt="Profile" />
              </Link>
              
              {/* Notification content with entire content linked to recipe if recipeId exists */}
              {formatContent(notification.content, notification.recipeId)}

              {/* Display recipe image */}
              {notification.recipeImage && <RecipeImage src={notification.recipeImage} alt="Recipe" />}
            </NotificationItem>
          ))
        ) : (
          <NotificationItem>No new notifications</NotificationItem>
        )}
      </NotificationDropdownContainer>
    </NotificationIcon>
  );
};

export default NotificationDropdown;
