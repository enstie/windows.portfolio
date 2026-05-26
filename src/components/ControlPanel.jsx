import React, { useState } from 'react';

export default function ControlPanel({
  theme,
  setTheme,
  wallpaper,
  setWallpaper
}) {
  const [activeTab, setActiveTab] = useState('display'); // display, system

  return (
    <div className="xp-control-panel">
      {/* Sidebar Task List */}
      <div className="cp-sidebar">
        <div className="sidebar-section blue-card">
          <div className="sidebar-section-header">
            <span>Control Panel Tasks</span>
          </div>
          <div className="sidebar-section-body">
            <span className={`sidebar-link ${activeTab === 'display' ? 'active-link' : ''}`} onClick={() => setActiveTab('display')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Change Display Settings
            </span>
            <span className={`sidebar-link ${activeTab === 'system' ? 'active-link' : ''}`} onClick={() => setActiveTab('system')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <rect x="2" y="3" width="20" height="12" rx="2" ry="2" />
                <line x1="12" y1="15" x2="12" y2="19" />
                <line x1="8" y1="19" x2="16" y2="19" />
              </svg>
              View System Info
            </span>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="cp-main border-3d">
        {activeTab === 'display' && (
          <div className="display-settings-tab">
            <h3>Display Properties</h3>
            <p>Configure the visual themes and wallpapers of your Windows XP SaaS Desktop.</p>

            <div className="property-group border-3d">
              <legend>Theme Palette</legend>
              <div className="radio-options">
                <label className="xp-radio-label">
                  <input
                    type="radio"
                    name="theme-select"
                    checked={theme === 'blue'}
                    onChange={() => setTheme('blue')}
                  />
                  <span>Luna Blue (Classic Default)</span>
                </label>
                <label className="xp-radio-label">
                  <input
                    type="radio"
                    name="theme-select"
                    checked={theme === 'olive'}
                    onChange={() => setTheme('olive')}
                  />
                  <span>Homestead Olive Green</span>
                </label>
                <label className="xp-radio-label">
                  <input
                    type="radio"
                    name="theme-select"
                    checked={theme === 'silver'}
                    onChange={() => setTheme('silver')}
                  />
                  <span>Metallic Silver Professional</span>
                </label>
              </div>
            </div>

            <div className="property-group border-3d" style={{ marginTop: '15px' }}>
              <legend>Desktop Wallpaper</legend>
              <div className="radio-options">
                <label className="xp-radio-label">
                  <input
                    type="radio"
                    name="wallpaper-select"
                    checked={wallpaper === 'bliss'}
                    onChange={() => setWallpaper('bliss')}
                  />
                  <span>Iconic Bliss Hills</span>
                </label>
                <label className="xp-radio-label">
                  <input
                    type="radio"
                    name="wallpaper-select"
                    checked={wallpaper === 'classic'}
                    onChange={() => setWallpaper('classic')}
                  />
                  <span>Windows Classic Teal (Windows 95/NT)</span>
                </label>
                <label className="xp-radio-label">
                  <input
                    type="radio"
                    name="wallpaper-select"
                    checked={wallpaper === 'bsod'}
                    onChange={() => setWallpaper('bsod')}
                  />
                  <span>BSOD (Blue Screen of Death) - Dev mode</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="system-info-tab">
            <h3>System Properties</h3>
            
            <div className="system-specs-grid">
              <div className="sys-badge-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#225381" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="12" rx="2" ry="2" />
                  <line x1="12" y1="15" x2="12" y2="19" />
                  <line x1="8" y1="19" x2="16" y2="19" />
                </svg>
              </div>
              <div className="sys-details">
                <div className="sys-section-title">System:</div>
                <div>Microsoft Windows XP</div>
                <div>Professional Edition</div>
                <div>Version 2002 (Service Pack 3)</div>

                <div className="sys-section-title" style={{ marginTop: '15px' }}>SaaS Environment:</div>
                <div>React 19.x & Vite Bundle</div>
                <div>VFS Storage: In-Session State</div>
                <div>AutoScaler Configuration: Enabled</div>

                <div className="sys-section-title" style={{ marginTop: '15px' }}>Computer Specs:</div>
                <div>Google DeepMind Agent CPU</div>
                <div>64 MB RAM (Simulated)</div>
                <div>SaaS API Connection: Live & SSL Secure</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
