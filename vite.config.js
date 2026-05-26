import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom Vite plugin: a local CORS proxy that fetches any URL server-side
// This means ANY website can be loaded inside the browser without CORS errors
const localCorsProxy = {
  name: 'local-cors-proxy',
  configureServer(server) {
    server.middlewares.use('/api/fetch', async (req, res) => {
      // Parse the target URL from query string: /api/fetch?url=https://...
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
        const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const response = await fetch(targetUrl, {
          signal: controller.signal,
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'identity', // avoid compressed responses
            'Cache-Control': 'no-cache',
          },
        });
        clearTimeout(timeout);

        const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';
        const body = await response.text();

        // Allow the browser to read the response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', contentType);
        res.statusCode = response.status;
        res.end(body);
      } catch (err) {
        console.error('[cors-proxy] Failed to fetch:', targetUrl, err.message);
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ error: err.message, url: targetUrl }));
      }
    });
  }
};

export default defineConfig({
  plugins: [react(), localCorsProxy],
  server: {
    proxy: {
      // Proxy DuckDuckGo HTML search — adds real browser headers to bypass bot detection
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
  }
})
