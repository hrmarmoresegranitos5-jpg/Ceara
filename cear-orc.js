// ════════════════════════════════════════════════════════════
// ORÇAMENTO
// ════════════════════════════════════════════════════════════

function renderOrc(wrap) {
  const s = orcState;
  const isCorrer = s.tipo === 'correr';
  const accConfig = ACESSORIOS_CONFIG[s.tipo] || [];
  const vidrosDispo = (VIDROS_POR_TIPO[s.tipo]||[]).map(k=>({key:k,...VIDROS[k]}));

  // Bloco de folhas para porta de correr
  const folhasBlock = isCorrer ? `
    <div class="field" style="margin-bottom:16px">
      <label>Número de folhas</label>
      <div class="correr-folhas" id="correrFolhas">
        ${[1,2,4].map(n => {
          const moveis = CORRER_MOVEIS[n] ?? n;
          const fixas  = n - moveis;
          const desc   = fixas > 0
            ? `${moveis} móve${moveis>1?'is':'l'} + ${fixas} fixa${fixas>1?'s':''}`
            : `${moveis} móve${moveis>1?'is':'l'}`;
          return `
            <button class="folha-btn${s.folhasCorrer===n?' active':''}" onclick="orcSetFolhas(${n})">
              <span class="folha-n">${n}</span>
              <span class="folha-lbl">${n===1?'folha':'folhas'}</span>
              <span class="folha-desc">${desc}</span>
            </button>`;
        }).join('')}
      </div>
    </div>
  ` : '';

  // Info resumo do sistema de correr
  const correrInfo = isCorrer ? (() => {
    const nF = s.folhasCorrer;
    const nM = CORRER_MOVEIS[nF] ?? 2;
    const nFx = nF - nM;
    return `
      <div class="correr-info" id="correrInfo">
        <div class="ci-item"><span class="ci-ic">🔲</span><span class="ci-v">${nF} folha${nF>1?'s':''}</span><span class="ci-l">total</span></div>
        <div class="ci-sep"></div>
        <div class="ci-item"><span class="ci-ic">↔️</span><span class="ci-v">${nM}</span><span class="ci-l">móve${nM>1?'is':'l'}</span></div>
        ${nFx>0?`<div class="ci-sep"></div><div class="ci-item"><span class="ci-ic">🔒</span><span class="ci-v">${nFx}</span><span class="ci-l">fixa${nFx>1?'s':''}</span></div>`:''}
        <div class="ci-sep"></div>
        <div class="ci-item"><span class="ci-ic">🔑</span><span class="ci-v">${nM}</span><span class="ci-l">fechadura${nM>1?'s':''}</span></div>
        <div class="ci-sep"></div>
        <div class="ci-item"><span class="ci-ic">✋</span><span class="ci-v">${nM}</span><span class="ci-l">puxador${nM>1?'es':''}</span></div>
      </div>`;
  })() : '';

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

      <svg id="orcCAD" class="orc-cad" viewBox="0 0 320 200"></svg>

      ${folhasBlock}
      ${correrInfo}

      <div class="campo-row">
        <div class="field"><label>Largura (cm)</label><input id="orcLarg" type="number" inputmode="numeric" value="${s.larg}" placeholder="cm" oninput="orcUpdate()"></div>
        <div class="field"><label>Altura (cm)</label><input id="orcAlt" type="number" inputmode="numeric" value="${s.alt}" placeholder="cm" oninput="orcUpdate()"></div>
      </div>

      <div class="field">
        <label>Tipo de vidro</label>
        <select id="orcVidro" onchange="orcUpdate()">
          ${vidrosDispo.map(v=>`<option value="${v.key}"${s.vidroKey===v.key?' selected':''}>${v.nome} — ${formatBRL(v.preco)}/m²</option>`).join('')}
        </select>
      </div>

      ${(!isCorrer && accConfig.length>0)?`
        <div class="section" style="margin-bottom:16px">
          <div class="section-ttl">Acessórios</div>
          <div class="orc-accs" id="orcAccs">
            ${accConfig.map(a=>{
              const ativo = s.accs[a.id]??a.obrig;
              return `<button class="orc-acc-btn${ativo?' on':''}${a.obrig?' obrig':''}" onclick="orcToggleAcc('${a.id}',${a.obrig})">${ativo?'✓':'+'} ${a.nome}${a.preco?` (${formatBRL(a.preco)})`:a.desc?` (${a.desc})`:''}</button>`;
            }).join('')}
          </div>
        </div>
      `:''}

      <div class="field">
        <label>Distância (km) — frete grátis até 20 km</label>
        <input id="orcKm" type="number" inputmode="numeric" value="${s.km}" placeholder="0" oninput="orcUpdate()">
      </div>

      <div class="campo-row">
        <div class="field"><label>Cliente (opcional)</label><input id="orcCliente" type="text" value="${s.cliente}" placeholder="Nome" oninput="orcUpdate()"></div>
        <div class="field"><label>Telefone</label><input id="orcFone" type="tel" value="${s.fone}" placeholder="(85) 9..." oninput="orcUpdate()"></div>
      </div>

      <div id="orcResultBox"></div>
      <div id="orcSavedMsg"></div>
      <div id="orcAcoes"></div>
      <div style="height:88px"></div>
    </div>
  `;

  renderCAD(document.getElementById('orcCAD'), { tipo:s.tipo, larg:s.larg, alt:s.alt, folhas:s.folhasCorrer });
  orcCalcAndRender();
}

function orcSetFolhas(n) {
  orcState.folhasCorrer = n;
  renderOrc(document.getElementById('pgWrap'));
}

function orcUpdate() {
  const larg = parseFloat(document.getElementById('orcLarg')?.value)||0;
  const alt  = parseFloat(document.getElementById('orcAlt')?.value)||0;
  const vidro= document.getElementById('orcVidro')?.value||orcState.vidroKey;
  const km   = parseFloat(document.getElementById('orcKm')?.value)||0;
  const cliente = document.getElementById('orcCliente')?.value||'';
  const fone    = document.getElementById('orcFone')?.value||'';
  orcState.larg = larg; orcState.alt = alt; orcState.vidroKey = vidro;
  orcState.km = km; orcState.cliente = cliente; orcState.fone = fone;
  renderCAD(document.getElementById('orcCAD'), { tipo:orcState.tipo, larg, alt, folhas:orcState.folhasCorrer });
  orcCalcAndRender();
}

function orcCalcAndRender() {
  const s = orcState;
  const res = calcularOrcamento({ tipo:s.tipo, larg:s.larg, alt:s.alt, vidro:s.vidroKey, accs:s.accs, km:s.km, folhasCorrer:s.folhasCorrer });
  orcState.resultado = res;
  const rb = document.getElementById('orcResultBox');
  const ra = document.getElementById('orcAcoes');
  if (!rb) return;
  if (res) {
    rb.innerHTML = `
      <div class="orc-result">
        <div class="orc-total">${formatBRL(res.total)}</div>
        ${res.totalAvista < res.total ? `<div class="orc-avista">💚 À vista: ${formatBRL(res.totalAvista)} (10% off)</div>` : ''}
        <div class="orc-linhas">
          ${res.linhas.map(l=>`<div class="orc-linha"><span>${l.nome}</span><span>${formatBRL(l.valor)}</span></div>`).join('')}
        </div>
      </div>
    `;
    ra.innerHTML = `
      <div style="display:flex;gap:10px;margin-bottom:12px">
        <button class="btn btn-ghost btn-full" onclick="orcSalvar()">💾 Salvar</button>
        <button class="btn btn-grn btn-full" onclick="orcCompartilhar()">📤 Compartilhar</button>
      </div>
    `;
  } else {
    rb.innerHTML = '';
    ra.innerHTML = '';
  }
}

function orcTrocaTipo(tipo) {
  orcState.tipo = tipo;
  orcState.larg = DEFAULTS[tipo]?.larg ?? 80;
  orcState.alt  = DEFAULTS[tipo]?.alt ?? 120;
  orcState.vidroKey = (VIDROS_POR_TIPO[tipo]||[])[0]||'';
  orcState.accs = {};
  orcState.resultado = null;
  if (tipo === 'correr') orcState.folhasCorrer = 2;
  renderOrc(document.getElementById('pgWrap'));
}

function orcToggleAcc(id, obrig) {
  if (obrig) return;
  orcState.accs[id] = !(orcState.accs[id] ?? false);
  orcCalcAndRender();
  const accConfig = ACESSORIOS_CONFIG[orcState.tipo] || [];
  const container = document.getElementById('orcAccs');
  if (container) {
    container.innerHTML = accConfig.map(a=>{
      const ativo = orcState.accs[a.id]??a.obrig;
      return `<button class="orc-acc-btn${ativo?' on':''}${a.obrig?' obrig':''}" onclick="orcToggleAcc('${a.id}',${a.obrig})">${ativo?'✓':'+'} ${a.nome}${a.preco?` (${formatBRL(a.preco)})`:a.desc?` (${a.desc})`:''}</button>`;
    }).join('');
  }
}

async function orcSalvar() {
  if (!orcState.resultado) return;
  showModalConfirm(
    '💾 Salvar orçamento?',
    `Salvar orçamento de ${formatBRL(orcState.resultado.total)} no histórico${orcState.cliente ? ` para ${orcState.cliente}` : ''}?`,
    'Salvar',
    async () => {
      try {
        await salvarOrcamento({
          tipo: orcState.tipo,
          larg: orcState.larg,
          alt:  orcState.alt,
          vidro: orcState.vidroKey,
          accs: orcState.accs,
          km: orcState.km,
          clienteNome: orcState.cliente.trim(),
          clienteFone: orcState.fone.trim(),
          resultado: orcState.resultado,
          folhasCorrer: orcState.folhasCorrer,
        });
        closeModal();
        const sm = document.getElementById('orcSavedMsg');
        if (sm) { sm.innerHTML = '<div class="orc-saved">✓ Orçamento salvo no histórico!</div>'; setTimeout(()=>sm.innerHTML='',3000); }
      } catch(e) { alert('Erro ao salvar: '+e.message); }
    }
  );
}

function orcCompartilhar() {
  if (!orcState.resultado) return;
  showModalCompartilhar(orcState);
}

function orcWppDireto() {
  const txt = gerarTextoWpp({ cliente:orcState.cliente, tipo:orcState.tipo, larg:orcState.larg, alt:orcState.alt, vidro:orcState.vidroKey, resultado:orcState.resultado, folhasCorrer:orcState.folhasCorrer });
  const num = (orcState.fone||'').replace(/\D/g,'');
  const base = num ? `https://wa.me/55${num}` : 'https://wa.me/';
  window.open(`${base}?text=${encodeURIComponent(txt)}`, '_blank');
  closeModal();
}

function orcGerarPDF() {
  closeModal();
  gerarPDFOrcamento(orcState);
}

