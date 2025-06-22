import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./assets/logo.png";
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Logo and tag */}
                <div className="footer-logo">
                    <img src={Logo} alt="BotCraft Logo" className="logo" />
                    <p>by Angels</p>
                </div>

                {/* Footer links section */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h3>PLATFORM</h3>
                        <ul>
                            <li>AI Agents</li>
                            <li>AI Copilots trained on your Data</li>
                            <li>24x7 Customer Support</li>
                            <li>Automated Employee Support</li>
                            <li>AI-Enhanced Conversational Commerce</li>
                            <li>Integrations</li>
                            <li>Model Agnostic</li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>RESOURCES</h3>
                        <ul>
                            <li>Security</li>
                            <li>Pricing</li>
                            <li>Documentation</li>
                            <li>API</li>
                            <li>Status</li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>COMPANY</h3>
                        <ul>
                            <li>Request a Demo</li>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Contact Us</li>
                            <li>LinkedIn AI</li>
                            <li>Growth Platform</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer bottom strip */}
            <div className="footer-bottom">
                <p>© 2024 BotCraft, Inc. All rights reserved.</p>

                <div className="footer-bottom-links">
                    <a href="#">Terms</a>
                    <a href="#">Privacy</a>
                    <a href="#">Policy</a>
                    <a href="#">Security</a>
                </div>

                <div className="footer-icons">
                    <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                    <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                    <a href="#" aria-label="Twitter"><FaXTwitter /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
