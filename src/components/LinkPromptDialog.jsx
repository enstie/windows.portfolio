import React, { useEffect } from 'react';

/**
 * Windows XP-style "Open Link" dialog.
 * Props:
 *   url      - the URL being opened
 *   onClose  - called when dialog is dismissed
 *   onOpenIE - called when user picks "Internet Explorer" (the in-OS browser)
 */
export default function LinkPromptDialog({ url, onClose, onOpenIE }) {
  // Close on Escape
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  const displayUrl = url ? (url.length > 55 ? url.slice(0, 52) + '...' : url) : '';

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 99998
        }}
      />

      {/* Dialog box */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        width: 420,
        fontFamily: 'Tahoma, sans-serif',
        fontSize: 11,
        boxShadow: '3px 3px 12px rgba(0,0,0,0.5)',
        border: '1px solid #0054e3',
        userSelect: 'none'
      }}>
        {/* Title bar */}
        <div style={{
          background: 'linear-gradient(180deg, #0058e5 0%, #2b88d8 4%, #0058e5 6%, #0058e5 50%, #0346d7 96%, #0346d7 100%)',
          padding: '4px 6px',
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#fff',
          fontSize: 12, fontWeight: 'bold'
        }}>
          {/* IE icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1a6fc4" stroke="#fff" strokeWidth="1"/>
            <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="#7ecef4" strokeWidth="1.2"/>
          </svg>
          <span style={{ flex: 1 }}>Open Link</span>
          <button
            onClick={onClose}
            style={{
              width: 16, height: 14,
              background: 'linear-gradient(180deg, #e9a63e, #c9762a)',
              border: '1px solid #7a4a1a',
              color: '#fff', fontSize: 10, fontWeight: 'bold',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, lineHeight: 1
            }}
          >x</button>
        </div>

        {/* Body */}
        <div style={{
          background: '#ece9d8',
          border: '1px solid #aca899',
          borderTop: 'none'
        }}>
          {/* Content area */}
          <div style={{ padding: '16px 18px 12px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {/* IE icon large */}
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="#1a6fc4"/>
                <path d="M2 16h28M16 2a20 20 0 0 1 0 28M16 2a20 20 0 0 0 0 28" stroke="#7ecef4" strokeWidth="1.8"/>
                <circle cx="16" cy="16" r="5" fill="#fff" opacity="0.15"/>
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8, color: '#1a1a2e', lineHeight: 1.5 }}>
                How would you like to open this link?
              </div>
              <div style={{
                background: '#fff', border: '1px solid #7f9db9',
                padding: '3px 6px', color: '#0066cc', fontSize: 11,
                marginBottom: 12, wordBreak: 'break-all',
                fontFamily: 'Courier New, monospace'
              }}>
                {displayUrl}
              </div>

              {/* Option buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Internet Explorer option */}
                <button
                  onClick={() => { onOpenIE(url); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'linear-gradient(180deg, #ffffff, #ece9d8)',
                    border: '2px solid #0054e3',
                    padding: '7px 10px', cursor: 'pointer',
                    textAlign: 'left', width: '100%',
                    borderRadius: 0
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="16" cy="16" r="14" fill="#1a6fc4"/>
                    <path d="M2 16h28M16 2a20 20 0 0 1 0 28M16 2a20 20 0 0 0 0 28" stroke="#7ecef4" strokeWidth="1.8"/>
                  </svg>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 11 }}>Open in Internet Explorer</div>
                    <div style={{ color: '#555', fontSize: 10 }}>Browse inside this portfolio OS</div>
                  </div>
                </button>

                {/* Actual browser option */}
                <button
                  onClick={() => { window.open(url, '_blank', 'noopener,noreferrer'); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'linear-gradient(180deg, #ffffff, #ece9d8)',
                    border: '1px solid #aca899',
                    padding: '7px 10px', cursor: 'pointer',
                    textAlign: 'left', width: '100%',
                    borderRadius: 0
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 11 }}>Open in your actual browser</div>
                    <div style={{ color: '#555', fontSize: 10 }}>Opens in a new browser tab</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer button row */}
          <div style={{
            background: '#d4d0c8',
            borderTop: '1px solid #aca899',
            padding: '6px 10px',
            display: 'flex', justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '3px 20px',
                background: 'linear-gradient(180deg, #fff, #ece9d8)',
                border: '1px solid #7f9db9',
                cursor: 'pointer', fontSize: 11,
                fontFamily: 'Tahoma, sans-serif',
                minWidth: 70
              }}
            >Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
