import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const HeaderContainer = styled.header`
  background-color: #343a40;
  padding: 1rem;
  color: #fff;
  display: flex;
  justify-content: center; /* Center align all items horizontally */
  align-items: center; /* Center items vertically */
  position: relative; /* Position for absolute positioning of AuthNavList */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1100px; /* Limit max width to keep content centered */
  justify-content: space-between; /* Space between NavList and AuthNavList */
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  gap: 2rem; /* Add gap between navigation items */
`;

const NavItem = styled.li`
  margin: 0;
  @media (max-width: 768px) {
    margin: 0 0.5rem;
  }
`;

const AuthNavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 1rem; /* Add gap between login and register links */
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #28a745;
  }
`;

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  return (
    <HeaderContainer>
      <MainContent>
        <NavList>
          <NavItem><StyledLink to="/">Home</StyledLink></NavItem>
          <NavItem><StyledLink to="/recipes">Recipes</StyledLink></NavItem>
          <NavItem><StyledLink to="/add-recipe">Add Recipe</StyledLink></NavItem>
          <NavItem><StyledLink to="/profile">Profile</StyledLink></NavItem>
        </NavList>
        <AuthNavList>
          <NavItem><StyledLink to="#" onClick={openLoginModal}>Login</StyledLink></NavItem>
          <NavItem><StyledLink to="#" onClick={openRegisterModal}>Register</StyledLink></NavItem>
        </AuthNavList>
      </MainContent>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />
    </HeaderContainer>
  );
};

export default Header;
