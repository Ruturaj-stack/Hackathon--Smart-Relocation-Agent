import http from 'http';
import url from 'url';
import neighborhoodsHandler from './api/neighborhoods.ts';
import searchHandler from './api/search.ts';
import osmHandler from './api/osm.ts';

// Helper to simulate VercelRequest and VercelResponse on Node http.IncomingMessage / http.ServerResponse
function runHandler(handler: any, req: http.IncomingMessage, res: http.ServerResponse) {
  // Parse query
  const parsedUrl = url.parse(req.url || '', true);
  (req as any).query = parsedUrl.query;

  // Add response helpers
  (res as any).status = (statusCode: number) => {
    res.statusCode = statusCode;
    return res;
  };
  (res as any).json = (data: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return res;
  };

  // Parse body for POST requests
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        (req as any).body = body ? JSON.parse(body) : {};
      } catch (e) {
        (req as any).body = body;
      }
      try {
        await handler(req, res);
      } catch (err: any) {
        console.error("Local dev server function error:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
      }
    });
  } else {
    (req as any).body = {};
    Promise.resolve().then(async () => {
      try {
        await handler(req, res);
      } catch (err: any) {
        console.error("Local dev server function error:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
      }
    });
  }
}

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url || '', true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/neighborhoods') {
    runHandler(neighborhoodsHandler, req, res);
  } else if (pathname === '/api/search') {
    runHandler(searchHandler, req, res);
  } else if (pathname === '/api/osm') {
    runHandler(osmHandler, req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`📡 Local API Server running on http://localhost:${PORT}`);
});
