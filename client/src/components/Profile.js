import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
import axios from 'axios';

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfilePicture = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 1.5rem;
`;

const ProfileDetails = styled.div`
  flex: 1;
`;

const ProfileTitle = styled.h1`
  margin: 0;
  color: #28a745;
`;

const ProfileSubtitle = styled.p`
  margin: 0;
  color: #6c757d;
`;

const ProfileContent = styled.div`
  margin-top: 1rem;
`;

const ProfileSection = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #343a40;
`;

const Content = styled.p`
  font-size: 1rem;
  color: #495057;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = sessionStorage.getItem('email');
      if (!email) return; // Exit if no email is found
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Email': email,
          },
          withCredentials: true,
        });
        setUserData(response.data);
        setBio(response.data.bio || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleFileChange = (e) => {
    setNewProfilePicture(e.target.files[0]);
  };

  const handleSave = async () => {
    const email = sessionStorage.getItem('email'); // Retrieve email from session storage
    const formData = new FormData();
    
    // Append the bio and the new profile picture to the form data
    formData.append('bio', bio);
    if (newProfilePicture) {
      formData.append('profilePicture', newProfilePicture);
    }

    try {
      await axios.put('/api/profile', formData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Email': email,
        },
        withCredentials: true,
      });
      setIsEditing(false);
      setNewProfilePicture(null); // Reset profile picture state after saving
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!userData) {
    return (
      <>
        <Header />
        <ProfileContainer>
          <p>Please log in to view your profile.</p>
        </ProfileContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <ProfileContainer>
        <ProfileHeader>
          <ProfilePicture src={userData.profilePicture || "https://via.placeholder.com/100"} alt="Profile Picture" />
          <ProfileDetails>
            <ProfileTitle>{userData.name}</ProfileTitle>
            <ProfileSubtitle>@{userData.name || 'johndoe'}</ProfileSubtitle>
          </ProfileDetails>
        </ProfileHeader>
        <ProfileContent>
          <ProfileSection>
            <Label>Email:</Label>
            <Content>{userData.email}</Content>
          </ProfileSection>
          <ProfileSection>
            <Label>Bio:</Label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={handleBioChange}
                rows="4"
                cols="50"
              />
            ) : (
              <Content>{bio}</Content>
            )}
          </ProfileSection>
          {/* Show profile picture section only if no picture is available and not in edit mode */}
          {!userData.profilePicture && !isEditing && (
            <ProfileSection>
              <Label>Profile Picture:</Label>
              <Content>No profile picture uploaded.</Content>
            </ProfileSection>
          )}
          {/* Show the profile picture upload option and current picture when editing */}
          {isEditing && (
            <ProfileSection>
              <Label>Profile Picture:</Label>
              {userData.profilePicture && (
                <>
                  <ProfilePicture src={userData.profilePicture} alt="Current Profile Picture" />
                  <Content>Current Profile Picture</Content>
                </>
              )}
              <input type="file" onChange={handleFileChange} />
              {newProfilePicture && <Content>{newProfilePicture.name}</Content>}
            </ProfileSection>
          )}
          <ProfileSection>
            {isEditing ? (
              <>
                <EditButton onClick={handleSave}>Save</EditButton>&nbsp;&nbsp;&nbsp;&nbsp;
                <EditButton onClick={() => setIsEditing(false)}>Cancel</EditButton>
              </>
            ) : (
              <EditButton onClick={() => setIsEditing(true)}>Edit Profile</EditButton>
            )}
          </ProfileSection>
        </ProfileContent>
      </ProfileContainer>
      {/* <Footer /> */}
    </>
  );
};

export default Profile;
