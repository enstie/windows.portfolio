import React, { useState, useEffect, useRef } from 'react';

const LINES = [
  { delay: 0,   text: '$ whoami',                             color: '#00ff41' },
  { delay: 800, text: 'justice_entsie',                        color: '#ffffff' },
  { delay: 1400, text: '',                                     color: '#fff' },
  { delay: 1600, text: '$ cat profile.json',                   color: '#00ff41' },
  { delay: 2200, text: '{',                                    color: '#ffd700' },
  { delay: 2350, text: '  "name":     "Justice Entsie",',      color: '#87ceeb' },
  { delay: 2500, text: '  "role":     "Full-Stack Developer",', color: '#87ceeb' },
  { delay: 2650, text: '  "location": "Accra, Ghana",',        color: '#87ceeb' },
  { delay: 2800, text: '  "gpa":      "3.8 / 4.0",',          color: '#87ceeb' },
  { delay: 2950, text: '  "class":    "2026",',                color: '#87ceeb' },
  { delay: 3100, text: '  "uni":      "GCTU"',                 color: '#87ceeb' },
  { delay: 3250, text: '}',                                    color: '#ffd700' },
  { delay: 3600, text: '',                                     color: '#fff' },
  { delay: 3800, text: '$ ls ./skills/',                       color: '#00ff41' },
  { delay: 4200, text: 'React   Node.js   Python   Go   AWS   GCP   K8s   Docker', color: '#ffffff' },
  { delay: 4600, text: '',                                     color: '#fff' },
  { delay: 4800, text: '$ ls ./achievements/',                 color: '#00ff41' },
  { delay: 5200, text: 'Smart_Ghana_Hackathon_Winner.trophy', color: '#ffd700' },
  { delay: 5350, text: 'HackMIT_Finalist.badge',              color: '#ffd700' },
  { delay: 5500, text: 'AWS_Certified.cert',                  color: '#ffd700' },
  { delay: 5650, text: 'GCP_Professional.cert',               color: '#ffd700' },
  { delay: 5800, text: 'CKA_Certified.cert',                  color: '#ffd700' },
  { delay: 5950, text: 'Meta_Frontend.cert',                  color: '#ffd700' },
  { delay: 6100, text: '',                                     color: '#fff' },
  { delay: 6300, text: '$ echo $MOTTO',                        color: '#00ff41' },
  { delay: 6800, text: '"Building elegant digital experiences at the intersection', color: '#ff9966' },
  { delay: 6900, text: ' of performance and design."',         color: '#ff9966' },
  { delay: 7200, text: '',                                     color: '#fff' },
  { delay: 7400, text: '$ contact --email',                    color: '#00ff41' },
  { delay: 7800, text: 'Entise4561@gmail.com',                 color: '#00ccff' },
  { delay: 8000, text: '$ contact --github',                   color: '#00ff41' },
  { delay: 8400, text: 'github.com/entsie',                    color: '#00ccff' },
  { delay: 8600, text: '',                                     color: '#fff' },
  { delay: 8800, text: '$ _',                                  color: '#00ff41' },
];

export default function TerminalBio() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const bottomRef = useRef(null);
  const timersRef = useRef([]);

  const startAnimation = () => {
    // Clear any existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setVisibleLines([]);
    setIsRunning(true);

    LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        if (i === LINES.length - 1) setIsRunning(false);
      }, line.delay);
      timersRef.current.push(t);
    });
  };

  useEffect(() => {
    startAnimation();
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLines]);

  return (
    <div style={{
      height: '100%', background: '#0d0d0d', display: 'flex', flexDirection: 'column',
      fontFamily: '"Courier New", Courier, monospace', fontSize: 12
    }}>
      {/* Terminal bar */}
      <div style={{
        background: '#1a1a1a', padding: '6px 12px', display: 'flex',
        alignItems: 'center', gap: 6, borderBottom: '1px solid #333', flexShrink: 0
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ color: '#888', fontSize: 11, marginLeft: 8 }}>bio.sh — justice@portfolio</span>
        <button
          onClick={startAnimation}
          disabled={isRunning}
          style={{
            marginLeft: 'auto', background: isRunning ? '#333' : '#1a3a1a', color: isRunning ? '#555' : '#00ff41',
            border: '1px solid ' + (isRunning ? '#444' : '#00ff41'),
            padding: '2px 8px', fontSize: 10, cursor: isRunning ? 'not-allowed' : 'pointer',
            borderRadius: 2, fontFamily: 'inherit'
          }}
        >
          {isRunning ? 'Running...' : 'Run Again'}
        </button>
      </div>

      {/* Terminal output */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', scrollbarWidth: 'thin', scrollbarColor: '#333 #0d0d0d' }}>
        {visibleLines.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color, lineHeight: 1.7,
              animation: 'fadeInLine 0.2s ease',
              whiteSpace: 'pre'
            }}
          >
            {line.text || '\u00A0'}
          </div>
        ))}
        {isRunning && (
          <span style={{
            display: 'inline-block', width: 8, height: 14,
            background: '#00ff41',
            animation: 'blink 1s step-end infinite',
            verticalAlign: 'bottom'
          }} />
        )}
        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes fadeInLine { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
