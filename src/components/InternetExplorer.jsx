import React, { useState, useEffect, useRef } from 'react';
import { FolderIcon, FileIcon } from './Explorer';

// Cute Retro Rover Dog SVG
const RoverDogSvg = ({ state }) => {
  const isSniffing = state === 'searching';
  return (
    <svg width="70" height="70" viewBox="0 0 100 100" fill="none" className={isSniffing ? 'rover-sniff-anim' : 'rover-idle-anim'}>
      {/* Body */}
      <ellipse cx="48" cy="65" rx="25" ry="18" fill="#F3B329" stroke="#B87B00" strokeWidth="2" />
      {/* Back foot */}
      <circle cx="32" cy="80" r="7" fill="#D29613" stroke="#B87B00" strokeWidth="2" />
      {/* Front foot */}
      <circle cx="58" cy="81" r="7" fill="#F3B329" stroke="#B87B00" strokeWidth="2" />
      {/* Tail */}
      <path d="M26 60 Q15 50 12 58 Q14 65 24 64" fill="#F3B329" stroke="#B87B00" strokeWidth="2" className={isSniffing ? 'tail-wag-fast' : 'tail-wag'} />
      {/* Head */}
      <circle cx="68" cy="45" r="16" fill="#F3B329" stroke="#B87B00" strokeWidth="2" />
      {/* Ears */}
      <path d="M58 35 Q50 48 55 52 Q62 50 64 42" fill="#AF7001" stroke="#B87B00" strokeWidth="2" />
      <path d="M78 35 Q86 48 81 52 Q74 50 72 42" fill="#F3B329" stroke="#B87B00" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="65" cy="41" r="2.5" fill="#000" />
      <circle cx="75" cy="41" r="2.5" fill="#000" />
      {/* Snout */}
      <ellipse cx="74" cy="48" rx="6" ry="4" fill="#FCE088" />
      <circle cx="77" cy="47" r="2" fill="#000" />
      {/* Collar */}
      <rect x="58" y="55" width="16" height="4" rx="2" fill="#E84A2A" />
      <circle cx="66" cy="60" r="2" fill="#F9D71C" />
    </svg>
  );
};

const TrophyIconSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F1C40F" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M19 2h-4v2h4v7c0 2.206-1.794 4-4 4H9c-2.206 0-4-1.794-4-4V4h4V2H5c-2.757 0-5 2.243-5 5v3c0 2.414 1.721 4.434 4 4.899V18c0 2.206 1.794 4 4 4h8c2.206 0 4-1.794 4-4v-3.101c2.279-.465 4-2.485 4-4.899V7c0-2.757-2.243-5-5-5zm-11 2v9c0 1.103.897 2 2 2h4c1.103 0 2-.897 2-2V4H8z"/>
  </svg>
);

const GithubIconSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const StarIconSvg = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#F1C40F" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
  </svg>
);

const GlobeIconSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ComputerIconSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

// Parse DuckDuckGo HTML page into structured results
function parseDuckDuckGoHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const results = [];

  doc.querySelectorAll('.web-result, .results_links_deep, .result').forEach(el => {
    const titleEl = el.querySelector('.result__a');
    const snippetEl = el.querySelector('.result__snippet');
    const urlEl = el.querySelector('.result__url');

    if (!titleEl) return;

    // Decode the real destination URL from DuckDuckGo's redirect param
    let rawHref = titleEl.getAttribute('href') || '';
    let realUrl = rawHref;
    if (rawHref.includes('uddg=')) {
      try {
        const match = rawHref.match(/[?&]uddg=([^&]+)/);
        if (match && match[1]) realUrl = decodeURIComponent(match[1]);
      } catch (e) { /* keep rawHref */ }
    }
    if (realUrl.startsWith('//')) realUrl = 'https:' + realUrl;
    else if (!/^https?:\/\//i.test(realUrl) && realUrl.length > 0) realUrl = 'https://' + realUrl;

    const title = titleEl.textContent?.trim() || '';
    const snippet = snippetEl?.textContent?.trim() || '';
    const displayUrl = urlEl?.textContent?.trim() || realUrl;

    if (title && realUrl && !results.some(r => r.url === realUrl)) {
      results.push({ title, url: realUrl, snippet, displayUrl, source: 'web' });
    }
  });

  return results;
}

