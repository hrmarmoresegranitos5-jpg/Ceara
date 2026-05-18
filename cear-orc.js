// ════════════════════════════════════════════════════════════
// ORÇAMENTO — versão limpa e confiável
// ════════════════════════════════════════════════════════════

// Tabelas globais de lookup (evita problemas de escape em onclick)
var _ORC = {
  kitCores: ['branco','preto'],
  boxTipos: ['fixo','conv','3p','4p','canto'],
  pivCfgs:  ['1s','1sf','1sb','1sfb','2s','2sf'],
  kits:     ['comum','jumbo'],
  folhas:   [1,2,3,4],
  jFolhas:  [2,3,4],
  puxQtd:   [1,2],
  pivLabels:['1 folha','1 + fixo','1 + band.','1+fixo+band.','2 folhas','2 + fixo'],
};

// Funções de ação globais (chamadas pelos botões via index)
function _setPivCfg(i)    { orcSetPivConfig(_ORC.pivCfgs[i]); }
function _setKit(i)       { orcSetKit(_ORC.kits[i]); }
function _setFolhas(i)    { orcSetFolhas(_ORC.folhas[i]); }
function _setJFolhas(i)   { orcSetJanelaFolhas(_ORC.jFolhas[i]); }
function _setPuxQtd(i)    { orcSetPuxQtd(_ORC.puxQtd[i]); }
function _setKitCor(i)    { orcSetKitCor(_ORC.kitCores[i]); }
function _togAcc(id)      { orcToggleAcc(id, false); }
function _togAccObr(id)   { orcToggleAcc(id, true); }

