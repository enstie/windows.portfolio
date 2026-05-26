import React, { useRef, useEffect, useState } from 'react';

export default function Window({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  x,
  y,
  width,
  height,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  children
}) {
  const windowRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startW: 0, startH: 0, initialX: 0, initialY: 0 });
  const [resizing, setResizing] = useState(false);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-control-btn')) return; // ignore control buttons
    onFocus(id);
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: x,
      initialY: y
    };
    e.preventDefault();
  };

  const handleResizeMouseDown = (e) => {
    onFocus(id);
    setResizing(true);
    dragRef.current = {
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startW: width,
      startH: height
    };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragRef.current.isDragging && !isMaximized) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        onMove(id, dragRef.current.initialX + dx, dragRef.current.initialY + dy);
      } else if (resizing && !isMaximized) {
        const dw = e.clientX - dragRef.current.startX;
        const dh = e.clientY - dragRef.current.startY;
        const newW = Math.max(300, dragRef.current.startW + dw);
        const newH = Math.max(200, dragRef.current.startH + dh);
        onResize(id, newW, newH);
      }
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      setResizing(false);
    };

    if (dragRef.current.isDragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragRef.current.isDragging, resizing, x, y, width, height, isMaximized, id]);

  if (!isOpen || isMinimized) return null;

  const style = isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '30px', // Taskbar height
        zIndex: zIndex
      }
    : {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        zIndex: zIndex
      };

  return (
    <div
      ref={windowRef}
      className={`xp-window-container ${isMaximized ? 'maximized' : ''} ${zIndex === 100 ? 'focused' : ''}`}
      style={style}
      onClick={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div className="xp-title-bar" onMouseDown={handleMouseDown} onDoubleClick={() => onMaximize(id)}>
        <div className="xp-title-bar-left">
          {icon && <span className="xp-window-icon">{icon}</span>}
          <span className="xp-title-bar-text">{title}</span>
        </div>
        <div className="xp-title-bar-controls">
          <button
            className="window-control-btn minimize"
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(id);
            }}
          >
            <span>_</span>
          </button>
          <button
            className="window-control-btn maximize"
            title={isMaximized ? 'Restore Down' : 'Maximize'}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(id);
            }}
          >
            <div className={isMaximized ? 'restore-icon' : 'maximize-icon'}></div>
          </button>
          <button
            className="window-control-btn close"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
          >
            <span>X</span>
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="xp-window-body">
        {children}
      </div>

      {/* Resize Handle (only show when not maximized) */}
      {!isMaximized && (
        <div className="xp-window-resize-handle" onMouseDown={handleResizeMouseDown}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="8" y1="2" x2="2" y2="8" stroke="#8c8c8c" strokeWidth="1.5" />
            <line x1="9" y1="5" x2="5" y2="9" stroke="#8c8c8c" strokeWidth="1.5" />
            <line x1="9" y1="8" x2="8" y2="9" stroke="#8c8c8c" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  );
}
