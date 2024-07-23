import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: #343a40;
  padding: 1rem;
  color: #fff;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 1rem;
  @media (max-width: 768px) {
    margin: 0 0.5rem;
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

const Header = () => {
  return (
    <HeaderContainer>
      <NavList>
        <NavItem><StyledLink to="/">Home</StyledLink></NavItem>
        <NavItem><StyledLink to="/recipes">Recipes</StyledLink></NavItem>
        <NavItem><StyledLink to="/add-recipe">Add Recipe</StyledLink></NavItem>
        <NavItem><StyledLink to="/profile">Profile</StyledLink></NavItem>
      </NavList>
    </HeaderContainer>
  );
};

export default Header;
