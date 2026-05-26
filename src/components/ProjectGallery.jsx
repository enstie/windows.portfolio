import React, { useState } from 'react';
import LinkPromptDialog from './LinkPromptDialog';

const PROJECTS = [
  {
    id: 'quantumchat',
    name: 'QuantumChat',
    tagline: 'Real-time encrypted messaging at scale',
    description: 'End-to-end encrypted chat platform with presence indicators, file sharing, and message threading. Handles 10,000+ concurrent users with sub-50ms latency.',
    tech: ['React', 'Node.js', 'Socket.io', 'Redis', 'PostgreSQL'],
    stars: 142,
    forks: 38,
    status: 'Live',
    color: '#0066cc',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  {
    id: 'neuralvision',
    name: 'NeuralVision',
    tagline: 'Computer vision dashboard with real-time ML inference',
    description: 'Object detection dashboard built on YOLOv8 with a custom training pipeline. Achieves 94% accuracy on the COCO dataset with sub-100ms inference.',
    tech: ['React', 'Python', 'FastAPI', 'PyTorch', 'OpenCV', 'Chart.js'],
    stars: 98,
    forks: 21,
    status: 'Live',
    color: '#6a0dad',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    )
  },
  {
    id: 'agriai',
    name: 'AgriAI',
    tagline: 'Edge ML crop disease detection for rural farmers',
    description: 'TensorFlow Lite model on Raspberry Pi detecting crop diseases in the field without internet access. Won Smart Ghana Hackathon 2024 from 200+ teams.',
    tech: ['TensorFlow Lite', 'Flutter', 'Raspberry Pi', 'GCP', 'Python'],
    stars: 211,
    forks: 64,
    status: 'Award-Winning',
    color: '#2d7a2d',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  {
    id: 'securevault',
    name: 'SecureVault',
    tagline: 'Zero-knowledge password manager with AES-256',
    description: 'Password manager using zero-knowledge architecture. AES-256-GCM encryption, biometric auth, and cross-device sync. 500+ active daily users.',
    tech: ['React Native', 'AWS Lambda', 'DynamoDB', 'AES-256', 'PBKDF2'],
    stars: 77,
    forks: 18,
    status: 'Live',
    color: '#b33000',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )
  },
  {
    id: 'ecosense',
    name: 'EcoSense IoT',
    tagline: 'Environmental monitoring with 200+ sensor nodes',
    description: 'Distributed IoT monitoring system collecting air quality, temperature, and humidity across 200+ nodes. Real-time alerting with predictive maintenance ML.',
    tech: ['Go', 'MQTT', 'RabbitMQ', 'InfluxDB', 'Grafana', 'Edge ML'],
    stars: 89,
    forks: 25,
    status: 'Live',
    color: '#00698f',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  },
  {
    id: 'studysync',
    name: 'StudySync',
    tagline: 'Collaborative study platform used by 1,200+ GCTU students',
    description: 'Shared notes, flashcards, group study rooms, and Pomodoro timer. Built for Ghana Communication Technology University students. 1,200+ active users.',
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'CSS Modules'],
    stars: 54,
    forks: 12,
    status: 'Live',
    color: '#c77d00',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    )
  },
  {
    id: 'cryptotrack',
    name: 'CryptoTrack',
    tagline: 'DeFi portfolio tracker across 50+ protocols',
    description: 'Aggregates wallet holdings, yield farming positions, and gas usage across 50+ DeFi protocols. Gas optimization alerts and yield analytics dashboard.',
    tech: ['Next.js', 'Ethers.js', 'Web3', 'The Graph', 'MongoDB', 'Redis'],
    stars: 63,
    forks: 19,
    status: 'Live',
    color: '#8a5500',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    id: 'devopspipeline',
    name: 'DevOps Pipeline',
    tagline: 'Zero-downtime CI/CD cutting deploy time from 45min to 4min',
    description: 'Automated deployment pipeline with canary releases, instant rollback, Slack/email notifications, and full infrastructure-as-code using Terraform.',
    tech: ['GitHub Actions', 'Terraform', 'Docker', 'Kubernetes', 'AWS', 'GCP'],
    stars: 118,
    forks: 44,
    status: 'Open Source',
    color: '#1a4a1a',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    )
  }
];

