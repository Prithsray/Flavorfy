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


p {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}

.powered-by {
  margin-top: 1rem;
  font-size: 1rem;
  color: #dcdcdc; /* Light grey color */
  font-weight: 400;
}
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Flavorfy. All rights reserved.</p>
      <p className="powered-by">Powered by Prithwish</p>
    </FooterContainer>
  );
};

export default Footer;
