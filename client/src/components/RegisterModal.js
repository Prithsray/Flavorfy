import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components
const ModalContent = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent white background */
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

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: #28a745;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #218838;
  }
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #28a745;
  text-align: center;
`;

const Logo = styled.img`
  width: 30%; /* Adjust the size of the logo */
  max-width: 200px; /* Maximum width */
  margin-bottom: 1rem; /* Space below the logo */
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
  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(''); // State for success messages
  const [closing, setClosing] = useState(false); // State to handle modal closing
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message
    setSuccess(''); // Clear previous success message

    const formData = { name, email, password };

    try {
      await axios.post(`${API_BASE_URL}/api/register`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setName('');
      setEmail('');
      setPassword('');
      setSuccess('Registration successful!'); // Set success message
      setClosing(true); // Set closing state to true

      // Close the modal after a delay to show success message
      setTimeout(() => {
        onRequestClose();
        window.location.reload();
      }, 2000); // Adjust the delay as needed

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage); // Set error message from backend
      console.error('Registration failed:', errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => !closing && onRequestClose()} // Ensure modal is not closed before success message
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
          maxWidth: '400px',
          maxHeight: '400px',
        },
      }}
    >
      <ModalContent>
        <CloseButton onClick={() => !closing && onRequestClose()}>&times;</CloseButton>
        <Logo src="/logo_grey.png" alt="Logo" /> {/* Add logo here */}
        <Title>Register</Title>
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
  );
};

export default RegisterModal;
