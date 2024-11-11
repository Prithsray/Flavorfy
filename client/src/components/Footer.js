import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #343a40;
  color: #fff;
  text-align: center;
  padding: 1rem;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Flavorfy. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
