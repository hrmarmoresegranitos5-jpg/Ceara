// ════════════════════════════════════════════════════════════
// ORÇAMENTO — multi-item, cliente persistente, editável
// ════════════════════════════════════════════════════════════

var _ORC = {
  pivCfgs:  ['1s','1sf','1sb','1sfb','2s','2sf'],
  pivLbls:  ['1 folha','1 + fixo','1 + band.','1+fixo+band.','2 folhas','2 + fixo'],
  kits:     ['comum','jumbo'],
  kitCores: ['branco','preto'],
  folhas:   [1,2,3,4],
  jFolhas:  [2,3,4],
  puxQtd:   [1,2],
  boxTipos: ['fixo','conv','3p','4p','canto'],
  boxLbls:  ['Só fixo','1F+1M','2F+1M','2F+2M','Canto'],
  boxDesc:  ['Fixo+PU','Convencional','Central','4 painéis','+R$100/m²'],
  molaOpts: [0,1,2],
};

function _setPivCfg(i)  { orcSetPivConfig(_ORC.pivCfgs[i]); }
function _setKit(i)     { orcSetKit(_ORC.kits[i]); }
function _setFolhas(i)  { orcSetFolhas(_ORC.folhas[i]); }
function _setJFolhas(i) { orcSetJanelaFolhas(_ORC.jFolhas[i]); }
function _setPuxQtd(i)  { orcSetPuxQtd(_ORC.puxQtd[i]); }
function _setKitCor(i)  { orcSetKitCor(_ORC.kitCores[i]); }
function _setBoxTipo(i) { orcSetBoxTipo(_ORC.boxTipos[i]); }
function _setMola(i)    { orcSetMola(_ORC.molaOpts[i]); }
function _togAcc(id)    { orcToggleAcc(id, false); }
function _togAccObr(id) { orcToggleAcc(id, true); }

// ════════════════════════════════════════════════════════════
// ÁREAS — agrupamento profissional dos tipos de item
// ════════════════════════════════════════════════════════════
var _AREA_SVG = {
  portas:  '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="1"/><line x1="5" y1="21.5" x2="19" y2="21.5"/><circle cx="15.3" cy="12" r="0.9" fill="currentColor" stroke="none"/></svg>',
  janelas: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4" width="17" height="16" rx="1"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="3.5" y1="12" x2="20.5" y2="12"/></svg>',
  box:     '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="10.5" height="17" rx="1"/><rect x="10" y="3.5" width="10.5" height="17" rx="1" opacity=".55"/></svg>',
  outros:  '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><line x1="8" y1="16.5" x2="16.5" y2="8"/></svg>',
};
var AREAS = [
  { id:'portas',  nome:'Portas',          icon:'🚪', desc:'Pivotante e de correr',              tipos:['pivotante','correr'],           cor:'rgba(212,175,55,0.14)',  borda:'rgba(212,175,55,0.3)',  fg:'#EDD060' },
  { id:'janelas', nome:'Janelas',         icon:'🪟', desc:'Janela e basculante',                 tipos:['janela','basculante'],          cor:'rgba(80,160,220,0.14)',  borda:'rgba(80,160,220,0.32)', fg:'rgba(120,190,240,1)' },
  { id:'box',     nome:'Box de Banheiro', icon:'🛁', desc:'Fixo, convencional, canto',           tipos:['box'],                          cor:'rgba(58,158,106,0.14)',  borda:'rgba(58,158,106,0.32)', fg:'rgba(100,200,150,1)' },
  { id:'outros',  nome:'Outros',          icon:'✨', desc:'Espelho, guarda-corpo, vidro comum',  tipos:['espelho','guarda','comum'],     cor:'rgba(180,120,220,0.14)', borda:'rgba(180,120,220,0.32)', fg:'rgba(200,150,230,1)' },
];
AREAS.forEach(function(a){ a.svg = _AREA_SVG[a.id] || a.icon; });
function _areaOfTipo(tipo) {
  for (var i=0;i<AREAS.length;i++) if (AREAS[i].tipos.indexOf(tipo)>=0) return AREAS[i].id;
  return AREAS[0].id;
}
function _areaObj(id) {
  for (var i=0;i<AREAS.length;i++) if (AREAS[i].id===id) return AREAS[i];
  return null;
}
var orcArea = null; // null = mostra a tela de escolha de área
var _orcTouched = false; // true assim que o usuário mexe em algum campo do formulário atual
var _orcAnimDir = null; // 'right' = avançando (área→form), 'left' = voltando (form→área)

// ── Uso por área (pra destacar "Mais usado") ──
function _orcAreaUsageGet() {
  try { return JSON.parse(localStorage.getItem('cearAreaUsage')||'{}'); } catch(e) { return {}; }
}
function _orcAreaUsageBump(id) {
  try {
    var u = _orcAreaUsageGet();
    u[id] = (u[id]||0) + 1;
    localStorage.setItem('cearAreaUsage', JSON.stringify(u));
  } catch(e) {}
}
function _orcAreaMaisUsada() {
  var u = _orcAreaUsageGet();
  var total = 0, bestId = null, bestN = 0;
  Object.keys(u).forEach(function(id){ total += u[id]; if (u[id] > bestN) { bestN = u[id]; bestId = id; } });
  // só destaca se já houver um histórico mínimo e uma liderança clara (>=40% do uso total)
  if (total >= 4 && bestId && bestN / total >= 0.4) return bestId;
  return null;
}

