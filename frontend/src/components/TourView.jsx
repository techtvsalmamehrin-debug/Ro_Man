import { useState, useEffect } from 'react';

export default function TourView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch('https://roman-production.up.railway.app/tour-config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Error loading tour config", err));
  }, []);

  const videoUrl = config?.tour_url || "https://www.youtube.com/embed/eUNFH9eqGXo?autoplay=1";
  const isLocal = config?.tour_type === 'local';

  return (
    <div className="tour-container glass-panel">
      <div className={`video-player ${isPlaying ? 'playing' : ''}`} onClick={() => !isPlaying && setIsPlaying(true)}>
        {!isPlaying ? (
          <>
            <div className="play-button">▶</div>
            <p>Virtual Campus Tour Video</p>
          </>
        ) : (
          isLocal ? (
            <video
              width="100%"
              height="100%"
              controls
              autoPlay
              src={`https://roman-production.up.railway.app${videoUrl}`}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="Virtual Campus Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )
        )}
      </div>
      <div className="tour-controls">
        <h3>Experience Campus Life</h3>
        <p>Watch a guided tour of our labs, library, and classrooms.</p>
      </div>

      <style>{`
        .tour-container {
          width: 90%;
          max-width: 900px;
          height: 70vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .video-player {
          flex: 1;
          background: #000;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          background-image: linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 50%, #1e293b 50%, #1e293b 75%, #0f172a 75%, #0f172a 100%);
          background-size: 40px 40px;
          cursor: pointer;
        }
        .video-player.playing {
            background: #000;
            cursor: default;
        }
        .play-button {
          font-size: 4rem;
          color: rgba(255,255,255,0.7);
          transition: transform 0.3s;
        }
        .video-player:not(.playing):hover .play-button {
          transform: scale(1.1);
          color: white;
        }
        .tour-controls {
          text-align: center;
        }
        .tour-controls h3 {
          color: var(--primary-color);
          margin-bottom: 5px;
        }
        .tour-controls p {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
