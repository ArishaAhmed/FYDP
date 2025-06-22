import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">EduLearn</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/admissions">Admissions</Link></li>
          <li><Link to="/courses">Courses</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;