// ── Renderização principal ────────────────────────────────────
function renderOrc(wrap) {
  if (!wrap) return;
  const s = orcState;
  const isPiv    = s.tipo === 'pivotante';
  const isCorrer = s.tipo === 'correr';
  const isJanela = s.tipo === 'janela';
  const vidrosDispo = (VIDROS_POR_TIPO[s.tipo]||[]).map(k=>({key:k,...CFG.vidros[k]}));

  // ── Seletor tipo (scroll horizontal) ──
  let tipoBlock = '<div class="orc-tipos" id="orcTipos">';
  TIPOS.forEach(function(t) {
    tipoBlock += '<button class="orc-tipo-btn' + (s.tipo===t.id?' active':'') + '" onclick="orcTrocaTipo(\'' + t.id + '\')">'
      + '<span class="orc-tipo-ic">' + t.icon + '</span>'
      + '<span class="orc-tipo-lbl">' + t.label + '</span>'
      + '</button>';
  });
  tipoBlock += '</div>';

  // ── Seletor configuração pivotante (6 mini-desenhos) ──
  let pivConfig = '';
  if (isPiv) {
    // Ícones de configuração sem SVG (mais limpo)
    const _icons = ['🚪','🚪▐','▬🚪','▬🚪▐','🚪🚪','🚪🚪▐'];
    let btns = '';
    _ORC.pivCfgs.forEach(function(id, i) {
      const c = PIV_CONFIGS[id];
      const cur = (s.pivFolhas===c.folhas && !!s.temFixo===c.fixo && !!s.temBandeirola===c.band);
      btns += '<button class="piv-cfg-btn' + (cur?' active':'') + '" onclick="_setPivCfg(' + i + ')">'
        + '<span class="piv-cfg-lbl">' + _ORC.pivLabels[i] + '</span>'
        + '</button>';
    });
    pivConfig = '<div class="piv-config-ttl">Configuração da porta</div>'
      + '<div class="piv-configs" id="pivConfigs">' + btns + '</div>';
  }

  // ── Seletor folhas correr ──
  let folhasBlock = '';
  if (isCorrer) {
    let btns = '';
    [1,2,3,4].forEach(function(n, i) {
      const nM = CORRER_MOVEIS[n]||n, nFx = n-nM;
      const vpvv = nM<=1?'VP':'VV';
      const desc = nFx>0
        ? nM+' móve'+(nM>1?'is':'l')+' + '+nFx+' fixa'+(nFx>1?'s':'')+' · '+vpvv
        : nM+' móve'+(nM>1?'is':'l')+' · '+vpvv;
      btns += '<button class="folha-btn'+(s.folhasCorrer===n?' active':'')+'" onclick="_setFolhas('+i+')">'
        + '<span class="folha-n">'+n+'</span>'
        + '<span class="folha-lbl">'+(n===1?'folha':'folhas')+'</span>'
        + '<span class="folha-desc">'+desc+'</span>'
        + '</button>';
    });
    folhasBlock = '<div class="field" style="margin-bottom:14px"><label>Número de folhas</label>'
      + '<div class="correr-folhas">'+btns+'</div></div>';
  }

  // ── Seletor folhas janela ──
  let janelaBlock = '';
  if (isJanela) {
    const nFj = s.janelaFolhas||2;
    const defs = [
      {n:2, desc:'1 fixa · 1 móvel · VP'},
      {n:3, desc:'1 fixa · 2 móveis · VV'},
      {n:4, desc:'2 fixas · 2 móveis · VV'},
    ];
    let btns = '';
    defs.forEach(function(d, i) {
      btns += '<button class="folha-btn'+(nFj===d.n?' active':'')+'" onclick="_setJFolhas('+i+')">'
        + '<span class="folha-n">'+d.n+'</span>'
        + '<span class="folha-lbl">folhas</span>'
        + '<span class="folha-desc">'+d.desc+'</span>'
        + '</button>';
    });
    janelaBlock = '<div class="field" style="margin-bottom:14px"><label>Número de folhas</label>'
      + '<div class="correr-folhas">'+btns+'</div></div>';
  }

  // ── Seletor tipo de box ──
  let boxTipoBlock = '';
  const isBox = s.tipo === 'box';
  if (isBox) {
    const bt = s.boxTipo||'conv';
    const bts = [
      {id:'fixo',  label:'Só Fixo',        desc:'Vidro fixo + PU'},
      {id:'conv',  label:'1F + 1M',         desc:'Convencional'},
      {id:'3p',    label:'2F + 1M',         desc:'Central'},
      {id:'4p',    label:'2F + 2M',         desc:'4 painéis'},
      {id:'canto', label:'Canto',           desc:'+R$100/m²'},
    ];
    let bb = '';
    bts.forEach(function(b,i){
      bb += '<button class="folha-btn'+(bt===b.id?' active':'')+'" onclick="orcSetBoxTipo('+i+')">'
        + '<span class="folha-n" style="font-size:.75rem">'+b.label+'</span>'
        + '<span class="folha-desc">'+b.desc+'</span></button>';
    });
    boxTipoBlock = '<div class="field" style="margin-bottom:12px"><label>Tipo de box</label>'
      + '<div class="correr-folhas">'+bb+'</div></div>';
    // Canto: segunda medida
    if (bt==='canto') {
      boxTipoBlock += '<div class="campo-row">'
        + '<div class="field"><label>Lado A — Largura (cm)</label><input id="orcLarg" type="number" inputmode="numeric" value="'+s.larg+'" oninput="orcUpdate()"></div>'
        + '<div class="field"><label>Lado B — Largura (cm)</label><input id="orcLargB" type="number" inputmode="numeric" value="'+(s.largB||80)+'" oninput="orcUpdate()"></div>'
        + '</div>';
    }
  }

  // ── Seletor cor do kit engenharia (correr/janela) ──
  let kitCorBlock = '';
  if (isCorrer || isJanela) {
    const kc = s.kitCor||'branco';
    kitCorBlock = '<div class="field"><label>Kit engenharia</label>'
      + '<div class="kit-opts">'
      + '<button class="kit-btn'+(kc==='branco'?' active':'')+'" onclick="orcSetKitCor(0)">'
      + '<span class="kit-nm">Branco</span><span class="kit-sub">R$ 120/m²</span><span class="kit-desc">Padrão</span></button>'
      + '<button class="kit-btn'+(kc==='preto'?' active':'')+'" onclick="orcSetKitCor(1)">'
      + '<span class="kit-nm">Preto</span><span class="kit-sub">R$ 130/m²</span><span class="kit-desc">Premium</span></button>'
      + '</div></div>';
  }

  // ── Badge info correr ──
  let correrBadge = '';
  if (isCorrer) {
    const nF=s.folhasCorrer||2, nM=CORRER_MOVEIS[nF]||2, nFx=nF-nM, vpvv=nM<=1?'VP':'VV';
    correrBadge = '<div class="correr-info">'
      + '<div class="ci-item"><span class="ci-ic">🔲</span><span class="ci-v">'+nF+'</span><span class="ci-l">folha'+(nF>1?'s':'')+'</span></div>'
      + '<div class="ci-sep"></div>'
      + '<div class="ci-item"><span class="ci-ic">↔️</span><span class="ci-v">'+nM+'</span><span class="ci-l">móve'+(nM>1?'is':'l')+'</span></div>';
    if (nFx>0) correrBadge += '<div class="ci-sep"></div><div class="ci-item"><span class="ci-ic">🔒</span><span class="ci-v">'+nFx+'</span><span class="ci-l">fixa'+(nFx>1?'s':'')+'</span></div>';
    correrBadge += '<div class="ci-sep"></div>'
      + '<div class="ci-item"><span class="ci-ic">🔑</span><span class="ci-v">'+vpvv+'</span><span class="ci-l">fechadura</span></div>'
      + '</div>';
  }

  // ── Campos dimensão ──
  const fixoField = (isPiv && s.temFixo)
    ? '<div class="field" style="margin-top:-4px"><label>Largura do fixo lateral (cm)</label>'
      + '<input id="orcFixoLarg" type="number" inputmode="numeric" value="'+(s.fixoLarg||40)+'" min="1" oninput="orcUpdate()"></div>'
    : '';
  const bandField = (isPiv && s.temBandeirola)
    ? '<div class="field" style="margin-top:-4px"><label>Altura da bandeirola (cm)</label>'
      + '<input id="orcBandH" type="number" inputmode="numeric" value="'+(s.bandH||40)+'" min="1" oninput="orcUpdate()"></div>'
    : '';

  // ── Kit pivotante + Mola ──
  const nFolhasPiv = isPiv ? (s.pivFolhas||1) : 1;
  let kitBlock = '';
  if (isPiv) {
    kitBlock = '<div class="field"><label>Kit pivotante</label>'
      + '<div class="kit-opts kit-opts-kits">'
      + '<button class="kit-btn'+(s.kitPivotante==='comum'?' active':'')+'" onclick="_setKit(0)">'
        +'<span class="kit-nm">Comum</span><span class="kit-sub">R$ 150</span><span class="kit-desc">Padrão</span></button>'
      + '<button class="kit-btn'+(s.kitPivotante==='jumbo'?' active':'')+'" onclick="_setKit(1)">'
        +'<span class="kit-nm">Jumbo</span><span class="kit-sub">R$ 350</span><span class="kit-desc">Portas grandes</span></button>'
      + '</div></div>'
      // Mola: 1 folha = toggle; 2 folhas = 0/1/2
      + '<div class="field mola-field">'
      + (nFolhasPiv===2
        ? '<label style="font-size:.72rem;color:var(--t3)">Mola hidráulica</label>'
          + '<div class="kit-opts" style="margin-top:6px">'
          + '<button class="kit-btn'+(s.molaQtd===0?' active':'')+'" onclick="orcSetMola(0)" style="flex:1"><span class="kit-nm">Sem mola</span></button>'
          + '<button class="kit-btn'+(s.molaQtd===1?' active':'')+'" onclick="orcSetMola(1)" style="flex:1"><span class="kit-nm">1 mola</span><span class="kit-sub">R$ 500</span></button>'
          + '<button class="kit-btn'+(s.molaQtd===2?' active':'')+'" onclick="orcSetMola(2)" style="flex:1"><span class="kit-nm">2 molas</span><span class="kit-sub">R$ 1.000</span></button>'
          + '</div>'
        : '<button class="mola-toggle'+(s.molaQtd>0?' active':'')+'" onclick="orcToggleMola()">'
          + '<span class="mola-ic">⚙️</span>'
          + '<div class="mola-info"><span class="mola-nm">Mola Hidráulica</span>'
          + '<span class="mola-sub">R$ 500 · fecha automático</span></div>'
          + '<span class="mola-chk">'+(s.molaQtd>0?'✓':'')+'</span>'
          + '</button>'
      )
      + '</div>';
  }

  // ── Acessórios ──
  let accsBlock = '';
  const is2Folhas = isPiv && (s.pivFolhas||1) === 2;
  const puxQtd = is2Folhas ? (s.puxadoresQtd||1) : 1;
  const puxAtivo = !!(s.accs && s.accs.puxador);

  // Para correr: puxador como acessório
  if (isCorrer) {
    const nM2 = CORRER_MOVEIS[s.folhasCorrer||2]||2;
    const puxOnC = !!(s.accs && s.accs.puxador);
    accsBlock = '<div class="section" style="margin-bottom:14px"><div class="section-ttl">Acessórios</div>'
      + '<div class="orc-accs" id="orcAccs">'
      + '<button class="orc-acc-btn'+(puxOnC?' on':'')+'" onclick="_togAcc(\'puxador\')">'
      + (puxOnC?'✓':'+')+ ' Puxador ('+nM2+'× R$ 100,00)</button>'
      + '</div></div>';
  } else {
    // Para outros tipos: lista de acessórios
    const visAcc = _getVisAcc();
    if (visAcc.length) {
      let ah = '<div class="section" style="margin-bottom:14px"><div class="section-ttl">Acessórios</div>'
             + '<div class="orc-accs" id="orcAccs">';
      visAcc.forEach(function(a) {
        const ativo = !!(s.accs && (s.accs[a.id] !== undefined ? s.accs[a.id] : a.obrig));
        const fn = a.obrig ? '_togAccObr' : '_togAcc';
        ah += '<button class="orc-acc-btn'+(ativo?' on':'')+(a.obrig?' obrig':'')
           + '" onclick="'+fn+'(\''+a.id+'\')">'
           + (ativo?'✓':'+')+' '+a.nome+(a.preco?' ('+formatBRL(a.preco)+')':'')+'</button>';
      });
      ah += '</div>';
      if (is2Folhas && puxAtivo) {
        ah += '<div class="pux-qty-row"><span class="pux-qty-lbl">Quantidade:</span>'
          + '<button class="pux-qty-btn'+(puxQtd===1?' active':'')+'" onclick="_setPuxQtd(0)">1 puxador · R$ 100</button>'
          + '<button class="pux-qty-btn'+(puxQtd===2?' active':'')+'" onclick="_setPuxQtd(1)">2 puxadores · R$ 200</button>'
          + '</div>';
      }
      ah += '</div>';
      accsBlock = ah;
    }
  }

  // ── Vidro select ──
  let vidroOpts = '';
  vidrosDispo.forEach(function(v) {
    vidroOpts += '<option value="'+v.key+'"'+(s.vidroKey===v.key?' selected':'')+'>'+v.nome+' — '+formatBRL(v.preco)+'/m²</option>';
  });

  // ── Montar HTML ──
  wrap.innerHTML = '<div id="pgOrcamento">'
    + tipoBlock
    + boxTipoBlock
    + '<svg id="orcCAD" class="orc-cad" viewBox="0 0 320 200"></svg>'
    + pivConfig
    + folhasBlock
    + janelaBlock
    + kitCorBlock
    + correrBadge
    + '<div class="campo-row">'
    + '<div class="field"><label>Largura (cm)</label><input id="orcLarg" type="number" inputmode="numeric" value="'+s.larg+'" oninput="orcUpdate()"></div>'
    + '<div class="field"><label>Altura (cm)</label><input id="orcAlt" type="number" inputmode="numeric" value="'+s.alt+'" oninput="orcUpdate()"></div>'
    + '</div>'
    + fixoField + bandField
    + kitBlock
    + '<div class="field"><label>Tipo de vidro</label><select id="orcVidro" onchange="orcUpdate()">'
    + vidroOpts + '</select></div>'
    + accsBlock
    + '<div class="field"><label>Distância (km) — frete grátis até '+CFG.comercial.frete_gratis_km+' km</label>'
    + '<input id="orcKm" type="number" inputmode="numeric" value="'+s.km+'" oninput="orcUpdate()"></div>'
    + '<div class="campo-row">'
    + '<div class="field"><label>Cliente</label><input id="orcCliente" type="text" value="'+s.cliente+'" placeholder="Nome" oninput="orcUpdate()"></div>'
    + '<div class="field"><label>Telefone</label><input id="orcFone" type="tel" value="'+s.fone+'" placeholder="(85) 9..." oninput="orcUpdate()"></div>'
    + '</div>'
    + '<div id="orcResultBox"></div>'
    + '<div id="orcSavedMsg"></div>'
    + '<div id="orcAcoes"></div>'
    + '<div style="height:88px"></div>'
    + '</div>';

  _orcRefreshCAD();
  orcCalcAndRender();
}

