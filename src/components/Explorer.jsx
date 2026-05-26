import React, { useState, useEffect, useRef } from 'react';

// Retro PNG Icons
export const FolderIcon = ({ size = 32 }) => (
  <img src="/icons/folder.png" alt="Folder" style={{ width: `${size}px`, height: `${size}px` }} />
);

export const FileIcon = ({ size = 32 }) => (
  <img src="/icons/file.png" alt="File" style={{ width: `${size}px`, height: `${size}px` }} />
);

export const BackArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export const ForwardArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export const UpArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

export const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function Explorer({
  currentPath,
  history,
  onNavigate,
  onNavigateBack,
  onNavigateForward,
  onNavigateUp,
  getFolderByPath,
  createFolder,
  createFile,
  renameItem,
  deleteItem,
  onOpenFile,
  onOpenSearch
}) {
  const [address, setAddress] = useState(currentPath);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editName, setEditName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const fileContainerRef = useRef(null);

  const currentFolder = getFolderByPath(currentPath);

  useEffect(() => {
    setAddress(currentPath);
    setSelectedItemId(null);
  }, [currentPath]);

  // Handle address bar enter
  const handleAddressKeyDown = (e) => {
    if (e.key === 'Enter') {
      const targetFolder = getFolderByPath(address);
      if (targetFolder && targetFolder.type === 'folder') {
        onNavigate(address);
      } else {
        alert(`Path not found: ${address}`);
        setAddress(currentPath);
      }
    }
  };

  // Close context menu and stop editing on clicking elsewhere
  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleContextMenu = (e, item = null) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = fileContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setContextMenu({
      x,
      y,
      item
    });

    if (item) {
      setSelectedItemId(item.id);
    } else {
      setSelectedItemId(null);
    }
  };

  const handleItemClick = (e, item) => {
    e.stopPropagation();
    setSelectedItemId(item.id);
  };

  const handleItemDoubleClick = (e, item) => {
    e.stopPropagation();
    if (item.type === 'folder') {
      const newPath = currentPath === 'C:' || currentPath === 'C:\\'
        ? `C:\\${item.name}`
        : `${currentPath}\\${item.name}`;
      onNavigate(newPath);
    } else if (item.type === 'file') {
      onOpenFile(item.id, item.name);
    }
  };

  const handleCreateFolder = () => {
    createFolder(currentPath, 'New Folder');
    setContextMenu(null);
  };

  const handleCreateFile = () => {
    createFile(currentPath, 'New Text Document.txt', '');
    setContextMenu(null);
  };

  const handleRenameStart = (item) => {
    setEditingItemId(item.id);
    setEditName(item.name);
    setContextMenu(null);
  };

  const handleRenameSave = () => {
    if (editName.trim() && editingItemId) {
      renameItem(editingItemId, editName.trim());
    }
    setEditingItemId(null);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRenameSave();
    } else if (e.key === 'Escape') {
      setEditingItemId(null);
    }
  };

  const handleDeleteItem = (item) => {
    if (confirm(`Are you sure you want to delete '${item.name}'?`)) {
      deleteItem(item.id);
      setSelectedItemId(null);
    }
    setContextMenu(null);
  };

  return (
    <div className="xp-explorer">
      {/* Menu toolbar */}
      <div className="xp-explorer-menubar">
        <span className="menubar-item">File</span>
        <span className="menubar-item">Edit</span>
        <span className="menubar-item">View</span>
        <span className="menubar-item">Favorites</span>
        <span className="menubar-item">Tools</span>
        <span className="menubar-item">Help</span>
      </div>

      {/* Button toolbar */}
      <div className="xp-explorer-toolbar">
        <button className="toolbar-btn" onClick={onNavigateBack} disabled={history.currentIndex <= 0}>
          <div className="btn-circle back"><BackArrowIcon /></div>
          <span>Back</span>
        </button>
        <button className="toolbar-btn" onClick={onNavigateForward} disabled={history.currentIndex >= history.paths.length - 1}>
          <div className="btn-circle"><ForwardArrowIcon /></div>
          <span>Forward</span>
        </button>
        <button className="toolbar-btn" onClick={onNavigateUp} disabled={currentPath === 'C:' || currentPath === 'C:\\'}>
          <div className="btn-circle"><UpArrowIcon /></div>
          <span>Up</span>
        </button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn" onClick={onOpenSearch}>
          <div className="btn-circle search"><SearchIcon /></div>
          <span>Search</span>
        </button>
      </div>

      {/* Address bar */}
      <div className="xp-explorer-addressbar">
        <span className="address-label">Address</span>
        <div className="address-input-wrapper">
          <input
            type="text"
            className="address-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleAddressKeyDown}
          />
          <button className="address-go-btn" onClick={() => handleAddressKeyDown({ key: 'Enter' })}>Go</button>
        </div>
      </div>

      {/* Main Area */}
      <div className="xp-explorer-main">
        {/* Left Side Tasks Panel */}
        <div className="xp-explorer-sidebar">
          <div className="sidebar-section blue-card">
            <div className="sidebar-section-header">
              <span>File and Folder Tasks</span>
            </div>
            <div className="sidebar-section-body">
              <span className="sidebar-link" onClick={handleCreateFolder}>Make a new folder</span>
              <span className="sidebar-link" onClick={handleCreateFile}>Create a text file</span>
            </div>
          </div>

          <div className="sidebar-section blue-card">
            <div className="sidebar-section-header">
              <span>Other Places</span>
            </div>
            <div className="sidebar-section-body">
              <span className="sidebar-link" onClick={() => onNavigate('C:')}>My Computer (C:)</span>
              <span className="sidebar-link" onClick={() => onNavigate('C:\\My Portfolio')}>My Portfolio</span>
              <span className="sidebar-link" onClick={() => onNavigate('C:\\My Portfolio\\Projects')}>Projects</span>
            </div>
          </div>

          <div className="sidebar-section blue-card">
            <div className="sidebar-section-header">
              <span>Details</span>
            </div>
            <div className="sidebar-section-body details-text">
              <strong>{currentFolder?.name || 'Explorer'}</strong>
              <div>Type: Folder</div>
              <div>Contains: {currentFolder?.children?.length || 0} items</div>
            </div>
          </div>
        </div>

        {/* Right Side Files View */}
        <div
          ref={fileContainerRef}
          className="xp-explorer-files"
          onContextMenu={(e) => handleContextMenu(e, null)}
        >
          {currentFolder && currentFolder.children && currentFolder.children.map(item => (
            <div
              key={item.id}
              className={`xp-file-item ${selectedItemId === item.id ? 'selected' : ''}`}
              onClick={(e) => handleItemClick(e, item)}
              onDoubleClick={(e) => handleItemDoubleClick(e, item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <div className="xp-file-icon">
                {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
              </div>
              <div className="xp-file-name">
                {editingItemId === item.id ? (
                  <input
                    type="text"
                    className="xp-rename-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleRenameSave}
                    onKeyDown={handleRenameKeyDown}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span>{item.name}</span>
                )}
              </div>
            </div>
          ))}

          {(!currentFolder || !currentFolder.children || currentFolder.children.length === 0) && (
            <div className="xp-empty-folder">This folder is empty.</div>
          )}

          {/* Context Menu */}
          {contextMenu && (
            <div
              className="xp-context-menu"
              style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              {contextMenu.item ? (
                <>
                  <div className="context-menu-item" onClick={() => {
                    handleItemDoubleClick({ stopPropagation: () => {} }, contextMenu.item);
                    setContextMenu(null);
                  }}>Open</div>
                  <div className="context-menu-item" onClick={() => handleRenameStart(contextMenu.item)}>Rename</div>
                  <div className="context-menu-divider" />
                  <div className="context-menu-item" onClick={() => handleDeleteItem(contextMenu.item)}>Delete</div>
                </>
              ) : (
                <>
                  <div className="context-menu-item" onClick={handleCreateFolder}>New Folder</div>
                  <div className="context-menu-item" onClick={handleCreateFile}>New Text Document</div>
                  <div className="context-menu-divider" />
                  <div className="context-menu-item" onClick={() => setContextMenu(null)}>Refresh</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
