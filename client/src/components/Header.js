import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
// import RegisterModal from './RegisterModal';
import { FaChevronDown, FaSearch, FaBars } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: #343a40;
  padding: 0.2rem 1rem;
  height: 70px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    height: auto; /* Set height to auto for smaller screens */
  }
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  justify-content: space-between;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')}; /* Show or hide based on isOpen */
    flex-direction: column; /* Stack items vertically */
    position: absolute; /* Position it absolutely */
    top: 70px; /* Adjust based on header height */
    left: 0;
    background-color: #343a40; /* Match the header color */
    width: 100%; /* Full width */
    z-index: 100; /* Ensure it appears above other elements */
  }
`;

const NavItem = styled.li`
  margin: 0;

  @media (max-width: 768px) {
    padding: 1rem; /* Add padding for touch targets */
  }
`;

const AuthNavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 1rem;
  position: relative;

  @media (max-width: 768px) {
    display: none; /* Hide by default on mobile */
  }
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
  cursor: pointer;
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
  background-color: rgba(211, 211, 211, 0.9);
  color: #000;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 10;
  min-width: 120px;
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const SearchBar = styled.form`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  width: 100%;
  max-width: 590px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.77rem;
  border: 1px solid #ced4da;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #28a745;
  }
`;

const SearchButton = styled.button`
  padding: 0.88rem 1rem;
  border: none;
  border-radius: 0 4px 4px 0;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #218838;
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
`;

const Logo = styled.img`
  max-height: 75px;
  max-width: 100%;
  margin-left: rem;
  margin-right: 1rem;
  align-self: center;
`;

const BurgerIcon = styled(FaBars)`
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block; /* Show on mobile screens */
  }
`;

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false); // State for navigation visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  // const openRegisterModal = () => setIsRegisterModalOpen(true);
  // const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNav = () => setIsNavOpen(!isNavOpen); // Toggle navigation visibility

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <HeaderContainer>
      <StyledLink to="/">
        <Logo src="/logo.png" alt="Flavorfy Logo" />
      </StyledLink>
      <MainContent>
        <BurgerIcon onClick={toggleNav} /> {/* Burger icon for mobile navigation */}

        <NavList isOpen={isNavOpen}> {/* Pass isOpen to NavList */}
          <NavItem><StyledLink to="/">Home</StyledLink></NavItem>
          <NavItem><StyledLink to="/recipes">Recipes</StyledLink></NavItem>
        </NavList>

        <SearchBar onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="Search Items, Recipe"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchButton type="submit">
            <IconWrapper>
              <FaSearch />
            </IconWrapper>
          </SearchButton>
        </SearchBar>

        <AuthNavList>
          {user ? (
            <ProfileWrapper onClick={toggleDropdown}>
              <UserName>Welcome, {user.name}</UserName>
              <DropdownIcon isOpen={isDropdownOpen} />
              <DropdownMenu isOpen={isDropdownOpen}>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <DropdownItem>Profile</DropdownItem>
                </Link>
                <Link to="/add-recipe" style={{ textDecoration: 'none' }}>
                  <DropdownItem>Add Recipe</DropdownItem>
                </Link>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </ProfileWrapper>
          ) : (
            <>
              <NavItem><StyledLink to="#" onClick={openLoginModal}>Login/Register</StyledLink></NavItem>
              {/* <NavItem><StyledLink to="#" onClick={openRegisterModal}>Register</StyledLink></NavItem> */}
            </>
          )}
        </AuthNavList>
      </MainContent>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
      {/* <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} /> */}
    </HeaderContainer>
  );
};

export default Header;
