export default async function handler(req, res) {
  // Allow CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Missing q parameter' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    // Forward to DuckDuckGo HTML search — same as the Vite proxy rewrite
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(ddgUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://duckduckgo.com/',
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timeout);

    const body = await response.text();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
