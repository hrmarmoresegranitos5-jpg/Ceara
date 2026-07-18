// ════════════════════════════════════════════════════════════
// FINANCEIRO / PREÇOS
// ════════════════════════════════════════════════════════════

let finState = { aba:'precos', contas:[], mostrarRecebidas:false };

function renderFinanceiro(wrap) {
  wrap.innerHTML = `
    <div>
      <div class="hist-filtros" style="padding:14px 14px 0">
        <button class="hist-chip${finState.aba==='precos'?' on':''}" onclick="finSetAba('precos')">💎 Tabela de Preços</button>
        <button class="hist-chip${finState.aba==='contas'?' on':''}" onclick="finSetAba('contas')">💰 Financeiro</button>
      </div>
      <div id="finConteudo"></div>
    </div>
  `;
  finRenderConteudo(wrap);
}

function finSetAba(aba) {
  finState.aba = aba;
  renderFinanceiro(document.getElementById('pgWrap'));
}

function finRenderConteudo(wrap) {
  const alvo = (wrap || document.getElementById('pgWrap'));
  const destino = document.getElementById('finConteudo') || alvo;
  if (finState.aba === 'contas') {
    destino.innerHTML = '<div class="hist-empty"><div class="hist-empty-ic">⏳</div>Carregando…</div>';
    finCarregarContas();
  } else {
    destino.innerHTML = _finTabelaPrecosHTML();
  }
}

async function finCarregarContas() {
  try {
    finState.contas = (typeof listarContas === 'function') ? await listarContas() : [];
  } catch(e) {
    finState.contas = [];
  }
  finRenderContas();
}

function finRenderContas() {
  const destino = document.getElementById('finConteudo');
  if (!destino) return;

  const pendentes = finState.contas.filter(c => c.status !== 'recebido');
  const recebidas  = finState.contas.filter(c => c.status === 'recebido');
  const aReceber  = pendentes.reduce((s,c) => s + Math.max(0, (c.valor||0) - (c.valorRecebido||0)), 0);
  const jaRecebido = finState.contas.reduce((s,c) => s + (c.valorRecebido||0), 0);

  const header = `
    <div class="ag-hero">
      <div class="ag-hero-ttl">💰 Financeiro</div>
      <div class="ag-hero-sub">${pendentes.length ? pendentes.length+' conta'+(pendentes.length>1?'s':'')+' a receber' : 'Nenhuma conta pendente'}</div>
    </div>
    <div class="card" style="display:flex;gap:10px;margin:12px 14px">
      <div style="flex:1;text-align:center">
        <div style="font-size:.62rem;color:var(--t3);font-weight:700;text-transform:uppercase;letter-spacing:.04em">A receber</div>
        <div style="font-size:1.05rem;font-weight:800;color:var(--gold)">${formatBRL(aReceber)}</div>
      </div>
      <div style="flex:1;text-align:center;border-left:1px solid rgba(255,255,255,.08)">
        <div style="font-size:.62rem;color:var(--t3);font-weight:700;text-transform:uppercase;letter-spacing:.04em">Recebido</div>
        <div style="font-size:1.05rem;font-weight:800;color:var(--grn)">${formatBRL(jaRecebido)}</div>
      </div>
    </div>
  `;

  const emptyState = pendentes.length ? '' : `<div class="hist-empty"><div class="hist-empty-ic">📭</div>Nenhuma conta a receber ainda.\nAprove um orçamento no Histórico pra gerar uma automaticamente.</div>`;

  const cards = pendentes.map(c => _finCardHTML(c)).join('');

  let recebidasBlock = '';
  if (recebidas.length) {
    recebidasBlock = `<button class="ag-concluidas-toggle" onclick="finToggleRecebidas()">${finState.mostrarRecebidas?'▾':'▸'} Recebidas (${recebidas.length})</button>`;
    if (finState.mostrarRecebidas) {
      recebidasBlock += recebidas.map(c => _finCardHTML(c)).join('');
    }
  }

  destino.innerHTML = `
    ${header}
    <div class="ag-lista" style="padding:0 14px">${cards}</div>
    <div style="padding:0 14px">${emptyState}</div>
    <div style="padding:0 14px">${recebidasBlock}</div>
    <div style="height:32px"></div>
  `;
}