// ── Configs pivotante ──────────────────────────────────────────
var PIV_CONFIGS = {
  '1s':   { folhas:1, fixo:false, band:false },
  '1sf':  { folhas:1, fixo:true,  band:false },
  '1sb':  { folhas:1, fixo:false, band:true  },
  '1sfb': { folhas:1, fixo:true,  band:true  },
  '2s':   { folhas:2, fixo:false, band:false },
  '2sf':  { folhas:2, fixo:true,  band:false },
};

function orcSetPivConfig(id) {
  var c = PIV_CONFIGS[id]; if (!c) return;
  orcState.pivFolhas     = c.folhas;
  orcState.accs          = {};
  orcState.puxadoresQtd  = 1;
  orcState.temFixo       = c.fixo;
  orcState.temBandeirola = c.band;
  if (!orcState.fixoLarg) orcState.fixoLarg = 40;
  if (!orcState.bandH)    orcState.bandH    = 40;
  renderOrc(document.getElementById('pgWrap'));
}

function orcSetJanelaFolhas(n) { orcState.janelaFolhas = n; renderOrc(document.getElementById('pgWrap')); }
function orcSetFolhas(n)       { orcState.folhasCorrer = n; renderOrc(document.getElementById('pgWrap')); }
function orcSetKitCor(id)      { orcState.kitCor = id; renderOrc(document.getElementById('pgWrap')); }
function orcSetKit(id)         { orcState.kitPivotante = id; renderOrc(document.getElementById('pgWrap')); }
function orcSetPuxQtd(n)       { orcState.puxadoresQtd = n; renderOrc(document.getElementById('pgWrap')); }
function orcSetMola(n)         { orcState.molaQtd = n; orcState.temMola = n>0; renderOrc(document.getElementById('pgWrap')); }
function orcToggleMola()       { orcState.molaQtd = orcState.molaQtd>0?0:1; orcState.temMola = orcState.molaQtd>0; renderOrc(document.getElementById('pgWrap')); }
function orcSetPuxCorrer(n)    { orcState.puxadoresCorrerQtd = n; renderOrc(document.getElementById('pgWrap')); }
function orcSetBoxTipo(i)      {
  const bts=['fixo','conv','3p','4p','canto'];
  orcState.boxTipo = bts[i]||'conv';
  renderOrc(document.getElementById('pgWrap'));
}


