import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';

const ModalContent = styled.div`
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  width: 80vw;
  height: 80vh;
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
  box-sizing: border-box;
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

const LoginModal = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle successful login
      console.log('Login successful:', response.data);
      // Optionally store the token in local storage or context
      localStorage.setItem('token', response.data.token);
      onRequestClose(); // Close the modal on successful login

    } catch (error) {
      setError('Invalid email or password');
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
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
          width: '410px',
          height: '410px',
        },
      }}
    >
      <ModalContent>
        <CloseButton onClick={onRequestClose}>&times;</CloseButton>
        <Title>Login</Title>
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button type="submit">Login</Button>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
