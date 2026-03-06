import { useState } from 'react'
import './index.css'
import ChatInterface from './components/ChatInterface'
import TourView from './components/TourView'
import FormView from './components/FormView'
import AdminView from './components/AdminView'
import AboutRoman from './components/AboutRoman'

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const isAdminViewable = queryParams.get('dev') === 'true' || queryParams.get('admin') === 'portal';

  const [activeView, setActiveView] = useState(isAdminViewable ? 'admin' : 'home'); // home, chat, tour, form, admin
  const [initialQuery, setInitialQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInitialQuery(transcript);
        setActiveView('chat');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        alert("Microphone error. Please try again.");
      };

      recognition.start();
    } else {
      alert("Voice input requires a supported browser (Chrome/Edge).");
    }
  };

  return (
    <div className="app-container">
      {/* Header / Status Bar */}
      <header className="status-bar glass-panel">
        <div className="logo" onClick={() => setActiveView('home')} style={{ cursor: 'pointer' }}>RO-MAN <span className="version">AI v1.0</span></div>
        <div className="status-indicators">
          <span className="status-dot online"></span> Online
          <span className="time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeView === 'home' && (
          <div className="hero-section">
            <div className="robot-avatar-container">
              {/* Robot Face will go here */}
              <div className="placeholder-face glow-effect">
                <div className="eyes">
                  <div className="eye left"></div>
                  <div className="eye right"></div>
                </div>
              </div>
            </div>
            <h1 className="welcome-text">Hello, I am Ro-Man.</h1>
            <p className="welcome-sub">Ask me anything about the college!</p>

            <div className="home-search-container">
              <input
                type="text"
                className="home-search-input"
                placeholder="Ask a question..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setInitialQuery(e.target.value);
                    setActiveView('chat');
                  }
                }}
              />
              <button
                className={`mic-home-btn ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                title="Speak to ask"
              >
                {isListening ? '🔴' : '🎤'}
              </button>
            </div>
          </div>
        )}

        {activeView === 'chat' && (
          <div className="flex-center" style={{ width: '100%', height: '100%' }}>
            <div className="flex-center" style={{ width: '100%', height: '100%' }}>
              <ChatInterface
                initialQuery={initialQuery}
                clearInitialQuery={() => setInitialQuery('')}
                navigateTo={setActiveView}
              />
            </div>
          </div>
        )}

        {activeView === 'tour' && (
          <div className="flex-center" style={{ width: '100%', height: '100%' }}>
            <TourView />
          </div>
        )}

        {activeView === 'form' && (
          <div className="flex-center" style={{ width: '100%', height: '100%' }}>
            <FormView navigateTo={setActiveView} />
          </div>
        )}

        {activeView === 'admin' && (
          <div className="flex-center" style={{ width: '100%', height: '100%' }}>
            <AdminView />
          </div>
        )}

        {activeView === 'roman' && (
          <div className="flex-center" style={{ width: '100%', height: '100%' }}>
            <AboutRoman />
          </div>
        )}
      </main>

      {/* Bottom Navigation / Controls */}
      <nav className="bottom-nav glass-panel">
        <button className={`nav-btn ${activeView === 'home' ? 'active' : ''}`} onClick={() => setActiveView('home')}>Home</button>
        <button className={`nav-btn ${activeView === 'chat' ? 'active' : ''}`} onClick={() => setActiveView('chat')}>Ask Question</button>
        <button className={`nav-btn ${activeView === 'tour' ? 'active' : ''}`} onClick={() => setActiveView('tour')}>Virtual Tour</button>
        <button className={`nav-btn ${activeView === 'form' ? 'active' : ''}`} onClick={() => setActiveView('form')}>Enquiry Form</button>
        {isAdminViewable && (
          <button className={`nav-btn ${activeView === 'admin' ? 'active' : ''}`} onClick={() => setActiveView('admin')} style={{ opacity: 0.8 }}>Admin Portal</button>
        )}
        <button className={`nav-btn ${activeView === 'roman' ? 'active' : ''}`} onClick={() => setActiveView('roman')}>About Ro-Man</button>
      </nav>

      <style>{`
        .app-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 20px;
        }

        .status-bar {
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .version {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-left: 10px;
        }

        .status-indicators {
          display: flex;
          align-items: center;
          gap: 15px;
          color: var(--text-secondary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--success-color);
          box-shadow: 0 0 8px var(--success-color);
        }

        .main-content {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%; /* Ensure full width */
        }

        .robot-avatar-container {
          width: 200px;
          height: 200px;
          margin: 0 auto 30px;
        }

        .placeholder-face {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #2a3b55, #050a14);
          border: 2px solid var(--primary-color);
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 30px var(--primary-glow);
          position: relative;
        }

        .eyes {
          display: flex;
          gap: 40px;
        }

        .eye {
          width: 30px;
          height: 10px;
          background-color: var(--primary-color);
          border-radius: 20px;
          box-shadow: 0 0 10px var(--primary-color);
          animation: blink 4s infinite;
        }

        @keyframes blink {
          0%, 48%, 52%, 100% { height: 10px; }
          50% { height: 2px; }
        }

        .welcome-text {
          font-size: 3rem;
          text-align: center;
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        
        .welcome-sub {
          text-align: center;
          color: var(--text-secondary);
          font-size: 1.2rem;
          margin-bottom: 30px;
        }

        .home-search-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          gap: 15px;
          align-items: center;
          justify-content: center;
        }

        .home-search-input {
          flex: 1;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--glass-border);
          border-radius: 15px;
          padding: 15px 25px;
          color: white;
          font-family: inherit;
          font-size: 1.1rem;
          text-align: center;
          transition: all 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .home-search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
          background: rgba(15, 23, 42, 0.8);
          transform: scale(1.02);
        }

        .mic-home-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex; /* Ensure center alignment */
          align-items: center; /* Vertical center */
          justify-content: center; /* Horizontal center */
          cursor: pointer;
          font-size: 1.5rem;
          color: white;
          transition: all 0.3s;
        }

        .mic-home-btn:hover {
            background: var(--primary-color);
            box-shadow: 0 0 15px var(--primary-glow);
            transform: scale(1.1);
        }

        .mic-home-btn.listening {
          background: #ef4444; /* Red for listening */
          border-color: #ef4444;
          box-shadow: 0 0 20px #ef4444;
          animation: pulse-red-home 1.5s infinite;
        }

        @keyframes pulse-red-home {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .bottom-nav {
          padding: 15px;
          display: flex;
          justify-content: space-around;
        }

        .nav-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 1rem;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .nav-btn.active, .nav-btn:hover {
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary-color);
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
        }
      `}</style>
    </div>
  )
}

export default App
