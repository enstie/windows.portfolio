import React, { useState, useRef, useEffect, useCallback } from 'react';

// ── Passenger playlist using official YouTube video IDs ──────────────────────
const TRACKS = [
  {
    id: 'yMqL81Y2lQk',
    title: 'Let Her Go',
    album: 'All the Little Lights',
    year: '2012',
    duration: '4:14'
  },
  {
    id: 'RBumgq5yVrA',
    title: 'Passenger - Coins in a Fountain',
    album: 'Whispers',
    year: '2014',
    duration: '3:50'
  },
  {
    id: 'OgLQM4vBILo',
    title: "I'll Be Your Man",
    album: 'All the Little Lights',
    year: '2012',
    duration: '3:22'
  },
  {
    id: 'Z7lqEBGcnns',
    title: 'Catch in the Dark',
    album: 'All the Little Lights',
    year: '2012',
    duration: '3:48'
  },
  {
    id: '8lGRHlOqBFM',
    title: 'Long Road',
    album: 'Whispers',
    year: '2014',
    duration: '4:05'
  },
  {
    id: 'hRe7p5QIbh4',
    title: "Nothing's Changed",
    album: 'Whispers II',
    year: '2016',
    duration: '4:30'
  },
  {
    id: 'VIhfu6yBZDE',
    title: 'Holes',
    album: 'Whispers',
    year: '2014',
    duration: '3:38'
  },
  {
    id: 'yqbvdxI-EJs',
    title: 'Staring at the Stars',
    album: 'All the Little Lights',
    year: '2012',
    duration: '4:10'
  },
  {
    id: 'MjkFAX8HK9Q',
    title: 'Golden Leaves',
    album: 'All the Little Lights',
    year: '2012',
    duration: '3:28'
  },
  {
    id: 'XCnAkBwLbAk',
    title: 'Scare Away the Dark',
    album: 'Whispers',
    year: '2014',
    duration: '4:02'
  }
];

