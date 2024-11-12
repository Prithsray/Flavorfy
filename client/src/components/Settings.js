// Settings.js
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from './Header';

const SettingsContainer = styled.div`
  display: flex; // Use flexbox for horizontal layout
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

// Tab styling
const TabContainer = styled.div`
  display: flex;
  flex-direction: column; // Stack tabs vertically
  border-right: 1px solid #ddd; // Add a right border for separation
  margin-right: 1.5rem; // Add space between tabs and content
`;

const Tab = styled.button`
  padding: 1rem; // Increase padding for a comfortable click area
  background-color: ${(props) => (props.active ? '#1cca5b' : '#e9ecef')};
  color: ${(props) => (props.active ? '#fff' : '#6c757d')};
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin-bottom: 0.8rem; // Space between tabs

  &:hover {
    background-color: ${(props) => (props.active ? '#16a34a' : '#dee2e6')};
  }
`;

// Styling for form inputs and buttons
const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.75rem 0;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #16a34a;
  }
`;

const UpdateButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #1cca5b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #16a34a;
  }
`;

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
// Reuse DeactivateButton for deactivation
const DeactivateButton = styled(UpdateButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const Section = styled.div`
  margin: 1.5rem 0; /* Add gap between sections */
  flex-grow: 1; /* Allow section to take available space */
`;

const Settings = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('password');


  const email = sessionStorage.getItem('email');
  const handleDeactivate = async () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      try {
        
        await axios.delete(`${API_BASE_URL}/api/profile/deactivate-profile`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Email': email,
          },
          withCredentials: true,
        });
        alert('Account has been deactivated.');
        sessionStorage.clear();
        window.location.href = '/';
      } catch (error) {
        console.error('Error deactivating account:', error);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    try {
     
      await axios.put(`${API_BASE_URL}/api/profile/change-password`, {
        currentPassword,
        newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Email': email,
        },
        withCredentials: true,
      });
      alert('Password updated successfully.');
      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };


  if (!email) {
    return (
      <>
        <Header />
        <ProfileContainer>
          <p>Please log in to view this page.</p>
        </ProfileContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <SettingsContainer>
        <div>
          <h2 style={{ marginBottom: '20px' }}>Settings</h2>
          <TabContainer>
            <Tab active={activeTab === 'password'} onClick={() => setActiveTab('password')}>
              Update Password
            </Tab>
            <Tab active={activeTab === 'display'} onClick={() => setActiveTab('display')}>
              Display Preferences
            </Tab>
            <Tab active={activeTab === 'deactivation'} onClick={() => setActiveTab('deactivation')}>
              Account Deactivation
            </Tab>
          </TabContainer>
        </div>
        {/* Tab Content */}
        <Section>
          {activeTab === 'password' && (
            <Section>
              <h3 style={{marginBottom:'20px'}}>Update Password</h3>
              <label style={{fontSize:'14px',fontWeight:'bold'}}>
                Current Password
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </label>
              <label  style={{fontSize:'14px',fontWeight:'bold'}}>
                New Password
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </label>
              <label  style={{fontSize:'14px',fontWeight:'bold'}}>
                Confirm New Password
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </label>
              <UpdateButton onClick={handlePasswordChange}>Update Password</UpdateButton>
            </Section>
          )}

          {activeTab === 'display' && (
            <Section>
              <h3 style={{marginBottom:'20px'}}>Display Preferences</h3>
              <label>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                Enable Dark Mode
              </label>
            </Section>
          )}

          {activeTab === 'deactivation' && (
            <Section>
              <h3 style={{marginBottom:'20px'}}>Account Deactivation</h3>
              <DeactivateButton onClick={handleDeactivate}>Deactivate My Account</DeactivateButton>
            </Section>
          )}
        </Section>
      </SettingsContainer>
    </>
  );
};

export default Settings;
