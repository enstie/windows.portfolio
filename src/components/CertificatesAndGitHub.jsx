import React, { useState, useEffect } from 'react';
import LinkPromptDialog from './LinkPromptDialog';

const GITHUB_USER = 'entsie';

const CERTS = [
  {
    id: 'aws',
    title: 'AWS Certified Solutions Architect',
    subtitle: 'Associate Level',
    issuer: 'Amazon Web Services',
    date: 'October 2023',
    validationNo: 'AWS-SAA-2023-JE-84721',
    color: '#ff9900',
    bgColor: '#fff8ee',
    logo: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff9900">
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.063-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.29 1.245-5.29c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.362 1.381-5.362c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.063-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .41-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.176 0 .36.008.535.032.183.024.35.056.518.088.16.04.311.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.063.256-.19.256a.83.83 0 0 1-.304-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.991.44 1.246.767.254.327.383.7.383 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.743.167-1.15.167z"/>
      </svg>
    )
  },
  {
    id: 'gcp',
    title: 'Google Cloud Professional Developer',
    subtitle: 'Professional Level',
    issuer: 'Google Cloud',
    date: 'March 2024',
    validationNo: 'GCP-PD-2024-JE-19302',
    color: '#4285f4',
    bgColor: '#f0f4ff',
    logo: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#4285f4">
        <path d="M12.48 10.92v2.56h3.92c-.16 1.02-.62 1.88-1.3 2.44v2.02h2.1c1.23-1.13 1.94-2.8 1.94-4.78 0-.46-.04-.9-.12-1.32H12.48zm0 9.2c2 0 3.67-.65 4.9-1.76l-2.1-2.02c-.65.44-1.48.7-2.8.7-2.16 0-3.98-1.45-4.64-3.4H3.66v2.08A7.503 7.503 0 0 0 12.48 20.12zm-4.64-5.5c-.17-.5-.26-1.03-.26-1.62s.09-1.12.26-1.62V9.3H3.66A7.503 7.503 0 0 0 3.08 12c0 1.22.3 2.38.8 3.42l3.96-2.8zM12.48 5.38c1.22 0 2.32.42 3.18 1.24l2.38-2.38C16.5 2.84 14.62 2 12.48 2A7.503 7.503 0 0 0 3.66 9.3l3.98 2.58c.66-1.95 2.48-3.4 4.64-3.4l.2-.1z"/>
      </svg>
    )
  },
  {
    id: 'cka',
    title: 'Certified Kubernetes Administrator',
    subtitle: 'CKA — Linux Foundation',
    issuer: 'CNCF / Linux Foundation',
    date: 'June 2024',
    validationNo: 'LF-CKA-2024-JE-57843',
    color: '#326ce5',
    bgColor: '#f0f3ff',
    logo: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#326ce5">
        <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.516-.734zm1.145-1.98a.44.44 0 0 0 .76-.337l.01-.003.28-2.899a5.145 5.145 0 0 0-3.009 1.24l2.092 1.918.003-.003a.44.44 0 0 0-.136.084zm2.forcedly 3.109l-.007-.01.999-2.413a5.171 5.171 0 0 1 2.075 2.597l-2.578.437-.004-.005a.44.44 0 0 1-.484-.606zm.833 2.129a.44.44 0 0 0-.173.756l-.002.011 1.962 1.754a5.143 5.143 0 0 0 .73-3.255l-2.516.734zm-1.145 1.98a.44.44 0 0 0-.76.337l-.01.003-.28 2.899a5.145 5.145 0 0 0 3.009-1.24l-2.092-1.918-.003.003a.44.44 0 0 0 .136-.084zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.252 15.782l-.007-.004a6.716 6.716 0 0 1-4.58-9.776l.004-.007a6.716 6.716 0 0 1 9.776 4.58l-.004.007a6.716 6.716 0 0 1-5.189 5.2z"/>
      </svg>
    )
  },
  {
    id: 'meta',
    title: 'Meta Frontend Developer',
    subtitle: 'Professional Certificate',
    issuer: 'Meta / Coursera',
    date: 'December 2023',
    validationNo: 'META-FE-2023-JE-33112',
    color: '#1877f2',
    bgColor: '#f0f6ff',
    logo: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#1877f2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  }
];

