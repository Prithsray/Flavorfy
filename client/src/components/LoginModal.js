import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';
import RegisterModal from './RegisterModal';
import OtpModal from './OtpModal'; // Import OtpModal

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

const CloseButton = styled.button`
  position: absolute;
  top: 1px;
  right: 1px;
  background: transparent;
  border: none;
  color: #28a745;
  font-size: 1.8rem;
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

const RegisterText = styled.p`
  margin-top: 1rem;
  text-align: center;
`;

const RegisterLink = styled.span`
  color: #28a745;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #218838;
  }
`;

// Login Modal Component
const LoginModal = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [closing, setClosing] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State for OTP modal
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Function to open the register modal and close the login modal
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    onRequestClose(); // Close the LoginModal
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Send cookies with request
      });

      const { token, user } = response.data;

      // Store user info
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('name', user.name);
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('token', token);
      setSuccess('Login successful!');
      setClosing(true);

      setTimeout(() => {
        onRequestClose();
        window.location.reload();
      }, 2000);

    } catch (error) {
      // Handle the error response
      if (error.response?.status === 403) {
        // If user is not active, open the OTP modal
        setError(error.response?.data?.message || 'Account is not activated yet ');
        console.log(error.response?.data?.message);
        setIsOtpModalOpen(true);

        onRequestClose(); // Close the login modal
      } else {
        setError(error.response?.data?.message || 'Invalid email or password');
        console.error('Login failed:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => !closing && onRequestClose()}
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
            width: '80vw',
            height: '80vh',
            maxWidth: '450px',
            maxHeight: '450px',
          },
        }}
      >
        <ModalContent>
          <CloseButton onClick={() => !closing && onRequestClose()}>&times;</CloseButton>
          <Logo src="/logo_grey.png" alt="Logo" />
          <Title>Login</Title>
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
            <Button type="submit">Login</Button>
          </Form>
          <RegisterText>
            Don't have an account?{' '}
            <RegisterLink onClick={openRegisterModal}>Register</RegisterLink>
          </RegisterText>
        </ModalContent>
      </Modal>
      
      {/* Render the RegisterModal */}
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />
      
      {/* Render the OtpModal for account activation */}
      <OtpModal 
        isOpen={isOtpModalOpen} 
        onRequestClose={() => {
          setIsOtpModalOpen(false);
          onRequestClose(); // Optionally close login modal as well
        }} 
        email={email} // Pass the email for OTP verification
      />
    </>
  );
};

export default LoginModal;
