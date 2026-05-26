import React, { useState, useRef, useEffect, useCallback } from 'react';

// ── Passenger playlist ────────────────────────────────────────────────────────
const TRACKS = [
  { id: 'yMqL81Y2lQk', title: 'Let Her Go',          album: 'All the Little Lights', year: '2012', duration: '4:14' },
  { id: 'OgLQM4vBILo', title: "I'll Be Your Man",     album: 'All the Little Lights', year: '2012', duration: '3:22' },
  { id: 'Z7lqEBGcnns', title: 'Catch in the Dark',    album: 'All the Little Lights', year: '2012', duration: '3:48' },
  { id: 'MjkFAX8HK9Q', title: 'Golden Leaves',        album: 'All the Little Lights', year: '2012', duration: '3:28' },
  { id: 'yqbvdxI-EJs', title: 'Staring at the Stars', album: 'All the Little Lights', year: '2012', duration: '4:10' },
  { id: 'XCnAkBwLbAk', title: 'Scare Away the Dark',  album: 'Whispers',              year: '2014', duration: '4:02' },
  { id: 'VIhfu6yBZDE', title: 'Holes',                album: 'Whispers',              year: '2014', duration: '3:38' },
  { id: 'RBumgq5yVrA', title: 'Coins in a Fountain',  album: 'Whispers',              year: '2014', duration: '3:50' },
  { id: '8lGRHlOqBFM', title: 'Long Road',            album: 'Whispers',              year: '2014', duration: '4:05' },
  { id: 'hRe7p5QIbh4', title: "Nothing's Changed",    album: 'Whispers II',           year: '2016', duration: '4:30' },
];

// Build a YouTube embed URL. autoplay=1 triggers immediate play (requires prior user gesture).
function embedUrl(videoId, autoplay = false) {
  return (
    `https://www.youtube.com/embed/${videoId}` +
    `?enablejsapi=1&autoplay=${autoplay ? 1 : 0}` +
    `&controls=0&modestbranding=1&rel=0&fs=0&iv_load_policy=3&cc_load_policy=0`
  );
}

// Send a command to the YouTube iframe via postMessage (instant, no API needed)
function ytCmd(iframe, func, args = []) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args }),
    '*'
  );
}

