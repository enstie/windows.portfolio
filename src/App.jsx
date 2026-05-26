import React, {
  useState, useEffect, useCallback, useMemo, Suspense, lazy
} from 'react';
import './App.css';
import { useVFS } from './hooks/useVFS';
import Window    from './components/Window';
import Taskbar   from './components/Taskbar';
import DesktopIcons from './components/DesktopIcons';

// ── Lazy-loaded components ─────────────────────────────────────────────────
// Each component gets its own JS chunk; it's fetched from the server only when
// the user first opens that window — initial page load is much faster.
const Explorer            = lazy(() => import('./components/Explorer'));
const Notepad             = lazy(() => import('./components/Notepad'));
const SaaSControl         = lazy(() => import('./components/SaaSControl'));
const Minesweeper         = lazy(() => import('./components/Minesweeper'));
const InternetExplorer    = lazy(() => import('./components/InternetExplorer'));
const MediaPlayer         = lazy(() => import('./components/MediaPlayer'));
const ControlPanel        = lazy(() => import('./components/ControlPanel'));
const ResumeViewer        = lazy(() => import('./components/ResumeViewer'));
const ProjectGallery      = lazy(() => import('./components/ProjectGallery'));
const TerminalBio         = lazy(() => import('./components/TerminalBio'));
const CertificatesAndGitHub = lazy(() => import('./components/CertificatesAndGitHub'));

// ── XP-style window loading fallback ──────────────────────────────────────
function WindowLoadingFallback() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', background: '#ece9d8',
      fontFamily: 'Tahoma, sans-serif', fontSize: 12, color: '#444'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 32, height: 32, border: '3px solid #0054e3',
          borderTop: '3px solid transparent', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', margin: '0 auto 10px'
        }} />
        Loading…
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Icon JSX helpers (stable references, not recreated each render) ────────
const ICON = {
  computer:   <img src="/icons/computer.png"    alt="" style={{ width:16, height:16, verticalAlign:'middle' }} />,
  network:    <img src="/icons/network.png"     alt="" style={{ width:16, height:16, verticalAlign:'middle' }} />,
  minesweeper:<img src="/icons/minesweeper.png" alt="" style={{ width:16, height:16, verticalAlign:'middle' }} />,
  media:      <img src="/icons/media-player.png"alt="" style={{ width:16, height:16, verticalAlign:'middle' }} />,
  ie:         <img src="/icons/ie.png"          alt="" style={{ width:16, height:16, verticalAlign:'middle' }} />,
  notepad:    <img src="/icons/notepad.png"     alt="" style={{ width:16, height:16, verticalAlign:'middle' }} />,
};

// ── Initial window registry ────────────────────────────────────────────────
const INITIAL_WINDOWS = [
  { id:'explorer',      title:'My Computer',          icon: ICON.computer,    isOpen:false, isMinimized:false, isMaximized:false, x:100, y:80,  width:650, height:480, zIndex:10 },
  { id:'saas',          title:'SaaS Control Center',  icon: ICON.network,     isOpen:false, isMinimized:false, isMaximized:false, x:180, y:40,  width:780, height:520, zIndex:20 },
  { id:'minesweeper',   title:'Minesweeper',           icon: ICON.minesweeper, isOpen:false, isMinimized:false, isMaximized:false, x:400, y:120, width:260, height:380, zIndex:10 },
  { id:'media-player',  title:'Windows Media Player',  icon: ICON.media,       isOpen:false, isMinimized:false, isMaximized:false, x:350, y:150, width:480, height:350, zIndex:10 },
  { id:'ie',            title:'Internet Explorer',     icon: ICON.ie,          isOpen:false, isMinimized:false, isMaximized:false, x:80,  y:100, width:680, height:500, zIndex:10 },
  { id:'control-panel', title:'Control Panel',         icon: ICON.computer,    isOpen:false, isMinimized:false, isMaximized:false, x:220, y:160, width:600, height:450, zIndex:10 },
];

