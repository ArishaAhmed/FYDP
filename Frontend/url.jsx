import React from "react";
import { useLocation } from "react-router-dom";
import './url.css';
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";
const Url = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const botId = queryParams.get("bot_id");

  if (!botId) {
    return <div>Error: No bot ID provided.</div>;
  }

  const embedCode = `<iframe src="http://localhost:3000/embed-chat?bot_id=${botId}" width="400" height="600" style="border: none; border-radius: 8px;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied to clipboard!");
  };

  return (
    <>

      <Navbar />
      <div className="chatbottt-creator-container">
        <div className="chatbottt-content">
          <h2>Your URL-based Chatbot is Ready!</h2>

          <div className="instruction-block">
            <h3>Embed it on Your Website:</h3>

            <div className="code-block">
              <div className="code-header">
                <span className="lang-label">HTML</span>
                <button className="copy-btn" onClick={handleCopy}>
                  📋 Copy
                </button>
              </div>
              <pre className="code-content">{embedCode}</pre>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>

  );

};
export default Url;












// import React from "react";
// import { useLocation } from "react-router-dom";
// import './url.css';
// const Url = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const botId = queryParams.get("bot_id");

//   if (!botId) {
//     return <div>Error: No bot ID provided.</div>;
//   }

//   const embedCode = `<iframe src="http://localhost:3000/embed-chat?bot_id=${botId}" width="400" height="600" style="border: none; border-radius: 8px;"></iframe>`;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(embedCode);
//     alert("Embed code copied to clipboard!");
//   };

//   return (
//     <div className="chatbot-creator-container">
//       <div className="chatbot-content">
//         <h2> Your URL-based Chatbot is Ready!</h2>

//         <div className="instruction-block">
//           <h3>Embed it on Your Website:</h3>
//           <code
//             className="embed-code"
//             style={{
//               display: "block",
//               padding: "10px",
//               backgroundColor: "#222",
//               borderRadius: "8px",
//               marginBottom: "10px",
//               wordBreak: "break-all",
//               color: "#fff",
//             }}
//           >
//             {embedCode}
//           </code>

//           <button
//             onClick={handleCopy}
//             style={{
//               padding: "10px 16px",
//               backgroundColor: "#7e22ce",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Copy to Clipboard
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Url;
