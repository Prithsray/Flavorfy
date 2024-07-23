import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

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
  return (
    <>
      <Header />
      <ProfileContainer>
        <ProfileHeader>
          <ProfilePicture src="https://via.placeholder.com/100" alt="Profile Picture" />
          <ProfileDetails>
            <ProfileTitle>John Doe</ProfileTitle>
            <ProfileSubtitle>@johndoe</ProfileSubtitle>
          </ProfileDetails>
        </ProfileHeader>
        <ProfileContent>
          <ProfileSection>
            <Label>Email:</Label>
            <Content>john.doe@example.com</Content>
          </ProfileSection>
          <ProfileSection>
            <Label>Bio:</Label>
            <Content>
              Enthusiastic cook and food blogger. I love sharing recipes and tips for delicious meals.
            </Content>
          </ProfileSection>
          <ProfileSection>
            <EditButton>Edit Profile</EditButton>
          </ProfileSection>
        </ProfileContent>
      </ProfileContainer>
      <Footer />
    </>
  );
};

export default Profile;