// Fallback search: DDG Instant Answer + Wikipedia (both CORS-native, no proxy needed)
async function fetchFallbackSearch(query) {
  const results = [];

  // DuckDuckGo Instant Answer API – CORS-native
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const ddgData = await fetch(ddgUrl).then(r => r.json());

    if (ddgData.AbstractText && ddgData.AbstractURL) {
      results.push({
        title: ddgData.Heading || query,
        url: ddgData.AbstractURL,
        snippet: ddgData.AbstractText,
        displayUrl: ddgData.AbstractURL,
        source: 'ddg'
      });
    }
    (ddgData.RelatedTopics || [])
      .filter(t => t.FirstURL && t.Text)
      .slice(0, 5)
      .forEach(t => {
        if (!results.some(r => r.url === t.FirstURL)) {
          results.push({ title: t.Text.split(' - ')[0] || t.Text, url: t.FirstURL, snippet: t.Text, displayUrl: t.FirstURL, source: 'ddg' });
        }
      });
  } catch (e) { console.warn('DDG Instant Answer failed:', e); }

  // Wikipedia Search API – CORS-native
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=8`;
    const wikiData = await fetch(wikiUrl).then(r => r.json());
    (wikiData?.query?.search || []).forEach(item => {
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`;
      if (!results.some(r => r.url === pageUrl)) {
        results.push({
          title: item.title,
          url: pageUrl,
          snippet: item.snippet.replace(/<[^>]+>/g, '') + '...',
          displayUrl: `en.wikipedia.org/wiki/${item.title.replace(/ /g, '_')}`,
          source: 'wikipedia'
        });
      }
    });
  } catch (e) { console.warn('Wikipedia Search failed:', e); }

  return results;
}

// Web search: DDG Instant Answer + Wikipedia OpenSearch (both CORS-native, work on any host)
// DuckDuckGo blocks server-side scraping from cloud IPs so we use client-side APIs directly.
async function fetchFullWebSearch(query) {
  const results = [];

  // ── DuckDuckGo Instant Answer API ─────────────────────────────────────────
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const ddgData = await fetch(ddgUrl).then(r => r.json());

    if (ddgData.AbstractText && ddgData.AbstractURL) {
      results.push({
        title: ddgData.Heading || query,
        url: ddgData.AbstractURL,
        snippet: ddgData.AbstractText,
        displayUrl: ddgData.AbstractURL,
        source: 'web'
      });
    }
    (ddgData.RelatedTopics || [])
      .filter(t => t.FirstURL && t.Text)
      .slice(0, 6)
      .forEach(t => {
        if (!results.some(r => r.url === t.FirstURL)) {
          results.push({
            title: t.Text.split(' - ')[0] || t.Text,
            url: t.FirstURL,
            snippet: t.Text,
            displayUrl: t.FirstURL,
            source: 'web'
          });
        }
      });
  } catch (e) { console.warn('DDG Instant Answer failed:', e); }

  // ── Wikipedia full-text search ────────────────────────────────────────────
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=10&srprop=snippet`;
    const wikiData = await fetch(wikiUrl).then(r => r.json());
    (wikiData?.query?.search || []).forEach(item => {
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`;
      if (!results.some(r => r.url === pageUrl)) {
        results.push({
          title: item.title,
          url: pageUrl,
          snippet: item.snippet.replace(/<[^>]+>/g, '') + '...',
          displayUrl: `en.wikipedia.org/wiki/${item.title.replace(/ /g, '_')}`,
          source: 'web'
        });
      }
    });
  } catch (e) { console.warn('Wikipedia search failed:', e); }

  return { results, engine: 'Web Search' };
}

