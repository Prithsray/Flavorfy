// RegisterModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';
import OtpModal from './OtpModal'; // Import the OtpModal

// Global variable to store email
let globalEmail = null;

// Styled Components
const ModalContent = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  width: 50vw;
  height: 50vw;
  max-width: 400px;
  max-height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #28a745;
  text-align: center;
`;

const Logo = styled.img`
  width: 30%;
  max-width: 200px;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
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

const CloseButton = styled.button`
  position: absolute;
  top: 1px;
  right: 1px;
  background: none;
  border: none;
  color: #28a745;
  font-size: 1.8rem;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin: 1rem 0;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: #28a745;
  margin: 1rem 0;
  text-align: center;
`;

// Register Modal Component
const RegisterModal = ({ isOpen, onRequestClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false); // State for OTP modal visibility
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = { name, email, password };

    try {
      // Register the user
      await axios.post(`${API_BASE_URL}/api/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setName('');
      setEmail('');
      setPassword('');
      setSuccess('Registration successful! Please check your email for the OTP.');

      // Store the email in the global variable
      globalEmail = email;

      // Close RegisterModal and open OtpModal
      onRequestClose(); // Close RegisterModal
      setShowOtpModal(true); // Open OTP modal

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
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
            height: '50vw',
            maxWidth: '450px',
            maxHeight: '450px',
          },
        }}
      >
        <ModalContent>
          <CloseButton onClick={onRequestClose}>×</CloseButton> {/* Close Button */}
          <Logo src="/logo_grey.png" alt="Logo" />
          <Title>Registration</Title>
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Register</Button>
          </Form>
        </ModalContent>
      </Modal>

      {/* OTP Modal */}
      {showOtpModal && <OtpModal isOpen={showOtpModal} onRequestClose={() => setShowOtpModal(false)} email={globalEmail} />}
    </>
  );
};

export default RegisterModal;
