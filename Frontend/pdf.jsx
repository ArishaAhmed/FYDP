// import React, { useState, useEffect } from 'react';
// import './pdf.css';

// function Pdf() {
//   const [language, setLanguage] = useState('en');
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   // ✅ Detect if we're in embed mode via URL param
//   const isEmbed = new URLSearchParams(window.location.search).get('embed') === 'true';
//   const botId = new URLSearchParams(window.location.search).get('bot_id');

// useEffect(() => {
//   const fetchChatHistory = async (lang) => {
//     try {
//       const response = await fetch(`http://localhost:5000/get_bot_chat_history?bot_id=${botId}`);
//       const data = await response.json();

//       if (data.history && data.history.length > 0) {
//         const formattedMessages = data.history.flatMap((entry) => ([
//           { sender: 'user', text: entry.question },
//           { sender: 'bot', text: entry.answer }
//         ]));
//         setMessages(formattedMessages);
//       } else {
//         setMessages([
//           {
//             sender: 'bot',
//             text:
//               lang === 'en'
//                 ? '👋 Hi! How may I help you? I can communicate in English or Urdu. Chat with me.'
//                 : '👋 السلام علیکم! میں آپ کی کس طرح مدد کر سکتا ہوں؟ آپ اردو یا انگریزی میں بات چیت کر سکتے ہیں۔',
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching chat history:', error);
//       setMessages([
//         {
//           sender: 'bot',
//           text:
//             lang === 'en'
//               ? '👋 Hi! How may I help you? I can communicate in English or Urdu. Chat with me.'
//               : '👋 السلام علیکم! میں آپ کی کس طرح مدد کر سکتا ہوں؟ آپ اردو یا انگریزی میں بات چیت کر سکتے ہیں۔',
//         },
//       ]);
//     }
//   };

//   if (botId) {
//     fetchChatHistory(language); // Pass language as argument
//   }
// }, [botId, language]); // ✅ No longer depends on language


//   const handleLanguageChange = (e) => setLanguage(e.target.value);

//   const handleSend = async () => {
//     if (input.trim() === '') return;

//     const userMessage = { sender: 'user', text: input };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput('');

//     try {
//       const response = await fetch('http://localhost:5000/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           bot_id: botId,
//           question: input,
//           language: language // Send the current language to backend
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       const botResponse = { sender: 'bot', text: data.answer };
//       setMessages((prevMessages) => [...prevMessages, botResponse]);
//     } catch (error) {
//       console.error('Error sending message to backend:', error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' },
//       ]);
//     }
//   };

//   return (
//     <div className={`chatbot-creator-container ${isEmbed ? 'embed-mode' : ''} ${language === 'ur' ? 'rtl-mode' : ''}`}>
//       <header className="chatbot-header">
//         {!isEmbed && (
//           <div className="language-selector">
//             <label>
//               <input
//                 type="radio"
//                 value="en"
//                 checked={language === 'en'}
//                 onChange={handleLanguageChange}
//               />
//               English
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 value="ur"
//                 checked={language === 'ur'}
//                 onChange={handleLanguageChange}
//               />
//               Urdu
//             </label>
//           </div>
//         )}
//         <h1>
//           {language === 'en'
//             ? 'Welcome to Your Smart Assistant'
//             : 'خوش آمدید آپ کے اسمارٹ اسسٹنٹ میں'}
//         </h1>
//       </header>

//       <main className="chatbot-content">
//         <div className="chat-history">
//           {messages.map((msg, index) => (
//             <div key={index} className={`chatbot-message ${msg.sender}`}>
//               {msg.text}
//             </div>
//           ))}
//         </div>

//         <div className="chatbot-input-box">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder={language === 'en' ? 'Ask anything..' : 'چیٹ بوٹ بنانے سے متعلق کچھ پوچھیں...'}
//             dir={language === 'ur' ? 'rtl' : 'ltr'}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 handleSend();
//               }
//             }}
//           />
//           <button onClick={handleSend}>Send</button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Pdf;

























// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './pdf.css';

// function Pdf() {
//   const [language, setLanguage] = useState('en');
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userInitial, setUserInitial] = useState('');
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const isEmbed = new URLSearchParams(window.location.search).get('embed') === 'true';
//   const botId = new URLSearchParams(window.location.search).get('bot_id');

