// ════════════════════════════════════════════════════════════
// ORÇAMENTO
// ════════════════════════════════════════════════════════════

function renderOrc(wrap) {
  const s = orcState;
  const isPiv    = s.tipo === 'pivotante';
  const isCorrer = s.tipo === 'correr';
  const isJanela = s.tipo === 'janela';
  // Para pivotante 2 folhas: adiciona contra fechadura automaticamente
  let accConfig = (ACESSORIOS_CONFIG[s.tipo] || []).slice();
  if (isPiv && (s.pivFolhas||1) === 2) {
    if (!accConfig.find(a => a.id === 'contra')) {
      accConfig.push({ id:'contra', nome:'Contra fechadura (2 folhas)', preco:50, obrig:true });
    }
  }
  const vidrosDispo = (VIDROS_POR_TIPO[s.tipo]||[]).map(k=>({key:k,...CFG.vidros[k]}));

  // ── Seletor visual de configuração (pivotante) — usa concatenação para evitar
  //    problemas com template literals aninhados
  let pivConfig = '';
  if (isPiv) {
    const _cfgs = [
      { id:'1s',   label:'1 folha',        fixo:false, band:false, folhas:1 },
      { id:'1sf',  label:'1 + fixo',        fixo:true,  band:false, folhas:1 },
      { id:'1sb',  label:'1 + bandeirola',  fixo:false, band:true,  folhas:1 },
      { id:'1sfb', label:'1+fixo+band.',    fixo:true,  band:true,  folhas:1 },
      { id:'2s',   label:'2 folhas',        fixo:false, band:false, folhas:2 },
      { id:'2sf',  label:'2 + fixo',        fixo:true,  band:false, folhas:2 },
    ];
    let _btns = '';
    for (const c of _cfgs) {
      const cur = (s.pivFolhas===c.folhas && !!s.temFixo===c.fixo && !!s.temBandeirola===c.band);
      _btns += '<button class="piv-cfg-btn' + (cur?' active':'') + '" onclick="orcSetPivConfig(\'' + c.id + '\')">';
      _btns += '<svg id="mcad_' + c.id + '" class="piv-cfg-cad" viewBox="0 0 60 44" width="60" height="44"></svg>';
      _btns += '<span class="piv-cfg-lbl">' + c.label + '</span>';
      _btns += '</button>';
    }
    pivConfig = '<div class="piv-config-ttl">Configuração da porta</div>'
              + '<div class="piv-configs" id="pivConfigs">' + _btns + '</div>';
  }

  // ── Folhas para porta de correr ──
  const folhasBlock = isCorrer ? `
    <div class="field" style="margin-bottom:14px">
      <label>Número de folhas</label>
      <div class="correr-folhas" id="correrFolhas">
        ${[1,2,4].map(n => {
          const moveis = CORRER_MOVEIS[n]??n, fixas=n-moveis;
          const vpvv = moveis<=1?'VP':'VV';
          const desc = fixas>0
            ? `${moveis} móve${moveis>1?'is':'l'} + ${fixas} fixa${fixas>1?'s':''} · ${vpvv}`
            : `${moveis} móve${moveis>1?'is':'l'} · ${vpvv}`;
          return `<button class="folha-btn${s.folhasCorrer===n?' active':''}" onclick="orcSetFolhas(${n})">
            <span class="folha-n">${n}</span>
            <span class="folha-lbl">${n===1?'folha':'folhas'}</span>
            <span class="folha-desc">${desc}</span>
          </button>`;
        }).join('')}
      </div>
    </div>
  ` : '';

  // ── Info correr VP/VV ──
  const correrInfo = isCorrer ? (() => {
    const nF=s.folhasCorrer, nM=CORRER_MOVEIS[nF]??2, nFx=nF-nM, vpvv=nM<=1?'VP':'VV';
    return `<div class="correr-info" id="correrInfo">
      <div class="ci-item"><span class="ci-ic">🔲</span><span class="ci-v">${nF}</span><span class="ci-l">folha${nF>1?'s':''}</span></div>
      <div class="ci-sep"></div>
      <div class="ci-item"><span class="ci-ic">↔️</span><span class="ci-v">${nM}</span><span class="ci-l">móve${nM>1?'is':'l'}</span></div>
      ${nFx>0?`<div class="ci-sep"></div><div class="ci-item"><span class="ci-ic">🔒</span><span class="ci-v">${nFx}</span><span class="ci-l">fixa${nFx>1?'s':''}</span></div>`:''}
      <div class="ci-sep"></div>
      <div class="ci-item"><span class="ci-ic">🔑</span><span class="ci-v">${vpvv}</span><span class="ci-l">fechadura</span></div>
      <div class="ci-sep"></div>
      <div class="ci-item"><span class="ci-ic">✋</span><span class="ci-v">${nM}</span><span class="ci-l">puxador${nM>1?'es':''}</span></div>
    </div>`;
  })() : '';

  // ── Info janela auto ──
  const janelaInfo = isJanela ? (() => {
    const nFj = s.larg<=120?2:4, vpvv=nFj===2?'VP':'VV';
    return `<div class="correr-info">
      <div class="ci-item"><span class="ci-ic">🪟</span><span class="ci-v">${nFj}</span><span class="ci-l">folhas</span></div>
      <div class="ci-sep"></div>
      <div class="ci-item"><span class="ci-ic">🏷️</span><span class="ci-v">${vpvv}</span><span class="ci-l">${s.larg<=120?'≤120cm':'>120cm'}</span></div>
    </div>`;
  })() : '';

  // ── Campos dimensões ──
  // Para pivotante com fixo: campo de vão total ou largura do fixo
  const fixoFields = (isPiv && s.temFixo) ? `
    <div class="field" style="margin-top:-4px">
      <label>Largura do fixo lateral (cm)</label>
      <input id="orcFixoLarg" type="number" inputmode="numeric"
             value="${s.fixoLarg||40}" placeholder="cm" min="1" oninput="orcUpdate()">
    </div>
  ` : '';
  const bandFields = (isPiv && s.temBandeirola) ? `
    <div class="field" style="margin-top:-4px">
      <label>Altura da bandeirola (cm)</label>
      <input id="orcBandH" type="number" inputmode="numeric"
             value="${s.bandH||40}" placeholder="cm" min="1" oninput="orcUpdate()">
    </div>
  ` : '';

  // ── Kit pivotante + Mola (separados, sem template literals aninhados) ──
  let kitBlock = '';
  if (isPiv) {
    // Kit buttons: usar SVG containers com IDs, preenchidos após render
    const svgComum = '<svg id="mkitComum" class="kit-cad" viewBox="0 0 50 50" width="50" height="50"></svg>';
    const svgJumbo = '<svg id="mkitJumbo" class="kit-cad" viewBox="0 0 50 50" width="50" height="50"></svg>';
    const svgMola  = '<svg id="mkitMola"  class="kit-cad" viewBox="0 0 50 50" width="50" height="50"></svg>';

    // Build kit HTML safely
    function _kitBtn(kitId, svg, nm, sub, desc) {
      return '<button class="kit-btn' + (s.kitPivotante===kitId?' active':'')
           + '" onclick="orcSetKit(\'' + kitId + '\')">'
           + svg + '<span class="kit-nm">' + nm + '</span>'
           + '<span class="kit-sub">' + sub + '</span>'
           + '<span class="kit-desc">' + desc + '</span></button>';
    }
    kitBlock = '<div class="field"><label>Kit pivotante</label>'
      + '<div class="kit-opts kit-opts-kits">'
      + _kitBtn('comum', svgComum, 'Comum',  'R$ 150', 'Padrão')
      + _kitBtn('jumbo', svgJumbo, 'Jumbo',  'R$ 350', 'Portas grandes')
      + '</div></div>'
      + '<div class="field"><label>Mola hidráulica'
      + ' <span style="font-size:.6rem;color:var(--t4)">— instala junto com o kit</span></label>'
      + '<button class="kit-btn kit-btn-mola' + (s.temMola?' active':'') + '"'
      + ' onclick="orcToggleMola()" style="width:100%">'
      + svgMola
      + '<span class="kit-nm">' + (s.temMola?'✓ Mola Hidráulica':' Mola Hidráulica') + '</span>'
      + '<span class="kit-sub">R$ 500</span>'
      + '<span class="kit-desc">Fecha automático</span></button></div>';
  }


  // Acessórios: para pivotante, mostra só puxador e fixador (kit já está no kitBlock)
  let accsBlock = '';
  if (!isCorrer) {
    // Pivotante: só puxador e fixador (kit tratado acima, contra fechadura abaixo)
    const pivAccs = [
      { id:'puxador', nome:'Puxador',  preco:100, obrig:false },
      { id:'fixador', nome:'Fixador',  preco:60,  obrig:false },
    ];
    if (isPiv && (s.pivFolhas||1) === 2) {
      pivAccs.push({ id:'contra', nome:'Contra fechadura (2 folhas)', preco:50, obrig:true });
    }
    const visAcc = isPiv ? pivAccs : accConfig;
    if (visAcc.length) {
      let ah = '<div class="section" style="margin-bottom:14px"><div class="section-ttl">Acessórios</div><div class="orc-accs" id="orcAccs">';
      visAcc.forEach(a => {
        const ativo = s.accs[a.id] ?? a.obrig;
        ah += '<button class="orc-acc-btn' + (ativo?' on':'') + (a.obrig?' obrig':'') + '"'
           + ' onclick="orcToggleAcc(\'' + a.id + '\',' + a.obrig + ')">'
           + (ativo?'✓':'+') + ' ' + a.nome + (a.preco ? ' (' + formatBRL(a.preco) + ')' : '') + '</button>';
      });
      ah += '</div></div>';
      accsBlock = ah;
    }
  }

  wrap.innerHTML = `
    <div id="pgOrcamento">
      <div class="orc-tipos" id="orcTipos">
        ${TIPOS.map(t=>`
          <button class="orc-tipo-btn${s.tipo===t.id?' active':''}" onclick="orcTrocaTipo('${t.id}')">
            <span class="orc-tipo-ic">${t.icon}</span>
            <span class="orc-tipo-lbl">${t.label}</span>
          </button>
        `).join('')}
      </div>

      <svg id="orcCAD" class="orc-cad" viewBox="0 0 320 220"></svg>

      ${pivConfig}
      ${folhasBlock}
      ${correrInfo}
      ${janelaInfo}

      <div class="campo-row">
        <div class="field"><label>Largura (cm)</label>
          <input id="orcLarg" type="number" inputmode="numeric" value="${s.larg}" placeholder="cm" oninput="orcUpdate()"></div>
        <div class="field"><label>Altura (cm)</label>
          <input id="orcAlt" type="number" inputmode="numeric" value="${s.alt}" placeholder="cm" oninput="orcUpdate()"></div>
      </div>
      ${fixoFields}
      ${bandFields}

      ${kitBlock}

      <div class="field">
        <label>Tipo de vidro</label>
        <select id="orcVidro" onchange="orcUpdate()">
          ${vidrosDispo.map(v=>`<option value="${v.key}"${s.vidroKey===v.key?' selected':''}>${v.nome} — ${formatBRL(v.preco)}/m²</option>`).join('')}
        </select>
      </div>

      ${accsBlock}

      <div class="field">
        <label>Distância (km) — frete grátis até ${CFG.comercial.frete_gratis_km} km</label>
        <input id="orcKm" type="number" inputmode="numeric" value="${s.km}" placeholder="0" oninput="orcUpdate()">
      </div>

      <div class="campo-row">
        <div class="field"><label>Cliente</label>
          <input id="orcCliente" type="text" value="${s.cliente}" placeholder="Nome" oninput="orcUpdate()"></div>
        <div class="field"><label>Telefone</label>
          <input id="orcFone" type="tel" value="${s.fone}" placeholder="(85) 9..." oninput="orcUpdate()"></div>
      </div>

      <div id="orcResultBox"></div>
      <div id="orcSavedMsg"></div>
      <div id="orcAcoes"></div>
      <div style="height:88px"></div>
    </div>
  `;

  _orcRefreshCAD();
  orcCalcAndRender();
  // Render mini-CADs do seletor pivotante
  if (isPiv) { _renderMiniCADs(); _renderMiniKitCADs(); }
}