function orcSelecionarArea(id) {
  orcArea = id;
  _orcAnimDir = 'right';
  _orcAreaUsageBump(id);
  var area = _areaObj(id);
  if (area && area.tipos.indexOf(orcState.tipo)===-1) orcTrocaTipo(area.tipos[0]);
  else renderOrc(document.getElementById('pgWrap'));
}
function orcVoltarArea() {
  orcArea = null;
  _orcAnimDir = 'left';
  renderOrc(document.getElementById('pgWrap'));
}
function _renderOrcAreaPicker(wrap) {
  var cards = '';
  var maisUsada = _orcAreaMaisUsada();
  AREAS.forEach(function(a, i){
    var qtdTipos = a.tipos.length;
    var destaque = (a.id === maisUsada) ? '<span class="orc-area-tag">Mais usado</span>' : '';
    cards += '<button class="orc-area-card" style="animation-delay:'+(i*45)+'ms;--stripe-color:'+a.fg+'" onclick="orcSelecionarArea(\''+a.id+'\')">'
      + '<span class="orc-area-ic" style="background:'+a.cor+';border:1px solid '+a.borda+';color:'+a.fg+'">'+a.svg+'</span>'
      + '<div class="orc-area-txt"><span class="orc-area-nm">'+a.nome+destaque+'</span>'
      + '<span class="orc-area-desc">'+a.desc+'</span></div>'
      + '<span class="orc-area-arr" style="color:'+a.fg+'">›</span>'
      + '</button>';
  });
  var _animClass = _orcAnimDir==='left' ? ' orc-slide-in-left' : (_orcAnimDir==='right' ? '' : '');
  _orcAnimDir = null;

  // ── Atalho "Continuar" (item em andamento, ainda não adicionado à lista) ──
  var continuarBlock = '';
  if (_orcTouched && orcState.larg > 0 && orcState.alt > 0) {
    var descCont = (TIPO_LABEL[orcState.tipo]||orcState.tipo)+' '+orcState.larg+'×'+orcState.alt+' cm';
    continuarBlock = '<button class="orc-continuar" onclick="orcSelecionarArea(\''+_areaOfTipo(orcState.tipo)+'\')">'
      + '<span class="orc-continuar-ic">↻</span>'
      + '<div class="orc-continuar-txt"><span class="orc-continuar-lbl">Continuar de onde parou</span>'
      + '<span class="orc-continuar-desc">'+descCont+'</span></div>'
      + '<span class="orc-continuar-arr">›</span>'
      + '</button>';
  }

  wrap.innerHTML = '<div id="pgOrcamento" class="orc-screen'+_animClass+'">'
    + '<div class="orc-area-hero">'
    + '<span class="orc-area-hero-ic">🧮</span>'
    + '<div class="orc-area-ttl">O que você vai orçar?</div>'
    + '<div class="orc-area-sub">Escolha a área para começar um novo item</div>'
    + '</div>'
    + continuarBlock
    + '<div class="orc-area-grid">'+cards+'</div>'
    + (orcItens.length ? '' : '<div class="orc-area-empty"><span class="orc-area-empty-ic">📋</span>Nenhum orçamento ainda — comece escolhendo uma área acima</div>')
    + '<div style="height:24px"></div>'
    + '</div>';
}

var PIV_CONFIGS = {
  '1s':{folhas:1,fixo:false,band:false},'1sf':{folhas:1,fixo:true,band:false},
  '1sb':{folhas:1,fixo:false,band:true},'1sfb':{folhas:1,fixo:true,band:true},
  '2s':{folhas:2,fixo:false,band:false},'2sf':{folhas:2,fixo:true,band:false},
};

var orcItens   = [];   // itens salvos [{snap, resultado, qty, desc, editLabel}]
var orcEditIdx = -1;   // -1 = novo item; >=0 = editando item[idx]

