import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';
import RegisterModal from './RegisterModal';
import OtpModal from './OtpModal'; // Import OtpModal
import ForgotPasswordModal from './ForgotPasswordModal';
// Styled Components with Responsive Design
const ModalContent = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  width: 50vw;
  height: 50vw;
  max-width: 420px;
  max-height: 420px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    width: 80vw;
    height: auto;
    max-width: 360px;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 90vw;
    height: auto;
    padding: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
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
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Logo = styled.img`
  width: 30%;
  max-width: 200px;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    width: 50%;
  }
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

  @media (max-width: 480px) {
    padding: 0.4rem;
  }
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
  margin-bottom:1rem;
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

const ForgotPasswordLink = styled.span`
  color: #28a745;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  margin-bottom:1rem;

  &:hover {
    color: #218838;
  }
`;

const LoginModal = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [closing, setClosing] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
    onRequestClose();
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };



  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    onRequestClose();
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
        withCredentials: true
      });

      const { token, user } = response.data;

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
      if (error.response?.status === 403) {
        setError(error.response?.data?.message || 'Account is not activated yet ');
        setIsOtpModalOpen(true);
        onRequestClose();
      } else {
        setError(error.response?.data?.message || 'Invalid email or password');
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
            height: '60vh',
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
              <ForgotPasswordLink onClick={openForgotPasswordModal}>
            Forgot Password?
          </ForgotPasswordLink>
            <Button type="submit">Login</Button>
          </Form>
          <RegisterText>
            Don't have an account?{' '}
            <RegisterLink onClick={openRegisterModal}>Register</RegisterLink>
          </RegisterText>
        </ModalContent>
      </Modal>
      
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />
      <OtpModal 
        isOpen={isOtpModalOpen} 
        onRequestClose={() => {
          setIsOtpModalOpen(false);
          onRequestClose();
        }} 
        email={email}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onRequestClose={closeForgotPasswordModal}
      />
    </>
  );
};

export default LoginModal;
