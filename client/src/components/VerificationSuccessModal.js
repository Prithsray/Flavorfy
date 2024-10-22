import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

// Styled Components
const ModalContent = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  width: 50vw;
  height: 30vw;
  max-width: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif; /* Apply the font */
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #28a745;
  text-align: center;
  font-size: 1.2rem; /* Adjust font size */
`;

const Button = styled.button`
  padding: 0.5rem; /* Adjust padding */
  font-size: 0.9rem; /* Smaller font size */
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #218838;
  }
`;

// Verification Success Modal Component
const VerificationSuccessModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          borderRadius: '8px',
          padding: '0',
          margin: 'auto',
          width: '50vw',
          height: '30vw',
          maxWidth: '400px',
        },
      }}
    >
      <ModalContent>
        <Title>Your account is verified and activated successfully!</Title>
        <Title>Please Log In</Title>
        <Button onClick={onRequestClose}>Close</Button>
      </ModalContent>
    </Modal>
  );
};

export default VerificationSuccessModal;