// Configs pivotante
const PIV_CONFIGS = {
  '1s':   { folhas:1, fixo:false, band:false, fixoLado:'dir' },
  '1sf':  { folhas:1, fixo:true,  band:false, fixoLado:'dir' },
  '1sb':  { folhas:1, fixo:false, band:true,  fixoLado:'dir' },
  '1sfb': { folhas:1, fixo:true,  band:true,  fixoLado:'dir' },
  '2s':   { folhas:2, fixo:false, band:false, fixoLado:'dir' },
  '2sf':  { folhas:2, fixo:true,  band:false, fixoLado:'dir' },
};

function orcSetPivConfig(id) {
  const c = PIV_CONFIGS[id];
  if (!c) return;
  orcState.pivFolhas      = c.folhas;
  orcState.accs           = {}; // reset ao trocar config
  orcState.temFixo        = c.fixo;
  orcState.temBandeirola  = c.band;
  orcState.fixoLado       = c.fixoLado;
  if (!orcState.fixoLarg) orcState.fixoLarg = 40;
  if (!orcState.bandH)    orcState.bandH    = 40;
  renderOrc(document.getElementById('pgWrap'));
}

function orcSetFolhas(n) {
  orcState.folhasCorrer = n;
  renderOrc(document.getElementById('pgWrap'));
}