// ════════════════════════════════════════════════════════════
// RENDER PRINCIPAL
// ════════════════════════════════════════════════════════════
function renderOrc(wrap) {
  if (!wrap) return;
  var s = orcState;
  if (orcEditIdx >= 0) orcArea = _areaOfTipo(s.tipo);
  if (!orcArea) { _renderOrcAreaPicker(wrap); return; }
  var isPiv    = s.tipo === 'pivotante';
  var isCorrer = s.tipo === 'correr';
  var isJanela = s.tipo === 'janela';
  var isBox    = s.tipo === 'box';
  var nFP      = isPiv ? (s.pivFolhas||1) : 1;
  var vidrosDispo = (VIDROS_POR_TIPO[s.tipo]||[]).map(function(k){
    return {key:k, nome:CFG.vidros[k].nome, preco:CFG.vidros[k].preco};
  });

  // ── Cabeçalho cliente (sempre visível) ──
  var clienteBlock = '<div class="campo-row orc-cliente-header">'
    +'<div class="field"><label>👤 Cliente</label><input id="orcCliente" type="text" value="'+s.cliente+'" placeholder="Nome do cliente" oninput="orcUpdate()"></div>'
    +'<div class="field"><label>📱 Telefone</label><input id="orcFone" type="tel" value="'+s.fone+'" placeholder="(85) 9..." oninput="orcUpdate()"></div>'
    +'</div>';

  // ── Banner "editando item X" ──
  var editBanner = '';
  if (orcEditIdx >= 0) {
    editBanner = '<div class="orc-edit-banner">✏️ Editando item '+(orcEditIdx+1)
      +' <button class="orc-edit-cancel" onclick="orcCancelarEdicao()">Cancelar</button></div>';
  }

  // ── Breadcrumb: Área → Tipo → Medidas ──
  var areaAtual = _areaObj(orcArea);
  var tipoAtual = TIPOS.filter(function(x){return x.id===s.tipo;})[0];
  var areaCrumb = '<div class="orc-crumb-row">'
    + '<div class="orc-crumb-steps">'
    + '<button class="orc-crumb-step" onclick="orcVoltarArea()" title="Trocar área">'
      + '<span class="orc-crumb-ic" style="color:'+(areaAtual?areaAtual.fg:'inherit')+'">'+(areaAtual?areaAtual.svg:'')+'</span>'
      + '<span class="orc-crumb-txt">'+(areaAtual?areaAtual.nome:'')+'</span>'
    + '</button>'
    + '<span class="orc-crumb-sep">›</span>'
    + '<span class="orc-crumb-step is-static">'
      + '<span class="orc-crumb-ic">'+(tipoAtual?tipoAtual.icon:'')+'</span>'
      + '<span class="orc-crumb-txt">'+(tipoAtual?tipoAtual.label:'')+'</span>'
    + '</span>'
    + '<span class="orc-crumb-sep">›</span>'
    + '<span class="orc-crumb-step is-current">'
      + '<span class="orc-crumb-txt">Medidas</span>'
    + '</span>'
    + '</div>'
    + (orcItens.length ? '<span class="orc-crumb-badge">'+orcItens.length+' item'+(orcItens.length>1?'s':'')+'</span>' : '')
    + '</div>';

  // ── Seletor tipo (somente os tipos da área atual) ──
  var tipoBlock = '';
  if (areaAtual && areaAtual.tipos.length > 1) {
    tipoBlock = '<div class="orc-tipos">';
    areaAtual.tipos.forEach(function(tid){
      var t = TIPOS.filter(function(x){return x.id===tid;})[0];
      if (!t) return;
      tipoBlock += '<button class="orc-tipo-btn'+(s.tipo===t.id?' active':'')+'" onclick="orcTrocaTipo(\''+t.id+'\')">'
        +'<span class="orc-tipo-ic">'+t.icon+'</span><span class="orc-tipo-lbl">'+t.label+'</span></button>';
    });
    tipoBlock += '</div>';
  }

  // ── Box tipo ──
  var boxBlock = '';
  if (isBox) {
    var bt=s.boxTipo||'conv', bbBtns='';
    _ORC.boxTipos.forEach(function(id,i){
      bbBtns += '<button class="folha-btn'+(bt===id?' active':'')+'" onclick="_setBoxTipo('+i+')">'
        +'<span class="folha-n" style="font-size:.72rem">'+_ORC.boxLbls[i]+'</span>'
        +'<span class="folha-desc">'+_ORC.boxDesc[i]+'</span></button>';
    });
    boxBlock = '<div class="field" style="margin-bottom:12px"><label>Tipo de box</label>'
      +'<div class="correr-folhas">'+bbBtns+'</div></div>';
  }

  // ── Config pivotante ──
  var pivConfig = '';
  if (isPiv) {
    var btns = '';
    _ORC.pivCfgs.forEach(function(id,i){
      var c=PIV_CONFIGS[id];
      var cur=(s.pivFolhas===c.folhas&&!!s.temFixo===c.fixo&&!!s.temBandeirola===c.band);
      btns += '<button class="piv-cfg-btn'+(cur?' active':'')+'" onclick="_setPivCfg('+i+')">'
        +'<svg id="mcad_'+id+'" class="piv-cfg-cad" viewBox="0 0 60 44" width="86" height="63"></svg>'
        +'<span class="piv-cfg-lbl">'+_ORC.pivLbls[i]+'</span></button>';
    });
    pivConfig = '<div class="piv-config-ttl">Configuração da porta</div>'
      +'<div class="piv-configs">'+btns+'</div>';
  }

  // ── Folhas correr ──
  var folhasBlock = '';
  if (isCorrer) {
    var fb='';
    [1,2,3,4].forEach(function(n,i){
      var nM=CORRER_MOVEIS[n]||n, nFx=n-nM, vv=nM<=1?'VP':'VV';
      fb += '<button class="folha-btn'+(s.folhasCorrer===n?' active':'')+'" onclick="_setFolhas('+i+')">'
        +'<span class="folha-n">'+n+'</span><span class="folha-lbl">'+(n===1?'folha':'folhas')+'</span>'
        +'<span class="folha-desc">'+(nFx>0?nM+'M+'+nFx+'F':nM+'M')+' · '+vv+'</span></button>';
    });
    folhasBlock = '<div class="field" style="margin-bottom:14px"><label>Folhas</label>'
      +'<div class="correr-folhas">'+fb+'</div></div>';
  }

  // ── Folhas janela ──
  var janelaBlock = '';
  if (isJanela) {
    var nFj=s.janelaFolhas||2, jb='';
    [{n:2,d:'1F+1M · VP'},{n:3,d:'1F+2M · VV'},{n:4,d:'2F+2M · VV'}].forEach(function(x,i){
      jb += '<button class="folha-btn'+(nFj===x.n?' active':'')+'" onclick="_setJFolhas('+i+')">'
        +'<span class="folha-n">'+x.n+'</span><span class="folha-lbl">folhas</span>'
        +'<span class="folha-desc">'+x.d+'</span></button>';
    });
    janelaBlock = '<div class="field" style="margin-bottom:14px"><label>Folhas</label>'
      +'<div class="correr-folhas">'+jb+'</div></div>';
  }

  // ── Dimensões ──
  var dimBlock = '';
  if (isBox&&(s.boxTipo||'conv')==='canto') {
    dimBlock = '<div class="campo-row">'
      +'<div class="field"><label>Lado A — Larg. (cm)</label><input id="orcLarg" type="number" inputmode="numeric" value="'+s.larg+'" oninput="orcUpdate()"></div>'
      +'<div class="field"><label>Lado B — Larg. (cm)</label><input id="orcLargB" type="number" inputmode="numeric" value="'+(s.largB||80)+'" oninput="orcUpdate()"></div>'
      +'</div>'
      +'<div class="field"><label>Altura (cm)</label><input id="orcAlt" type="number" inputmode="numeric" value="'+s.alt+'" oninput="orcUpdate()"></div>';
  } else {
    dimBlock = '<div class="campo-row">'
      +'<div class="field"><label>Largura (cm)</label><input id="orcLarg" type="number" inputmode="numeric" value="'+s.larg+'" oninput="orcUpdate()"></div>'
      +'<div class="field"><label>Altura (cm)</label><input id="orcAlt" type="number" inputmode="numeric" value="'+s.alt+'" oninput="orcUpdate()"></div>'
      +'</div>';
  }
  var fixoField=(isPiv&&s.temFixo)?'<div class="field"><label>Larg. fixo (cm)</label><input id="orcFixoLarg" type="number" inputmode="numeric" value="'+(s.fixoLarg||40)+'" oninput="orcUpdate()"></div>':'';
  var bandField=(isPiv&&s.temBandeirola)?'<div class="field"><label>Alt. bandeirola (cm)</label><input id="orcBandH" type="number" inputmode="numeric" value="'+(s.bandH||40)+'" oninput="orcUpdate()"></div>':'';

  // ── Kit pivotante + mola ──
  var kitBlock = '';
  if (isPiv) {
    var svgC='<svg id="mkitComum" viewBox="0 0 50 50" width="54" height="54"></svg>';
    var svgJ='<svg id="mkitJumbo" viewBox="0 0 50 50" width="54" height="54"></svg>';
    var kitSub_c='R$ '+(nFP===2?'300':'150');
    var kitSub_j='R$ '+(nFP===2?'700':'350');
    kitBlock = '<div class="field"><label>Kit pivotante'+(nFP===2?' (2 kits)':'')+'</label>'
      +'<div class="kit-opts kit-opts-kits">'
      +'<button class="kit-btn'+(s.kitPivotante==='comum'?' active':'')+'" onclick="_setKit(0)">'+svgC
        +'<span class="kit-nm">Comum</span><span class="kit-sub">'+kitSub_c+'</span><span class="kit-desc">Padrão</span></button>'
      +'<button class="kit-btn'+(s.kitPivotante==='jumbo'?' active':'')+'" onclick="_setKit(1)">'+svgJ
        +'<span class="kit-nm">Jumbo</span><span class="kit-sub">'+kitSub_j+'</span><span class="kit-desc">Grandes</span></button>'
      +'</div></div>'
      +'<div class="field"><label>Mola hidráulica</label>'
      +(nFP===2
        ?'<div class="kit-opts">'
          +'<button class="kit-btn'+(s.molaQtd===0?' active':'')+'" onclick="_setMola(0)" style="flex:1"><span class="kit-nm">Sem mola</span></button>'
          +'<button class="kit-btn'+(s.molaQtd===1?' active':'')+'" onclick="_setMola(1)" style="flex:1"><span class="kit-nm">1 mola</span><span class="kit-sub">R$ 500</span></button>'
          +'<button class="kit-btn'+(s.molaQtd===2?' active':'')+'" onclick="_setMola(2)" style="flex:1"><span class="kit-nm">2 molas</span><span class="kit-sub">R$ 1.000</span></button>'
          +'</div>'
        :'<button class="mola-toggle'+(s.molaQtd>0?' active':'')+'" onclick="orcToggleMola()">'
          +'<span class="mola-ic">⚙️</span><div class="mola-info"><span class="mola-nm">Mola Hidráulica</span>'
          +'<span class="mola-sub">R$ 500 · fecha automático</span></div>'
          +'<span class="mola-chk">'+(s.molaQtd>0?'✓':'')+'</span></button>'
      )+'</div>';
  }

  // ── Kit engenharia (correr/janela/box) ──
  var kitCorBlock = '';
  if (isCorrer||isJanela||isBox) {
    var kc=s.kitCor||'branco';
    kitCorBlock = '<div class="field"><label>Kit engenharia</label><div class="kit-opts">'
      +'<button class="kit-btn'+(kc==='branco'?' active':'')+'" onclick="_setKitCor(0)"><span class="kit-nm">Branco</span><span class="kit-sub">R$ 120/m²</span></button>'
      +'<button class="kit-btn'+(kc==='preto'?' active':'')+'" onclick="_setKitCor(1)"><span class="kit-nm">Preto</span><span class="kit-sub">R$ 130/m²</span></button>'
      +'</div></div>';
  }

  // ── Acessórios ──
  var accsBlock = '';
  var visAcc = _getVisAcc();
  var is2F   = isPiv && nFP===2;
  var puxOn  = !!(s.accs&&s.accs.puxador);
  var puxQtd = is2F?(s.puxadoresQtd||1):1;
  var puxQtdC= s.puxadoresCorrerQtd||1;

  if (isCorrer) {
    accsBlock = '<div class="section" style="margin-bottom:14px"><div class="section-ttl">Acessórios</div>'
      +'<div class="orc-accs"><button class="orc-acc-btn'+(puxOn?' on':'')+'" onclick="_togAcc(\'puxador\')">'+(puxOn?'✓':'+')+' Puxador</button></div>';
    if (puxOn) {
      accsBlock += '<div class="pux-qty-row"><span class="pux-qty-lbl">Quantidade:</span>'
        +'<button class="pux-qty-btn'+(puxQtdC===1?' active':'')+'" onclick="orcSetPuxCorrer(1)">1 · R$ 100</button>'
        +'<button class="pux-qty-btn'+(puxQtdC===2?' active':'')+'" onclick="orcSetPuxCorrer(2)">2 · R$ 200</button>'
        +'</div>';
    }
    accsBlock += '</div>';
  } else if (visAcc.length) {
    var ah='<div class="section" style="margin-bottom:14px"><div class="section-ttl">Acessórios</div><div class="orc-accs">';
    visAcc.forEach(function(a){
      var ativo=!!(s.accs&&(s.accs[a.id]!==undefined?s.accs[a.id]:a.obrig));
      ah += '<button class="orc-acc-btn'+(ativo?' on':'')+(a.obrig?' obrig':'')+'" onclick="'+(a.obrig?'_togAccObr':'_togAcc')+'(\''+a.id+'\')">'
        +(ativo?'✓':'+')+' '+a.nome+(a.preco?' · '+formatBRL(a.preco):'')+'</button>';
    });
    ah += '</div>';
    if (is2F&&puxOn) {
      ah += '<div class="pux-qty-row"><span class="pux-qty-lbl">Puxadores:</span>'
        +'<button class="pux-qty-btn'+(puxQtd===1?' active':'')+'" onclick="_setPuxQtd(0)">1 · R$ 100</button>'
        +'<button class="pux-qty-btn'+(puxQtd===2?' active':'')+'" onclick="_setPuxQtd(1)">2 · R$ 200</button>'
        +'</div>';
    }
    accsBlock = ah+'</div>';
  }

  // ── Vidro ──
  var vidroOpts='';
  vidrosDispo.forEach(function(v){
    vidroOpts+='<option value="'+v.key+'"'+(s.vidroKey===v.key?' selected':'')+'>'+v.nome+' — '+formatBRL(v.preco)+'/m²</option>';
  });

  // ── Qtd + km ──
  var qtdKmBlock = '<div class="campo-row">'
    +'<div class="field"><label>Quantidade</label><input id="orcQtd" type="number" inputmode="numeric" value="'+(s.qty||1)+'" min="1" oninput="orcUpdate()"></div>'
    +'<div class="field"><label>Distância (km)</label><input id="orcKm" type="number" inputmode="numeric" value="'+s.km+'" oninput="orcUpdate()"></div>'
    +'</div>';

  // ── Itens salvos ──
  var itensBlock = _renderItens();

  // ── Montar ──
  var _animClass2 = _orcAnimDir==='right' ? ' orc-slide-in-right' : '';
  _orcAnimDir = null;
  wrap.innerHTML = '<div id="pgOrcamento" class="orc-screen'+_animClass2+'">'
    + areaCrumb
    + clienteBlock
    + editBanner
    + tipoBlock
    + '<svg id="orcCAD" class="orc-cad" viewBox="0 0 320 200"></svg>'
    + boxBlock + pivConfig + folhasBlock + janelaBlock
    + dimBlock + fixoField + bandField
    + kitBlock + kitCorBlock
    + '<div class="field"><label>Tipo de vidro</label><select id="orcVidro" onchange="orcUpdate()">'+vidroOpts+'</select></div>'
    + accsBlock
    + qtdKmBlock
    + '<div id="orcResultBox"></div>'
    + '<div id="orcAcoes"></div>'
    + itensBlock
    + '<div id="orcSavedMsg"></div>'
    + '<div style="height:88px"></div>'
    + '</div>';

  _orcRefreshCAD();
  orcCalcAndRender();
  if (isPiv) { _renderMiniCADs(); _renderMiniKitCADs(); }
}

