import React, { useState, useRef, useCallback } from 'react';

// ── Grid constants ──────────────────────────────────────────────────────────
const CELL_W   = 90;   // icon cell width  (icon 80px + 5px side padding each)
const CELL_H   = 100;  // icon cell height (icon 90px + 5px top/bottom padding)
const START_X  = 14;   // left margin from desktop edge
const START_Y  = 14;   // top margin from desktop edge
const COLS     = 3;    // default 3-column layout

// Convert grid (col, row) → pixel top-left of the cell
function cellToPixel(col, row) {
  return {
    x: START_X + col * CELL_W,
    y: START_Y + row * CELL_H
  };
}

// Convert pixel position → nearest grid (col, row), clamped to valid bounds
function pixelToCell(x, y, maxCols, maxRows) {
  const col = Math.max(0, Math.min(maxCols - 1, Math.round((x - START_X) / CELL_W)));
  const row = Math.max(0, Math.min(maxRows - 1, Math.round((y - START_Y) / CELL_H)));
  return { col, row };
}

// Default layout: 3 columns, fill downward first (classic XP style)
function defaultGrid(icons) {
  const map = {};
  icons.forEach((icon, i) => {
    const col = Math.floor(i / Math.ceil(icons.length / COLS));
    const row = i % Math.ceil(icons.length / COLS);
    map[icon.id] = { col, row };
  });
  return map;
}

