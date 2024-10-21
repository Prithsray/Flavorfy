import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Slider from 'react-slick';
import Header from './Header';
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
  padding: 2rem 0;
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
  height: 400px;
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

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #28a745;
  margin: 3rem 0 2rem;
`;

const FeaturedRecipes = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const RecipeCard = styled.div`
  width: 300px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RecipeInfo = styled.div`
  padding: 1rem;
  text-align: left;
`;

const TestimonialsContainer = styled.div`
  background-color: #fff;
  padding: 3rem 2rem;
  text-align: center;
`;

const TestimonialHeading = styled.h2`
  font-size: 2.5rem;
  color: #28a745;
  margin-bottom: 2rem;
`;

const TestimonialsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const TestimonialCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1rem;
  color: #555;
`;

const TestimonialAuthor = styled.p`
  font-weight: bold;
  color: #28a745;
`;


// const CallToAction = styled.div`
//   background-color: #28a745;
//   color: #fff;
//   padding: 3rem 2rem;
//   text-align: center;
// `;

// const CTAButton = styled(Button)`
//   background-color: #fff;
//   color: #28a745;
//   &:hover {
//     background-color: #e6e6e6;
//   }
// `;

// const BlogPosts = styled.div`
//   background-color: #f8f9fa;
//   padding: 3rem 0;
// `;

// const BlogCard = styled.div`
//   display: flex;
//   background-color: #fff;
//   border: 1px solid #ddd;
//   border-radius: 0.25rem;
//   overflow: hidden;
//   margin-bottom: 2rem;
// `;

// const BlogImage = styled.img`
//   width: 150px;
//   object-fit: cover;
// `;

// const BlogContent = styled.div`
//   padding: 1rem;
//   text-align: left;
// `;

// const Categories = styled.div`
//   background-color: #fff;
//   padding: 3rem 0;
//   text-align: center;
// `;

// const CategoryItem = styled.div`
//   display: inline-block;
//   background-color: #28a745;
//   color: #fff;
//   padding: 1rem 2rem;
//   border-radius: 0.25rem;
//   margin: 0.5rem;
//   cursor: pointer;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #218838;
//   }
// `;

const AboutUs = styled.div`
  padding: 3rem 2rem;
  background-color: #f8f9fa;
  color: #343a40;
  text-align: center;
`;

const Home = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomArrow className="slick-prev">‹</CustomArrow>,
    nextArrow: <CustomArrow className="slick-next">›</CustomArrow>,
  };

  useEffect(() => {
    axios.get('/api/recipes')
      .then(response => {
        setFeaturedRecipes(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch featured recipes');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <HomeContainer>
        <Title>Welcome to Flavorfy</Title>
        <Subtitle>Discover and share amazing recipes with the world!</Subtitle>
        <Button onClick={() => window.location.href = '/recipes'}>Explore Recipes</Button>

        <SliderContainer>
          <Slider {...sliderSettings}>
            <Slide>
              <SlideImage src="https://hips.hearstapps.com/hmg-prod/images/crepes-index-64347419e3c7a.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*" alt="Crepes" />
              <SlideText>
                <h3>Crepes</h3>
                <p>Delicate pancakes filled with sweet or savory.</p>
              </SlideText>
            </Slide>
            <Slide>
              <SlideImage src="https://www.southernliving.com/thmb/rolXWVfkNEC-gZaupNKkmdXyaRA=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/2447004_chili_16-d59d432e74744a6a8567f4c87a344f53.jpg" alt="Classic Beef Chili" />
              <SlideText>
                <h3>Classic Beef Chili</h3>
                <p>Hearty stew with ground beef and beans.</p>
              </SlideText>
            </Slide>
            <Slide>
              <SlideImage src="https://www.foodandwine.com/thmb/MsTd5zgsuEHBo1w-vWuuYQno0mw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/FAW-recipes-pasta-sausage-basil-and-mustard-hero-06-cfd1c0a2989e474ea7e574a38182bbee.jpg" alt="Pasta with Sausage, Basil, and Mustard" />
              <SlideText>
                <h3>Pasta with Sausage, Basil, and Mustard</h3>
                <p>Savory pasta dish with sausage and basil.</p>
              </SlideText>
            </Slide>
          </Slider>
        </SliderContainer>

        <SectionTitle>Featured Recipes</SectionTitle>
        <FeaturedRecipes>
  {(featuredRecipes && Array.isArray(featuredRecipes) ? featuredRecipes.slice(0, 6) : []).map(recipe => (
    <RecipeCard key={recipe.id} onClick={() => window.location.href = `/recipes/${recipe.id}`}>
      <RecipeImage
        src={recipe.image ? `${recipe.image}` : 'https://via.placeholder.com/300x200'}
        alt={recipe.title}
      />
      <RecipeInfo>
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
      </RecipeInfo>
    </RecipeCard>
  ))}
</FeaturedRecipes>

        <TestimonialsContainer>
      <TestimonialHeading>What Our Users Say</TestimonialHeading>
      <TestimonialsWrapper>
        <TestimonialCard>
          <TestimonialText>"This app has transformed my cooking experience. Highly recommend!"</TestimonialText>
          <TestimonialAuthor>- Jane Doe</TestimonialAuthor>
        </TestimonialCard>
        <TestimonialCard>
          <TestimonialText>"The recipe suggestions are spot on, and I love the user-friendly interface."</TestimonialText>
          <TestimonialAuthor>- John Smith</TestimonialAuthor>
        </TestimonialCard>
        <TestimonialCard>
          <TestimonialText>"Fantastic app! The recipes are diverse and delicious, and the interface is intuitive."</TestimonialText>
          <TestimonialAuthor>- Emma Brown</TestimonialAuthor>
        </TestimonialCard>
        <TestimonialCard>
          <TestimonialText>"I never knew cooking could be so fun. This app is a game-changer for meal planning."</TestimonialText>
          <TestimonialAuthor>- Michael Johnson</TestimonialAuthor>
        </TestimonialCard>
        <TestimonialCard>
          <TestimonialText>"The community recipes and tips have been invaluable. Highly satisfied with my experience."</TestimonialText>
          <TestimonialAuthor>- Sarah Lee</TestimonialAuthor>
        </TestimonialCard>
      </TestimonialsWrapper>
    </TestimonialsContainer>

        

        <AboutUs>
          <h2>About Us</h2>
          <p>At RecipeApp, we're passionate about helping you discover and share the best recipes. Our platform is designed to make cooking fun and easy for everyone.</p>
        </AboutUs>

       
      </HomeContainer>
      
    </>
  );
};

export default Home;