function orcSetKit(id) {
  orcState.kitPivotante = id;
  _orcRefreshCAD();
  orcCalcAndRender();
  // Re-render kit buttons
  document.querySelectorAll('.kit-btn:not(.kit-btn-mola)').forEach(b => {
    b.classList.toggle('active', b.onclick && b.onclick.toString().includes("'" + id + "'"));
  });
}

function orcToggleMola() {
  orcState.temMola = !orcState.temMola;
  const btn = document.querySelector('.kit-btn-mola');
  if (btn) {
    btn.classList.toggle('active', orcState.temMola);
    btn.querySelector('.kit-nm').textContent = orcState.temMola ? '✓ Mola Hidráulica' : '+ Mola Hidráulica';
  }
  orcCalcAndRender();
}

function _orcRefreshCAD() {
  const s = orcState;
  const svgEl = document.getElementById('orcCAD');
  if (!svgEl) return;
  renderCAD(svgEl, {
    tipo:           s.tipo,
    larg:           s.larg,
    alt:            s.alt,
    folhas:         s.folhasCorrer,
    pivFolhas:      s.pivFolhas   || 1,
    kitPivotante:   s.kitPivotante|| 'comum',
    temFixo:        s.temFixo,
    fixoLarg:       s.fixoLarg    || 40,
    fixoLado:       s.fixoLado    || 'dir',
    temBandeirola:  s.temBandeirola,
    bandH:          s.bandH       || 40,
    temMola:        s.temMola,
    accs:           s.accs,
  });
}