// Build a proxy src URL — the iframe loads this directly so the browser
// renders the real page natively (CSS, images, scripts all work).
function proxyUrl(targetUrl) {
  return `/api/fetch?url=${encodeURIComponent(targetUrl)}`;
}

export default function InternetExplorer({
  vfs,
  onOpenFile,
  onNavigateToFolder,
  onOpenApp
}) {
  // Navigation history state
  const [url, setUrl] = useState('http://www.google.com');
  const [history, setHistory] = useState(['http://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [inputUrl, setInputUrl] = useState('http://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  
  // Proxy iframe src — points at /api/fetch?url=... so the browser loads the real page
  const [iframeSrc, setIframeSrc] = useState('');

  // Search companion sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roverState, setRoverState] = useState('idle');
  const [roverSpeech, setRoverSpeech] = useState("Hi! I'm Rover, your Search Companion. I can help you search files on this computer or lookup things on the internet!");
  const [searchMode, setSearchMode] = useState('menu'); // menu, files, web
  const [localQuery, setLocalQuery] = useState('');
  const [localResults, setLocalResults] = useState([]);

  // Live web search state
  const [webQuery, setWebQuery] = useState('');
  const [webResults, setWebResults] = useState(null); // { query: '', results: [] }
  const [webLoading, setWebLoading] = useState(false);

  // Sync address bar input with URL state changes
  useEffect(() => {
    setInputUrl(url);
  }, [url]);

  // Listen for external 'Open in IE' requests from portfolio components
  useEffect(() => {
    const handler = (e) => {
      const targetUrl = e.detail?.url;
      if (targetUrl) navigateTo(targetUrl);
    };
    window.addEventListener('ie-load-url', handler);
    return () => window.removeEventListener('ie-load-url', handler);
  }, []);

  // Load a page: point the iframe at the proxy URL directly
  function fetchExternalPage(targetUrl) {
    setIsLoading(true);
    // Point the iframe directly at our proxy — browser renders it natively
    setIframeSrc(proxyUrl(targetUrl));
    // Give the iframe a moment to start loading, then hide the spinner
    setTimeout(() => setIsLoading(false), 800);
  }

  // No postMessage listener needed — iframe navigates itself via the proxy src

  // Fetch page if url updates to external
  useEffect(() => {
    if (isExternalUrl(url)) {
      fetchExternalPage(url);
    }
  }, [url]);

  // Navigate to a new URL
  function navigateTo(targetUrl) {
    // Normalize URL
    let cleanUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl) && cleanUrl.length > 0) {
      const hasSpaces = cleanUrl.includes(' ');
      const hasDot = cleanUrl.includes('.');
      if (hasSpaces || !hasDot) {
        handleWebSearchSubmit(cleanUrl);
        return;
      }
      cleanUrl = 'http://' + cleanUrl;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUrl(cleanUrl);

      // Update history
      setHistory(prev => {
        const nextHist = prev.slice(0, historyIndex + 1);
        nextHist.push(cleanUrl);
        setHistoryIndex(nextHist.length - 1);
        return nextHist;
      });
    }, 400);
  }

  const handleGo = () => {
    navigateTo(inputUrl);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setUrl(history[idx]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setUrl(history[idx]);
    }
  };

  const handleHome = () => {
    navigateTo('http://www.google.com');
  };

  const handleRefresh = () => {
    if (isExternalUrl(url)) {
      fetchExternalPage(url);
    } else {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  function isExternalUrl(checkUrl) {
    const clean = checkUrl.toLowerCase();
    // Only the simulated Google homepage and search results are rendered as custom React pages
    // Every other URL (including entisejustice.dev, github.com, wikipedia.org, etc.)
    // gets fetched as a real website via the local CORS proxy
    if (clean === 'about:blank') return false;
    if (clean.includes('google.com') && !clean.includes('/search')) return false; // Google homepage → custom page
    if (clean.includes('google.com') && clean.includes('/search')) return false;  // Google results → custom page
    return true; // everything else: fetch it for real
  }

  // Perform local recursive VFS search
  const performLocalSearch = (item, q, path = 'C:') => {
    let list = [];
    const nameMatch = item.name.toLowerCase().includes(q.toLowerCase());
    const contentMatch = item.type === 'file' && item.content.toLowerCase().includes(q.toLowerCase());

    if (item.id !== 'root' && (nameMatch || contentMatch)) {
      list.push({
        id: item.id,
        name: item.name,
        type: item.type,
        path: path
      });
    }

    if (item.type === 'folder' && item.children) {
      item.children.forEach(child => {
        const nextPath = path === 'C:' ? `C:\\${item.name}` : `${path}\\${item.name}`;
        list = [...list, ...performLocalSearch(child, q, nextPath)];
      });
    }

    return list;
  };

  const handleLocalSubmit = () => {
    if (!localQuery.trim()) {
      setRoverSpeech("Please type a file name or search term first!");
      return;
    }
    setRoverState('searching');
    setRoverSpeech("Searching local directories...");
    setTimeout(() => {
      let results = [];
      vfs.children.forEach(child => {
        results = [...results, ...performLocalSearch(child, localQuery, 'C:')];
      });
      setLocalResults(results);
      setRoverState('idle');
      if (results.length > 0) {
        setRoverSpeech(`Woof! I found ${results.length} matching file(s) on your computer.`);
      } else {
        setRoverSpeech("I couldn't find any matching files. Try another spelling!");
      }
    }, 800);
  };

  // Live web search using DDG Instant Answer + Wikipedia (both CORS-native)
  function handleWebSearchSubmit(queryStr) {
    const q = queryStr || webQuery;
    if (!q.trim()) return;

    setWebQuery(q);
    setWebLoading(true);
    setRoverState('searching');
    setRoverSpeech(`Sniffing the internet for "${q}"...`);

    // Show the search results page URL
    const searchUrl = `http://www.google.com/search?q=${encodeURIComponent(q)}`;
    setUrl(searchUrl);
    setHistory(prev => {
      const nextHist = prev.slice(0, historyIndex + 1);
      nextHist.push(searchUrl);
      setHistoryIndex(nextHist.length - 1);
      return nextHist;
    });

    fetchFullWebSearch(q)
      .then(({ results, engine }) => {
        setWebResults({ query: q, results, engine });
        setWebLoading(false);
        setRoverState('idle');
        if (results.length > 0) {
          setRoverSpeech(`Woof! Found ${results.length} results for "${q}" via ${engine}!`);
        } else {
          setRoverSpeech(`Couldn't find anything for "${q}". Try a different term!`);
        }
      })
      .catch(err => {
        console.error(err);
        setWebResults({ query: q, results: [], engine: '' });
        setWebLoading(false);
        setRoverState('idle');
        setRoverSpeech('Oops, something went wrong. Please try again.');
      });
  }

  const handleSuggestionClick = (keyword) => {
    setWebQuery(keyword);
    handleWebSearchSubmit(keyword);
  };

  return (
    <div className="xp-ie-container">
      {/* Top Menu Bar */}
      <div className="xp-ie-menubar">
        <span className="menubar-item">File</span>
        <span className="menubar-item">Edit</span>
        <span className="menubar-item">View</span>
        <span className="menubar-item">Favorites</span>
        <span className="menubar-item">Tools</span>
        <span className="menubar-item">Help</span>
      </div>

      {/* Navigation Toolbar */}
      <div className="xp-ie-toolbar">
        <button className="toolbar-btn" onClick={handleBack} disabled={historyIndex === 0}>
          <div className="btn-circle back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <span>Back</span>
        </button>
        <button className="toolbar-btn" onClick={handleForward} disabled={historyIndex === history.length - 1}>
          <div className="btn-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <span>Forward</span>
        </button>
        <button className="toolbar-btn" onClick={() => setIsLoading(false)}>
          <div className="btn-circle stop">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <span>Stop</span>
        </button>
        <button className="toolbar-btn" onClick={handleRefresh}>
          <div className="btn-circle refresh">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
          </div>
          <span>Refresh</span>
        </button>
        <button className="toolbar-btn" onClick={handleHome}>
          <div className="btn-circle home">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span>Home</span>
        </button>
        <div className="toolbar-divider" />
        <button className={`toolbar-btn ${isSidebarOpen ? 'active-btn' : ''}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <div className="btn-circle search">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <span>Search</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="xp-ie-addressbar">
        <span className="address-label">Address</span>
        <div className="address-input-wrapper">
          <input
            type="text"
            className="address-input"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGo()}
          />
          <button className="address-go-btn" onClick={handleGo}>Go</button>
        </div>
      </div>

      {/* Browser Main Window Area */}
      <div className="xp-ie-main">
        {/* Rover Search Sidebar */}
        {isSidebarOpen && (
          <div className="xp-ie-sidebar border-3d">
            <div className="rover-bubble-container">
              <div className="rover-speech-bubble">
                {roverSpeech}
              </div>
              <div className="rover-speech-arrow"></div>
              <div className="rover-dog-wrapper">
                <RoverDogSvg state={roverState} />
              </div>
            </div>

            {searchMode === 'menu' && (
              <div className="rover-search-options">
                <div className="sidebar-title">What do you want to search?</div>
                <button className="rover-menu-btn" onClick={() => setSearchMode('web')}><GlobeIconSvg /> Search the Internet</button>
                <button className="rover-menu-btn" onClick={() => setSearchMode('files')}><ComputerIconSvg /> Search files on this PC</button>
              </div>
            )}

            {searchMode === 'files' && (
              <div className="rover-search-form">
                <div className="sidebar-title">Search for files:</div>
                <input
                  type="text"
                  className="rover-input"
                  placeholder="e.g. Skills, Project..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocalSubmit()}
                />
                <div className="rover-form-actions">
                  <button className="xp-btn" onClick={handleLocalSubmit}>Search</button>
                  <button className="xp-btn" onClick={() => { setSearchMode('menu'); setLocalResults([]); }}>Back</button>
                </div>

                {localResults.length > 0 && (
                  <div className="local-results-list">
                    <div className="results-subheading">Results:</div>
                    {localResults.map(item => (
                      <div
                        key={item.id}
                        className="local-result-item"
                        onDoubleClick={() => {
                          if (item.type === 'file') onOpenFile(item.id, item.name);
                          else onNavigateToFolder(item.path + '\\' + item.name);
                        }}
                      >
                        {item.type === 'folder' ? <FolderIcon size={16} /> : <FileIcon size={16} />}
                        <span className="result-name-text">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {searchMode === 'web' && (
              <div className="rover-search-form">
                <div className="sidebar-title">Search the Internet:</div>
                <input
                  type="text"
                  className="rover-input"
                  placeholder="Query..."
                  value={webQuery}
                  onChange={(e) => setWebQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleWebSearchSubmit()}
                />
                <div className="rover-form-actions">
                  <button className="xp-btn" onClick={() => handleWebSearchSubmit()}>Search</button>
                  <button className="xp-btn" onClick={() => setSearchMode('menu')}>Back</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Viewport Content */}
        <div className="xp-ie-viewport border-3d">
          {isLoading ? (
            <div className="ie-loading-screen">
              <div className="flashlight-animation" style={{ animation: 'xp-search-spin 1s linear infinite' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#225381" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="6" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px' }}>Loading page...</div>
            </div>
          ) : (
            <>
              {/* GOOGLE PAGE */}
              {(url.includes('google.com') && !url.includes('/search')) && (
                <div className="viewport-page google-home">
                  <div className="google-logo-wrapper">
                    <span className="g-blue">G</span>
                    <span className="g-red">o</span>
                    <span className="g-yellow">o</span>
                    <span className="g-blue">g</span>
                    <span className="g-green">l</span>
                    <span className="g-red">e</span>
                  </div>
                  <div className="google-search-form-sim">
                    <input
                      type="text"
                      className="google-input-sim"
                      value={webQuery}
                      onChange={(e) => setWebQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleWebSearchSubmit()}
                      placeholder="Search the actual web..."
                      autoFocus
                    />
                    <div className="google-buttons-row">
                      <button className="google-btn-sim" onClick={() => handleWebSearchSubmit()}>Google Search</button>
                      <button className="google-btn-sim" onClick={() => handleSuggestionClick('Meta Frontend Certificate')}>I'm Feeling Lucky</button>
                    </div>
                  </div>
                  <div className="google-suggestions-sim">
                    Search suggestions: 
                    <span className="suggestion-tag" onClick={() => handleSuggestionClick('React 19')}>React 19</span>
                    <span className="suggestion-tag" onClick={() => handleSuggestionClick('AWS Solutions Architect')}>AWS Solutions</span>
                    <span className="suggestion-tag" onClick={() => handleSuggestionClick('B.Tech Ghana GCTU')}>GCTU B.Tech</span>
                  </div>
                </div>
              )}

              {/* GOOGLE SEARCH RESULTS PAGE (Live Web Search!) */}
              {(url.includes('google.com') && url.includes('/search')) && (
                <div className="viewport-page google-results">
                  <div className="results-top-bar">
                    <div className="google-logo-small" onClick={handleHome}>
                      <span className="g-blue">G</span>
                      <span className="g-red">o</span>
                      <span className="g-yellow">o</span>
                      <span className="g-blue">g</span>
                      <span className="g-green">l</span>
                      <span className="g-red">e</span>
                    </div>
                    <div className="results-search-box">
                      <input
                        type="text"
                        className="google-input-small"
                        value={webQuery}
                        onChange={(e) => setWebQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleWebSearchSubmit()}
                      />
                      <button className="google-small-btn" onClick={() => handleWebSearchSubmit()}>Search</button>
                    </div>
                  </div>

                  <div className="results-content-area">
                    <div className="results-stats">
                      Live web results for <strong>"{webResults?.query}"</strong>
                      {webResults?.engine && <span style={{ marginLeft: 6, color: '#888', fontStyle: 'italic' }}>via {webResults.engine}</span>}
                    </div>

                    {webLoading ? (
                      <div className="results-loading">Searching the web...</div>
                    ) : (
                      <div className="results-list-main">
                        <div className="links-results-list">
                          {webResults?.results && webResults.results.length > 0 ? (
                            webResults.results.map((result, index) => (
                              <div key={index} className="web-result-item">
                                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(result.url); }} className="web-title-link">
                                  {result.title}
                                </a>
                                <div className="web-url-green">
                                  {result.displayUrl || result.url}
                                  <span style={{ marginLeft: 6, fontSize: '10px', color: '#888', background: '#f0f0f0', padding: '1px 5px', borderRadius: 3, fontStyle: 'normal' }}>
                                    {result.source === 'wikipedia' ? 'Wikipedia' : result.source === 'web' ? 'Web' : 'DDG'}
                                  </span>
                                </div>
                                <p className="web-snippet">{result.snippet}</p>
                              </div>
                            ))
                          ) : (
                            <div className="no-web-results">
                              <h3>No web results found.</h3>
                              <p>Try searching for broader terms or check your spelling.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* REAL WEBSITE — iframe src points at /api/fetch?url=... */}
              {isExternalUrl(url) && iframeSrc && (
                <iframe
                  key={iframeSrc}
                  title="Internet Explorer Browser Viewport"
                  src={iframeSrc}
                  style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#ffffff' }}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