function _finCardHTML(c) {
  const recebido = c.status === 'recebido';
  const saldo = Math.max(0, (c.valor||0) - (c.valorRecebido||0));
  return `
    <div class="ag-card${recebido?' ag-card-done':''}">
      <div class="ag-card-top">
        <span class="ag-card-num">${recebido ? '✅' : '⏳'}</span>
        ${c.orcamentoId ? '<span class="ag-card-badge" style="opacity:.7">Orçamento #'+c.orcamentoId+'</span>' : ''}
      </div>
      <div class="ag-card-cliente">${esc(c.clienteNome || 'Sem nome')}</div>
      ${c.descricao ? `<div class="ag-card-obs">${esc(c.descricao)}</div>` : ''}
      <div class="ag-card-datas">${formatBRL(c.valor||0)}${!recebido && c.valorRecebido ? ' · recebido '+formatBRL(c.valorRecebido) : ''}</div>
      <div class="ag-card-actions">
        ${recebido
          ? `<button class="ag-act" onclick="finReabrirConta(${c.id})">↺ Reabrir</button>`
          : `<button class="ag-act ag-act-ok" onclick="finMarcarRecebida(${c.id})">✓ Marcar recebido</button>`
        }
        <button class="ag-act ag-act-del" onclick="finExcluirConta(${c.id})">🗑</button>
      </div>
    </div>
  `;
}

async function finMarcarRecebida(id) {
  const c = finState.contas.find(x => x.id === id);
  if (!c) return;
  try {
    const atualizada = { ...c, status:'recebido', valorRecebido:c.valor||0 };
    await atualizarConta(atualizada);
    finState.contas = finState.contas.map(x => x.id===id ? atualizada : x);
    finRenderContas();
    if (typeof histMostrarToast === 'function') histMostrarToast('✅ Conta marcada como recebida');
  } catch(e) { if (typeof histMostrarToast === 'function') histMostrarToast('❌ Erro ao atualizar'); }
}

async function finReabrirConta(id) {
  const c = finState.contas.find(x => x.id === id);
  if (!c) return;
  try {
    const atualizada = { ...c, status:'pendente' };
    await atualizarConta(atualizada);
    finState.contas = finState.contas.map(x => x.id===id ? atualizada : x);
    finRenderContas();
  } catch(e) { if (typeof histMostrarToast === 'function') histMostrarToast('❌ Erro ao atualizar'); }
}

function finExcluirConta(id) {
  const doDelete = async () => {
    try {
      await removerConta(id);
      finState.contas = finState.contas.filter(x => x.id !== id);
      finRenderContas();
      if (typeof closeModal === 'function') closeModal();
      if (typeof histMostrarToast === 'function') histMostrarToast('🗑️ Conta excluída');
    } catch(e) { if (typeof histMostrarToast === 'function') histMostrarToast('❌ Erro ao excluir'); }
  };
  if (typeof showModalConfirm === 'function') {
    showModalConfirm('🗑️ Excluir conta?','Essa ação não pode ser desfeita.','Excluir', doDelete, true);
  } else if (confirm('Excluir esta conta a receber?')) {
    doDelete();
  }
}

function finToggleRecebidas() {
  finState.mostrarRecebidas = !finState.mostrarRecebidas;
  finRenderContas();
}