function _renderMiniCADs() {
  const configs = {
    'mcad_1s':   { tipo:'pivotante', fixo:null,  band:false, folhas:1 },
    'mcad_1sf':  { tipo:'pivotante', fixo:'dir', band:false, folhas:1 },
    'mcad_1sb':  { tipo:'pivotante', fixo:null,  band:true,  folhas:1 },
    'mcad_1sfb': { tipo:'pivotante', fixo:'dir', band:true,  folhas:1 },
    'mcad_2s':   { tipo:'pivotante', fixo:null,  band:false, folhas:2 },
    'mcad_2sf':  { tipo:'pivotante', fixo:'dir', band:false, folhas:2 },
  };
  Object.entries(configs).forEach(([id, cfg]) => renderMiniCAD(id, cfg));
}

function orcUpdate() {
  const s = orcState;
  s.larg    = parseFloat(document.getElementById('orcLarg')?.value)||0;
  s.alt     = parseFloat(document.getElementById('orcAlt')?.value)||0;
  s.vidroKey= document.getElementById('orcVidro')?.value||s.vidroKey;
  s.km      = parseFloat(document.getElementById('orcKm')?.value)||0;
  s.cliente = document.getElementById('orcCliente')?.value||'';
  s.fone    = document.getElementById('orcFone')?.value||'';
  if (s.temFixo)       s.fixoLarg = parseFloat(document.getElementById('orcFixoLarg')?.value)||40;
  if (s.temBandeirola) s.bandH    = parseFloat(document.getElementById('orcBandH')?.value)||40;
  _orcRefreshCAD();
  orcCalcAndRender();
}

function orcCalcAndRender() {
  const s = orcState;
  const res = calcularOrcamento({
    tipo:s.tipo, larg:s.larg, alt:s.alt, vidro:s.vidroKey,
    accs:s.accs, km:s.km, folhasCorrer:s.folhasCorrer,
    pivFolhas:s.pivFolhas||1, kitPivotante:s.kitPivotante||'comum',
    temFixo:s.temFixo, fixoLarg:s.fixoLarg||40,
    temBandeirola:s.temBandeirola, bandH:s.bandH||40,
  });
  orcState.resultado = res;
  const rb = document.getElementById('orcResultBox');
  const ra = document.getElementById('orcAcoes');
  if (!rb) return;
  if (res) {
    rb.innerHTML = `<div class="orc-result">
      <div class="orc-total">${formatBRL(res.total)}</div>
      ${res.totalAvista < res.total ? `<div class="orc-avista">💚 À vista: ${formatBRL(res.totalAvista)} (${Math.round(CFG.comercial.desconto_avista*100)}% off)</div>` : ''}
      <div class="orc-linhas">
        ${res.linhas.map(l=>`<div class="orc-linha"><span>${l.nome}</span><span>${formatBRL(l.valor)}</span></div>`).join('')}
      </div>
    </div>`;
    ra.innerHTML = `<div style="display:flex;gap:10px;margin-bottom:12px">
      <button class="btn btn-ghost btn-full" onclick="orcSalvar()">💾 Salvar</button>
      <button class="btn btn-grn btn-full" onclick="orcCompartilhar()">📤 Compartilhar</button>
    </div>`;
  } else { rb.innerHTML=''; ra.innerHTML=''; }
}

