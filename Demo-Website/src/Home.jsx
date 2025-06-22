import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleExplorePrograms = () => {
    navigate('/courses');
  };

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to EduLearn Institute</h1>
        <p>Discover a limitless world of learning. Empowering students through innovation and excellence.</p>
        <button className="cta-button" onClick={handleExplorePrograms}>
          Explore Programs
        </button>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About Us</h2>
        <p>EduLearn is a top-tier educational institution focused on innovative teaching and student success.</p>
        <p>We offer programs in science, arts, and more—taught by expert faculty in a nurturing environment.</p>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Why Choose EduLearn?</h2>
        <ul>
          <li>✅ Modern Curriculum aligned with global standards</li>
          <li>✅ Experienced and passionate faculty</li>
          <li>✅ Smart classrooms and online learning support</li>
          <li>✅ Personalized student guidance and career support</li>
        </ul>
      </section>

      {/* Programs */}
      <section className="programs">
        <h2>Our Programs</h2>
        <div className="program-list">
          <div className="program-card">
            <h3>Science</h3>
            <p>Explore physics, chemistry, biology, and more through hands-on learning.</p>
          </div>
          <div className="program-card">
            <h3>Arts</h3>
            <p>Develop creativity and expression through visual, performing, and digital arts.</p>
          </div>
          <div className="program-card">
            <h3>Technology</h3>
            <p>Stay ahead with coding, AI, and modern tech integration in education.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Students Say</h2>
        <blockquote>
          “EduLearn has transformed my learning journey. The interactive approach and supportive teachers made all the difference.”
          <cite>— Aisha K., Student</cite>
        </blockquote>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Join Us?</h2>
        <p>Apply today and become part of a vibrant, forward-thinking academic community.</p>
        <button className="cta-button">Get Started</button>
      </section>

      {/* Floating Chatbot */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        {<iframe
          src="http://localhost:3000/embed-chat?bot_id=B104"
          width="350"
          height="500"
          style={{ border: 'none', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          title="EduLearn Chatbot"
        ></iframe>}
      </div>
    </div>
  );
}

export default Home;