function CertCard({ cert, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? cert.bgColor : '#fff',
        border: isSelected ? `2px solid ${cert.color}` : '1px solid #ccc',
        borderRadius: 3, padding: '10px 12px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
        boxShadow: isSelected ? `0 2px 8px ${cert.color}33` : '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'all 0.15s ease'
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 6, flexShrink: 0,
        background: cert.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${cert.color}33`
      }}>
        {cert.logo}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cert.title}</div>
        <div style={{ color: cert.color, fontSize: 10, marginTop: 2 }}>{cert.issuer} · {cert.date}</div>
      </div>
    </div>
  );
}

function GitHubStats({ onOpenLink }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
        ]);
        if (!userRes.ok) throw new Error('GitHub user not found');
        const user = await userRes.json();
        const repos = reposRes.ok ? await reposRes.json() : [];
        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
        const langs = {};
        repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
        const topLangs = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5);
        setStats({ user, totalStars, totalForks, repoCount: repos.length, topLangs, repos: repos.slice(0, 4) });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 8 }}>Fetching GitHub stats...</div>
        <div style={{ width: 120, height: 4, background: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#0066cc', width: '60%', animation: 'pulse 1.5s ease infinite' }} />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', textAlign: 'center', padding: 20 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 'bold', color: '#cc4444', marginBottom: 6 }}>Could not load GitHub stats</div>
        <div style={{ fontSize: 11 }}>Username "{GITHUB_USER}" may not exist yet, or GitHub rate-limited the request.</div>
      </div>
    </div>
  );

  const { user, totalStars, totalForks, repoCount, topLangs, repos } = stats;

  const StatBox = ({ label, value, color }) => (
    <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '10px 12px', textAlign: 'center', flex: 1 }}>
      <div style={{ fontWeight: 'bold', fontSize: 18, color: color || '#1a1a2e' }}>{value}</div>
      <div style={{ color: '#666', fontSize: 10, marginTop: 2 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ padding: 14, overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '10px 12px' }}>
        {user.avatar_url && <img src={user.avatar_url} alt="avatar" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #0066cc' }} />}
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 13, color: '#1a1a2e' }}>{user.name || GITHUB_USER}</div>
          <div style={{ color: '#666', fontSize: 11 }}>{user.bio || 'Full-Stack Developer'}</div>
          <button
            onClick={() => onOpenLink(`https://github.com/${GITHUB_USER}`)}
            style={{ color: '#0066cc', fontSize: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Tahoma, sans-serif', textDecoration: 'underline' }}
          >github.com/{GITHUB_USER}</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <StatBox label="Repositories" value={repoCount} color="#0066cc" />
        <StatBox label="Stars Earned" value={totalStars} color="#c77d00" />
        <StatBox label="Forks" value={totalForks} color="#2d7a2d" />
        <StatBox label="Followers" value={user.followers} color="#6a0dad" />
      </div>

      {/* Top languages */}
      {topLangs.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '10px 12px', marginBottom: 14 }}>
          <div style={{ fontWeight: 'bold', fontSize: 11, color: '#1a1a2e', marginBottom: 8 }}>Top Languages</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {topLangs.map(([lang, count]) => (
              <span key={lang} style={{
                background: '#e8f0f8', color: '#0066cc', padding: '2px 8px',
                borderRadius: 2, fontSize: 10, border: '1px solid #c5d8ec', fontWeight: 'bold'
              }}>{lang} ({count})</span>
            ))}
          </div>
        </div>
      )}

      {/* Recent repos */}
      <div style={{ fontWeight: 'bold', fontSize: 11, color: '#1a1a2e', marginBottom: 8 }}>Recent Repositories</div>
      {repos.map(repo => (
        <div key={repo.id} style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '8px 12px', marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 'bold', color: '#0066cc', fontSize: 11 }}>{repo.name}</div>
            <div style={{ display: 'flex', gap: 8, color: '#888', fontSize: 10 }}>
              <span>★ {repo.stargazers_count}</span>
              <span>⑂ {repo.forks_count}</span>
            </div>
          </div>
          {repo.description && <div style={{ color: '#555', fontSize: 10, marginTop: 3 }}>{repo.description.substring(0, 90)}</div>}
          {repo.language && <span style={{ background: '#e8f0f8', color: '#0066cc', padding: '1px 5px', borderRadius: 2, fontSize: 9, marginTop: 4, display: 'inline-block' }}>{repo.language}</span>}
        </div>
      ))}
    </div>
  );
}

