import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Home from './Home.jsx';
import AboutUs from './AboutUs.jsx';
import Admissions from './Admissions.jsx';
import Courses from './Courses.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/courses" element={<Courses />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;