const STATUS_COLORS = {
  'Live': '#2d7a2d',
  'Award-Winning': '#c77d00',
  'Open Source': '#0066cc'
};

export default function ProjectGallery() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [dialogUrl, setDialogUrl] = useState(null);

  const handleOpenIE = (url) => {
    window.dispatchEvent(new CustomEvent('open-in-ie', { detail: { url } }));
  };

  return (
    <>
      {dialogUrl && (
        <LinkPromptDialog
          url={dialogUrl}
          onClose={() => setDialogUrl(null)}
          onOpenIE={handleOpenIE}
        />
      )}
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Tahoma, sans-serif', fontSize: 12, overflow: 'hidden', background: '#f0ece4' }}>
      {/* Grid panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 13 }}>Projects ({PROJECTS.length})</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {PROJECTS.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: '#fff',
                border: selected?.id === p.id ? `2px solid ${p.color}` : '1px solid #ccc',
                borderRadius: 3,
                padding: 12,
                cursor: 'pointer',
                boxShadow: hovered === p.id ? '0 3px 10px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                transform: hovered === p.id ? 'translateY(-1px)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 6, marginBottom: 8,
                background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {p.icon}
              </div>
              <div style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4, fontSize: 12 }}>{p.name}</div>
              <div style={{ color: '#666', fontSize: 10, lineHeight: 1.4, marginBottom: 8 }}>{p.tagline}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {p.tech.slice(0, 3).map(t => (
                  <span key={t} style={{
                    background: '#e8f0f8', color: '#0066cc',
                    padding: '1px 5px', borderRadius: 2, fontSize: 9,
                    border: '1px solid #c5d8ec'
                  }}>{t}</span>
                ))}
                {p.tech.length > 3 && (
                  <span style={{ color: '#888', fontSize: 9, alignSelf: 'center' }}>+{p.tech.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{
          width: 280, borderLeft: '1px solid #ccc', background: '#fff',
          display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0
        }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${selected.color}, ${selected.color}bb)`,
            padding: '20px 16px',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(255,255,255,0.2)', border: 'none',
                color: '#fff', width: 20, height: 20, borderRadius: '50%',
                cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >x</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selected.icon}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{selected.name}</div>
                <span style={{
                  background: STATUS_COLORS[selected.status] || '#444',
                  color: '#fff', padding: '1px 6px', borderRadius: 2, fontSize: 9, marginTop: 4, display: 'inline-block'
                }}>{selected.status}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: 14, flex: 1 }}>
            <p style={{ color: '#444', lineHeight: 1.6, margin: '0 0 14px' }}>{selected.description}</p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#666' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span style={{ fontSize: 12 }}>{selected.stars}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#666' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
                  <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><line x1="12" y1="12" x2="12" y2="15"/>
                </svg>
                <span style={{ fontSize: 12 }}>{selected.forks} forks</span>
              </div>
            </div>

            {/* Tech stack */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: 6, fontSize: 11 }}>Tech Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {selected.tech.map(t => (
                  <span key={t} style={{
                    background: '#e8f0f8', color: selected.color,
                    padding: '3px 8px', borderRadius: 2, fontSize: 10,
                    border: `1px solid ${selected.color}44`, fontWeight: 'bold'
                  }}>{t}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setDialogUrl(`https://github.com/entsie`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#1a1a2e', color: '#fff', padding: '7px 12px',
                border: 'none',
                borderRadius: 3, fontSize: 11, cursor: 'pointer',
                justifyContent: 'center', marginTop: 8, width: '100%',
                fontFamily: 'Tahoma, sans-serif'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
