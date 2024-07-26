import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import Header from './Header';
import Footer from './Footer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  color: #343a40;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #28a745;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const SliderContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 2rem auto;
  position: relative;
`;

const Slide = styled.div`
  position: relative;
  height: 400px; /* Adjust the height as needed */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
`;

const SlideText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 1rem;
  text-align: center;
`;

const CustomArrow = styled.div`
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  transform: translateY(-50%);

  &.slick-prev {
    left: 10px;
  }

  &.slick-next {
    right: 10px;
  }
`;

const Home = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000, // Slide every 3 seconds
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomArrow className="slick-prev">‹</CustomArrow>,
    nextArrow: <CustomArrow className="slick-next">›</CustomArrow>,
  };

  return (
    <>
     <Header />
      <HomeContainer>
        <Title>Welcome to RecipeApp</Title>
        <Subtitle>Discover and share amazing recipes with the world!</Subtitle>
        <Button onClick={() => window.location.href = '/recipes'}>Explore Recipes</Button>
        <SliderContainer>
          <Slider {...sliderSettings}>
            <Slide>
              <SlideImage src="https://hips.hearstapps.com/hmg-prod/images/crepes-index-64347419e3c7a.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*" alt="Recipe 1" />
              <SlideText>
                <h3>Recipe 1</h3>
                <p>Delicious recipe description goes here.</p>
              </SlideText>
            </Slide>
            <Slide>
              <SlideImage src="https://www.eatingwell.com/thmb/yMc-omrZge4WvdofEtjNWSVHG10=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Chicken-piccata-casserole-3x2-167-f44730f489cc4b9493547de1c76a3b93.jpg" alt="Recipe 2" />
              <SlideText>
                <h3>Recipe 2</h3>
                <p>Another delicious recipe description goes here.</p>
              </SlideText>
            </Slide>
            <Slide>
              <SlideImage src="https://www.eatingwell.com/thmb/qO1x9CP7y-7EtRxxlDG8uDAuerE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Chicken-piccata-casserole-step-3-156-8d24cdf67c7d4158baace9560d3a94f5.jpg" alt="Recipe 3" />
              <SlideText>
                <h3>Recipe 3</h3>
                <p>Yet another delicious recipe description goes here.</p>
              </SlideText>
            </Slide>
          </Slider>
        </SliderContainer>
      </HomeContainer>
      <Footer/>
    </>
  );
};

export default Home;