export default function MediaPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [volume,     setVolume]     = useState(80);
  const [isMuted,    setIsMuted]    = useState(false);
  const [visMode,    setVisMode]    = useState('bars');
  const [showVideo,  setShowVideo]  = useState(false);
  const [elapsed,    setElapsed]    = useState(0);
  // iframeSrc drives what the iframe plays. Once set with autoplay=1, it starts immediately.
  const [iframeSrc, setIframeSrc]   = useState(() => embedUrl(TRACKS[0].id, false));

  const iframeRef   = useRef(null);
  const canvasRef   = useRef(null);
  const timerRef    = useRef(null);
  const visTimerRef = useRef(null);

  const track = TRACKS[currentIdx];

  // ── Volume / mute via postMessage ─────────────────────────────────────────
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    ytCmd(iframe, 'setVolume', [isMuted ? 0 : volume]);
  }, [volume, isMuted]);

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  // ── Listen for YT iframe state messages ──────────────────────────────────
  // YT sends postMessage events back when enablejsapi=1
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.event === 'infoDelivery' && data.info) {
          // playerState: 1=playing, 2=paused, 0=ended
          if (data.info.playerState === 1) setIsPlaying(true);
          if (data.info.playerState === 2) setIsPlaying(false);
          if (data.info.playerState === 0) {
            // Auto-advance to next track
            setCurrentIdx(prev => {
              const next = (prev + 1) % TRACKS.length;
              setElapsed(0);
              setIframeSrc(embedUrl(TRACKS[next].id, true));
              setIsPlaying(true);
              return next;
            });
          }
        }
      } catch (_) {}
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // ── Controls ──────────────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (isPlaying) {
      ytCmd(iframe, 'pauseVideo');
      setIsPlaying(false);
    } else {
      ytCmd(iframe, 'playVideo');
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleStop = useCallback(() => {
    const iframe = iframeRef.current;
    ytCmd(iframe, 'stopVideo');
    setIsPlaying(false);
    setElapsed(0);
  }, []);

  // Load a track: update src with autoplay=1 — starts playing immediately
  const loadTrack = useCallback((idx) => {
    setCurrentIdx(idx);
    setElapsed(0);
    setIframeSrc(embedUrl(TRACKS[idx].id, true));
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    loadTrack((currentIdx - 1 + TRACKS.length) % TRACKS.length);
  }, [currentIdx, loadTrack]);

  const handleNext = useCallback(() => {
    loadTrack((currentIdx + 1) % TRACKS.length);
  }, [currentIdx, loadTrack]);

  // ── Canvas visualizer ─────────────────────────────────────────────────────
  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00081d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#052e72'; ctx.lineWidth = 1;
    for (let i = 8; i < canvas.height; i += 8) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
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
    ctx.fillStyle = '#00081d'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#052e72'; ctx.lineWidth = 1;
    for (let i = 8; i < h; i += 8) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }
    if (visMode === 'bars') {
      const bw = 8, gap = 2, count = Math.floor(w / (bw + gap));
      for (let i = 0; i < count; i++) {
        const bh = Math.floor(Math.random() * (h - 6)) + 4;
        const grad = ctx.createLinearGradient(0, h, 0, h - bh);
        grad.addColorStop(0, '#00cc44');
        grad.addColorStop(0.6, '#ffdd00');
        grad.addColorStop(1, '#ff3300');
        ctx.fillStyle = grad;
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
        ctx.fillStyle = '#fff';
        ctx.fillRect(i * (bw + gap), h - bh - 2, bw, 2);
      }
    } else {
      ctx.beginPath(); ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2;
      const amp = Math.random() * 22 + 8, freq = Math.random() * 3 + 2;
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin((x / w) * Math.PI * freq * 2 + Date.now() / 300) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [visMode]);

  useEffect(() => { drawStatic(); }, [drawStatic]);

  useEffect(() => {
    if (isPlaying && !showVideo) {
      visTimerRef.current = setInterval(drawVisualizer, 80);
    } else {
      clearInterval(visTimerRef.current);
      if (!showVideo) drawStatic();
    }
    return () => clearInterval(visTimerRef.current);
  }, [isPlaying, showVideo, drawVisualizer, drawStatic]);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const trackDuration = parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]);
  const progress = Math.min(100, (elapsed / trackDuration) * 100);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="xp-media-player">
      <div className="player-inner-header">
        <span className="player-logo">Windows Media Player</span>
        <span style={{ color: '#aac', fontSize: 10 }}>Passenger Collection</span>
      </div>

      <div className="player-body">
        <div className="vis-screen-wrapper" style={{ position: 'relative' }}>

          {/* ── Persistent iframe: the actual audio engine ── */}
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            width="160" height="90"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title="YouTube Player"
            style={{
              position: 'absolute', top: 0, left: 0,
              opacity: showVideo ? 1 : 0,
              pointerEvents: showVideo ? 'auto' : 'none',
              zIndex: showVideo ? 2 : 0,
              border: 'none'
            }}
          />

          {/* ── Canvas visualizer ── */}
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

          {/* VID / VIZ toggle */}
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

          {/* Scrolling banner */}
          <div className="track-scroll-banner" style={{ position: 'relative', zIndex: 11, marginTop: 90 }}>
            <span className="scrolling-text">
              {isPlaying
                ? `▶  ${track.title}  —  Passenger  •  ${track.album} (${track.year})`
                : `⏹  ${track.title}  —  Passenger`}
            </span>
          </div>
        </div>

        {/* Playlist */}
        <div className="playlist-panel border-3d">
          <div className="playlist-header">Passenger — {TRACKS.length} tracks</div>
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
          <button className="control-btn prev-btn" title="Previous" onClick={handlePrev}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>

          <button
            className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={handlePlayPause}
          >
            {isPlaying
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
                  <rect x="5" y="4" width="5" height="16" /><rect x="14" y="4" width="5" height="16" />
                </svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto', transform:'translateX(1px)' }}>
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
            }
          </button>

          <button className="control-btn stop-btn" title="Stop" onClick={handleStop}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
              <rect x="4" y="4" width="16" height="16" />
            </svg>
          </button>

          <button className="control-btn next-btn" title="Next" onClick={handleNext}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display:'block', margin:'auto' }}>
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>

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
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-seek-row">
          <div className="progress-bar-container player-seek">
            <div className="progress-bar-fill player-seek-fill" style={{ width: `${progress}%` }} />
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
