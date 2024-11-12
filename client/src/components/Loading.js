import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(8px);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #16a34a;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 2rem;
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 500;
  animation: ${slideUp} 0.5s ease;
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 4px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      #f3f4f6 0%,
      #16a34a 50%,
      #f3f4f6 100%
    );
    animation: ${shimmer} 1.5s linear infinite;
    background-size: 468px 468px;
  }
`;

const LoadingProgress = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  animation: ${slideUp} 0.5s ease;
`;

const LoadingElements = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 3rem;
`;

const LoadingElement = styled.div`
  width: 12px;
  height: 12px;
  background-color: #16a34a;
  border-radius: 50%;
  animation: ${fadeIn} 0.3s ease infinite alternate;
  animation-delay: ${props => props.delay}s;
  opacity: 0.3;
`;

const LoadingScreen = ({ text = "Loading..." }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : prev));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>{text}</LoadingText>
      <LoadingBar />
      <LoadingProgress>{progress}%</LoadingProgress>
      <LoadingElements>
        <LoadingElement delay={0} />
        <LoadingElement delay={0.2} />
        <LoadingElement delay={0.4} />
      </LoadingElements>
    </LoadingContainer>
  );
};

// Usage example component
const PageWithLoading = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen text="Getting things ready..." />}
      {/* Your actual page content here */}
    </>
  );
};

export default LoadingScreen;