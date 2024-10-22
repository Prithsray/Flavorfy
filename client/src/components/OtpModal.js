import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import axios from 'axios';
import VerificationSuccessModal from './VerificationSuccessModal'; // Import the success modal

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

// OTP Modal Component
const OtpModal = ({ isOpen, onRequestClose, email }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerificationSuccessOpen, setIsVerificationSuccessOpen] = useState(false); // State for success modal
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/otp`, { email, otp });
      setSuccess('OTP verified successfully!');
      setIsVerificationSuccessOpen(true); // Open verification success modal
      setTimeout(() => {
        onRequestClose();
        window.location.reload(); // Refresh or redirect after OTP verification
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    if (isResending) return; // Prevent further requests if already resending
    setError('');
    setSuccess('');
    setIsResending(true);
    setResendCooldown(30); // Set cooldown to 30 seconds

    try {
      await axios.post(`${API_BASE_URL}/api/otp/resend-otp`, { email });
      setSuccess('OTP resent successfully! Please check your email.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    }

    // Start cooldown timer
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResending(false);
          return 0; // Reset cooldown
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>
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
            height: '50vw',
            maxWidth: '450px',
            maxHeight: '450px',
          },
        }}
      >
        <ModalContent>
          <Logo src="/logo_grey.png" alt="Logo" />
          <h4 >Your account is not active yet </h4><bR></bR>
          <h6>Please Enter OTP sent to your Email to activate your account </h6><br></br>
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleOtpSubmit}>
            <Input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button type="submit">Verify OTP</Button>
          </Form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            {isResending ? `Resend OTP in ${resendCooldown}s` : (
              <span 
                style={{ color: '#28a745', cursor: 'pointer' }} 
                onClick={handleResendOtp}
              >
                Resend OTP
              </span>
            )}
          </p>
        </ModalContent>
      </Modal>

      {/* Verification Success Modal */}
      <VerificationSuccessModal 
        isOpen={isVerificationSuccessOpen} 
        onRequestClose={() => {
          setIsVerificationSuccessOpen(false);
          onRequestClose(); // Optionally close OTP modal as well
        }} 
      />
    </>
  );
};

export default OtpModal;