// ── Render lista de itens ─────────────────────────────────────
function _renderItens() {
  if (!orcItens.length) return '';
  var total=0, totalAv=0;
  var rows = '';
  orcItens.forEach(function(it,idx){
    var subtotal=(it.resultado.total||0)*(it.qty||1);
    var subtotalAv=(it.resultado.totalAvista||it.resultado.total||0)*(it.qty||1);
    total+=subtotal; totalAv+=subtotalAv;
    var isEditing = orcEditIdx===idx;
    rows += '<div class="orc-item-row'+(isEditing?' editing':'')+'">'
      +'<div class="orc-item-info">'
      +'<span class="orc-item-nome">'+(it.qty>1?it.qty+'× ':'')+it.desc+'</span>'
      +'<span class="orc-item-val">'+formatBRL(subtotal)+'</span>'
      +'</div>'
      +'<div class="orc-item-btns">'
      +(isEditing
        ?'<span style="font-size:.7rem;color:var(--gold)">editando</span>'
        :'<button class="orc-item-edit" onclick="orcEditarItem('+idx+')" title="Editar">✏️</button>'
      )
      +'<button class="orc-item-del" onclick="orcRemoverItem('+idx+')" title="Remover">✕</button>'
      +'</div></div>';
  });
  var html = '<div class="orc-itens-lista">'
    +'<div class="orc-itens-header"><span>📋 Itens</span>'
    +'<button class="orc-limpar-btn" onclick="orcLimparItens()">Limpar tudo</button></div>'
    +rows
    +'<div class="orc-itens-total"><span>Total:</span><span>'+formatBRL(total)+'</span></div>';
  if (totalAv < total) {
    html += '<div class="orc-avista" style="margin-top:4px">💚 À vista: '+formatBRL(totalAv)+'</div>';
  }
  html += '<div style="display:flex;gap:8px;margin-top:12px">'
    +'<button class="btn btn-ghost btn-full" onclick="orcSalvarTodos()">💾 Salvar orçamento</button>'
    +'<button class="btn btn-grn btn-full" onclick="orcEnviarTodos()">📤 Enviar</button>'
    +'</div></div>';
  return html;
}

