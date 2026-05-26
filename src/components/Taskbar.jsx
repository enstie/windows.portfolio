import React, { useState, useEffect } from 'react';

export default function Taskbar({
  windows,
  activeWindowId,
  onStartMenuToggle,
  isStartMenuOpen,
  onWindowToggleMinimize,
  onOpenApp,
  onOpenFolder
}) {
  const [timeStr, setTimeStr] = useState('');

  // Clock tick effect
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // hour 0 should be 12
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartMenuAppClick = (appKey, title) => {
    onOpenApp(appKey, title);
    onStartMenuToggle(false);
  };

  const handleStartMenuFolderClick = (path) => {
    onOpenFolder(path);
    onStartMenuToggle(false);
  };

  const handlePowerOff = () => {
    onStartMenuToggle(false);
    if (confirm('Turn off simulated Windows XP system? (This will reload the page)')) {
      const shutdownOverlay = document.createElement('div');
      shutdownOverlay.className = 'xp-shutdown-overlay';
      shutdownOverlay.innerHTML = `
        <div class="shutdown-text-box">
          <div class="shutdown-spinner"></div>
          <h2>Windows is shutting down...</h2>
        </div>
      `;
      document.body.appendChild(shutdownOverlay);
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
  };

  return (
    <div className="xp-taskbar">
      {/* Start Button */}
      <button
        className={`xp-start-btn ${isStartMenuOpen ? 'pressed' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onStartMenuToggle(!isStartMenuOpen);
        }}
      >
        <span className="start-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}>
            <g transform="skewX(-10)">
              {/* Top Left: Red */}
              <path d="M3 3 C 6 2, 8 4, 11 3 L 11 11 C 8 12, 6 10, 3 11 Z" fill="#E74C3C" />
              {/* Top Right: Green */}
              <path d="M12.5 2.8 C 15 1.8, 17 3.5, 20.5 2.5 L 20.5 10.5 C 17 11.5, 15 9.8, 12.5 10.8 Z" fill="#2ECC71" />
              {/* Bottom Left: Blue */}
              <path d="M3 12 C 6 11, 8 13, 11 12 L 11 20 C 8 21, 6 19, 3 20 Z" fill="#3498DB" />
              {/* Bottom Right: Yellow */}
              <path d="M12.5 11.8 C 15 10.8, 17 12.5, 20.5 11.5 L 20.5 19.5 C 17 20.5, 15 18.8, 12.5 19.8 Z" fill="#F1C40F" />
            </g>
          </svg>
        </span>
        <span className="start-text">start</span>
      </button>

      {/* Start Menu Popup */}
      {isStartMenuOpen && (
        <div className="xp-start-menu border-3d" onClick={(e) => e.stopPropagation()}>
          {/* Header Banner */}
          <div className="start-menu-header">
            <div className="avatar-frame border-3d">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="username">Guest SaaS Engineer</span>
          </div>

          {/* Two Columns */}
          <div className="start-menu-content">
            {/* Left Column (Apps) */}
            <div className="menu-column left-col">
              <div className="pinned-title">Internet & Email</div>
              <div className="menu-item" onClick={() => handleStartMenuAppClick('ie', 'Internet Explorer')}>
                <div className="item-icon font-large">
                  <img src="/icons/ie.png" alt="" style={{ width: '32px', height: '32px' }} />
                </div>
                <div className="item-details">
                  <div className="item-title-bold">Internet Explorer</div>
                  <div className="item-subtitle">SaaS Portfolio Browser</div>
                </div>
              </div>
              <div className="menu-item" onClick={() => handleStartMenuAppClick('saas', 'SaaS Control Center')}>
                <div className="item-icon font-large">
                  <img src="/icons/network.png" alt="" style={{ width: '32px', height: '32px' }} />
                </div>
                <div className="item-details">
                  <div className="item-title-bold">SaaS Control Center</div>
                  <div className="item-subtitle">Cloud Monitor & CLI</div>
                </div>
              </div>
              
              <div className="menu-divider" />

              <div className="menu-item" onClick={() => handleStartMenuAppClick('notepad-about', 'Notepad - About Me.txt')}>
                <div className="item-icon font-large">
                  <img src="/icons/notepad.png" alt="" style={{ width: '32px', height: '32px' }} />
                </div>
                <div className="item-details">
                  <div className="item-title-normal">Notepad</div>
                </div>
              </div>
              <div className="menu-item" onClick={() => handleStartMenuAppClick('media-player', 'Windows Media Player')}>
                <div className="item-icon font-large">
                  <img src="/icons/media-player.png" alt="" style={{ width: '32px', height: '32px' }} />
                </div>
                <div className="item-details">
                  <div className="item-title-normal">Windows Media Player</div>
                </div>
              </div>
              <div className="menu-item" onClick={() => handleStartMenuAppClick('minesweeper', 'Minesweeper')}>
                <div className="item-icon font-large">
                  <img src="/icons/minesweeper.png" alt="" style={{ width: '32px', height: '32px' }} />
                </div>
                <div className="item-details">
                  <div className="item-title-normal">Minesweeper</div>
                </div>
              </div>
            </div>

            {/* Right Column (Folders / Settings) */}
            <div className="menu-column right-col">
              <div className="menu-item-right" onClick={() => handleStartMenuFolderClick('C:\\My Portfolio')}>
                <span className="item-icon-right">
                  <img src="/icons/documents.png" alt="" style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                </span>
                <span className="item-text-right">My Documents</span>
              </div>
              <div className="menu-item-right" onClick={() => handleStartMenuFolderClick('C:\\My Portfolio\\Projects')}>
                <span className="item-icon-right">
                  <img src="/icons/folder.png" alt="" style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                </span>
                <span className="item-text-right">My Projects</span>
              </div>
              <div className="menu-item-right" onClick={() => handleStartMenuFolderClick('C:')}>
                <span className="item-icon-right">
                  <img src="/icons/computer.png" alt="" style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                </span>
                <span className="item-text-right">My Computer</span>
              </div>
              
              <div className="menu-divider-right" />

              <div className="menu-item-right" onClick={() => handleStartMenuAppClick('control-panel', 'Control Panel')}>
                <span className="item-icon-right">
                  <img src="/icons/computer.png" alt="" style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                </span>
                <span className="item-text-right">Control Panel</span>
              </div>
              <div className="menu-item-right" onClick={() => handleStartMenuAppClick('ie', 'Internet Explorer')}>
                <span className="item-icon-right">
                  <img src="/icons/ie.png" alt="" style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                </span>
                <span className="item-text-right">Search</span>
              </div>
              <div className="menu-item-right" onClick={() => alert('Type api commands inside the SaaS Control Center terminal!')}>
                <span className="item-icon-right">
                  <img src="/icons/file.png" alt="" style={{ width: '16px', height: '16px', marginRight: '10px', marginLeft: '2px', verticalAlign: 'middle' }} />
                </span>
                <span className="item-text-right">Run...</span>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="start-menu-footer">
            <button className="footer-action-btn logoff" onClick={() => alert('Log off in sandbox is disabled!')}>
              <span className="footer-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F1C40F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '5px' }}>
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              </span>
              <span>Log Off</span>
            </button>
            <button className="footer-action-btn shutdown" onClick={handlePowerOff}>
              <span className="footer-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '5px' }}>
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />
                </svg>
              </span>
              <span>Turn Off Computer</span>
            </button>
          </div>
        </div>
      )}

      {/* Taskbar Apps Buttons */}
      <div className="xp-taskbar-apps">
        {windows.map(win => (
          <button
            key={win.id}
            className={`xp-taskbar-app-btn ${activeWindowId === win.id ? 'active' : ''}`}
            onClick={() => onWindowToggleMinimize(win.id)}
          >
            <span className="app-btn-icon">{win.icon}</span>
            <span className="app-btn-title">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="xp-system-tray">
        <span className="tray-icon" title="SaaS Cloud Connection Healthy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ff00" strokeWidth="3" style={{ verticalAlign: 'middle', marginRight: '2px' }}>
            <path d="M5 12.5l4 4 10-10" />
          </svg>
        </span>
        <span className="tray-icon" title="Audio Player State">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '2px' }}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#ffffff" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </span>
        <span className="tray-clock">{timeStr}</span>
      </div>
    </div>
  );
}
