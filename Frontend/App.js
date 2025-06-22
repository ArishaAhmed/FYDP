import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Home.jsx";
import BotCraftLogin from "./BotCraft-login.jsx";
import BotCraftSignup from "./BotCraft-signup.jsx";
import LogoutPage from "./Logout.jsx";
import CreateBot from "./CreateBot.jsx";
import Pdf from "./pdf.jsx";
import Url from "./url.jsx";
import BotDashboard from "./BotDashboard.jsx"; 
import Profile from "./ProfilePage.jsx";
import EmbedChat from "./embedchat.jsx";
function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("authToken"));
    };

    window.addEventListener("loginStatusChanged", checkToken);

    return () => {
      window.removeEventListener("loginStatusChanged", checkToken);
    };
  }, []);

return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<BotCraftLogin />} />
        <Route path="/signup" element={<BotCraftSignup />} />
        <Route path="/logout" element={<LogoutPage setToken={setToken} />} />
        <Route path="/embed-chat" element={<EmbedChat />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard"
          element={token ? <BotDashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/createbot"
          element={token ? <CreateBot /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/pdf"
          element={token ? <Pdf /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/url"
          element={token ? <Url /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
