function _renderMiniCADs() {
  var cfgMap = {
    'mcad_1s':   { tipo:'pivotante', fixo:null,  band:false, folhas:1 },
    'mcad_1sf':  { tipo:'pivotante', fixo:'dir', band:false, folhas:1 },
    'mcad_1sb':  { tipo:'pivotante', fixo:null,  band:true,  folhas:1 },
    'mcad_1sfb': { tipo:'pivotante', fixo:'dir', band:true,  folhas:1 },
    'mcad_2s':   { tipo:'pivotante', fixo:null,  band:false, folhas:2 },
    'mcad_2sf':  { tipo:'pivotante', fixo:'dir', band:false, folhas:2 },
  };
  Object.entries(cfgMap).forEach(function(e) { renderMiniCAD(e[0], e[1]); });
}

// ── Atualizar CAD ─────────────────────────────────────────────
function _orcRefreshCAD() {
  var s = orcState, el = document.getElementById('orcCAD');
  if (!el) return;
  renderCAD(el, {
    tipo:s.tipo, larg:s.larg, alt:s.alt,
    folhas:s.folhasCorrer, pivFolhas:s.pivFolhas||1,
    kitPivotante:s.kitPivotante||'comum',
    temFixo:s.temFixo, fixoLarg:s.fixoLarg||40,
    temBandeirola:s.temBandeirola, bandH:s.bandH||40,
    temMola:s.temMola, accs:s.accs||{},
    janelaFolhas:s.janelaFolhas||2,
  });
}