// ── EXE file → app window routes ──────────────────────────────────────────
const EXE_ROUTES = {
  'resume-exe':       { title:'Resume — Justice Entsie',    width:760, height:520, component:'resume'   },
  'projects-exe':     { title:'Project Showcase Gallery',   width:820, height:540, component:'projects' },
  'bio-sh':           { title:'bio.sh — Terminal',          width:680, height:460, component:'terminal' },
  'certs-github-exe': { title:'Certificates & GitHub Stats',width:740, height:520, component:'certs'    },
};

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const { vfs, getItem, getFolderByPath, createFolder, createFile, renameItem, updateFileContent, deleteItem } = useVFS();

  const [theme,    setTheme]    = useState('blue');
  const [wallpaper,setWallpaper]= useState('bliss');
  const [windows,  setWindows]  = useState(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState('saas');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('C:\\My Portfolio');
  const [history, setHistory] = useState({ paths:['C:\\My Portfolio'], currentIndex:0 });

  // ── IE link handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const url = e.detail?.url;
      if (!url) return;
      setActiveWindowId('ie');
      setWindows(prev => {
        const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
        return prev.map(w => w.id==='ie' ? { ...w, isOpen:true, isMinimized:false, zIndex:maxZ+1 } : w);
      });
      setTimeout(() => window.dispatchEvent(new CustomEvent('ie-load-url', { detail:{ url } })), 120);
    };
    window.addEventListener('open-in-ie', handler);
    return () => window.removeEventListener('open-in-ie', handler);
  }, []);

  // ── Window management (all stable with useCallback) ──────────────────────
  const focusWindow = useCallback((id) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
      return prev.map(w => w.id===id ? { ...w, isMinimized:false, zIndex:maxZ+1 } : w);
    });
  }, []);

  const openApp = useCallback((appId, title='', appIcon=ICON.computer) => {
    setIsStartMenuOpen(false);
    setActiveWindowId(appId);
    setWindows(prev => {
      const exists = prev.find(w => w.id===appId);
      const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
      if (exists) return prev.map(w => w.id===appId ? { ...w, isOpen:true, isMinimized:false, zIndex:maxZ+1 } : w);
      return [...prev, {
        id:appId, title, icon:appIcon,
        isOpen:true, isMinimized:false, isMaximized:false,
        x:120+Math.random()*80, y:60+Math.random()*80,
        width:550, height:420, zIndex:maxZ+1
      }];
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id===id ? { ...w, isOpen:false } : w));
    setActiveWindowId(prev => {
      if (prev !== id) return prev;
      const open = windows.filter(w => w.id!==id && w.isOpen && !w.isMinimized);
      open.sort((a,b) => b.zIndex - a.zIndex);
      return open[0]?.id ?? null;
    });
  }, [windows]);

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id===id ? { ...w, isMinimized:true } : w));
    setActiveWindowId(prev => {
      if (prev !== id) return prev;
      const open = windows.filter(w => w.id!==id && w.isOpen && !w.isMinimized);
      open.sort((a,b) => b.zIndex - a.zIndex);
      return open[0]?.id ?? null;
    });
  }, [windows]);

  const toggleMinimizeWindow = useCallback((id) => {
    const win = windows.find(w => w.id===id);
    if (!win) return;
    if (win.isMinimized || activeWindowId!==id) focusWindow(id);
    else minimizeWindow(id);
  }, [windows, activeWindowId, focusWindow, minimizeWindow]);

  const maximizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id===id ? { ...w, isMaximized:!w.isMaximized } : w));
    focusWindow(id);
  }, [focusWindow]);

  const moveWindow   = useCallback((id, x, y)   => setWindows(prev => prev.map(w => w.id===id ? { ...w, x, y } : w)), []);
  const resizeWindow = useCallback((id, width, height) => setWindows(prev => prev.map(w => w.id===id ? { ...w, width, height } : w)), []);

  const openFileInNotepad = useCallback((fileId, fileName) => {
    const file = getItem(fileId);
    if (!file) return;
    const route = EXE_ROUTES[fileId];
    if (route) {
      const appId = `app-${fileId}`;
      setActiveWindowId(appId);
      setWindows(prev => {
        const exists = prev.find(w => w.id===appId);
        const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
        if (exists) return prev.map(w => w.id===appId ? { ...w, isOpen:true, isMinimized:false, zIndex:maxZ+1 } : w);
        return [...prev, {
          id:appId, title:route.title, icon:ICON.notepad,
          isOpen:true, isMinimized:false, isMaximized:false,
          x:130+Math.random()*80, y:70+Math.random()*60,
          width:route.width, height:route.height, zIndex:maxZ+1,
          component:route.component
        }];
      });
      return;
    }
    const appId = `notepad-${fileId}`;
    setActiveWindowId(appId);
    setWindows(prev => {
      const exists = prev.find(w => w.id===appId);
      const maxZ = Math.max(...prev.map(w => w.zIndex), 1);
      if (exists) return prev.map(w => w.id===appId ? { ...w, isOpen:true, isMinimized:false, zIndex:maxZ+1 } : w);
      return [...prev, {
        id:appId, title:`Notepad - ${fileName}`, icon:ICON.notepad,
        isOpen:true, isMinimized:false, isMaximized:false,
        x:150+Math.random()*60, y:100+Math.random()*60,
        width:500, height:380, zIndex:maxZ+1,
        fileId, fileName
      }];
    });
  }, [getItem]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigateToPath = useCallback((path) => {
    const cleanPath = path.replace(/\\$/, '');
    const folder = getFolderByPath(cleanPath);
    if (folder?.type === 'folder') {
      setCurrentPath(cleanPath);
      setHistory(prev => {
        const paths = prev.paths.slice(0, prev.currentIndex + 1);
        paths.push(cleanPath);
        return { paths, currentIndex: paths.length - 1 };
      });
      openApp('explorer', 'My Computer', ICON.computer);
    }
  }, [getFolderByPath, openApp]);

  const navigateBack    = useCallback(() => {
    setHistory(prev => {
      if (prev.currentIndex <= 0) return prev;
      const idx = prev.currentIndex - 1;
      setCurrentPath(prev.paths[idx]);
      return { ...prev, currentIndex: idx };
    });
  }, []);

  const navigateForward = useCallback(() => {
    setHistory(prev => {
      if (prev.currentIndex >= prev.paths.length - 1) return prev;
      const idx = prev.currentIndex + 1;
      setCurrentPath(prev.paths[idx]);
      return { ...prev, currentIndex: idx };
    });
  }, []);

  const navigateUp = useCallback(() => {
    if (currentPath === 'C:' || currentPath === 'C:\\') return;
    const parts = currentPath.split('\\');
    parts.pop();
    navigateToPath(parts.join('\\') || 'C:');
  }, [currentPath, navigateToPath]);

  // ── Desktop icons (memoized — only re-created if callbacks change) ────────
  const desktopIcons = useMemo(() => [
    { id:'my-computer',       label:'My Computer',        src:'/icons/computer.png',    onDoubleClick:() => navigateToPath('C:') },
    { id:'my-portfolio',      label:'My Portfolio',       src:'/icons/documents.png',   onDoubleClick:() => navigateToPath('C:\\My Portfolio') },
    { id:'saas-hub',          label:'SaaS Hub',           src:'/icons/network.png',     onDoubleClick:() => openApp('saas','SaaS Control Center',ICON.network) },
    { id:'minesweeper',       label:'Minesweeper',        src:'/icons/minesweeper.png', onDoubleClick:() => openApp('minesweeper','Minesweeper',ICON.minesweeper) },
    { id:'media-player',      label:'Media Player',       src:'/icons/media-player.png',onDoubleClick:() => openApp('media-player','Windows Media Player',ICON.media) },
    { id:'internet-explorer', label:'Internet Explorer',  src:'/icons/ie.png',          onDoubleClick:() => openApp('ie','Internet Explorer',ICON.ie) },
    { id:'control-panel',     label:'Control Panel',      src:'/icons/computer.png',    onDoubleClick:() => openApp('control-panel','Control Panel',ICON.computer) },
    { id:'recycle-bin',       label:'Recycle Bin',        src:'/icons/recycle.png',     onDoubleClick:() => alert('Recycle Bin is empty!') },
  ], [navigateToPath, openApp]);

  // ── Window content resolver ───────────────────────────────────────────────
  const resolveContent = useCallback((win) => {
    if (win.id === 'explorer') return (
      <Explorer
        currentPath={currentPath} history={history}
        onNavigate={navigateToPath} onNavigateBack={navigateBack}
        onNavigateForward={navigateForward} onNavigateUp={navigateUp}
        getFolderByPath={getFolderByPath}
        createFolder={createFolder} createFile={createFile}
        renameItem={renameItem} deleteItem={deleteItem}
        onOpenFile={openFileInNotepad}
        onOpenSearch={() => openApp('ie','Internet Explorer',ICON.ie)}
      />
    );
    if (win.id === 'saas')          return <SaaSControl />;
    if (win.id === 'minesweeper')   return <Minesweeper />;
    if (win.id === 'media-player')  return <MediaPlayer />;
    if (win.id === 'ie')            return <InternetExplorer vfs={vfs} onOpenFile={openFileInNotepad} onNavigateToFolder={navigateToPath} onOpenApp={openApp} />;
    if (win.id === 'control-panel') return <ControlPanel theme={theme} setTheme={setTheme} wallpaper={wallpaper} setWallpaper={setWallpaper} />;
    if (win.id.startsWith('notepad-')) {
      const file = getItem(win.fileId);
      return <Notepad fileId={win.fileId} fileName={win.fileName} content={file?.content ?? ''} onSaveContent={updateFileContent} onClose={() => closeWindow(win.id)} />;
    }
    if (win.component === 'resume')   return <ResumeViewer />;
    if (win.component === 'projects') return <ProjectGallery />;
    if (win.component === 'terminal') return <TerminalBio />;
    if (win.component === 'certs')    return <CertificatesAndGitHub />;
    return null;
  }, [
    currentPath, history, navigateToPath, navigateBack, navigateForward,
    navigateUp, getFolderByPath, createFolder, createFile, renameItem,
    deleteItem, openFileInNotepad, openApp, vfs, theme, wallpaper,
    getItem, updateFileContent, closeWindow
  ]);

  // ── Taskbar windows list (memoized) ───────────────────────────────────────
  const openWindows = useMemo(() => windows.filter(w => w.isOpen), [windows]);

  const handleDesktopClick = useCallback(() => setIsStartMenuOpen(false), []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`xp-desktop-environment theme-${theme} wallpaper-${wallpaper}`}
      onClick={handleDesktopClick}
    >
      {wallpaper === 'bsod' && (
        <div className="bsod-overlay">
          <p className="bsod-title">A problem has been detected and Windows has been shut down to prevent damage to your computer.</p>
          <p className="bsod-sub">REGISTRY_ERROR_INTEGRATION_SUCCESSFUL</p>
          <p>If this is the first time you've seen this Stop error screen, restart your computer.</p>
          <p>Technical information:</p>
          <p>*** STOP: 0x00000050 (0xFD3094C2, 0x00000001, 0xFBFE7617, 0x00000000)</p>
          <p>Tip: Use the Start Menu or Control Panel to set the wallpaper back to Bliss!</p>
        </div>
      )}

      <DesktopIcons icons={desktopIcons} />

      {/* All windows rendered inside a single Suspense boundary */}
      <Suspense fallback={null}>
        {windows.map(win => (
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
            {/* Each window gets its own Suspense so only that window shows a spinner */}
            <Suspense fallback={<WindowLoadingFallback />}>
              {resolveContent(win)}
            </Suspense>
          </Window>
        ))}
      </Suspense>

      <Taskbar
        windows={openWindows}
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