function orcTrocaTipo(tipo) {
  orcState.tipo     = tipo;
  orcState.larg     = DEFAULTS[tipo]?.larg ?? 80;
  orcState.alt      = DEFAULTS[tipo]?.alt  ?? 120;
  orcState.vidroKey = (VIDROS_POR_TIPO[tipo]||[])[0]||'';
  orcState.accs     = {};
  orcState.resultado= null;
  orcState.temFixo        = false;
  orcState.temBandeirola  = false;
  orcState.pivFolhas      = 1;
  orcState.temMola        = false;
  if (tipo==='correr') orcState.folhasCorrer = 2;
  renderOrc(document.getElementById('pgWrap'));
}

function _getVisAcc() {
  const s = orcState;
  const isPiv = s.tipo === 'pivotante';
  if (isPiv) {
    const list = [
      { id:'puxador', nome:'Puxador',  preco:100, obrig:false },
      { id:'fixador', nome:'Fixador',  preco:60,  obrig:false },
    ];
    if ((s.pivFolhas||1) === 2) list.push({ id:'contra', nome:'Contra fechadura', preco:50, obrig:true });
    return list;
  }
  return ACESSORIOS_CONFIG[s.tipo] || [];
}

function orcToggleAcc(id, obrig) {
  if (obrig) return;
  orcState.accs[id] = !(orcState.accs[id]??false);
  orcCalcAndRender();
  const visAcc = _getVisAcc();
  const cont = document.getElementById('orcAccs');
  if (cont) {
    let html = '';
    visAcc.forEach(a => {
      const ativ = orcState.accs[a.id] ?? a.obrig;
      html += '<button class="orc-acc-btn' + (ativ?' on':'') + (a.obrig?' obrig':'') + '"'
            + ' onclick="orcToggleAcc(\'' + a.id + '\',' + a.obrig + ')">'
            + (ativ?'✓':'+') + ' ' + a.nome + (a.preco ? ' (' + formatBRL(a.preco) + ')' : '') + '</button>';
    });
    cont.innerHTML = html;
  }
}

async function orcSalvar() {
  if (!orcState.resultado) return;
  showModalConfirm('💾 Salvar orçamento?',
    `Salvar ${formatBRL(orcState.resultado.total)}${orcState.cliente?' para '+orcState.cliente:''}?`,
    'Salvar',
    async () => {
      try {
        await salvarOrcamento({ tipo:orcState.tipo, larg:orcState.larg, alt:orcState.alt, vidro:orcState.vidroKey, accs:orcState.accs, km:orcState.km, clienteNome:orcState.cliente.trim(), clienteFone:orcState.fone.trim(), resultado:orcState.resultado, folhasCorrer:orcState.folhasCorrer, pivFolhas:orcState.pivFolhas||1, kitPivotante:orcState.kitPivotante||'comum', temFixo:orcState.temFixo, fixoLarg:orcState.fixoLarg||0, temBandeirola:orcState.temBandeirola, bandH:orcState.bandH||0 });
        closeModal();
        const sm=document.getElementById('orcSavedMsg');
        if(sm){sm.innerHTML='<div class="orc-saved">✓ Orçamento salvo!</div>';setTimeout(()=>sm.innerHTML='',3000);}
      } catch(e) { alert('Erro: '+e.message); }
    }
  );
}

function orcCompartilhar() {
  if (!orcState.resultado) return;
  showModalCompartilhar(orcState);
}
function orcWppDireto() {
  const txt = gerarTextoWpp({cliente:orcState.cliente,tipo:orcState.tipo,larg:orcState.larg,alt:orcState.alt,vidro:orcState.vidroKey,resultado:orcState.resultado,folhasCorrer:orcState.folhasCorrer});
  const num=(orcState.fone||'').replace(/\D/g,'');
  const base=num?`https://wa.me/55${num}`:'https://wa.me/';
  window.open(`${base}?text=${encodeURIComponent(txt)}`,'_blank');
  closeModal();
}
function orcGerarPDF() { closeModal(); gerarPDFOrcamento(orcState); }
