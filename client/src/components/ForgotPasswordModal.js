// ForgotPasswordModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';

const ModalContent = styled.div`
  padding: 2rem 1.5rem;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 12px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const Logo = styled.img`
  width: 40%;
  max-width: 160px;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    width: 50%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #28a745;
  transition: color 0.2s ease;

  &:hover {
    color: #218838;
  }
`;

const Title = styled.h2`
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #28a745;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.6rem;
  color: #fff;
  background: linear-gradient(145deg, #28a745, #218838);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #218838, #1f7e34);
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ isError }) => (isError ? '#dc3545' : '#28a745')};
  text-align: center;
`;

const ForgotPasswordModal = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [step, setStep] = useState(1); // Step to manage flow: 1 for email, 2 for OTP, 3 for new password
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/login/forgot-password`, { email });
      setMessage('OTP sent to your email. Please check your inbox.');
      setStep(2); // Move to OTP input
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // You can also validate the OTP on the backend here
      // For now, we'll assume OTP verification is successful
      setMessage('OTP verified. Please enter your new password.');
      setStep(3); // Move to new password input
    } catch (error) {
      setMessage('Failed to verify OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/login/reset-password`, { email, otp, newPassword });
      setMessage('Password reset successfully. Redirecting to login...');
      // You can redirect to login here or close the modal
      setTimeout(onRequestClose, 2000); // Close modal after 2 seconds
    } catch (error) {
      setMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0',
          margin: 'auto',
          width: '80vw',
          height: '60vh',
          maxWidth: '380px',
          maxHeight: '450px',
          borderRadius: '12px',
          border: 'none',
        },
      }}
    >
      <ModalContent>
        <CloseButton onClick={onRequestClose}>&times;</CloseButton>
        <Logo src="/logo_grey.png" alt="Flavorfy Logo" />
        <Title>Forgot Password</Title>
        {step === 1 && (
          <>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button onClick={handleSendOtp}>Send OTP</Button>
          </>
        )}
        {step === 2 && (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button onClick={handleVerifyOtp}>Verify OTP</Button>
          </>
        )}
        {step === 3 && (
          <>
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password" // New confirm password input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </>
        )}
        {message && <Message isError={message.startsWith('Failed')}>{message}</Message>}
      </ModalContent>
    </Modal>
  );
};

export default ForgotPasswordModal;