// ── Acessórios visíveis ────────────────────────────────────────
function _getVisAcc() {
  var s = orcState, isPiv = s.tipo==='pivotante', isCorrer = s.tipo==='correr';
  if (isPiv) {
    var list = [
      { id:'puxador', nome:'Puxador',  preco:100, obrig:false },
      { id:'fixador', nome:'Fixador',  preco:60,  obrig:false },
    ];
    if ((s.pivFolhas||1)===2) {
      list.push({ id:'contra',   nome:'Contra fechadura', preco:50, obrig:true  });
      list.push({ id:'ferrolho', nome:'Ferrolho (2×)',    preco:120, obrig:true  });
    }
    return list;
  }
  if (isCorrer) return [];
  return ACESSORIOS_CONFIG[s.tipo] || [];
}

function orcToggleAcc(id, obrig) {
  if (obrig) return;
  orcState.accs[id] = !(orcState.accs[id]||false);
  renderOrc(document.getElementById('pgWrap'));
}

// ── Calcular e exibir resultado ───────────────────────────────
function orcUpdate() {
  var s = orcState;
  s.larg    = parseFloat(document.getElementById('orcLarg')?.value)||0;
  s.alt     = parseFloat(document.getElementById('orcAlt')?.value)||0;
  s.vidroKey= document.getElementById('orcVidro')?.value||s.vidroKey;
  s.km      = parseFloat(document.getElementById('orcKm')?.value)||0;
  s.cliente = document.getElementById('orcCliente')?.value||'';
  s.fone    = document.getElementById('orcFone')?.value||'';
  if (s.temFixo)       s.fixoLarg = parseFloat(document.getElementById('orcFixoLarg')?.value)||40;
  if (s.tipo==='box'&&s.boxTipo==='canto') s.largB = parseFloat(document.getElementById('orcLargB')?.value)||80;
  if (s.temBandeirola) s.bandH    = parseFloat(document.getElementById('orcBandH')?.value)||40;
  _orcRefreshCAD();
  orcCalcAndRender();
}

