// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

function formatBRL(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits:2 });
}

function calcularOrcamento({ tipo, larg, alt, vidro, accs, km }) {
  if (!larg || !alt || isNaN(larg) || isNaN(alt)) return null;
  const linhas = []; let total = 0, descontoBase = 0;
  const area = (larg/100)*(alt/100);
  const vidroObj = VIDROS[vidro];
  if (vidroObj) {
    const val = area * vidroObj.preco;
    linhas.push({ nome:vidroObj.nome, valor:val });
    total += val;
    if (vidroObj.temperado) descontoBase += val * DESCONTO_AVISTA;
  }
  (ACESSORIOS_CONFIG[tipo] || []).forEach(a => {
    const ativo = accs[a.id] ?? a.obrig;
    if (!ativo) return;
    let val = 0;
    if (a.preco !== null && a.preco !== undefined) { val = a.preco; }
    else {
      if (tipo === 'correr')  val = area * 100;
      if (tipo === 'janela')  val = (larg/100) * 100;
      if (tipo === 'box')     val = area * 120;
      if (tipo === 'espelho' && a.id === 'botoes') val = larg >= 60 ? 4*15 : 0;
      if (tipo === 'comum'   && a.id === 'recorte') val = area * 10;
    }
    linhas.push({ nome:a.nome, valor:val });
    total += val;
  });
  const kmNum = parseFloat(km) || 0;
  let frete = 0;
  if (kmNum > FRETE_GRATIS_KM) frete = (kmNum - FRETE_GRATIS_KM) * FRETE_POR_KM_EXTRA;
  linhas.push({ nome:`Frete (${kmNum} km)`, valor:frete });
  total += frete;
  return { linhas, total, totalAvista: total - descontoBase };
}

function gerarTextoWpp({ cliente, tipo, larg, alt, vidro, resultado }) {
  if (!resultado) return '';
  const vidroObj = VIDROS[vidro];
  const dataStr = new Date().toLocaleDateString('pt-BR');
  let txt = `*Orçamento — Ceará Planejados*\n📅 ${dataStr}\n`;
  if (cliente) txt += `👤 Cliente: ${cliente}\n`;
  txt += `\n📦 Produto: *${TIPO_LABEL[tipo]||tipo}*\n📐 Medidas: ${larg} x ${alt} cm\n`;
  if (vidroObj) txt += `🔷 Vidro: ${vidroObj.nome}\n`;
  txt += `\n*Composição:*\n`;
  resultado.linhas.forEach(l => txt += `• ${l.nome}: ${formatBRL(l.valor)}\n`);
  txt += `\n💰 *Total: ${formatBRL(resultado.total)}*\n💚 À vista (10% off): *${formatBRL(resultado.totalAvista)}*\n\n_Orçamento gerado pelo app Ceará Planejados_`;
  return txt;
}

function formatData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
}

function corTipo(tipo) {
  const map = {
    pivotante: { bg:'rgba(212,175,55,0.1)',  brd:'rgba(212,175,55,0.25)' },
    correr:    { bg:'rgba(80,160,220,0.1)',  brd:'rgba(80,160,220,0.25)' },
    janela:    { bg:'rgba(100,200,140,0.1)', brd:'rgba(100,200,140,0.25)' },
    box:       { bg:'rgba(160,120,220,0.1)', brd:'rgba(160,120,220,0.25)' },
    espelho:   { bg:'rgba(220,180,80,0.1)',  brd:'rgba(220,180,80,0.25)' },
    guarda:    { bg:'rgba(220,100,100,0.1)', brd:'rgba(220,100,100,0.25)' },
    basculante:{ bg:'rgba(100,200,255,0.1)', brd:'rgba(100,200,255,0.25)' },
    comum:     { bg:'rgba(180,180,180,0.1)', brd:'rgba(180,180,180,0.25)' },
  };
  return map[tipo] || { bg:'rgba(201,168,76,0.1)',brd:'rgba(201,168,76,0.2)' };
}

// ════════════════════════════════════════════════════════════
// NAV
// ════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { id:'home',       label:'Início',    icon:'🏠', cta:false },
  { id:'orc',        label:'Orçamento', icon:'🧮', cta:true  },
  { id:'financeiro', label:'Preços',    icon:'💎', cta:false },
  { id:'historico',  label:'Histórico', icon:'📂', cta:false },
  { id:'clientes',   label:'Clientes',  icon:'👥', cta:false },
  { id:'config',     label:'Config.',   icon:'ℹ️', cta:false },
];

let paginaAtiva = 'home';

function buildNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = NAV_ITEMS.map(it => `
    <button class="ni${it.cta?' ni-cta':''}${paginaAtiva===it.id?' on':''}" onclick="navTo('${it.id}')" aria-label="${it.label}">
      <div class="ni-ic-wrap"><span class="ni-i">${it.icon}</span></div>
      <span class="ni-l">${it.label}</span>
    </button>
  `).join('');
}

function navTo(pg) {
  if (pg === paginaAtiva) return;
  paginaAtiva = pg;
  buildNav();
  renderPage();
}

// ════════════════════════════════════════════════════════════
// RENDER ROUTER
// ════════════════════════════════════════════════════════════

function renderPage() {
  const wrap = document.getElementById('pgWrap');
  wrap.className = 'pg';
  // Force reflow para restart animation
  void wrap.offsetWidth;
  switch(paginaAtiva) {
    case 'home':       renderHome(wrap); break;
    case 'orc':        renderOrc(wrap); break;
    case 'financeiro': renderFinanceiro(wrap); break;
    case 'historico':  renderHistorico(wrap); break;
    case 'clientes':   renderClientes(wrap); break;
    case 'config':     renderConfig(wrap); break;
  }
  // Scroll to top
  document.getElementById('pages').scrollTop = 0;
}

