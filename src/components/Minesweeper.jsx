import React, { useState, useEffect, useRef } from 'react';

const BOARD_SIZE = 9;
const MINE_COUNT = 10;

export default function Minesweeper() {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [minesRemaining, setMinesRemaining] = useState(MINE_COUNT);
  const [timer, setTimer] = useState(0);
  const [isFaceClicked, setIsFaceClicked] = useState(false);
  const timerIntervalRef = useRef(null);

  // Initialize board
  const initializeBoard = () => {
    // Stop any running timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimer(0);
    setMinesRemaining(MINE_COUNT);
    setGameState('idle');

    // Create empty board
    let newBoard = Array(BOARD_SIZE).fill(null).map((_, r) =>
      Array(BOARD_SIZE).fill(null).map((_, c) => ({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (newBoard[r][c].isMine) continue;
        let count = 0;
        // Check 8 directions
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
              if (newBoard[nr][nc].isMine) count++;
            }
          }
        }
        newBoard[r][c].neighborMines = count;
      }
    }

    setBoard(newBoard);
  };

  useEffect(() => {
    initializeBoard();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => Math.min(prev + 1, 999));
      }, 1000);
    } else if (gameState === 'won' || gameState === 'lost') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState]);

  // Reveal a cell
  const revealCell = (r, c) => {
    if (gameState === 'lost' || gameState === 'won') return;

    let newBoard = [...board.map(row => [...row])];
    let cell = newBoard[r][c];

    if (cell.isRevealed || cell.isFlagged) return;

    let currentGameState = gameState;
    // Start game on first click
    if (gameState === 'idle') {
      currentGameState = 'playing';
      setGameState('playing');
    }

    // Check hit mine
    if (cell.isMine) {
      cell.isRevealed = true;
      // Reveal all mines
      newBoard.forEach(row => {
        row.forEach(cell => {
          if (cell.isMine) cell.isRevealed = true;
        });
      });
      setBoard(newBoard);
      setGameState('lost');
      return;
    }

    // Flood fill algorithm for blank cells
    const floodFill = (row, col) => {
      const q = [[row, col]];
      const visited = new Set();
      visited.add(`${row},${col}`);

      while (q.length > 0) {
        const [currR, currC] = q.shift();
        newBoard[currR][currC].isRevealed = true;

        if (newBoard[currR][currC].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = currR + dr;
              const nc = currC + dc;
              if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                const neighbor = newBoard[nr][nc];
                if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                  const key = `${nr},${nc}`;
                  if (!visited.has(key)) {
                    visited.add(key);
                    q.push([nr, nc]);
                  }
                }
              }
            }
          }
        }
      }
    };

    floodFill(r, c);

    // Check win condition
    let unrevealedSafeCells = 0;
    newBoard.forEach(row => {
      row.forEach(cell => {
        if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
      });
    });

    if (unrevealedSafeCells === 0) {
      setGameState('won');
      // Flag all remaining mines
      newBoard.forEach(row => {
        row.forEach(cell => {
          if (cell.isMine) cell.isFlagged = true;
        });
      });
      setMinesRemaining(0);
    }

    setBoard(newBoard);
  };

  // Flag/unflag a cell
  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameState === 'lost' || gameState === 'won' || gameState === 'idle') return;

    let newBoard = [...board.map(row => [...row])];
    let cell = newBoard[r][c];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    setMinesRemaining(prev => prev + (cell.isFlagged ? -1 : 1));
    setBoard(newBoard);
  };

  // Face rendering
  const getFaceImage = () => {
    if (isFaceClicked) return '/minesweeper/ohh.png';
    switch (gameState) {
      case 'won': return '/minesweeper/win.png';
      case 'lost': return '/minesweeper/dead.png';
      default: return '/minesweeper/smile.png';
    }
  };

  // Digital display padding
  const formatNumber = (num) => {
    if (num < 0) {
      const pos = Math.abs(num);
      return '-' + String(pos).padStart(2, '0');
    }
    return String(num).padStart(3, '0');
  };

  const renderDigits = (num) => {
    const formatted = formatNumber(num);
    return (
      <div style={{ display: 'flex', backgroundColor: '#000000', padding: '1px', border: '1px solid #7b7b7b' }}>
        {formatted.split('').map((char, idx) => {
          const imgName = char === '-' ? 'digit-' : `digit${char}`;
          return (
            <img
              key={idx}
              src={`/minesweeper/${imgName}.png`}
              alt={char}
              style={{ width: '13px', height: '23px', display: 'block' }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="xp-minesweeper">
      <div className="xp-minesweeper-window">
        {/* Game Menu */}
        <div className="xp-minesweeper-menu">
          <span>Game</span>
          <span>Help</span>
        </div>

        {/* Outer board border bevel */}
        <div className="xp-minesweeper-board-wrapper">
          {/* Header Dashboard */}
          <div className="xp-minesweeper-header">
            {renderDigits(minesRemaining)}
            <button
              className={`smiley-btn ${isFaceClicked ? 'active' : ''}`}
              onClick={initializeBoard}
              onMouseDown={() => setIsFaceClicked(true)}
              onMouseUp={() => setIsFaceClicked(false)}
              onMouseLeave={() => setIsFaceClicked(false)}
              style={{ width: '26px', height: '26px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img src={getFaceImage()} alt="smiley" style={{ width: '24px', height: '24px', display: 'block' }} />
            </button>
            {renderDigits(timer)}
          </div>

          {/* Grid */}
          <div className="xp-minesweeper-grid">
            {board.map((row, r) => (
              <div key={r} className="grid-row">
                {row.map((cell, c) => {
                  let cellClass = 'grid-cell';
                  let cellContent = null;

                  if (cell.isRevealed) {
                    cellClass += ' revealed';
                    if (cell.isMine) {
                      cellClass += ' mine';
                      cellContent = <img src="/minesweeper/mine-death.png" alt="mine" style={{ width: '100%', height: '100%', display: 'block' }} />;
                    } else if (cell.neighborMines > 0) {
                      cellClass += ` count-${cell.neighborMines}`;
                      cellContent = <img src={`/minesweeper/open${cell.neighborMines}.png`} alt={cell.neighborMines} style={{ width: '100%', height: '100%', display: 'block' }} />;
                    }
                  } else if (cell.isFlagged) {
                    cellClass += ' flagged';
                    cellContent = <img src="/minesweeper/flag.png" alt="flag" style={{ width: '100%', height: '100%', display: 'block' }} />;
                  }

                  return (
                    <button
                      key={c}
                      className={cellClass}
                      onClick={() => revealCell(r, c)}
                      onContextMenu={(e) => handleRightClick(e, r, c)}
                      disabled={gameState === 'won' || gameState === 'lost'}
                    >
                      {cellContent}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
