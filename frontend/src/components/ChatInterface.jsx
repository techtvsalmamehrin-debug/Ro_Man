import { useState, useRef, useEffect } from 'react';

export default function ChatInterface({ initialQuery, clearInitialQuery, navigateTo }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am Ro-Man. You can ask me anything about the college. Note: Please remember to fill out the Enquiry Form for admission queries.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (initialQuery) {
      processInput(initialQuery);
      if (clearInitialQuery) clearInitialQuery();
    }
  }, [initialQuery]);

  // Force initialize speech synthesis on mobile platforms
  const initializeAudio = () => {
    if ('speechSynthesis' in window) {
      const initUtterance = new SpeechSynthesisUtterance('');
      initUtterance.volume = 0;
      window.speechSynthesis.speak(initUtterance);
      // Remove listener once initialized
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('touchstart', initializeAudio);
    }
  };

  useEffect(() => {
    // Attach listener to first interaction anywhere on the document
    document.addEventListener('click', initializeAudio);
    document.addEventListener('touchstart', initializeAudio);
    return () => {
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('touchstart', initializeAudio);
    };
  }, []);

  // Text-to-Speech (Robotic Voice) with Cloud Fallback
  const speak = (text) => {
    const playCloudFallback = (textToSpeak) => {
      try {
        // Fallback to Google Translate's free TTS API
        // We encode the text and limit it (Google TTS has a ~200 char limit per request, but good enough for short replies)
        const safeText = textToSpeak.substring(0, 200);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(safeText)}`;
        const audio = new Audio(url);
        audio.play().catch(e => console.error("Cloud TTS Playback failed:", e));
      } catch (err) {
        console.error("Audio fallback failed", err);
      }
    };

    if ('speechSynthesis' in window) {
      // Force resume the synthesis engine (crucial for some Android/Chrome versions)
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel(); // Stop any previous speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.6; // Lower pitch for robot effect
      utterance.rate = 0.9;  // Slightly mechanical speed
      utterance.volume = 1;  // Ensure volume is maximum

      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Fallback order: Male -> UK/English -> Any English -> First Available -> Default
          const englishVoices = voices.filter(v => v.lang.startsWith('en'));
          const preferredVoice = englishVoices.find(v => v.name.includes('Male')) ||
            englishVoices.find(v => v.name.includes('UK') || v.name.includes('English')) ||
            englishVoices[0] ||
            voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
          window.speechSynthesis.speak(utterance);
        } else {
          // If voices STILL empty after waiting, use cloud fallback
          playCloudFallback(text);
        }
      };

      // In some Android browsers, getVoices() is empty initially and loads async
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });
        // Fallback speak if voiceschanged never fires or voices are truly missing
        setTimeout(() => {
          if (window.speechSynthesis.getVoices().length === 0) {
            playCloudFallback(text);
          } else {
            setVoiceAndSpeak();
          }
        }, 1000);
      } else {
        setVoiceAndSpeak();
      }
    } else {
      // Browser doesn't support SpeechSynthesis at all
      playCloudFallback(text);
    }
  };

  // Helper to add bot message and speak it
  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: 'bot', text }]);
    speak(text);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert("Microphone error. Please allow permissions.");
      };

      recognition.start();
    } else {
      alert("Voice input requires a supported browser (Chrome/Edge).");
    }
  };

  const processInput = async (manualInput = null) => {

    const textToProcess = manualInput || input;
    if (!textToProcess.trim()) return;

    const userMsg = { role: 'user', text: textToProcess };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Increment interaction count
    setInteractionCount(prev => {
      const newCount = prev + 1;
      if (newCount === 2) { // Show popup after 2nd interaction
        setTimeout(() => setShowPopup(true), 2000);
      }
      return newCount;
    });

    // Normal Chat Logic
    try {
      const response = await fetch(`https://roman-production.up.railway.app/query?q=${encodeURIComponent(textToProcess)}`);
      const data = await response.json();
      addBotMessage(data.response);
    } catch (error) {
      addBotMessage("Sorry, I'm having trouble connecting to my brain.");
    }
    setIsLoading(false);
  };

  return (
    <div className="chat-container glass-panel">
      <div className="messages-area">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        {isLoading && <div className="message bot"><div className="message-bubble typing">...</div></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Trigger dummy speech synchronously on user gesture
              if ('speechSynthesis' in window) {
                const primeUtterance = new SpeechSynthesisUtterance('');
                primeUtterance.volume = 0;
                window.speechSynthesis.speak(primeUtterance);
              }
              processInput();
            }
          }}
          placeholder="Type your question..."
          className="chat-input"
        />
        <button
          onClick={startListening}
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          title="Speak"
        >
          {isListening ? '🔴' : '🎤'}
        </button>
        <button
          onClick={() => {
            // Trigger dummy speech synchronously on user gesture
            if ('speechSynthesis' in window) {
              const primeUtterance = new SpeechSynthesisUtterance('');
              primeUtterance.volume = 0;
              window.speechSynthesis.speak(primeUtterance);
            }
            processInput();
          }}
          className="send-btn btn-primary"
        >
          Send
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card glass-panel">
            <div className="popup-icon">😊</div>
            <h3>Quick Reminder!</h3>
            <p>Don't forget to fill out the Enquiry Form for admission queries.</p>
            <div className="popup-actions">
              <button className="popup-btn-secondary" onClick={() => setShowPopup(false)}>Later</button>
              <button className="popup-btn-primary" onClick={() => { setShowPopup(false); navigateTo('form'); }}>OK</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .chat-container {
          width: 90%;
          max-width: 800px;
          height: 65vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          animation: float 6s ease-in-out infinite;
        }
        .mic-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0 15px;
          cursor: pointer;
          font-size: 1.2rem;
          color: white;
          transition: all 0.3s;
          min-width: 50px;
        }
        .mic-btn:hover {
            background: var(--primary-color);
            box-shadow: 0 0 10px var(--primary-glow);
        }
        .mic-btn.listening {
          background: #ef4444; /* Red color */
          box-shadow: 0 0 15px #ef4444;
          animation: pulse-red 1.5s infinite;
          border-color: #ef4444;
        }

        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding-right: 10px;
        }
        
        /* Custom Scrollbar */
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }
        .messages-area::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .messages-area::-webkit-scrollbar-thumb {
          background: var(--text-secondary);
          border-radius: 3px;
        }

        .message {
          display: flex;
          opacity: 0;
          animation: fade-in 0.3s forwards;
        }
        
        @keyframes fade-in {
          to { opacity: 1; transform: translateY(0); }
          from { opacity: 0; transform: translateY(10px); }
        }

        .message.user {
          justify-content: flex-end;
        }
        .message.bot {
          justify-content: flex-start;
        }
        .message-bubble {
          max-width: 75%;
          padding: 14px 20px;
          border-radius: 20px;
          font-size: 1.1rem;
          line-height: 1.5;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .message.user .message-bubble {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          border-bottom-right-radius: 4px;
        }
        .message.bot .message-bubble {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--glass-border);
          border-bottom-left-radius: 4px;
          color: var(--text-primary);
        }
        .input-area {
          display: flex;
          gap: 15px;
        }
        .chat-input {
          flex: 1;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--glass-border);
          border-radius: 15px;
          padding: 15px 20px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .chat-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
        }

        .popup-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            backdrop-filter: blur(4px);
            border-radius: 20px;
        }

        .popup-card {
            background: rgba(255, 255, 255, 0.95); /* White glass */
            color: #1e293b;
            padding: 30px;
            text-align: center;
            border-radius: 20px;
            width: 80%;
            max-width: 350px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(255,255,255,0.5);
        }

        .popup-icon {
            font-size: 4rem;
            margin-bottom: 10px;
            animation: bounce 2s infinite;
        }

        .popup-card h3 {
            margin: 10px 0;
            color: #0f172a;
            font-size: 1.5rem;
        }

        .popup-card p {
            color: #475569;
            margin-bottom: 25px;
            font-size: 1rem;
            line-height: 1.5;
        }

        .popup-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .popup-btn-primary {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            flex: 1;
        }

        .popup-btn-primary:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(14, 165, 233, 0.4);
        }

        .popup-btn-secondary {
            background: #e2e8f0;
            color: #475569;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .popup-btn-secondary:hover {
            background: #cbd5e1;
            color: #1e293b;
        }

        @keyframes pop-in {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
