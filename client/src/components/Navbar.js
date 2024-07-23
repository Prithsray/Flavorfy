import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #343a40;
  padding: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 1rem;
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

const Navbar = () => {
  return (
    <Nav>
      <NavList>
        <NavItem><StyledLink to="/">Home</StyledLink></NavItem>
        <NavItem><StyledLink to="/recipes">Recipes</StyledLink></NavItem>
        <NavItem><StyledLink to="/add-recipe">Add Recipe</StyledLink></NavItem>
        <NavItem><StyledLink to="/profile">Profile</StyledLink></NavItem>
      </NavList>
    </Nav>
  );
};

export default Navbar;
