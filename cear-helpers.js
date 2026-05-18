// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

function formatBRL(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits:2 });
}

function calcularOrcamento({ tipo, larg, alt, vidro, accs, km, folhasCorrer, pivFolhas, kitPivotante, temFixo, fixoLarg, temBandeirola, bandH, temMola, puxadoresQtd, janelaFolhas }) {
  if (!larg || !alt || isNaN(larg) || isNaN(alt)) return null;
  const linhas = []; let total = 0, descontoBase = 0;
  const area = (larg/100)*(alt/100);
  const vidroObj = VIDROS[vidro];

  // ── PORTA DE CORRER — lógica dedicada ──────────────────────
  if (tipo === 'correr') {
    const nFolhas  = Number(folhasCorrer) || 2;          // total de folhas
    const nMoveis  = CORRER_MOVEIS[nFolhas] ?? 2;        // folhas móveis
    const nFixas   = nFolhas - nMoveis;                  // folhas fixas
    const largM    = larg / 100;                         // largura em metros

    // Vidro — área total (todas as folhas)
    if (vidroObj) {
      const valVidro = area * vidroObj.preco;
      linhas.push({ nome:`Vidro ${vidroObj.nome} (${nFolhas} folha${nFolhas>1?'s':''})`, valor:valVidro });
      total += valVidro;
      if (vidroObj.temperado) descontoBase += valVidro * DESCONTO_AVISTA;
    }

    // Trilho superior
    const valTrilhoSup = largM * CORRER_PRECOS.trilho_sup;
    linhas.push({ nome:`Trilho superior (${larg} cm)`, valor:valTrilhoSup });
    total += valTrilhoSup;

    // Guia inferior
    const valGuiaInf = largM * CORRER_PRECOS.guia_inf;
    linhas.push({ nome:`Guia inferior (${larg} cm)`, valor:valGuiaInf });
    total += valGuiaInf;

    // Kits de carrinho (por folha móvel)
    const valKits = nMoveis * CORRER_PRECOS.kit_carrinho;
    linhas.push({ nome:`Kit carrinho ×${nMoveis} (folha${nMoveis>1?'s móveis':' móvel'})`, valor:valKits });
    total += valKits;

    // Fechadura (por folha móvel)
    const valFechadura = nMoveis * CORRER_PRECOS.fechadura;
    linhas.push({ nome:`Fechadura VP ×${nMoveis}`, valor:valFechadura });
    total += valFechadura;

    // Puxador (por folha móvel)
    const valPuxador = nMoveis * CORRER_PRECOS.puxador;
    linhas.push({ nome:`Puxador ×${nMoveis}`, valor:valPuxador });
    total += valPuxador;

    // Frete
    const kmNum = parseFloat(km) || 0;
    let frete = 0;
    if (kmNum > FRETE_GRATIS_KM) frete = (kmNum - FRETE_GRATIS_KM) * FRETE_POR_KM_EXTRA;
    linhas.push({ nome:`Frete (${kmNum} km)`, valor:frete });
    total += frete;

    return { linhas, total, totalAvista: total - descontoBase, nFolhas, nMoveis, nFixas };
  }

  // ── DEMAIS TIPOS ────────────────────────────────────────────
  if (vidroObj) {
    const val = area * vidroObj.preco;
    linhas.push({ nome:vidroObj.nome + (tipo==='pivotante'&&(pivFolhas||1)>1?' (2 folhas)':''), valor:val });
    total += val;
    if (vidroObj.temperado) descontoBase += val * DESCONTO_AVISTA;

    // Fixo lateral
    if (tipo === 'pivotante' && temFixo && fixoLarg > 0) {
      const areaFixo = (fixoLarg/100) * (alt/100);
      const valFixo = areaFixo * vidroObj.preco;
      linhas.push({ nome:'Vidro fixo lateral (' + fixoLarg + 'cm)', valor:valFixo });
      total += valFixo;
      if (vidroObj.temperado) descontoBase += valFixo * DESCONTO_AVISTA;
      // PU do fixo
      const perFixo = 2*(fixoLarg/100 + alt/100);
      const valPU = perFixo * (CFG.comercial.pu_por_m || 70);
      linhas.push({ nome:'PU fixo lateral (' + perFixo.toFixed(1) + 'm)', valor:valPU });
      total += valPU;
    }

    // Bandeirola
    if (tipo === 'pivotante' && temBandeirola && bandH > 0) {
      const areaBand = (larg/100) * (bandH/100);
      const valBand = areaBand * vidroObj.preco;
      linhas.push({ nome:'Bandeirola (' + bandH + 'cm)', valor:valBand });
      total += valBand;
      if (vidroObj.temperado) descontoBase += valBand * DESCONTO_AVISTA;
      const perBand = 2*(larg/100 + bandH/100);
      const valPUB = perBand * (CFG.comercial.pu_por_m || 70);
      linhas.push({ nome:'PU bandeirola (' + perBand.toFixed(1) + 'm)', valor:valPUB });
      total += valPUB;
    }
  }
  // Mola hidráulica — add-on separado do kit
  if (tipo === 'pivotante' && temMola) {
    linhas.push({ nome:'Mola Hidráulica (instalação)', valor: CFG.comercial.mola_hidraulica || 500 });
    total += CFG.comercial.mola_hidraulica || 500;
  }

  (ACESSORIOS_CONFIG[tipo] || []).forEach(a => {
    const ativo = accs[a.id] ?? a.obrig;
    if (!ativo) return;
    let val = 0;
    if (a.preco !== null && a.preco !== undefined) { val = a.preco; }
    else {
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

function gerarTextoWpp({ cliente, tipo, larg, alt, vidro, resultado, folhasCorrer }) {
  if (!resultado) return '';
  const vidroObj = VIDROS[vidro];
  const dataStr = new Date().toLocaleDateString('pt-BR');
  let txt = `*Orçamento — Ceará Planejados*\n📅 ${dataStr}\n`;
  if (cliente) txt += `👤 Cliente: ${cliente}\n`;
  txt += `\n📦 Produto: *${TIPO_LABEL[tipo]||tipo}*\n📐 Medidas: ${larg} x ${alt} cm\n`;
  if (tipo === 'correr' && resultado.nFolhas) {
    const nF = resultado.nFolhas;
    const nM = resultado.nMoveis;
    const nFx = resultado.nFixas;
    txt += `🔲 Configuração: *${nF} folha${nF>1?'s':''}`;
    if (nFx > 0) txt += ` (${nM} móve${nM>1?'is':'l'} + ${nFx} fixa${nFx>1?'s':''})`;
    else txt += ` móve${nM>1?'is':'l'}`;
    txt += `*\n`;
  }
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

