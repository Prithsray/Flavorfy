import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';

const ModalContent = styled.div`
  padding: 2rem;
  background-color: #fff;
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

const RegisterModal = ({ isOpen, onRequestClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, email, password };

    try {
      console.log('Form data being sent:', formData); // Debugging line to see the form data
      await axios.post('http://localhost:5000/api/register', formData, {
        headers: {
          'Content-Type': 'application/json' // Ensure the content type is set to JSON
        }
      });
      setName('');
      setEmail('');
      setPassword('');
      onRequestClose(); // Close the modal on successful registration
    } catch (error) {
      console.error('Registration failed:', error);
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
          width: '50vw',
          height: '50vw',
          maxWidth: '400px',
          maxHeight: '400px',
        },
      }}
    >
      <ModalContent>
        <CloseButton onClick={onRequestClose}>&times;</CloseButton>
        <Title>Register</Title>
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
