import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: linear-gradient(to right, #ffffff, #f8fafc, #ffffff);
  color: #2c3e50;
  text-align: center;
  padding: 0.7rem 1rem;
  
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 
    0 -4px 6px -1px rgba(0, 0, 0, 0.05),
    0 -2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(22, 163, 74, 0.2),
      transparent
    );
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const Copyright = styled.p`
  font-size: 0.95rem;
  margin: 0;
  margin-top:12px;
  font-weight: 500;
  color: #475569;
  letter-spacing: 0.02em;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const PoweredBy = styled.p`
  margin-top: 0rem;
  font-size: 0.9rem;
  font-weight: 400;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before,
  &::after {
    content: '';
    height: 1px;
    width: 2rem;
    background: linear-gradient(
      to right,
      transparent,
      rgba(22, 163, 74, 0.2),
      transparent
    );
    display: inline-block;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    
    &::before,
    &::after {
      width: 1.5rem;
    }
  }
`;

const Highlight = styled.span`
  background: linear-gradient(120deg, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: #16a34a;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(120deg, rgba(22, 163, 74, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%);
    transform: translateY(-1px);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© 2024 Flavorfy. All rights reserved.</Copyright>
        <PoweredBy>
          Powered by <Highlight>Prithwish</Highlight>
        </PoweredBy>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;