// Servidor plano en Node.js puro (sin dependencias) que sirve index.html
// y expone un CRUD básico sobre dos colecciones: el historial de rutinas
// completadas y las rutinas mismas. Cada documento se guarda como un
// archivo JSON individual en data/<coleccion>/<id>.json.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const DATA_ROOT = path.join(__dirname, 'data');

function isValidId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9-]+$/.test(id);
}

function makeStore(name, sortFn) {
  const dir = path.join(DATA_ROOT, name);
  fs.mkdirSync(dir, { recursive: true });
  const docPath = (id) => path.join(dir, `${id}.json`);

  return {
    list() {
      const docs = fs.readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
      return sortFn ? docs.sort(sortFn) : docs;
    },
    get(id) {
      if (!isValidId(id) || !fs.existsSync(docPath(id))) return null;
      return JSON.parse(fs.readFileSync(docPath(id), 'utf8'));
    },
    create(id, data) {
      const doc = { ...data, id };
      fs.writeFileSync(docPath(id), JSON.stringify(doc, null, 2));
      return doc;
    },
    update(id, patch) {
      const existing = this.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...patch, id };
      fs.writeFileSync(docPath(id), JSON.stringify(updated, null, 2));
      return updated;
    },
    remove(id) {
      if (!isValidId(id) || !fs.existsSync(docPath(id))) return false;
      fs.unlinkSync(docPath(id));
      return true;
    }
  };
}

const historialStore = makeStore('historial', (a, b) => new Date(b.weekStart) - new Date(a.weekStart));
const rutinasStore = makeStore('rutinas');
const ejerciciosStore = makeStore('ejercicios');

const DEFAULT_ROUTINE = {
  label: 'Mi rutina',
  days: [
    { day: 'Lunes', groups: ['Pecho', 'Bíceps'] },
    { day: 'Martes', groups: ['Cuádriceps', 'Pantorrilla'] },
    { day: 'Miércoles', groups: ['Espalda', 'Hombro', 'Tríceps'] },
    { day: 'Jueves', groups: ['Isquios', 'Glúteo', 'Pantorrilla'] },
    { day: 'Viernes', groups: ['Pecho', 'Bíceps', 'Tríceps'] },
    { day: 'Sábado', groups: [] },
    { day: 'Domingo', groups: [] }
  ]
};

// Catálogo de ejercicios de arranque, uno por grupo muscular de la rutina
// original. Vive en la base de datos (no hardcodeado en el frontend) para
// que se puedan agregar ejercicios propios desde la interfaz.
const DEFAULT_EXERCISES = {
  'Pecho': ['Press de banca plano', 'Press inclinado con mancuerna', 'Aperturas con mancuerna', 'Fondos en paralelas'],
  'Bíceps': ['Curl con barra', 'Curl martillo', 'Curl concentrado', 'Curl en banco Scott'],
  'Espalda': ['Dominadas (o jalón al pecho)', 'Remo con barra', 'Remo en polea baja', 'Jalón al pecho agarre ancho'],
  'Hombro': ['Press militar', 'Elevaciones laterales', 'Pájaros (deltoide posterior)', 'Press Arnold'],
  'Tríceps': ['Press francés', 'Extensión en polea (cuerda)', 'Fondos en banco', 'Press cerrado'],
  'Cuádriceps': ['Sentadilla', 'Prensa de piernas', 'Extensión de cuádriceps', 'Sentadilla búlgara'],
  'Isquios': ['Peso muerto rumano', 'Curl femoral acostado', 'Curl femoral sentado', 'Buenos días'],
  'Glúteo': ['Hip thrust', 'Puente de glúteo', 'Patada de glúteo en polea', 'Zancadas'],
  'Pantorrilla': ['Elevación de talones de pie', 'Elevación de talones sentado', 'Elevación de talones en prensa']
};

function slugify(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

if (rutinasStore.list().length === 0) {
  rutinasStore.create('principal', DEFAULT_ROUTINE);
}

if (ejerciciosStore.list().length === 0) {
  Object.entries(DEFAULT_EXERCISES).forEach(([group, exercises]) => {
    ejerciciosStore.create(slugify(group), { group, exercises });
  });
}

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

async function handleCollection(req, res, store, parts, opts) {
  const id = parts[2];

  if (req.method === 'GET' && parts.length === 2) {
    return sendJSON(res, 200, store.list());
  }

  if (req.method === 'GET' && parts.length === 3) {
    const doc = store.get(id);
    return doc ? sendJSON(res, 200, doc) : sendJSON(res, 404, { error: 'no encontrado' });
  }

  if (req.method === 'POST' && parts.length === 2) {
    const body = JSON.parse((await readBody(req)) || '{}');
    const doc = store.create(crypto.randomUUID(), body);
    return sendJSON(res, 201, doc);
  }

  if (req.method === 'PUT' && parts.length === 3) {
    const body = JSON.parse((await readBody(req)) || '{}');
    const updated = store.update(id, body);
    return updated ? sendJSON(res, 200, updated) : sendJSON(res, 404, { error: 'no encontrado' });
  }

  if (req.method === 'DELETE' && parts.length === 3) {
    if (opts && opts.keepAtLeastOne && store.list().length <= 1) {
      return sendJSON(res, 400, { error: 'debe quedar al menos una rutina' });
    }
    const ok = store.remove(id);
    return ok ? sendJSON(res, 200, { ok: true }) : sendJSON(res, 404, { error: 'no encontrado' });
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
  const parts = pathname.split('/').filter(Boolean);

  try {
    if (parts[0] === 'api' && parts[1] === 'historial') {
      await handleCollection(req, res, historialStore, parts);
    } else if (parts[0] === 'api' && parts[1] === 'rutinas') {
      await handleCollection(req, res, rutinasStore, parts, { keepAtLeastOne: true });
    } else if (parts[0] === 'api' && parts[1] === 'ejercicios') {
      await handleCollection(req, res, ejerciciosStore, parts);
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

function openBrowser(url) {
  const cmd = process.platform === 'darwin' ? `open "${url}"`
    : process.platform === 'win32' ? `start "" "${url}"`
    : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Servidor escuchando en ${url}`);
  openBrowser(url);
});
