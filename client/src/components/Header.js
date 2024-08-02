import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { FaChevronDown } from 'react-icons/fa'; // Importing the dropdown icon

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
  position: relative;
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

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer; /* Make the whole profile wrapper clickable */
`;

const UserName = styled.span`
  margin-right: 0.5rem;
`;

const DropdownIcon = styled(FaChevronDown)`
  margin-left: 0.5rem;
  font-size: 1rem;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DropdownMenu = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: 50px;
  right: 0;
  background-color: rgba(211, 211, 211, 0.9); /* Light gray with slight transparency */
  color: #000;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 10;
  min-width: 120px; /* Set a minimum width for the dropdown menu */
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [user, setUser] = useState(null); // State to store user information
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch user info from session storage or API
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('email'); // Remove user info from session storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name'); // Remove token from session storage
    setUser(null); // Clear user state
    setIsDropdownOpen(false); // Close the dropdown menu
    window.location.reload();
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <HeaderContainer>
      <MainContent>
        <NavList>
          <NavItem><StyledLink to="/">Home</StyledLink></NavItem>
          <NavItem><StyledLink to="/recipes">Recipes</StyledLink></NavItem>
          <NavItem><StyledLink to="/add-recipe">Add Recipe</StyledLink></NavItem>
        </NavList>
        <AuthNavList>
          {user ? (
            <ProfileWrapper onClick={toggleDropdown}>
              <UserName>Welcome, {user.name}</UserName>
              <DropdownIcon isOpen={isDropdownOpen} />
              <DropdownMenu isOpen={isDropdownOpen}>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <DropdownItem>Profile</DropdownItem>
                </Link>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </ProfileWrapper>
          ) : (
            <>
              <NavItem><StyledLink to="#" onClick={openLoginModal}>Login</StyledLink></NavItem>
              <NavItem><StyledLink to="#" onClick={openRegisterModal}>Register</StyledLink></NavItem>
            </>
          )}
        </AuthNavList>
      </MainContent>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />
    </HeaderContainer>
  );
};

export default Header;
