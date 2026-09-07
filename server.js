// Servidor plano en Node.js puro (sin dependencias) que sirve index.html
// y expone un CRUD básico sobre el historial de rutinas completadas.
// Cada semana finalizada se guarda como un documento JSON individual
// en data/historial/<id>.json.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data', 'historial');

fs.mkdirSync(DATA_DIR, { recursive: true });

function sendJSON(res, status, data) {
  const body = data === null ? '' : JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy(new Error('body demasiado grande'));
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

function isValidId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9-]+$/.test(id);
}

function docPath(id) {
  return path.join(DATA_DIR, `${id}.json`);
}

function listHistorial() {
  return fs.readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')))
    .sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
}

async function handleApi(req, res, pathname) {
  const parts = pathname.split('/').filter(Boolean); // ["api", "historial", ":id"?]
  const id = parts[2];

  if (req.method === 'GET' && parts.length === 2) {
    return sendJSON(res, 200, listHistorial());
  }

  if (req.method === 'GET' && parts.length === 3) {
    if (!isValidId(id) || !fs.existsSync(docPath(id))) {
      return sendJSON(res, 404, { error: 'no encontrado' });
    }
    return sendJSON(res, 200, JSON.parse(fs.readFileSync(docPath(id), 'utf8')));
  }

  if (req.method === 'POST' && parts.length === 2) {
    const body = JSON.parse((await readBody(req)) || '{}');
    const doc = {
      id: crypto.randomUUID(),
      weekStart: body.weekStart,
      weekEnd: body.weekEnd,
      routineKey: body.routineKey,
      routineLabel: body.routineLabel,
      completed: body.completed,
      total: body.total
    };
    fs.writeFileSync(docPath(doc.id), JSON.stringify(doc, null, 2));
    return sendJSON(res, 201, doc);
  }

  if (req.method === 'PUT' && parts.length === 3) {
    if (!isValidId(id) || !fs.existsSync(docPath(id))) {
      return sendJSON(res, 404, { error: 'no encontrado' });
    }
    const existing = JSON.parse(fs.readFileSync(docPath(id), 'utf8'));
    const body = JSON.parse((await readBody(req)) || '{}');
    const updated = { ...existing, ...body, id };
    fs.writeFileSync(docPath(id), JSON.stringify(updated, null, 2));
    return sendJSON(res, 200, updated);
  }

  if (req.method === 'DELETE' && parts.length === 3) {
    if (!isValidId(id) || !fs.existsSync(docPath(id))) {
      return sendJSON(res, 404, { error: 'no encontrado' });
    }
    fs.unlinkSync(docPath(id));
    return sendJSON(res, 200, { ok: true });
  }

  return sendJSON(res, 404, { error: 'ruta no encontrada' });
}

function serveIndex(res) {
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error leyendo index.html');
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (pathname.startsWith('/api/historial')) {
      await handleApi(req, res, pathname);
    } else if (pathname === '/' || pathname === '/index.html') {
      serveIndex(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('No encontrado');
    }
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: 'error interno' });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