// ── Ações de item ─────────────────────────────────────────────
function orcAdicionarItem() {
  var res = orcState.resultado;
  if (!res || !res.total) { alert('Configure o item antes de adicionar.'); return; }

  var desc = (TIPO_LABEL[orcState.tipo]||orcState.tipo)+' '+orcState.larg+'×'+orcState.alt+' cm';
  if ((orcState.qty||1) > 1) desc = orcState.qty+'× '+desc;
  var snap = JSON.parse(JSON.stringify(orcState));

  if (orcEditIdx >= 0) {
    orcItens[orcEditIdx] = {snap:snap, resultado:res, qty:orcState.qty||1, desc:desc};
    orcEditIdx = -1;
  } else {
    orcItens.push({snap:snap, resultado:res, qty:orcState.qty||1, desc:desc});
  }

  // Guardar cliente/fone e limpar tudo o resto
  var cliente = orcState.cliente;
  var fone    = orcState.fone;

  // Reset COMPLETO — dimensões vão para 0 para deixar claro que é um novo item
  _orcTouched = false;
  orcState.tipo            = 'pivotante';
  orcState.larg            = 0;
  orcState.alt             = 0;
  orcState.km              = 0;
  orcState.qty             = 1;
  orcState.vidroKey        = (VIDROS_POR_TIPO['pivotante']||[])[0]||'temp_trans';
  orcState.accs            = {};
  orcState.resultado       = null;
  orcState.temFixo         = false;
  orcState.temBandeirola   = false;
  orcState.pivFolhas       = 1;
  orcState.molaQtd         = 0;
  orcState.temMola         = false;
  orcState.janelaFolhas    = 2;
  orcState.folhasCorrer    = 2;
  orcState.puxadoresQtd    = 1;
  orcState.puxadoresCorrerQtd = 1;
  orcState.kitPivotante    = 'comum';
  orcState.kitCor          = 'branco';
  orcState.boxTipo         = 'conv';
  orcState.largB           = 0;
  orcState.fixoLarg        = 40;
  orcState.bandH           = 40;
  orcState.cliente         = cliente;
  orcState.fone            = fone;

  renderOrc(document.getElementById('pgWrap'));

  // Scroll para o topo para o usuário ver o formulário limpo
  var wrap = document.getElementById('pgWrap');
  if (wrap) wrap.scrollTop = 0;

  // Toast de confirmação
  histMostrarToast('✅ '+desc+' adicionado ao orçamento!');
}

