export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: 'Missing url parameter' });

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
    let body = await response.text();

    // For HTML pages, inject a <base> tag so all relative URLs (CSS, images, scripts, links)
    // resolve against the ORIGINAL domain rather than our Vercel domain.
    // Also inject a small script that rewrites absolute-path links (/foo → https://origin/foo)
    // so clicking links inside the iframe proxies them through us correctly.
    if (contentType.includes('text/html')) {
      const finalUrl = response.url || targetUrl; // follow redirects
      const origin = new URL(finalUrl).origin;   // e.g. https://en.wikipedia.org

      const baseTag = `<base href="${origin}/">`;

      // Small script: intercept clicks so navigation stays inside the proxy
      const interceptScript = `<script>
(function(){
  var ORIGIN = ${JSON.stringify(origin)};
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(!a || !a.href) return;
    var href = a.href;
    if(href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) return;
    e.preventDefault();
    // Turn any link into a proxy URL and navigate the iframe to it
    var proxyHref = '/api/fetch?url=' + encodeURIComponent(href);
    window.location.href = proxyHref;
  }, true);
})();
</script>`;

      // Inject base tag right after <head>
      if (/<head[\s>]/i.test(body)) {
        body = body.replace(/(<head[^>]*>)/i, `$1${baseTag}`);
      } else {
        body = baseTag + body;
      }

      // Inject click interceptor before </body>
      if (/<\/body>/i.test(body)) {
        body = body.replace(/<\/body>/i, `${interceptScript}</body>`);
      } else {
        body += interceptScript;
      }
    }

    // Only forward Content-Type — intentionally drop X-Frame-Options and
    // Content-Security-Policy so the browser allows iframe embedding.
    res.setHeader('Content-Type', contentType);
    return res.status(200).send(body);
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return res.status(502).json({
      error: isTimeout ? 'Request timed out after 12 seconds' : err.message,
      url: targetUrl
    });
  }
}
