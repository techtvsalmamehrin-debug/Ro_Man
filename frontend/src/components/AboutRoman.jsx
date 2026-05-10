export default function AboutRoman() {
  return (
    <div className="about-container glass-panel">
      <h2>About <span style={{ color: 'var(--primary-color)' }}>Ro-Man</span></h2>

      <div className="content-scroll">
        <section className="info-block">
          <h3>🤖 What is Ro-Man?</h3>
          <p>
            Ro-Man is a smart and interactive service robot designed especially for college enquiry and guidance.
            It acts like a virtual assistant with a physical robot body, welcoming visitors in a friendly and modern way.
          </p>
        </section>

        <section className="info-block">
          <h3>🎯 Objective</h3>
          <ul>
            <li>To assist students, parents, and visitors with instant information.</li>
            <li>To reduce manual enquiry work and improve the smart campus experience.</li>
          </ul>
        </section>

        <div className="team-section">
          <h3>👥 Developed By</h3>
          <p>Final-year B.Tech Students (2026 Pass-out)</p>
          <div className="team-members">
            <span>👩‍💻 Ms. Salmath T. V. (Lead)</span>
            <span>👩‍💻 Ms. Nidharya N. S.</span>
            <span>👩‍💻 Ms. Sharikha Jabeen K.</span>
            <span>👩‍💻 Ms. Shahma Nasrin K. R.</span>
          </div>
          <div className="guides">
            <p><strong>Guided By:</strong> Ms. Ihsana Muhammed P (CSE)</p>
            <p><strong>Supported By:</strong> Dr. P. Suresh Venugopal (Principal)</p>
          </div>
        </div>

        <div className="thanks-section" style={{ marginTop: '20px', background: 'rgba(255, 215, 0, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
          <h3 style={{ color: '#ffd700' }}>🏆 Special Thanks</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><strong>Mr. V. P. Salim</strong> - Chief Executive Officer (CEO)</li>
            <li><strong>Mr. K. M. Hyderali</strong> - General Secretary</li>
          </ul>
        </div>
      </div>

      <style>{`
        .about-container {
          width: 90%;
          max-width: 800px;
          height: 80vh;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fade-in 0.5s ease-out;
        }

        .content-scroll {
          overflow-y: auto;
          flex: 1;
          padding-right: 15px;
        }

        .content-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .content-scroll::-webkit-scrollbar-thumb {
          background: var(--primary-color);
          border-radius: 3px;
        }

        .info-block {
          margin-bottom: 25px;
          background: rgba(255, 255, 255, 0.03);
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        h3 {
          color: var(--secondary-color);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        ul {
          padding-left: 20px;
          color: var(--text-secondary);
        }

        li {
          margin-bottom: 8px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
        }

        .feature-card {
          background: rgba(14, 165, 233, 0.1);
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-size: 0.9rem;
          color: white;
          border: 1px solid var(--glass-border);
        }

        .team-section {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(20, 184, 166, 0.1));
          padding: 20px;
          border-radius: 15px;
          margin-top: 10px;
        }

        .team-members {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 15px 0;
        }

        .team-members span {
          background: rgba(0, 0, 0, 0.2);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .guides p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
}
