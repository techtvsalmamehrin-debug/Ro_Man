import React from 'react';

export default function GreetingPage({ navigateTo }) {
    return (
        <div className="greeting-container glass-panel fade-in">
            <div className="greeting-content">
                <h1 className="greeting-title glow-text">Welcome to Ro-Man</h1>
                <h2 className="greeting-subtitle">AI Admission Enquiry Robot</h2>

                <div className="robot-illustration">
                    <div className="placeholder-face glow-effect large-face">
                        <div className="eyes">
                            <div className="eye left"></div>
                            <div className="eye right"></div>
                        </div>
                        <div className="mouth"></div>
                    </div>
                </div>

                <p className="greeting-message">
                    Hello! I am Ro-Man, your AI assistant for admission enquiries.
                    I can help you get information about courses, fees, admission procedures,
                    and facilities at Royal College of Engineering and Technology, Thrissur.
                </p>

                <button
                    className="btn-primary start-btn"
                    onClick={() => navigateTo('home')}
                >
                    Go to Home Page
                </button>
            </div>

            <footer className="greeting-footer">
                <p>Developed by the Ro-Man Project Team (B.Tech Students)</p>
            </footer>

            <style>{`
        .greeting-container {
          width: 90%;
          max-width: 800px;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          text-align: center;
          position: relative;
        }

        .greeting-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 30px;
        }

        .greeting-title {
          font-size: 3.5rem;
          margin: 0;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .greeting-subtitle {
          font-size: 1.5rem;
          color: var(--text-secondary);
          margin-top: -15px;
          font-weight: 500;
        }

        .robot-illustration {
          margin: 20px 0;
          animation: float 6s ease-in-out infinite;
        }

        .large-face {
          width: 180px;
          height: 180px;
          position: relative;
        }

        .mouth {
          position: absolute;
          bottom: 40px;
          width: 50px;
          height: 8px;
          background-color: var(--primary-color);
          border-radius: 10px;
          box-shadow: 0 0 10px var(--primary-glow);
          animation: pulse-mouth 2s infinite;
        }

        @keyframes pulse-mouth {
          0%, 100% { width: 50px; }
          50% { width: 60px; height: 10px; }
        }

        .greeting-message {
          font-size: 1.25rem;
          line-height: 1.8;
          color: var(--text-primary);
          max-width: 650px;
          margin: 20px 0;
          padding: 20px;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .start-btn {
          font-size: 1.2rem;
          padding: 15px 40px;
          border-radius: 30px;
          margin-top: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: pulse 2s infinite;
        }

        .greeting-footer {
          margin-top: auto;
          padding-top: 30px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          opacity: 0.7;
          border-top: 1px solid rgba(255,255,255,0.1);
          width: 100%;
        }

        .fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