function orcCalcAndRender() {
  var s = orcState;
  var res = calcularOrcamento({
    tipo:s.tipo, larg:s.larg, alt:s.alt, vidro:s.vidroKey,
    accs:s.accs||{}, km:s.km,
    folhasCorrer:s.folhasCorrer||2,
    pivFolhas:s.pivFolhas||1,
    kitPivotante:s.kitPivotante||'comum',
    temFixo:!!s.temFixo, fixoLarg:s.fixoLarg||40,
    temBandeirola:!!s.temBandeirola, bandH:s.bandH||40,
    temMola:!!s.temMola,
    puxadoresQtd:s.puxadoresQtd||1,
    janelaFolhas:s.janelaFolhas||2,
    kitCor:s.kitCor||'branco',
    molaQtd:s.molaQtd||0,
    boxTipo:s.boxTipo||'conv',
    largB:s.largB||80,
    puxadoresCorrerQtd:s.puxadoresCorrerQtd||1,
  });
  orcState.resultado = res;
  var rb = document.getElementById('orcResultBox');
  var ra = document.getElementById('orcAcoes');
  if (!rb) return;
  if (res && res.total > 0) {
    var html = '<div class="orc-result">'
      + '<div class="orc-total">'+formatBRL(res.total)+'</div>';
    if (res.totalAvista < res.total) {
      html += '<div class="orc-avista">💚 À vista: '+formatBRL(res.totalAvista)+' ('+Math.round(CFG.comercial.desconto_avista*100)+'% off)</div>';
    }
    html += '<div class="orc-linhas">';
    res.linhas.forEach(function(l) {
      if (l.valor > 0) html += '<div class="orc-linha"><span>'+l.nome+'</span><span>'+formatBRL(l.valor)+'</span></div>';
    });
    html += '</div></div>';
    rb.innerHTML = html;
    if (ra) ra.innerHTML = '<div style="display:flex;gap:10px;margin-bottom:12px">'
      + '<button class="btn btn-ghost btn-full" onclick="orcSalvar()">💾 Salvar</button>'
      + '<button class="btn btn-grn btn-full" onclick="orcCompartilhar()">📤 Compartilhar</button>'
      + '</div>';
  } else {
    rb.innerHTML = '';
    if (ra) ra.innerHTML = '';
  }
}

