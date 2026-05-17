// ════════════════════════════════════════════════════════════
// INDEXEDDB
// ════════════════════════════════════════════════════════════

const DB_NAME = 'CearPlanejados', DB_VERSION = 1;
let _dbPromise = null;

function getDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('orcamentos')) {
        const os = db.createObjectStore('orcamentos', { keyPath:'id', autoIncrement:true });
        os.createIndex('por_data',    'criadoEm',    { unique:false });
        os.createIndex('por_cliente', 'clienteNome', { unique:false });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
  return _dbPromise;
}

async function dbTx(store, mode, fn) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const s  = tx.objectStore(store);
    const req = fn(s);
    if (req) { req.onsuccess = e => resolve(e.target.result); req.onerror = e => reject(e.target.error); }
    else { tx.oncomplete = () => resolve(); tx.onerror = e => reject(e.target.error); }
  });
}

async function salvarOrcamento(dados) {
  return dbTx('orcamentos','readwrite', s => s.add({ ...dados, criadoEm: new Date().toISOString() }));
}
async function listarOrcamentos() {
  const todos = await dbTx('orcamentos','readonly', s => s.getAll());
  return todos.sort((a,b) => new Date(b.criadoEm) - new Date(a.criadoEm));
}
async function removerOrcamento(id) {
  return dbTx('orcamentos','readwrite', s => s.delete(id));
}
async function atualizarOrcamento(orc) {
  return dbTx('orcamentos','readwrite', s => s.put({ ...orc, atualizadoEm: new Date().toISOString() }));
}
async function duplicarOrcamento(orc) {
  const { id, criadoEm, atualizadoEm, ...resto } = orc;
  return salvarOrcamento({ ...resto, clienteNome: orc.clienteNome ? orc.clienteNome + ' (cópia)' : '' });
}