function orcEditarItem(idx) {
  var it = orcItens[idx];
  if (!it) return;
  // Restaurar estado do item
  Object.assign(orcState, it.snap);
  orcEditIdx = idx;
  renderOrc(document.getElementById('pgWrap'));
}

function orcCancelarEdicao() {
  orcEditIdx = -1;
  var cliente=orcState.cliente, fone=orcState.fone;
  orcTrocaTipo(orcState.tipo);
  orcState.cliente=cliente; orcState.fone=fone;
  renderOrc(document.getElementById('pgWrap'));
}

function orcRemoverItem(idx) {
  orcItens.splice(idx,1);
  if (orcEditIdx===idx) orcEditIdx=-1;
  else if (orcEditIdx>idx) orcEditIdx--;
  renderOrc(document.getElementById('pgWrap'));
}

function orcLimparItens() {
  orcItens=[]; orcEditIdx=-1; _orcTouched=false;
  renderOrc(document.getElementById('pgWrap'));
}

// ── Cálculo e resultado ───────────────────────────────────────
function orcCalcAndRender() {
  var s=orcState;
  var res=calcularOrcamento({
    tipo:s.tipo, larg:s.larg, alt:s.alt, vidro:s.vidroKey, accs:s.accs||{}, km:s.km,
    folhasCorrer:s.folhasCorrer||2, pivFolhas:s.pivFolhas||1, kitPivotante:s.kitPivotante||'comum',
    temFixo:!!s.temFixo, fixoLarg:s.fixoLarg||40, temBandeirola:!!s.temBandeirola, bandH:s.bandH||40,
    temMola:s.molaQtd>0, puxadoresQtd:s.puxadoresQtd||1, janelaFolhas:s.janelaFolhas||2,
    kitCor:s.kitCor||'branco', molaQtd:s.molaQtd||0, boxTipo:s.boxTipo||'conv',
    largB:s.largB||80, puxadoresCorrerQtd:s.puxadoresCorrerQtd||1,
  });
  orcState.resultado=res;
  var rb=document.getElementById('orcResultBox'), ra=document.getElementById('orcAcoes');
  if (!rb) return;

  // Erro de validação (dimensão mínima)
  if (res && res.erro) {
    rb.innerHTML='<div class="orc-erro-dim">⚠️ '+res.erro+'</div>';
    if(ra) ra.innerHTML='';
    return;
  }

  if (res&&res.total>0) {
    var qty=s.qty||1, totalQ=res.total*qty, avistaQ=res.totalAvista*qty;
    var html='<div class="orc-result">'
      +'<div class="orc-total">'+formatBRL(totalQ)+(qty>1?' ('+qty+'× '+formatBRL(res.total)+')':'')+'</div>';
    if (avistaQ<totalQ) html+='<div class="orc-avista">💚 À vista: '+formatBRL(avistaQ)+'</div>';
    html+='<div class="orc-linhas">';
    res.linhas.forEach(function(l){
      var isFrete=l.nome.startsWith('Frete');
      var valorStr=(l.valor===0&&isFrete)?'<span style="color:var(--grn)">Grátis ✓</span>':formatBRL(l.valor);
      html+='<div class="orc-linha"><span>'+l.nome+'</span><span>'+valorStr+'</span></div>';
    });
    html+='</div></div>';
    rb.innerHTML=html;
    var btnLabel = orcEditIdx>=0 ? '✔ Atualizar item '+(orcEditIdx+1) : '➕ Adicionar ao orçamento';
    if (ra) ra.innerHTML='<button class="btn btn-gold btn-full" style="margin-bottom:8px" onclick="orcAdicionarItem()">'+btnLabel+'</button>'
      +'<div style="display:flex;gap:8px">'
      +'<button class="btn btn-ghost" style="flex:1" onclick="orcSalvar()">💾 Salvar</button>'
      +'<button class="btn btn-grn" style="flex:1" onclick="orcCompartilhar()">📤 Enviar</button>'
      +'</div>';
  } else {
    rb.innerHTML=''; if(ra) ra.innerHTML='';
  }
}

function orcUpdate() {
  var s=orcState;
  _orcTouched = true;
  s.larg    = parseFloat(document.getElementById('orcLarg')?.value)||0;
  s.alt     = parseFloat(document.getElementById('orcAlt')?.value)||0;
  s.vidroKey= document.getElementById('orcVidro')?.value||s.vidroKey;
  s.km      = parseFloat(document.getElementById('orcKm')?.value)||0;
  s.cliente = document.getElementById('orcCliente')?.value||'';
  s.fone    = document.getElementById('orcFone')?.value||'';
  s.qty     = parseInt(document.getElementById('orcQtd')?.value)||1;
  if (s.temFixo)       s.fixoLarg=parseFloat(document.getElementById('orcFixoLarg')?.value)||40;
  if (s.temBandeirola) s.bandH   =parseFloat(document.getElementById('orcBandH')?.value)||40;
  if (s.tipo==='box'&&s.boxTipo==='canto') s.largB=parseFloat(document.getElementById('orcLargB')?.value)||80;
  _orcRefreshCAD();
  orcCalcAndRender();
}

// ── Helpers ───────────────────────────────────────────────────
function _getVisAcc() {
  var s=orcState, isPiv=s.tipo==='pivotante';
  var a=CFG.acessorios||{};
  if (isPiv) {
    var list=[
      {id:'puxador', nome:'Puxador',          preco:a.puxador||100,          obrig:false},
      {id:'fixador', nome:'Fixador',           preco:a.fixador||60,           obrig:false},
    ];
    if((s.pivFolhas||1)===2){
      list.push({id:'contra',   nome:'Contra fechadura', preco:a.contra_fechadura||50, obrig:true});
      list.push({id:'ferrolho', nome:'Ferrolho 2×',      preco:a.ferrolho||120,       obrig:true});
    }
    return list;
  }
  if (s.tipo==='correr') return [];
  return ACESSORIOS_CONFIG[s.tipo]||[];
}