// Find the nearest empty cell to (targetCol, targetRow), given occupied cells
function nearestEmptyCell(targetCol, targetRow, occupiedById, excludeId, maxCols, maxRows) {
  const occupied = new Set(
    Object.entries(occupiedById)
      .filter(([id]) => id !== excludeId)
      .map(([, pos]) => `${pos.col},${pos.row}`)
  );

  // BFS outward from target
  const visited = new Set();
  const queue = [{ col: targetCol, row: targetRow, dist: 0 }];

  while (queue.length > 0) {
    // Sort by distance from target to always pick closest
    queue.sort((a, b) => a.dist - b.dist);
    const { col, row } = queue.shift();
    const key = `${col},${row}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (col < 0 || row < 0 || col >= maxCols || row >= maxRows) continue;
    if (!occupied.has(key)) return { col, row };
    // Add 4 neighbors
    for (const [dc, dr] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
      const nc = col + dc, nr = row + dr;
      const nk = `${nc},${nr}`;
      if (!visited.has(nk) && nc >= 0 && nr >= 0 && nc < maxCols && nr < maxRows) {
        const d = Math.abs(nc - targetCol) + Math.abs(nr - targetRow);
        queue.push({ col: nc, row: nr, dist: d });
      }
    }
  }
  return { col: targetCol, row: targetRow }; // fallback
}

export default function DesktopIcons({ icons }) {
  const containerRef  = useRef(null);
  const dragging      = useRef(null);

  // Grid state: { [id]: { col, row } }
  const [grid, setGrid] = useState(() => defaultGrid(icons));
  // Live pixel offset while dragging (only for the dragged icon)
  const [dragPixel, setDragPixel] = useState(null); // { id, x, y }
  const [selected, setSelected]   = useState(null);

  const handleMouseDown = useCallback((e, icon) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    setSelected(icon.id);

    const pos = grid[icon.id] || { col: 0, row: 0 };
    const { x: startX, y: startY } = cellToPixel(pos.col, pos.row);

    dragging.current = {
      id: icon.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startIconX: startX,
      startIconY: startY,
      moved: false
    };

    const onMouseMove = (me) => {
      if (!dragging.current) return;
      const dx = me.clientX - dragging.current.startMouseX;
      const dy = me.clientY - dragging.current.startMouseY;

      if (!dragging.current.moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      dragging.current.moved = true;

      setDragPixel({
        id: dragging.current.id,
        x: dragging.current.startIconX + dx,
        y: dragging.current.startIconY + dy
      });
    };

    const onMouseUp = (me) => {
      if (!dragging.current) return;
      const { id, moved, startIconX, startIconY } = dragging.current;

      if (moved) {
        const dx = me.clientX - dragging.current.startMouseX;
        const dy = me.clientY - dragging.current.startMouseY;
        const rawX = startIconX + dx;
        const rawY = startIconY + dy;

        // Compute available grid size from container
        const container = containerRef.current;
        const cw = container ? container.clientWidth  : window.innerWidth;
        const ch = container ? container.clientHeight : window.innerHeight;
        const maxCols = Math.floor((cw - START_X) / CELL_W) || 20;
        const maxRows = Math.floor((ch - START_Y) / CELL_H) || 10;

        const { col: nearCol, row: nearRow } = pixelToCell(rawX, rawY, maxCols, maxRows);
        const { col, row } = nearestEmptyCell(nearCol, nearRow, grid, id, maxCols, maxRows);

        setGrid(prev => ({ ...prev, [id]: { col, row } }));
      }

      setDragPixel(null);
      dragging.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [grid]);

  const handleDesktopClick = useCallback((e) => {
    if (e.target === containerRef.current) setSelected(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleDesktopClick}
      style={{ position: 'absolute', inset: 0, bottom: 38, pointerEvents: 'auto' }}
    >
      {icons.map(icon => {
        const isDragging = dragPixel?.id === icon.id;
        const gridPos    = grid[icon.id] || { col: 0, row: 0 };
        const { x, y }  = isDragging ? { x: dragPixel.x, y: dragPixel.y } : cellToPixel(gridPos.col, gridPos.row);
        const isSel      = selected === icon.id;

        // Snap ghost: show target cell outline when dragging
        let snapX = x, snapY = y;
        if (isDragging && containerRef.current) {
          const cw = containerRef.current.clientWidth;
          const ch = containerRef.current.clientHeight;
          const maxCols = Math.floor((cw - START_X) / CELL_W) || 20;
          const maxRows = Math.floor((ch - START_Y) / CELL_H) || 10;
          const { col: sc, row: sr } = pixelToCell(x, y, maxCols, maxRows);
          const snapped = cellToPixel(sc, sr);
          snapX = snapped.x;
          snapY = snapped.y;
        }

        return (
          <React.Fragment key={icon.id}>
            {/* Snap target ghost while dragging */}
            {isDragging && (
              <div style={{
                position: 'absolute',
                left: snapX, top: snapY,
                width: CELL_W - 2, height: CELL_H - 2,
                border: '1px dashed rgba(255,255,255,0.45)',
                borderRadius: 3,
                background: 'rgba(255,255,255,0.06)',
                pointerEvents: 'none',
                transition: 'left 0.07s, top 0.07s'
              }} />
            )}

            {/* The icon itself */}
            <div
              onMouseDown={(e) => handleMouseDown(e, icon)}
              onDoubleClick={(e) => { e.stopPropagation(); icon.onDoubleClick(); }}
              style={{
                position: 'absolute',
                left: x, top: y,
                width: CELL_W - 2,
                height: CELL_H - 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isDragging ? 'grabbing' : 'default',
                userSelect: 'none',
                borderRadius: 3,
                padding: '4px 2px',
                boxSizing: 'border-box',
                // Snap animation when landing
                transition: isDragging ? 'none' : 'left 0.12s cubic-bezier(0.2,0,0,1), top 0.12s cubic-bezier(0.2,0,0,1)',
                // XP selection style
                background: isSel ? 'rgba(49,106,197,0.4)' : 'transparent',
                outline: isSel ? '1px dotted rgba(255,255,255,0.9)' : 'none',
                // Lift shadow while dragging
                filter: isDragging ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' : 'none',
                zIndex: isDragging ? 9999 : 1
              }}
            >
              <img
                src={icon.src}
                alt={icon.label}
                draggable={false}
                style={{
                  width: 32, height: 32,
                  marginBottom: 5,
                  objectFit: 'contain',
                  filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.6))',
                  opacity: isSel ? 0.85 : 1,
                  transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.1s'
                }}
              />
              <span style={{
                color: '#fff',
                fontSize: 11,
                textAlign: 'center',
                lineHeight: 1.3,
                textShadow: '1px 1px 2px #000, 0 0 4px #000',
                maxWidth: CELL_W - 10,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word'
              }}>
                {icon.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
