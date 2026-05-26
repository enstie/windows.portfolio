import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom Vite plugin: a local CORS proxy that fetches any URL server-side
const localCorsProxy = {
  name: 'local-cors-proxy',
  configureServer(server) {
    server.middlewares.use('/api/fetch', async (req, res) => {
      const rawQuery = req.url.split('?').slice(1).join('?');
      const params = new URLSearchParams(rawQuery);
      const targetUrl = params.get('url');

      if (!targetUrl) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing url parameter' }));
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(targetUrl, {
          signal: controller.signal,
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'identity',
            'Cache-Control': 'no-cache',
          },
        });
        clearTimeout(timeout);

        const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';
        const body = await response.text();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', contentType);
        res.statusCode = response.status;
        res.end(body);
      } catch (err) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ error: err.message, url: targetUrl }));
      }
    });
  }
};

export default defineConfig({
  plugins: [
    react({
      // Babel fast-refresh only in dev — skips full component transforms in prod
      babel: { plugins: [] }
    }),
    localCorsProxy
  ],

  server: {
    proxy: {
      '/api/search': {
        target: 'https://html.duckduckgo.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          const url = new URL('http://localhost' + path);
          return '/html/?' + url.searchParams.toString();
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
            proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
            proxyReq.setHeader('Referer', 'https://duckduckgo.com/');
            proxyReq.setHeader('Cache-Control', 'no-cache');
          });
        }
      }
    }
  },

  build: {
    // Use Vite's built-in oxc minifier (esbuild not installed separately in this version)
    minify: true,
    target: 'es2020',
    // Don't inline assets below this size — keep icons as separate cacheable files
    assetsInlineLimit: 0,
    // Suppress "chunk size" warnings; we split manually anyway
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting: React core, each heavy app component, vendor libs
        manualChunks(id) {
          // React + ReactDOM → tiny, always-needed core chunk
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Scheduler (react-dom dep)
          if (id.includes('node_modules/scheduler')) {
            return 'react-core';
          }
          // Each large portfolio component gets its own lazy chunk
          if (id.includes('ResumeViewer'))         return 'app-resume';
          if (id.includes('ProjectGallery'))        return 'app-projects';
          if (id.includes('TerminalBio'))           return 'app-terminal';
          if (id.includes('CertificatesAndGitHub')) return 'app-certs';
          if (id.includes('InternetExplorer'))      return 'app-browser';
          if (id.includes('SaaSControl'))           return 'app-saas';
          if (id.includes('Minesweeper'))           return 'app-games';
          if (id.includes('MediaPlayer'))           return 'app-media';
          if (id.includes('ControlPanel'))          return 'app-controlpanel';
          // Everything else in node_modules → vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },

  // Pre-bundle these so dev startup is instant on repeat runs
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