function _orcRefreshCAD() {
  var s=orcState, el=document.getElementById('orcCAD'); if(!el) return;
  renderCAD(el,{tipo:s.tipo,larg:s.larg,alt:s.alt,folhas:s.folhasCorrer,pivFolhas:s.pivFolhas||1,kitPivotante:s.kitPivotante||'comum',temFixo:s.temFixo,fixoLarg:s.fixoLarg||40,temBandeirola:s.temBandeirola,bandH:s.bandH||40,temMola:s.molaQtd>0,accs:s.accs||{},janelaFolhas:s.janelaFolhas||2});
}

function _renderMiniCADs() {
  [{id:'mcad_1s',fixo:null,band:false,f:1},{id:'mcad_1sf',fixo:'dir',band:false,f:1},{id:'mcad_1sb',fixo:null,band:true,f:1},{id:'mcad_1sfb',fixo:'dir',band:true,f:1},{id:'mcad_2s',fixo:null,band:false,f:2},{id:'mcad_2sf',fixo:'dir',band:false,f:2}]
  .forEach(function(x){renderMiniCAD(x.id,{tipo:'pivotante',fixo:x.fixo,band:x.band,folhas:x.f});});
}

// ── Ações de estado ───────────────────────────────────────────
function orcSetPivConfig(id) {
  var c=PIV_CONFIGS[id]; if(!c) return;
  orcState.pivFolhas=c.folhas; orcState.accs={}; orcState.puxadoresQtd=1; orcState.molaQtd=0; orcState.temMola=false;
  orcState.temFixo=c.fixo; orcState.temBandeirola=c.band;
  if(!orcState.fixoLarg) orcState.fixoLarg=40;
  if(!orcState.bandH)    orcState.bandH=40;
  renderOrc(document.getElementById('pgWrap'));
}
function orcTrocaTipo(tipo) {
  var c=orcState.cliente, f=orcState.fone;
  orcState.tipo=tipo; orcState.larg=DEFAULTS[tipo]?.larg??80; orcState.alt=DEFAULTS[tipo]?.alt??120;
  orcState.vidroKey=(VIDROS_POR_TIPO[tipo]||[])[0]||'temp_trans';
  orcState.accs={}; orcState.resultado=null; orcState.temFixo=false; orcState.temBandeirola=false;
  orcState.pivFolhas=1; orcState.molaQtd=0; orcState.temMola=false; orcState.janelaFolhas=2;
  orcState.puxadoresQtd=1; orcState.kitPivotante='comum'; orcState.kitCor='branco';
  orcState.boxTipo='conv'; orcState.qty=1; orcState.cliente=c; orcState.fone=f;
  if(tipo==='correr') orcState.folhasCorrer=2;
  renderOrc(document.getElementById('pgWrap'));
}
function orcSetFolhas(n)       { orcState.folhasCorrer=n; renderOrc(document.getElementById('pgWrap')); }
function orcSetJanelaFolhas(n) { orcState.janelaFolhas=n; renderOrc(document.getElementById('pgWrap')); }
function orcSetKit(id)         { orcState.kitPivotante=id; renderOrc(document.getElementById('pgWrap')); }
function orcSetKitCor(id)      { orcState.kitCor=id; renderOrc(document.getElementById('pgWrap')); }
function orcSetPuxQtd(n)       { orcState.puxadoresQtd=n; renderOrc(document.getElementById('pgWrap')); }
function orcSetPuxCorrer(n)    { orcState.puxadoresCorrerQtd=n; renderOrc(document.getElementById('pgWrap')); }
function orcSetMola(n)         { orcState.molaQtd=n; orcState.temMola=n>0; renderOrc(document.getElementById('pgWrap')); }
function orcToggleMola()       { var n=orcState.molaQtd>0?0:1; orcState.molaQtd=n; orcState.temMola=n>0; renderOrc(document.getElementById('pgWrap')); }
function orcSetBoxTipo(i)      { orcState.boxTipo=_ORC.boxTipos[i]; renderOrc(document.getElementById('pgWrap')); }
function orcToggleAcc(id,obrig){ if(obrig) return; orcState.accs[id]=!(orcState.accs[id]||false); renderOrc(document.getElementById('pgWrap')); }

// ── Salvar / enviar ───────────────────────────────────────────
async function orcSalvar() {
  if(!orcState.resultado) return;
  showModalConfirm('💾 Salvar orçamento?','Salvar '+formatBRL(orcState.resultado.total)+(orcState.cliente?' para '+orcState.cliente:'')+'?','Salvar',async function(){
    try {
      var dadosBase = {
        tipo:orcState.tipo, larg:orcState.larg, alt:orcState.alt, vidro:orcState.vidroKey,
        accs:orcState.accs, km:orcState.km, clienteNome:orcState.cliente.trim(),
        clienteFone:orcState.fone.trim(), resultado:orcState.resultado,
        folhasCorrer:orcState.folhasCorrer, pivFolhas:orcState.pivFolhas||1,
        kitPivotante:orcState.kitPivotante||'comum', temFixo:orcState.temFixo,
        fixoLarg:orcState.fixoLarg||0, temBandeirola:orcState.temBandeirola, bandH:orcState.bandH||0
      };
      closeModal();
      await _orcVincularCliente(dadosBase);
      var sm=document.getElementById('orcSavedMsg');
      if(sm){sm.innerHTML='<div class="orc-saved">✓ Salvo!</div>';setTimeout(function(){sm.innerHTML='';},2500);}
    } catch(e){alert('Erro: '+e.message);}
  });
}

