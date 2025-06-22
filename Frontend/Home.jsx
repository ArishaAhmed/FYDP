



import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "./navbar.jsx"; // ✅ Import reusable Navbar
import Footer from "./footer.jsx"; // ✅ Import reusable Footer

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login status and listen for login/logout events
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkLogin(); // Initial check

    window.addEventListener("loginStatusChanged", checkLogin);
    return () => window.removeEventListener("loginStatusChanged", checkLogin);
  }, []);

  const handleCreateBotClick = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/CreateBot");
    } else {
      alert("Please login first.");
      navigate("/login");
    }
  };

  return (
    <div>
      {/* Background diamonds */}
      <div className="diamond-container">
        <div className="diamond pink"></div>
        <div className="diamond blue"></div>
        <div className="diamond purple"></div>
      </div>
      <div className="diamond-container-two">
        <div className="diamond pink-two"></div>
        <div className="diamond blue-two"></div>
        <div className="diamond purple-two"></div>
      </div>

      {/* ✅ Reusable Navbar */}
      <Navbar />

      <div className="hero-container">
        <div className="hero">
          <h1>
            Create <span className="highlight">Chatbots</span> That Serve <br /> You Effortlessly
          </h1>
          <p>
            Transform your website and files into a customer service powerhouse with <i>BotCraft</i>'s intelligent automation.
          </p>
          <button className="cta-button" onClick={handleCreateBotClick}>
            BUILD YOUR AI CHATBOT
          </button>
        </div>

        <section className="welcome-section">
          <h2>Welcome to <i>BotCraft</i></h2>
          <p>
            Where AI meets simplicity. Let's create intelligent, bilingual chatbots in <b>English</b> and <b>Urdu</b>, tailored to your needs.
          </p>
          <ul>
            <li><b>For Students & Teachers:</b> Turn PDFs like textbooks or notes into interactive chatbots for smarter, faster learning.</li>
            <li><b>For Businesses:</b> Transform your website into a customer service powerhouse with customized chatbots for instant support and engagement.</li>
          </ul>
          <p>Affordable, accessible, and designed for everyone—<i>BotCraft</i> makes AI-powered solutions effortless.</p>
          <p>Join us today and redefine how you learn, teach, and connect!</p>
        </section>
      </div>

      <section className="how-it-works">
        <div className="floating-background">
          <div className="diamond-container-two-two">
            <div className="diamonds pink-two-two"></div>
            <div className="diamonds blue-two-two"></div>
            <div className="diamonds purple-two-two"></div>
          </div>
        </div>

        <h2 className="section-title">HOW IT WORKS</h2>
        <p className="how-desc">
          Upload your PDF or share your website URL—BotCraft scans it, trains your AI chatbot, and customizes it to match your brand. Add it to your site in just minutes!
        </p>
        <button className="build-btn" onClick={handleCreateBotClick}>
          BUILD YOUR AI CHATBOT
        </button>

        <div className="steps">
          <details>
            <summary>1. Import Your Data & Train Your AI Agent</summary>
            <div className="details-content">Upload your data in URL or PDF format, and our AI will process and train itself to understand your content.</div>
          </details>
          <details>
            <summary>2. Customize Behavior & Appearance</summary>
            <div className="details-content">Adjust the AI’s responses, style, and personality to match your brand and user needs.</div>
          </details>
          <details>
            <summary>3. Embed On Your Website</summary>
            <div className="details-content">Get a JavaScript code snippet to integrate the AI seamlessly into your website or system.</div>
          </details>
          <details>
            <summary>4. Integrate with Your Tools</summary>
            <div className="details-content">Connect the AI with your existing tools and workflows for automated responses and insights.</div>
          </details>
          <details>
            <summary>5. Monitor & Optimize</summary>
            <div className="details-content">Track AI performance with real-time analytics and continuously improve accuracy and engagement.</div>
          </details>
        </div>
      </section>

      {/* ✅ Reusable Footer */}
      <Footer />
    </div>
  );
};

export default Home;