//   useEffect(() => {
//     const checkLogin = () => {
//       const token = localStorage.getItem("authToken");
//       const initial = localStorage.getItem("userInitial");
//       setIsLoggedIn(!!token);
//       setUserInitial(initial || '?');
//     };

//     checkLogin();
//     window.addEventListener("loginStatusChanged", checkLogin);

//     return () => {
//       window.removeEventListener("loginStatusChanged", checkLogin);
//     };
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const fetchChatHistory = async (lang) => {
//       try {
//         const response = await fetch(`http://localhost:5000/get_bot_chat_history?bot_id=${botId}`);
//         const data = await response.json();

//         if (data.history && data.history.length > 0) {
//           const formattedMessages = data.history.flatMap((entry) => ([
//             { sender: 'user', text: entry.question },
//             { sender: 'bot', text: entry.answer }
//           ]));
//           setMessages(formattedMessages);
//         } else {
//           setMessages([
//             {
//               sender: 'bot',
//               text: lang === 'en'
//                 ? '👋 Hi! How may I help you? I can communicate in English or Urdu. Chat with me.'
//                 : '👋 السلام علیکم! میں آپ کی کس طرح مدد کر سکتا ہوں؟ آپ اردو یا انگریزی میں بات چیت کر سکتے ہیں۔',
//             },
//           ]);
//         }
//       } catch (error) {
//         console.error('Error fetching chat history:', error);
//         setMessages([
//           {
//             sender: 'bot',
//             text: lang === 'en'
//               ? '👋 Hi! How may I help you? I can communicate in English or Urdu. Chat with me.'
//               : '👋 السلام علیکم! میں آپ کی کس طرح مدد کر سکتا ہوں؟ آپ اردو یا انگریزی میں بات چیت کر سکتے ہیں۔',
//           },
//         ]);
//       }
//     };

//     if (botId) {
//       fetchChatHistory(language);
//     }
//   }, [botId, language]);

//   const handleLanguageChange = (e) => setLanguage(e.target.value);

//   const handleSend = async () => {
//     if (input.trim() === '') return;

//     const userMessage = { sender: 'user', text: input };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput('');

//     try {
//       const response = await fetch('http://localhost:5000/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ bot_id: botId, question: input, language }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       const botResponse = { sender: 'bot', text: data.answer };
//       setMessages((prevMessages) => [...prevMessages, botResponse]);
//     } catch (error) {
//       console.error('Error sending message to backend:', error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' },
//       ]);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userInitial");
//     window.dispatchEvent(new Event("loginStatusChanged"));
//     setIsLoggedIn(false);
//     alert("Logged out successfully!");
//     navigate("/");
//   };

//   return (
//     <div className={`pdf-chatbot-container ${isEmbed ? 'pdf-embed-mode' : ''} ${language === 'ur' ? 'pdf-rtl-mode' : ''}`}>
//       <header className="pdf-chatbot-header">
//         {!isEmbed && (
//           <div className="header-controls">
//             <div className="pdf-language-selector">
//               <label>
//                 <input
//                   type="radio"
//                   value="en"
//                   checked={language === 'en'}
//                   onChange={handleLanguageChange}
//                 />
//                 English
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   value="ur"
//                   checked={language === 'ur'}
//                   onChange={handleLanguageChange}
//                 />
//                 Urdu
//               </label>
//             </div>

//             {isLoggedIn && (
//               <div className="profile-dropdown" ref={dropdownRef}>
//                 <button className="initial-button" onClick={() => setDropdownOpen(prev => !prev)}>
//                   {userInitial}
//                 </button>
//                 {dropdownOpen && (
//                   <div className="dropdown-menu">
//                     <button onClick={() => navigate("/profile")}>Profile</button>
//                     <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//                     <button onClick={handleLogout}>Logout</button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         <h1>
//           {language === 'en'
//             ? 'Welcome to Your Smart Assistant'
//             : 'خوش آمدید آپ کے اسمارٹ اسسٹنٹ میں'}
//         </h1>
//       </header>


//       <main className="pdf-chatbot-content">
//         <div className="pdf-chat-history">
//           {messages.map((msg, index) => (
//             <div key={index} className={`pdf-chatbot-message ${msg.sender}`}>
//               {msg.text}
//             </div>
//           ))}
//         </div>

//         <div className="pdf-chatbot-input-box">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder={language === 'en' ? 'Ask anything..' : 'چیٹ بوٹ بنانے سے متعلق کچھ پوچھیں...'}
//             dir={language === 'ur' ? 'rtl' : 'ltr'}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') handleSend();
//             }}
//           />
//           <button onClick={handleSend}>Send</button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Pdf;






















import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './pdf.css';

function Pdf() {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isEmbed = new URLSearchParams(window.location.search).get('embed') === 'true';
  const botId = new URLSearchParams(window.location.search).get('bot_id');

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("authToken");
      const initial = localStorage.getItem("userInitial");
      setIsLoggedIn(!!token);
      setUserInitial(initial || '?');
    };

    checkLogin();
    window.addEventListener("loginStatusChanged", checkLogin);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLogin);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchChatHistory = async (lang) => {
      try {
        const response = await fetch(`http://localhost:5000/get_bot_chat_history?bot_id=${botId}`);
        const data = await response.json();

        if (data.history && data.history.length > 0) {
          const formattedMessages = data.history.flatMap((entry) => ([
            { sender: 'user', text: entry.question },
            { sender: 'bot', text: entry.answer }
          ]));
          setMessages(formattedMessages);
        } else {
          setMessages([
            {
              sender: 'bot',
              text: lang === 'en'
                ? '👋 Hi! How may I help you? I can communicate in English or Urdu. Chat with me.'
                : '👋 السلام علیکم! میں آپ کی کس طرح مدد کر سکتا ہوں؟ آپ اردو یا انگریزی میں بات چیت کر سکتے ہیں۔',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([
          {
            sender: 'bot',
            text: lang === 'en'
              ? '👋 Hi! How may I help you? I can communicate in English or Urdu. Chat with me.'
              : '👋 السلام علیکم! میں آپ کی کس طرح مدد کر سکتا ہوں؟ آپ اردو یا انگریزی میں بات چیت کر سکتے ہیں۔',
          },
        ]);
      }
    };

    if (botId) {
      fetchChatHistory(language);
    }
  }, [botId, language]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add temporary "Thinking..." bot message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'bot',
        text: language === 'en' ? 'Typing...' : 'سوچ رہا ہوں...'
      }
    ]);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_id: botId, question: input, language }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      // Replace "Thinking..." with actual response
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { sender: 'bot', text: data.answer }
      ]);
    } catch (error) {
      console.error('Error sending message to backend:', error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInitial");
    window.dispatchEvent(new Event("loginStatusChanged"));
    setIsLoggedIn(false);
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className={`pdf-chatbot-container ${isEmbed ? 'pdf-embed-mode' : ''} ${language === 'ur' ? 'pdf-rtl-mode' : ''}`}>
      <header className="pdf-chatbot-header">
        {!isEmbed && (
          <div className="header-controls">
            <div className="pdf-language-selector">
              <label>
                <input
                  type="radio"
                  value="en"
                  checked={language === 'en'}
                  onChange={handleLanguageChange}
                />
                English
              </label>
              <label>
                <input
                  type="radio"
                  value="ur"
                  checked={language === 'ur'}
                  onChange={handleLanguageChange}
                />
                Urdu
              </label>
            </div>

            {isLoggedIn && (
              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="initial-button" onClick={() => setDropdownOpen(prev => !prev)}>
                  {userInitial}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => navigate("/profile")}>Profile</button>
                    <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <h1>
          {language === 'en'
            ? 'Welcome to Your Smart Assistant'
            : 'خوش آمدید آپ کے اسمارٹ اسسٹنٹ میں'}
        </h1>
      </header>

      <main className="pdf-chatbot-content">
        <div className="pdf-chat-history">
          {messages.map((msg, index) => (
            <div key={index} className={`pdf-chatbot-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="pdf-chatbot-input-box">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'en' ? 'Ask anything..' : 'چیٹ بوٹ بنانے سے متعلق کچھ پوچھیں...'}
            dir={language === 'ur' ? 'rtl' : 'ltr'}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (language === 'en' ? 'Sending...' : 'بھیج رہا ہوں...') : 'Send'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Pdf;