async function _orcVincularCliente(dados) {
  var nomeOrc = (dados.clienteNome||''). trim();
  if (!nomeOrc) { await salvarOrcamento(dados); return; }
  var clientes = [];
  try { clientes = await listarClientes(); } catch(e){}
  var match = clientes.find(c => c.nome.toLowerCase() === nomeOrc.toLowerCase());
  if (!match) match = clientes.find(c =>
    c.nome.toLowerCase().includes(nomeOrc.toLowerCase()) ||
    nomeOrc.toLowerCase().includes(c.nome.toLowerCase())
  );
  if (match) {
    showModal('<div class="modal-titulo">🔗 Vincular ao cadastro?</div>'+
      '<div style="font-size:.82rem;color:var(--t3);margin-bottom:14px">Encontramos <b>'+esc(match.nome)+'</b> no cadastro.<br>Vincular este orçamento ao perfil?</div>'+
      '<div class="modal-row"><button class="btn btn-ghost btn-full" id="vincNaoBtn">Não vincular</button>'+
      '<button class="btn btn-gold btn-full" id="vincSimBtn">🔗 Vincular</button></div>');
    document.getElementById('vincSimBtn').onclick = async function(){
      await salvarOrcamento({...dados,clienteId:match.id,clienteNome:match.nome,clienteFone:match.fone||dados.clienteFone});
      closeModal(); histMostrarToast('✅ Salvo e vinculado a '+match.nome);
    };
    document.getElementById('vincNaoBtn').onclick = async function(){
      await salvarOrcamento(dados); closeModal(); histMostrarToast('✅ Orçamento salvo');
    };
  } else {
    showModal('<div class="modal-titulo">👤 Cadastrar cliente?</div>'+
      '<div style="font-size:.82rem;color:var(--t3);margin-bottom:14px"><b>'+esc(nomeOrc)+'</b> não está no cadastro.<br>Deseja criar um cadastro rápido?</div>'+
      '<div class="modal-row"><button class="btn btn-ghost btn-full" id="cadNaoBtn">Não agora</button>'+
      '<button class="btn btn-gold btn-full" id="cadSimBtn">➕ Cadastrar</button></div>');
    document.getElementById('cadSimBtn').onclick = async function(){
      try {
        var novoId = await salvarCliente({nome:nomeOrc,fone:dados.clienteFone||''});
        await salvarOrcamento({...dados,clienteId:novoId});
        closeModal(); histMostrarToast('✅ Salvo + cliente cadastrado!');
      } catch(e){ closeModal(); histMostrarToast('✅ Orçamento salvo'); }
    };
    document.getElementById('cadNaoBtn').onclick = async function(){
      await salvarOrcamento(dados); closeModal(); histMostrarToast('✅ Orçamento salvo');
    };
  }
}
async function orcSalvarTodos() {
  if(!orcItens.length) return;
  var totalGeral=orcItens.reduce(function(a,it){return a+(it.resultado.total||0)*(it.qty||1);},0);
  showModalConfirm('💾 Salvar orçamento completo?',orcItens.length+' iten'+(orcItens.length>1?'s':'')+' · '+formatBRL(totalGeral)+(orcState.cliente?' · '+orcState.cliente:''),'Salvar',async function(){
    try {
      await salvarOrcamento({tipo:'multi',clienteNome:orcState.cliente.trim(),clienteFone:orcState.fone.trim(),itens:orcItens,resultado:{total:totalGeral,totalAvista:totalGeral,linhas:[]},km:0});
      closeModal();
    } catch(e){alert('Erro: '+e.message);}
  });
}
function orcCompartilhar() { if(!orcState.resultado) return; showModalCompartilhar(orcState); }
function orcEnviarTodos()  { showModalCompartilhar({...orcState, itens:orcItens}); }
function orcWppDireto() {
  var num=(orcState.fone||'').replace(/\D/g,'');
  var txt;
  if (orcItens && orcItens.length > 0) {
    // Orçamento multi-item
    txt = gerarTextoWppMulti({ cliente:orcState.cliente, fone:orcState.fone, itens:orcItens });
  } else {
    // Item único
    txt = gerarTextoWpp({cliente:orcState.cliente,tipo:orcState.tipo,larg:orcState.larg,alt:orcState.alt,vidro:orcState.vidroKey,resultado:orcState.resultado,folhasCorrer:orcState.folhasCorrer});
  }
  if (!num) {
    histMostrarToast('⚠️ Informe o telefone do cliente antes de enviar');
    closeModal();
    // Foca no campo fone
    setTimeout(() => { var el=document.getElementById('orcFone'); if(el){el.focus();el.scrollIntoView({behavior:'smooth',block:'center'});} }, 300);
    return;
  }
  window.open('https://wa.me/55'+num+'?text='+encodeURIComponent(txt),'_blank');
  closeModal();
}
function orcEnviarEmail() {
  var itens = orcItens && orcItens.length > 0;
  var txt = itens
    ? gerarTextoWppMulti({ cliente:orcState.cliente, fone:orcState.fone, itens:orcItens })
    : gerarTextoWpp({ cliente:orcState.cliente, tipo:orcState.tipo, larg:orcState.larg,
        alt:orcState.alt, vidro:orcState.vidroKey, resultado:orcState.resultado,
        folhasCorrer:orcState.folhasCorrer });
  var nome  = CFG.empresa?.nome || 'Ceará Planejados';
  var total = itens
    ? orcItens.reduce(function(s,it){return s+(it.resultado?.total||0)*(it.qty||1);},0)
    : (orcState.resultado?.total||0);
  var assunto = encodeURIComponent('Orçamento — ' + nome + (orcState.cliente ? ' para ' + orcState.cliente : '') + ' — ' + formatBRL(total));
  var corpo   = encodeURIComponent(txt);
  window.open('mailto:?subject=' + assunto + '&body=' + corpo, '_blank');
  closeModal();
}

function orcGerarPDF() {
  closeModal();
  // Se houver itens no orçamento multi, usa o gerador multi
  if (orcItens && orcItens.length > 0) {
    gerarPDFMulti({ itens: orcItens, cliente: orcState.cliente, fone: orcState.fone });
  } else {
    gerarPDFOrcamento(orcState);
  }
}
