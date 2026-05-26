import { useState, useCallback } from 'react';

const initialVFS = {
  id: 'root',
  name: 'C:',
  type: 'folder',
  children: [
    {
      id: 'portfolio',
      name: 'My Portfolio',
      type: 'folder',
      children: [
        {
          id: 'resume-exe',
          name: 'Resume.exe',
          type: 'file',
          content: '__APP__'
        },
        {
          id: 'projects-exe',
          name: 'Projects.exe',
          type: 'file',
          content: '__APP__'
        },
        {
          id: 'certs-github-exe',
          name: 'Certificates & GitHub.exe',
          type: 'file',
          content: '__APP__'
        },
        {
          id: 'bio-sh',
          name: 'bio.sh',
          type: 'file',
          content: '__APP__'
        },
        {
          id: 'about',
          name: 'About Me.txt',
          type: 'file',
          content: `=========================================
       JUSTICE ENTSIE'S PORTFOLIO
=========================================
Welcome to my interactive Windows XP Luna Portfolio!

I am a Full-Stack Developer & IT Student currently pursuing
a Bachelor of Science in Information Technology at
Ghana Communication Technology University (GCTU)
GPA: 3.8 | Class of 2026

I build elegant digital experiences at the intersection
of performance and design, turning complex problems into
clean, scalable code.

Key Achievements:
- 12+ Projects shipped (Web, Mobile, AI/ML)
- 2 Internships (Google, Infosys)
- 2 Hackathon Wins (Smart Ghana 2024, HackMIT 2023)
- AWS, GCP, CKA, and Meta certified

Double-click any .exe file to launch the interactive app!
`
        },
        {
          id: 'contact',
          name: 'Contact Me.txt',
          type: 'file',
          content: `=========================================
            CONTACT CHANNELS
=========================================

Feel free to reach out to collaborate, chat, or hire!

- Email:    Entise4561@gmail.com
- GitHub:   github.com/entsie
- LinkedIn: linkedin.com/in/entsier
- Portfolio: entisejustice.dev
- Location:  Accra, Ghana (Response within 12 hours)
`
        }
      ]
    }
  ]
};

// Helper function to find a folder by path recursively
const findFolderByPath = (root, pathParts) => {
  let current = root;
  for (const part of pathParts) {
    if (current.type !== 'folder') return null;
    const found = current.children.find(child => child.name === part && child.type === 'folder');
    if (!found) return null;
    current = found;
  }
  return current;
};

// Helper function to find an item by ID
const findItemById = (item, id) => {
  if (item.id === id) return item;
  if (item.type === 'folder' && item.children) {
    for (const child of item.children) {
      const found = findItemById(child, id);
      if (found) return found;
    }
  }
  return null;
};

export function useVFS() {
  const [vfs, setVfs] = useState(initialVFS);

  // Get item by ID
  const getItem = useCallback((id) => {
    return findItemById(vfs, id);
  }, [vfs]);

  // Navigate path string (e.g. "C:\My Portfolio\Skills") and return folder or null
  const getFolderByPath = useCallback((pathString) => {
    if (pathString === 'C:' || pathString === 'C:\\') return vfs;
    const cleanPath = pathString.replace(/^C:\\?/, '');
    const parts = cleanPath.split('\\').filter(Boolean);
    return findFolderByPath(vfs, parts);
  }, [vfs]);

  // Create folder
  const createFolder = useCallback((parentPath, name) => {
    setVfs(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const folder = findFolderByPath(copy, parentPath === 'C:' ? [] : parentPath.replace(/^C:\\?/, '').split('\\').filter(Boolean));
      if (folder && folder.type === 'folder') {
        const id = 'folder-' + Date.now();
        // Avoid duplicate names
        let uniqueName = name;
        let count = 1;
        while (folder.children.some(c => c.name.toLowerCase() === uniqueName.toLowerCase())) {
          uniqueName = `${name} (${count})`;
          count++;
        }
        folder.children.push({
          id,
          name: uniqueName,
          type: 'folder',
          children: []
        });
      }
      return copy;
    });
  }, []);

  // Create file
  const createFile = useCallback((parentPath, name, content = '') => {
    setVfs(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const folder = findFolderByPath(copy, parentPath === 'C:' ? [] : parentPath.replace(/^C:\\?/, '').split('\\').filter(Boolean));
      if (folder && folder.type === 'folder') {
        const id = 'file-' + Date.now();
        let uniqueName = name;
        let count = 1;
        while (folder.children.some(c => c.name.toLowerCase() === uniqueName.toLowerCase())) {
          const nameWithoutExt = name.substring(0, name.lastIndexOf('.')) || name;
          const ext = name.substring(name.lastIndexOf('.')) || '';
          uniqueName = `${nameWithoutExt} (${count})${ext}`;
          count++;
        }
        folder.children.push({
          id,
          name: uniqueName,
          type: 'file',
          content
        });
      }
      return copy;
    });
  }, []);

  // Rename item
  const renameItem = useCallback((itemId, newName) => {
    setVfs(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const item = findItemById(copy, itemId);
      if (item && item.id !== 'root') {
        item.name = newName;
      }
      return copy;
    });
  }, []);

  // Update file content
  const updateFileContent = useCallback((fileId, content) => {
    setVfs(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const item = findItemById(copy, fileId);
      if (item && item.type === 'file') {
        item.content = content;
      }
      return copy;
    });
  }, []);

  // Delete item
  const deleteItem = useCallback((itemId) => {
    if (itemId === 'root') return;
    setVfs(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      // Find parent of the target node and remove it
      const removeNode = (parent) => {
        if (parent.type === 'folder' && parent.children) {
          const index = parent.children.findIndex(c => c.id === itemId);
          if (index !== -1) {
            parent.children.splice(index, 1);
            return true;
          }
          for (const child of parent.children) {
            if (removeNode(child)) return true;
          }
        }
        return false;
      };
      removeNode(copy);
      return copy;
    });
  }, []);

  return {
    vfs,
    getItem,
    getFolderByPath,
    createFolder,
    createFile,
    renameItem,
    updateFileContent,
    deleteItem
  };
}
