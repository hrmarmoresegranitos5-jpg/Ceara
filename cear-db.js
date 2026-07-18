// ════════════════════════════════════════════════════════════
// INDEXEDDB
// ════════════════════════════════════════════════════════════

const DB_NAME = 'CearPlanejados', DB_VERSION = 3;
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
      if (!db.objectStoreNames.contains('clientes')) {
        const cs = db.createObjectStore('clientes', { keyPath:'id', autoIncrement:true });
        cs.createIndex('por_nome',  'nome',  { unique:false });
        cs.createIndex('por_fone',  'fone',  { unique:false });
      }
      if (!db.objectStoreNames.contains('financeiro')) {
        const fs = db.createObjectStore('financeiro', { keyPath:'id', autoIncrement:true });
        fs.createIndex('por_data',      'criadoEm',    { unique:false });
        fs.createIndex('por_status',    'status',      { unique:false });
        fs.createIndex('por_orcamento', 'orcamentoId', { unique:false });
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


// ── FINANCEIRO / CONTAS A RECEBER CRUD ──────────────────────
// Uma conta a receber é criada automaticamente quando um orçamento
// é aprovado no Histórico. Fica linkada pelo orcamentoId, igual a
// Agenda faz com as obras.
async function salvarConta(dados) {
  return dbTx('financeiro','readwrite', s => s.add({ status:'pendente', ...dados, criadoEm: new Date().toISOString() }));
}
async function listarContas() {
  const todas = await dbTx('financeiro','readonly', s => s.getAll());
  return todas.sort((a,b) => new Date(b.criadoEm) - new Date(a.criadoEm));
}
async function buscarContaPorOrcamento(orcamentoId) {
  const todas = await dbTx('financeiro','readonly', s => s.getAll());
  return todas.find(c => c.orcamentoId === orcamentoId) || null;
}
async function atualizarConta(conta) {
  return dbTx('financeiro','readwrite', s => s.put({ ...conta, atualizadoEm: new Date().toISOString() }));
}
async function removerConta(id) {
  return dbTx('financeiro','readwrite', s => s.delete(id));
}
// Cria a conta a receber a partir de um orçamento aprovado, evitando duplicar
// caso o orçamento seja des-aprovado e re-aprovado depois.
async function gerarContaDeOrcamento(orc) {
  const existente = await buscarContaPorOrcamento(orc.id);
  if (existente) return existente;
  const valor = orc.resultado?.total || 0;
  return salvarConta({
    orcamentoId: orc.id,
    clienteNome: orc.clienteNome || '',
    clienteFone: orc.clienteFone || '',
    valor,
    valorRecebido: 0,
    descricao: (typeof TIPO_LABEL !== 'undefined' && TIPO_LABEL[orc.tipo]) ? TIPO_LABEL[orc.tipo] : (orc.tipo || 'Orçamento'),
  });
}


// ── CLIENTES CRUD ────────────────────────────────────────────
async function salvarCliente(dados) {
  return dbTx('clientes','readwrite', s => s.add({ ...dados, criadoEm: new Date().toISOString() }));
}
async function listarClientes() {
  const todos = await dbTx('clientes','readonly', s => s.getAll());
  return todos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}
async function buscarCliente(id) {
  return dbTx('clientes','readonly', s => s.get(id));
}
async function atualizarCliente(cli) {
  return dbTx('clientes','readwrite', s => s.put({ ...cli, atualizadoEm: new Date().toISOString() }));
}
async function removerCliente(id) {
  return dbTx('clientes','readwrite', s => s.delete(id));
}
async function statsGerais() {
  const [orcs, clis] = await Promise.all([listarOrcamentos(), listarClientes()]);
  const agora = new Date();
  const mesAtual = agora.getFullYear() + '-' + String(agora.getMonth()+1).padStart(2,'0');
  const orcsMes  = orcs.filter(o => (o.criadoEm||'').startsWith(mesAtual));
  const faturado  = orcsMes.reduce((s,o) => s + (o.resultado?.total||0), 0);
  const pendentes = orcs.filter(o => !o.status || o.status === 'pendente').length;
  const aprovados = orcs.filter(o => o.status === 'aprovado').length;
  const ultimo    = orcs[0] || null;
  return { totalOrcs:orcs.length, totalClientes:clis.length, faturadoMes:faturado, pendentes, aprovados, ultimo };
}