export default function CertificatesAndGitHub() {
  const [activeTab, setActiveTab] = useState('certs');
  const [selectedCert, setSelectedCert] = useState(CERTS[0]);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Tahoma, sans-serif', fontSize: 12, background: '#f0ece4', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', background: '#d4d0c8', borderBottom: '1px solid #808080', padding: '2px 4px 0', flexShrink: 0 }}>
        {[
          { id: 'certs', label: 'Certificates' },
          { id: 'github', label: 'GitHub Stats' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '4px 14px', fontSize: 11,
              background: activeTab === tab.id ? '#f0ece4' : 'transparent',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#808080 #808080 #f0ece4 #808080' : 'transparent',
              borderBottom: activeTab === tab.id ? '1px solid #f0ece4' : 'none',
              cursor: 'pointer', fontFamily: 'Tahoma, sans-serif',
              position: 'relative', top: 1,
              color: '#1a1a2e', fontWeight: activeTab === tab.id ? 'bold' : 'normal'
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Certs tab */}
      {activeTab === 'certs' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* List */}
          <div style={{ width: 240, borderRight: '1px solid #ccc', overflowY: 'auto', padding: 10, background: '#fafafa', flexShrink: 0 }}>
            {CERTS.map(cert => (
              <CertCard key={cert.id} cert={cert} isSelected={selectedCert?.id === cert.id} onClick={() => setSelectedCert(cert)} />
            ))}
          </div>

          {/* Detail */}
          {selectedCert && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{
                background: '#fff', border: `2px solid ${selectedCert.color}44`,
                borderRadius: 6, padding: '28px 32px', maxWidth: 480, width: '100%',
                boxShadow: `0 4px 20px ${selectedCert.color}22`,
                backgroundImage: `linear-gradient(135deg, #fff 0%, ${selectedCert.bgColor} 100%)`
              }}>
                {/* Top stripe */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${selectedCert.color}, ${selectedCert.color}88)`, borderRadius: 3, marginBottom: 20, margin: '-28px -32px 20px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Certificate of Achievement</div>
                  <div style={{ background: selectedCert.bgColor, border: `2px solid ${selectedCert.color}`, borderRadius: 6, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedCert.logo}
                  </div>
                </div>

                <div style={{ fontWeight: 'bold', fontSize: 18, color: '#1a1a2e', marginBottom: 4, lineHeight: 1.3 }}>{selectedCert.title}</div>
                <div style={{ color: selectedCert.color, fontWeight: 'bold', fontSize: 13, marginBottom: 16 }}>{selectedCert.subtitle}</div>

                <div style={{ borderTop: `1px solid ${selectedCert.color}33`, paddingTop: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>
                    This certifies that <strong style={{ color: '#1a1a2e' }}>Justice Entsie</strong> has successfully demonstrated the knowledge and skills required for this certification.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: selectedCert.bgColor, padding: '10px 12px', borderRadius: 3, border: `1px solid ${selectedCert.color}33` }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Issuer</div>
                    <div style={{ fontSize: 11, fontWeight: 'bold', color: '#1a1a2e' }}>{selectedCert.issuer}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Issue Date</div>
                    <div style={{ fontSize: 11, fontWeight: 'bold', color: '#1a1a2e' }}>{selectedCert.date}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase' }}>Validation Number</div>
                    <div style={{ fontSize: 10, fontFamily: 'Courier New, monospace', color: selectedCert.color, fontWeight: 'bold' }}>{selectedCert.validationNo}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 16, borderTop: `1px solid ${selectedCert.color}33`, paddingTop: 12 }}>
                  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${selectedCert.color}, transparent)`, marginBottom: 6 }} />
                  <div style={{ fontSize: 10, color: '#aaa', fontStyle: 'italic' }}>Justice Entsie — Accra, Ghana</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GitHub tab */}
      {activeTab === 'github' && (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <GitHubStats onOpenLink={setDialogUrl} />
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
    </>
  );
}
