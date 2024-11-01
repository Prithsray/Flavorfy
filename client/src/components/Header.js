import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { FaChevronDown, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: #343a40;
  padding: 0.5rem 1rem;
  color: #fff;
  position: relative;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const LogoAndToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 50px;
  width: auto;
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  margin-left: 2rem;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    width: 100%;
    margin-left: 0;
    padding-top: 1rem;
    align-items: stretch;
  }
`;

const SearchBar = styled.form`
  display: flex;
  max-width: 500px;
  width: 100%;
  margin: 0 2rem;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    order: -1;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 1rem;
  
  &:focus {
    border-color: #28a745;
  }
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #28a745;
  border: none;
  border-radius: 0 4px 4px 0;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #218838;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NavItem = styled.li`
  margin: 0;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #28a745;
  }
  
  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.1rem;
  
  &:hover {
    color: #28a745;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  
  @media (max-width: 768px) {
    position: static;
    box-shadow: none;
    background-color: transparent;
    min-width: 100%;
  }
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.dark ? '#fff' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.dark ? '#4a4a4a' : '#f8f9fa'};
  }
  
  @media (max-width: 768px) {
    color: white;
    padding: 0.5rem 0;
    
    &:hover {
      background-color: transparent;
      color: #28a745;
    }
  }
`;

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(storedUser);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsNavOpen(false);
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoAndToggle>
          <Link to="/">
            <Logo src="/logo.png" alt="Flavorfy Logo" />
          </Link>
          <MobileToggle onClick={() => setIsNavOpen(!isNavOpen)}>
            {isNavOpen ? <FaTimes /> : <FaBars />}
          </MobileToggle>
        </LogoAndToggle>

        <MainContent isOpen={isNavOpen}>
          <SearchBar onSubmit={handleSearchSubmit}>
            <SearchInput
              type="text"
              placeholder="Search Items, Recipe, People"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </SearchBar>

          <Navigation>
            <NavList>
              <NavItem>
                <StyledLink to="/" onClick={() => setIsNavOpen(false)}>
                  Home
                </StyledLink>
              </NavItem>
              <NavItem>
                <StyledLink to="/recipes" onClick={() => setIsNavOpen(false)}>
                  Recipes
                </StyledLink>
              </NavItem>
            </NavList>

            <UserSection ref={dropdownRef}>
              {user ? (
                <>
                  <ProfileButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <span>Welcome, {user.name}</span>
                    <FaChevronDown />
                  </ProfileButton>
                  <DropdownMenu isOpen={isDropdownOpen}>
                    <Link to="/profile" style={{ textDecoration: 'none' }} onClick={() => setIsNavOpen(false)}>
                      <DropdownItem>Profile</DropdownItem>
                    </Link>
                    <Link to="/profile-recipe" style={{ textDecoration: 'none' }} onClick={() => setIsNavOpen(false)}>
                      <DropdownItem>My Recipes</DropdownItem>
                    </Link>
                    <Link to="/add-recipe" style={{ textDecoration: 'none' }} onClick={() => setIsNavOpen(false)}>
                      <DropdownItem>Add Recipe</DropdownItem>
                    </Link>
                    <Link to="/settings" style={{ textDecoration: 'none' }} onClick={() => setIsNavOpen(false)}>
                      <DropdownItem>Settings</DropdownItem>
                    </Link>
                    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                  </DropdownMenu>
                </>
              ) : (
                <StyledLink to="#" onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsNavOpen(false);
                }}>
                  Login/Register
                </StyledLink>
              )}
            </UserSection>
          </Navigation>
        </MainContent>
      </HeaderContent>
      
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={() => setIsLoginModalOpen(false)} />
    </HeaderContainer>
  );
};

export default Header;