export default function MediaPlayer() {
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [volume, setVolume]           = useState(80);
  const [visMode, setVisMode]         = useState('bars');
  const [elapsed, setElapsed]         = useState(0);
  const [isMuted, setIsMuted]         = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [showVideo, setShowVideo]     = useState(false); // toggle visualizer ↔ video

  const playerRef   = useRef(null);  // YT.Player instance
  const iframeRef   = useRef(null);
  const canvasRef   = useRef(null);
  const timerRef    = useRef(null);
  const visTimerRef = useRef(null);
  const containerId = 'yt-player-container';

  const track = TRACKS[currentIdx];

  // ── Canvas visualizer ──────────────────────────────────────────────────────
  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00081d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#052e72';
    ctx.lineWidth = 1;
    for (let i = 8; i < canvas.height; i += 8) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    // draw idle bars low
    const bw = 8, gap = 2, count = Math.floor(canvas.width / (bw + gap));
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = '#1a4a1a';
      ctx.fillRect(i * (bw + gap), canvas.height - 4, bw, 4);
    }
  }, []);

  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#00081d';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#052e72';
    ctx.lineWidth = 1;
    for (let i = 8; i < h; i += 8) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    if (visMode === 'bars') {
      const bw = 8, gap = 2;
      const count = Math.floor(w / (bw + gap));
      for (let i = 0; i < count; i++) {
        const bh = Math.floor(Math.random() * (h - 6)) + 4;
        const grad = ctx.createLinearGradient(0, h, 0, h - bh);
        grad.addColorStop(0, '#00cc44');
        grad.addColorStop(0.6, '#ffdd00');
        grad.addColorStop(1, '#ff3300');
        ctx.fillStyle = grad;
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
        // peak dot
        ctx.fillStyle = '#fff';
        ctx.fillRect(i * (bw + gap), h - bh - 2, bw, 2);
      }
    } else {
      ctx.beginPath();
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      const pts = 120, amp = Math.random() * 22 + 8, freq = Math.random() * 3 + 2;
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin((x / w) * Math.PI * freq * 2 + Date.now() / 300) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [visMode]);

  useEffect(() => { drawStatic(); }, [drawStatic]);

  // ── Start/stop visualizer animation ───────────────────────────────────────
  useEffect(() => {
    if (isPlaying && !showVideo) {
      visTimerRef.current = setInterval(drawVisualizer, 80);
    } else {
      clearInterval(visTimerRef.current);
      if (!showVideo) drawStatic();
    }
    return () => clearInterval(visTimerRef.current);
  }, [isPlaying, showVideo, drawVisualizer, drawStatic]);

  // ── Elapsed timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  // ── Load YouTube IFrame API once ───────────────────────────────────────────
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player(containerId, {
        height: '90',
        width: '160',
        videoId: TRACKS[0].id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          disablekb: 1
        },
        events: {
          onReady: (e) => {
            setPlayerReady(true);
            e.target.setVolume(80);
          },
          onStateChange: (e) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (e.data === 1) { setIsPlaying(true); }
            if (e.data === 2 || e.data === 0) { setIsPlaying(false); }
            if (e.data === 0) {
              // auto-advance
              setCurrentIdx(prev => {
                const next = (prev + 1) % TRACKS.length;
                setTimeout(() => {
                  playerRef.current?.loadVideoById(TRACKS[next].id);
                  playerRef.current?.playVideo();
                }, 300);
                setElapsed(0);
                return next;
              });
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
    return () => { /* keep player mounted */ };
  }, []);

  // ── Volume sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    if (isMuted) { playerRef.current.mute(); }
    else { playerRef.current.unMute(); playerRef.current.setVolume(volume); }
  }, [volume, isMuted, playerReady]);

  // ── Control handlers ───────────────────────────────────────────────────────
  const loadTrack = useCallback((idx) => {
    setCurrentIdx(idx);
    setElapsed(0);
    if (playerRef.current && playerReady) {
      playerRef.current.loadVideoById(TRACKS[idx].id);
      playerRef.current.playVideo();
    }
  }, [playerReady]);

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current || !playerReady) return;
    if (isPlaying) { playerRef.current.pauseVideo(); }
    else { playerRef.current.playVideo(); }
  }, [isPlaying, playerReady]);

  const handleStop = useCallback(() => {
    if (!playerRef.current || !playerReady) return;
    playerRef.current.stopVideo();
    setIsPlaying(false);
    setElapsed(0);
  }, [playerReady]);

  const handlePrev = useCallback(() => {
    const idx = (currentIdx - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(idx);
  }, [currentIdx, loadTrack]);

  const handleNext = useCallback(() => {
    const idx = (currentIdx + 1) % TRACKS.length;
    loadTrack(idx);
  }, [currentIdx, loadTrack]);

  // Format seconds to mm:ss
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="xp-media-player">
      {/* Header */}
      <div className="player-inner-header">
        <span className="player-logo">Windows Media Player</span>
        <span style={{ color: '#aac', fontSize: 10 }}>Passenger Collection</span>
      </div>

      <div className="player-body">
        {/* Visualizer / Video area */}
        <div className="vis-screen-wrapper" style={{ position: 'relative' }}>
          {/* Hidden YouTube player (always mounted, handles actual audio) */}
          <div
            id={containerId}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: 160, height: 90,
              opacity: showVideo ? 1 : 0,
              pointerEvents: showVideo ? 'auto' : 'none',
              zIndex: showVideo ? 2 : 0
            }}
          />

          {/* Canvas visualizer (shown when showVideo=false) */}
          <canvas
            ref={canvasRef}
            width="160" height="90"
            className="vis-canvas"
            style={{
              position: 'absolute', top: 0, left: 0,
              opacity: showVideo ? 0 : 1,
              zIndex: showVideo ? 0 : 2,
              cursor: 'pointer'
            }}
            onClick={() => setVisMode(v => v === 'bars' ? 'wave' : 'bars')}
          />

          {/* Toggle video/viz button */}
          <button
            onClick={() => setShowVideo(v => !v)}
            title={showVideo ? 'Show Visualizer' : 'Show Video'}
            style={{
              position: 'absolute', bottom: 3, right: 3, zIndex: 10,
              background: 'rgba(0,0,0,0.55)', border: '1px solid #335',
              color: '#aac', fontSize: 9, padding: '1px 4px', cursor: 'pointer',
              fontFamily: 'Tahoma, sans-serif', borderRadius: 2
            }}
          >
            {showVideo ? 'VIZ' : 'VID'}
          </button>

          {/* Scrolling track info */}
          <div className="track-scroll-banner" style={{ zIndex: 11, position: 'relative', marginTop: 90 }}>
            <span className="scrolling-text">
              {isPlaying
                ? `▶  ${track.title}  —  Passenger  •  ${track.album} (${track.year})`
                : playerReady ? `⏹  ${track.title}` : 'Loading YouTube API…'}
            </span>
          </div>
        </div>

        {/* Playlist */}
        <div className="playlist-panel border-3d">
          <div className="playlist-header">
            Passenger — {TRACKS.length} tracks
          </div>
          <div className="playlist-tracks">
            {TRACKS.map((t, idx) => (
              <div
                key={t.id}
                className={`playlist-item ${currentIdx === idx ? 'active' : ''}`}
                onDoubleClick={() => loadTrack(idx)}
                title={`${t.title} • ${t.album}`}
              >
                <span className="track-num">
                  {currentIdx === idx && isPlaying ? '▶' : `${idx + 1}.`}
                </span>
                <span className="track-title">{t.title}</span>
                <span className="track-len">{t.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls border-3d">
        <div className="control-buttons-row">
          {/* Prev */}
          <button className="control-btn prev-btn" title="Previous" onClick={handlePrev}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
                <rect x="5" y="4" width="5" height="16" /><rect x="14" y="4" width="5" height="16" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto', transform:'translateX(1px)' }}>
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>

          {/* Stop */}
          <button className="control-btn stop-btn" title="Stop" onClick={handleStop}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
              <rect x="4" y="4" width="16" height="16" />
            </svg>
          </button>

          {/* Next */}
          <button className="control-btn next-btn" title="Next" onClick={handleNext}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>

          {/* Mute */}
          <button
            className="control-btn"
            title={isMuted ? 'Unmute' : 'Mute'}
            onClick={() => setIsMuted(m => !m)}
            style={{ marginLeft: 4 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
              {isMuted ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" />
                  <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" />
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none"/>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Seek / elapsed */}
        <div className="progress-seek-row">
          <div className="progress-bar-container player-seek">
            <div className="progress-bar-fill player-seek-fill" style={{ width: `${Math.min(100, (elapsed / 250) * 100)}%` }} />
          </div>
          <span className="progress-pct">{fmt(elapsed)}</span>
        </div>

        {/* Volume */}
        <div className="volume-row">
          <span className="volume-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign:'middle', marginRight:4 }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </span>
          <input
            type="range" min="0" max="100" value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-val">{isMuted ? 'Muted' : `${volume}%`}</span>
        </div>
      </div>
    </div>
  );
}
