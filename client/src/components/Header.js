import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { FaChevronDown, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

const HeaderContainer = styled.header`
  background-color: rgba(255, 255, 255, 0.98);
  padding: 0.75rem 1.5rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 1px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  
  &:hover {
    box-shadow: 
      0 6px 12px -2px rgba(0, 0, 0, 0.12),
      0 3px 6px -2px rgba(0, 0, 0, 0.07),
      0 1px 0 rgba(0, 0, 0, 0.05);
  }
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
  gap: 1.5rem;
`;

const Logo = styled.img`
  height: 45px;
  width: auto;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #16a34a;
  }
  
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
  position: relative;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    order: -1;
  }
`;
const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 9999px;
  border-color: #16a34a;
  outline: none;
  font-size: 0.95rem;
  background-color: #f8fafc;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  
  &:focus {
    
    box-shadow: 
      0 0 0 3px rgba(22, 163, 74, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.03);
    background-color: white;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #16a34a;
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
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #16a34a;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #16a34a;
    
    &:after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    display: block;
    padding: 0.75rem 0;
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #16a34a;
    background-color: rgba(22, 163, 74, 0.05);
  }
`;
const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  
  @media (max-width: 768px) {
    position: static;
    box-shadow: none;
    background-color: transparent;
    min-width: 100%;
    border: none;
  }
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  
  &:hover {
    background-color: #f8fafc;
    color: #16a34a;
  }
  
  @media (max-width: 768px) {
    color: #2c3e50;
    padding: 0.75rem 0;
    
    &:hover {
      background-color: transparent;
      color: #16a34a;
    }
  }
`;

const StyledButtonLink = styled(Link)`
  color: white;
  background-color: #16a34a;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  text-decoration: none;
  border-radius: 9999px;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background-color: #15803d;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    display: block;
    text-align: center;
    padding: 1rem 1.5rem;
  }
`;

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 
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
            <Logo src="/logo_grey.png" alt="Flavorfy Logo" />
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
                <StyledButtonLink to="#" onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsNavOpen(false);
                }}>
                  Login/Register
                  </StyledButtonLink>
              )}
            </UserSection>
          </Navigation>
        </MainContent>
        {user && (
  <NotificationDropdown
    user={user}  // Pass the user object to NotificationDropdown
    isOpen={isNotificationOpen}
    onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
  />
)}
      </HeaderContent>
      
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={() => setIsLoginModalOpen(false)} />
    </HeaderContainer>
  );
};

export default Header;