// ── Trocar tipo ───────────────────────────────────────────────
function orcTrocaTipo(tipo) {
  orcState.tipo     = tipo;
  orcState.larg     = DEFAULTS[tipo]?.larg ?? 80;
  orcState.alt      = DEFAULTS[tipo]?.alt  ?? 120;
  orcState.vidroKey = (VIDROS_POR_TIPO[tipo]||[])[0]||'temp_trans';
  orcState.accs          = {};
  orcState.resultado     = null;
  orcState.temFixo       = false;
  orcState.temBandeirola = false;
  orcState.pivFolhas     = 1;
  orcState.temMola       = false;
  orcState.janelaFolhas  = 2;
  orcState.puxadoresQtd  = 1;
  orcState.kitPivotante  = 'comum';
  orcState.kitCor        = 'branco';
  if (tipo==='correr') orcState.folhasCorrer = 2;
  renderOrc(document.getElementById('pgWrap'));
}

// ── Salvar/Compartilhar ───────────────────────────────────────
async function orcSalvar() {
  if (!orcState.resultado) return;
  showModalConfirm('💾 Salvar orçamento?',
    'Salvar ' + formatBRL(orcState.resultado.total) + (orcState.cliente?' para '+orcState.cliente:'') + '?',
    'Salvar',
    async function() {
      try {
        await salvarOrcamento({
          tipo:orcState.tipo, larg:orcState.larg, alt:orcState.alt,
          vidro:orcState.vidroKey, accs:orcState.accs, km:orcState.km,
          clienteNome:orcState.cliente.trim(), clienteFone:orcState.fone.trim(),
          resultado:orcState.resultado, folhasCorrer:orcState.folhasCorrer,
          pivFolhas:orcState.pivFolhas||1, kitPivotante:orcState.kitPivotante||'comum',
          temFixo:orcState.temFixo, fixoLarg:orcState.fixoLarg||0,
          temBandeirola:orcState.temBandeirola, bandH:orcState.bandH||0
        });
        closeModal();
        var sm=document.getElementById('orcSavedMsg');
        if(sm){sm.innerHTML='<div class="orc-saved">✓ Orçamento salvo!</div>';setTimeout(function(){sm.innerHTML='';},3000);}
      } catch(e) { alert('Erro: '+e.message); }
    }
  );
}
function orcCompartilhar() { if (!orcState.resultado) return; showModalCompartilhar(orcState); }
function orcWppDireto() {
  var txt = gerarTextoWpp({cliente:orcState.cliente,tipo:orcState.tipo,larg:orcState.larg,alt:orcState.alt,vidro:orcState.vidroKey,resultado:orcState.resultado,folhasCorrer:orcState.folhasCorrer});
  var num=(orcState.fone||'').replace(/\D/g,'');
  window.open((num?'https://wa.me/55'+num:'https://wa.me/')+'?text='+encodeURIComponent(txt),'_blank');
  closeModal();
}
function orcGerarPDF() { closeModal(); gerarPDFOrcamento(orcState); }
