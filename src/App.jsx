import React, { useState, useEffect } from 'react';
import './App.css';
import { useVFS } from './hooks/useVFS';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import Explorer, { FolderIcon, FileIcon } from './components/Explorer';
import Notepad from './components/Notepad';
import Minesweeper from './components/Minesweeper';
import SaaSControl from './components/SaaSControl';
import InternetExplorer from './components/InternetExplorer';
import MediaPlayer from './components/MediaPlayer';
import ControlPanel from './components/ControlPanel';
import ResumeViewer from './components/ResumeViewer';
import ProjectGallery from './components/ProjectGallery';
import TerminalBio from './components/TerminalBio';
import CertificatesAndGitHub from './components/CertificatesAndGitHub';
import DesktopIcons from './components/DesktopIcons';

export default function App() {
  const {
    vfs,
    getItem,
    getFolderByPath,
    createFolder,
    createFile,
    renameItem,
    updateFileContent,
    deleteItem
  } = useVFS();

  // Desktop configuration for theme and wallpaper
  const [theme, setTheme] = useState('blue'); // blue, olive, silver
  const [wallpaper, setWallpaper] = useState('bliss'); // bliss, classic, bsod

  // Window list state
  const [windows, setWindows] = useState([
    {
      id: 'explorer',
      title: 'My Computer',
      icon: <img src="/icons/computer.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 100,
      y: 80,
      width: 650,
      height: 480,
      zIndex: 10
    },
    {
      id: 'saas',
      title: 'SaaS Control Center',
      icon: <img src="/icons/network.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
      isOpen: true, // open by default to catch user attention!
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 40,
      width: 780,
      height: 520,
      zIndex: 20
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      icon: <img src="/icons/minesweeper.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 400,
      y: 120,
      width: 260,
      height: 380,
      zIndex: 10
    },
    {
      id: 'media-player',
      title: 'Windows Media Player',
      icon: <img src="/icons/media-player.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 350,
      y: 150,
      width: 480,
      height: 350,
      zIndex: 10
    },
    {
      id: 'ie',
      title: 'Internet Explorer',
      icon: <img src="/icons/ie.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 80,
      y: 100,
      width: 680,
      height: 500,
      zIndex: 10
    },
    {
      id: 'control-panel',
      title: 'Control Panel',
      icon: <img src="/icons/computer.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 220,
      y: 160,
      width: 600,
      height: 450,
      zIndex: 10
    }
  ]);

  const [activeWindowId, setActiveWindowId] = useState('saas');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Listen for portfolio links requesting "Open in IE"
  useEffect(() => {
    const handler = (e) => {
      const url = e.detail?.url;
      if (!url) return;
      // Open the IE window
      setActiveWindowId('ie');
      setWindows(prev => {
        const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
        const updated = prev.map(w =>
          w.id === 'ie' ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
        );
        return updated;
      });
      // Give the IE component a moment to mount, then send it the URL via postMessage
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('ie-load-url', { detail: { url } }));
      }, 120);
    };
    window.addEventListener('open-in-ie', handler);
    return () => window.removeEventListener('open-in-ie', handler);
  }, []);

  // Explorer path history management
  const [currentPath, setCurrentPath] = useState('C:\\My Portfolio');
  const [history, setHistory] = useState({
    paths: ['C:\\My Portfolio'],
    currentIndex: 0
  });

  // Global window helpers
  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(prev => {
      // Find maximum z-index in current list
      const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
      return prev.map(w => {
        if (w.id === id) {
          return { ...w, isMinimized: false, zIndex: maxZ + 1 };
        }
        return w;
      });
    });
  };

  const openApp = (appId, title = '', appIcon = <img src="/icons/computer.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />) => {
    setIsStartMenuOpen(false);
    setActiveWindowId(appId);
    setWindows(prev => {
      const exists = prev.find(w => w.id === appId);
      const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
      if (exists) {
        // App is already registered, reopen it and focus
        return prev.map(w => w.id === appId ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w);
      } else {
        // Create new window config
        const newWin = {
          id: appId,
          title: title,
          icon: appIcon,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: 120 + Math.random() * 80,
          y: 60 + Math.random() * 80,
          width: 550,
          height: 420,
          zIndex: maxZ + 1
        };
        return [...prev, newWin];
      }
    });
  };

  const closeWindow = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
    // If we closed the active window, set another window active
    if (activeWindowId === id) {
      const openWins = windows.filter(w => w.id !== id && w.isOpen && !w.isMinimized);
      if (openWins.length > 0) {
        // Sort by zIndex descending
        openWins.sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(openWins[0].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
      const openWins = windows.filter(w => w.id !== id && w.isOpen && !w.isMinimized);
      if (openWins.length > 0) {
        openWins.sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(openWins[0].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const toggleMinimizeWindow = (id) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;
    if (win.isMinimized || activeWindowId !== id) {
      focusWindow(id);
    } else {
      minimizeWindow(id);
    }
  };

  const maximizeWindow = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const moveWindow = (id, newX, newY) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x: newX, y: newY } : w));
  };

  const resizeWindow = (id, newW, newH) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width: newW, height: newH } : w));
  };

  // VFS-integrated file opener: routes .exe files to rich app windows, .txt/.sh to Notepad
  const openFileInNotepad = (fileId, fileName) => {
    const file = getItem(fileId);
    if (!file) return;

    // Route special app files to their dedicated components
    const EXE_ROUTES = {
      'resume-exe':      { title: 'Resume — Justice Entsie',     width: 760, height: 520, component: 'resume' },
      'projects-exe':    { title: 'Project Showcase Gallery',     width: 820, height: 540, component: 'projects' },
      'bio-sh':          { title: 'bio.sh — Terminal',            width: 680, height: 460, component: 'terminal' },
      'certs-github-exe':{ title: 'Certificates & GitHub Stats',  width: 740, height: 520, component: 'certs' },
    };

    const route = EXE_ROUTES[fileId];
    if (route) {
      const appId = `app-${fileId}`;
      setActiveWindowId(appId);
      setWindows(prev => {
        const exists = prev.find(w => w.id === appId);
        const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
        if (exists) {
          return prev.map(w => w.id === appId ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w);
        }
        return [...prev, {
          id: appId,
          title: route.title,
          icon: <img src="/icons/notepad.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
          isOpen: true, isMinimized: false, isMaximized: false,
          x: 130 + Math.random() * 80, y: 70 + Math.random() * 60,
          width: route.width, height: route.height,
          zIndex: maxZ + 1,
          component: route.component
        }];
      });
      return;
    }

    // Default: open in Notepad
    const appId = `notepad-${fileId}`;
    setActiveWindowId(appId);
    setWindows(prev => {
      const exists = prev.find(w => w.id === appId);
      const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
      if (exists) {
        return prev.map(w => w.id === appId ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w);
      } else {
        const newWin = {
          id: appId,
          title: `Notepad - ${fileName}`,
          icon: <img src="/icons/notepad.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />,
          isOpen: true, isMinimized: false, isMaximized: false,
          x: 150 + Math.random() * 60, y: 100 + Math.random() * 60,
          width: 500, height: 380, zIndex: maxZ + 1,
          fileId: fileId, fileName: fileName
        };
        return [...prev, newWin];
      }
    });
  };

  // Navigation handlers
  const navigateToPath = (path) => {
    const cleanPath = path.replace(/\\$/, '');
    const folder = getFolderByPath(cleanPath);
    if (folder && folder.type === 'folder') {
      setCurrentPath(cleanPath);
      // Append to history
      setHistory(prev => {
        const nextPaths = prev.paths.slice(0, prev.currentIndex + 1);
        nextPaths.push(cleanPath);
        return {
          paths: nextPaths,
          currentIndex: nextPaths.length - 1
        };
      });
      openApp('explorer', 'My Computer', <img src="/icons/computer.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />);
    }
  };

  const navigateBack = () => {
    if (history.currentIndex > 0) {
      const nextIdx = history.currentIndex - 1;
      const targetPath = history.paths[nextIdx];
      setCurrentPath(targetPath);
      setHistory(prev => ({ ...prev, currentIndex: nextIdx }));
    }
  };

  const navigateForward = () => {
    if (history.currentIndex < history.paths.length - 1) {
      const nextIdx = history.currentIndex + 1;
      const targetPath = history.paths[nextIdx];
      setCurrentPath(targetPath);
      setHistory(prev => ({ ...prev, currentIndex: nextIdx }));
    }
  };

  const navigateUp = () => {
    if (currentPath === 'C:' || currentPath === 'C:\\') return;
    const parts = currentPath.split('\\');
    parts.pop();
    const parentPath = parts.join('\\') || 'C:';
    navigateToPath(parentPath);
  };

  // Close start menu when clicking on desktop
  const handleDesktopClick = () => {
    setIsStartMenuOpen(false);
  };

  return (
    <div
      className={`xp-desktop-environment theme-${theme} wallpaper-${wallpaper}`}
      onClick={handleDesktopClick}
    >
      {/* BSOD Mode Overlay */}
      {wallpaper === 'bsod' && (
        <div className="bsod-overlay">
          <p className="bsod-title">A problem has been detected and Windows has been shut down to prevent damage to your computer.</p>
          <p className="bsod-sub">REGISTRY_ERROR_INTEGRATION_SUCCESSFUL</p>
          <p>If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
          <p>Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.</p>
          <p>Technical information:</p>
          <p>*** STOP: 0x00000050 (0xFD3094C2, 0x00000001, 0xFBFE7617, 0x00000000)</p>
          <p>Tip: Use the Start Menu or click the Control Panel button on the taskbar below to open Control Panel and set the wallpaper back to Bliss!</p>
        </div>
      )}

      {/* Draggable Desktop Icons */}
      <DesktopIcons icons={[
        {
          id: 'my-computer',
          label: 'My Computer',
          src: '/icons/computer.png',
          onDoubleClick: () => navigateToPath('C:')
        },
        {
          id: 'my-portfolio',
          label: 'My Portfolio',
          src: '/icons/documents.png',
          onDoubleClick: () => navigateToPath('C:\\My Portfolio')
        },
        {
          id: 'saas-hub',
          label: 'SaaS Hub',
          src: '/icons/network.png',
          onDoubleClick: () => openApp('saas', 'SaaS Control Center', <img src="/icons/network.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />)
        },
        {
          id: 'minesweeper',
          label: 'Minesweeper',
          src: '/icons/minesweeper.png',
          onDoubleClick: () => openApp('minesweeper', 'Minesweeper', <img src="/icons/minesweeper.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />)
        },
        {
          id: 'media-player',
          label: 'Media Player',
          src: '/icons/media-player.png',
          onDoubleClick: () => openApp('media-player', 'Windows Media Player', <img src="/icons/media-player.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />)
        },
        {
          id: 'internet-explorer',
          label: 'Internet Explorer',
          src: '/icons/ie.png',
          onDoubleClick: () => openApp('ie', 'Internet Explorer', <img src="/icons/ie.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />)
        },
        {
          id: 'control-panel',
          label: 'Control Panel',
          src: '/icons/computer.png',
          onDoubleClick: () => openApp('control-panel', 'Control Panel', <img src="/icons/computer.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />)
        },
        {
          id: 'recycle-bin',
          label: 'Recycle Bin',
          src: '/icons/recycle.png',
          onDoubleClick: () => alert('Recycle Bin is empty! Go build more SaaS apps.')
        }
      ]} />

      {/* RENDER WINDOWS */}
      {windows.map(win => {
        let winContent = null;

        if (win.id === 'explorer') {
          winContent = (
            <Explorer
              currentPath={currentPath}
              history={history}
              onNavigate={navigateToPath}
              onNavigateBack={navigateBack}
              onNavigateForward={navigateForward}
              onNavigateUp={navigateUp}
              getFolderByPath={getFolderByPath}
              createFolder={createFolder}
              createFile={createFile}
              renameItem={renameItem}
              deleteItem={deleteItem}
              onOpenFile={openFileInNotepad}
              onOpenSearch={() => openApp('ie', 'Internet Explorer', <img src="/icons/ie.png" alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />)}
            />
          );
        } else if (win.id === 'saas') {
          winContent = <SaaSControl />;
        } else if (win.id === 'minesweeper') {
          winContent = <Minesweeper />;
        } else if (win.id === 'media-player') {
          winContent = <MediaPlayer />;
        } else if (win.id === 'ie') {
          winContent = (
            <InternetExplorer
              vfs={vfs}
              onOpenFile={openFileInNotepad}
              onNavigateToFolder={navigateToPath}
              onOpenApp={openApp}
            />
          );
        } else if (win.id === 'control-panel') {
          winContent = (
            <ControlPanel
              theme={theme}
              setTheme={setTheme}
              wallpaper={wallpaper}
              setWallpaper={setWallpaper}
            />
          );
        } else if (win.id.startsWith('notepad-')) {
          const fileConfig = win;
          const file = getItem(fileConfig.fileId);
          winContent = (
            <Notepad
              fileId={fileConfig.fileId}
              fileName={fileConfig.fileName}
              content={file ? file.content : ''}
              onSaveContent={updateFileContent}
              onClose={() => closeWindow(win.id)}
            />
          );
        } else if (win.component === 'resume') {
          winContent = <ResumeViewer />;
        } else if (win.component === 'projects') {
          winContent = <ProjectGallery />;
        } else if (win.component === 'terminal') {
          winContent = <TerminalBio />;
        } else if (win.component === 'certs') {
          winContent = <CertificatesAndGitHub />;
        }

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isMaximized={win.isMaximized}
            x={win.x}
            y={win.y}
            width={win.width}
            height={win.height}
            zIndex={win.zIndex}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onMove={moveWindow}
            onResize={resizeWindow}
          >
            {winContent}
          </Window>
        );
      })}

      {/* Taskbar & Start Menu */}
      <Taskbar
        windows={windows.filter(w => w.isOpen)}
        activeWindowId={activeWindowId}
        isStartMenuOpen={isStartMenuOpen}
        onStartMenuToggle={setIsStartMenuOpen}
        onWindowToggleMinimize={toggleMinimizeWindow}
        onOpenApp={openApp}
        onOpenFolder={navigateToPath}
      />
    </div>
  );
}
