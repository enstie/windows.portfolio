import React, { useState, useEffect } from 'react';

export default function Notepad({
  fileId,
  fileName,
  content,
  onSaveContent,
  onClose
}) {
  const [text, setText] = useState(content);

  useEffect(() => {
    setText(content);
  }, [content, fileId]);

  const handleSave = () => {
    onSaveContent(fileId, text);
    alert(`File "${fileName}" saved successfully in session!`);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="xp-notepad">
      {/* Menu toolbar */}
      <div className="xp-notepad-menubar">
        <div className="menubar-item-dropdown">
          <span className="menubar-item">File</span>
          <div className="menubar-dropdown-content">
            <div className="dropdown-item" onClick={handleSave}>Save</div>
            <div className="dropdown-divider" />
            <div className="dropdown-item" onClick={onClose}>Exit</div>
          </div>
        </div>
        <div className="menubar-item-dropdown">
          <span className="menubar-item">Edit</span>
          <div className="menubar-dropdown-content">
            <div className="dropdown-item" onClick={handleClear}>Clear All</div>
          </div>
        </div>
        <span className="menubar-item">Format</span>
        <span className="menubar-item">View</span>
        <span className="menubar-item">Help</span>
      </div>

      {/* Editor Textarea */}
      <textarea
        className="xp-notepad-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
}