function _finTabelaPrecosHTML() {
  const v  = CFG.vidros;
  const ac = CFG.acessorios;
  const co = CFG.comercial;
  const cr = CFG.correr;

  const secoes = [
    {
      titulo: '🔥 Vidros Temperados — 8mm',
      sub:    'Alta resistência · ' + Math.round(co.desconto_avista * 100) + '% desconto à vista',
      linhas: [
        ['Transparente',  formatBRL(v.temp_trans.preco) + '/m²'],
        ['Fumê',          formatBRL(v.temp_fume.preco)  + '/m²'],
        ['Serigrafado',   formatBRL(v.temp_serig.preco) + '/m²'],
        ['Jateado',       formatBRL(v.temp_jat.preco)   + '/m²'],
        ['Espelhado',     formatBRL(v.temp_esp.preco)   + '/m²'],
      ],
    },
    {
      titulo: '🔲 Vidros Comuns',
      sub:    'Uso residencial · Recorte ' + formatBRL(co.recorte_por_m2) + '/m²',
      linhas: [
        ['Incolor 4mm',  formatBRL(v.com_4.preco)     + '/m²'],
        ['Incolor 6mm',  formatBRL(v.com_6.preco)     + '/m²'],
        ['Fumê 3mm',     formatBRL(v.com_fume3.preco) + '/m²'],
        ['Fumê 4mm',     formatBRL(v.com_fume4.preco) + '/m²'],
        ['Espelho 3mm',  formatBRL(v.esp_3.preco)     + '/m²'],
        ['Espelho 4mm',  formatBRL(v.esp_4.preco)     + '/m²'],
      ],
    },
    {
      titulo: '🔧 Kits e Ferragens',
      sub:    'Inclusos automaticamente conforme o produto',
      linhas: [
        ['Kit pivotante comum',  formatBRL(ac.kit_pivotante)],
        ['Kit pivotante jumbo',  formatBRL(ac.kit_jumbo)],
        ['Kit engenharia branco', formatBRL(co.kit_eng_branco) + '/m²'],
        ['Kit engenharia preto',  formatBRL(co.kit_eng_preto)  + '/m²'],
        ['Kit basculante',        formatBRL(ac.kit_basculante)],
        ['Roldana',               formatBRL(co.roldana) + '/un'],
      ],
    },
    {
      titulo: '🪝 Acessórios Avulsos',
      sub:    'Adicionados automaticamente por produto',
      linhas: [
        ['Fechadura VP',       formatBRL(cr.fechadura)],
        ['Fechadura VV',       formatBRL(ac.fechadura_vv)],
        ['Puxador',            formatBRL(ac.puxador)],
        ['Fixador',            formatBRL(ac.fixador)],
        ['Bate-fecha VP',      formatBRL(ac.bate_vp)],
        ['Bate-fecha VV',      formatBRL(ac.bate_vv)],
        ['Mola hidráulica',    formatBRL(co.mola_hidraulica)],
        ['Cantoneira alumínio', formatBRL(co.cantoneira_por_m) + '/m'],
        ['PU (poliuretano)',    formatBRL(co.pu_por_m) + '/m'],
      ],
    },
  ];

  const descPct   = Math.round(co.desconto_avista * 100);
  const freteKm   = co.frete_gratis_km;
  const freteExtra = formatBRL(co.frete_por_km_extra);

  return `
    <div>
      <div class="hero"><div class="hero-ttl">💎 Tabela de Preços</div><div class="hero-sub">Valores por m² — ${esc(CFG.empresa.nome)}</div></div>
      <div class="section">
        ${secoes.map(s => `
          <div class="price-section">
            <div class="price-section-header"><h3>${s.titulo}</h3><p>${s.sub}</p></div>
            <div class="card" style="padding:4px 12px">
              <table class="tbl"><tbody>
                <tr><th>Tipo</th><th style="text-align:right">Valor</th></tr>
                ${s.linhas.map(([nome, val]) => `<tr><td>${nome}</td><td style="text-align:right">${val}</td></tr>`).join('')}
              </tbody></table>
            </div>
          </div>
        `).join('')}
        <div class="card" style="background:linear-gradient(135deg,rgba(58,158,106,.08),rgba(201,168,76,.05));border-color:rgba(58,158,106,.2)">
          <div style="font-size:.72rem;font-weight:700;color:var(--grn);margin-bottom:10px">💚 Condições de Pagamento</div>
          <div style="font-size:.74rem;color:var(--t3);line-height:1.8">
            • <b style="color:var(--t2)">Desconto à vista:</b> ${descPct}% nos vidros temperados e ferragens<br>
            • <b style="color:var(--t2)">Parcelamento:</b> até 6x sem juros<br>
            • <b style="color:var(--t2)">Cartão:</b> pode acrescentar taxas sobre total<br>
            • <b style="color:var(--t2)">Padrão:</b> 50% entrada + 50% na entrega<br>
            • <b style="color:var(--t2)">Frete:</b> grátis até ${freteKm} km · ${freteExtra}/km adicional
          </div>
        </div>
      </div>
      <div style="height:80px"></div>
    </div>
  `;
}


