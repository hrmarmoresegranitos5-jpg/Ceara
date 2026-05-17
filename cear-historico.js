// ════════════════════════════════════════════════════════════
// HISTÓRICO
// ════════════════════════════════════════════════════════════

let histState = { filtro:'todos', busca:'', dataInicio:'', dataFim:'', orcamentos:[], expandido:null };

function renderHistorico(wrap) {
  wrap.style.padding = '0';
  wrap.innerHTML = `
    <div class="hist-wrap" id="histWrap">
      <div class="hist-head">
        <div class="hist-titulo">📂 Histórico</div>
        <div class="hist-filtros" id="histFiltros">
          ${[['todos','📋 Todos'],['cliente','👤 Cliente'],['telefone','📱 Telefone'],['data','📅 Data']].map(([id,lbl])=>`
            <button class="hist-chip${histState.filtro===id?' on':''}" onclick="histSetFiltro('${id}')">${lbl}</button>
          `).join('')}
        </div>
        <div id="histBuscaWrap">
          ${histState.filtro!=='data'?`
            <div class="hist-busca">
              <span class="hist-busca-ic">🔍</span>
              <input id="histBuscaInput" value="${histState.busca}" placeholder="${histPlaceholder()}" oninput="histSetBusca(this.value)" autocomplete="off">
            </div>
          `:`
            <div class="hist-date-row">
              <div class="hist-date-group"><div class="hist-date-lbl">De</div><input type="date" id="histDataIni" value="${histState.dataInicio}" onchange="histSetDatas(this.value,null)"></div>
              <div class="hist-date-group"><div class="hist-date-lbl">Até</div><input type="date" id="histDataFim" value="${histState.dataFim}" onchange="histSetDatas(null,this.value)"></div>
            </div>
          `}
        </div>
        <div class="hist-resumo" id="histResumo">Carregando…</div>
      </div>
      <div class="hist-list" id="histList"><div class="hist-empty"><div class="hist-empty-ic">⏳</div>Carregando…</div></div>
      <div id="histToast"></div>
    </div>
  `;
  histCarregar();
}

function histPlaceholder() {
  return { todos:'Buscar por cliente, telefone ou tipo…', cliente:'Digite o nome do cliente…', telefone:'Digite o telefone…', data:'' }[histState.filtro]||'Buscar…';
}

async function histCarregar() {
  try {
    histState.orcamentos = await listarOrcamentos();
    histRenderLista();
  } catch(e) {
    const l = document.getElementById('histList');
    if (l) l.innerHTML = '<div class="hist-empty"><div class="hist-empty-ic">❌</div>Erro ao carregar</div>';
  }
}

function histFiltrar() {
  let lista = [...histState.orcamentos];
  const t = histState.busca.trim().toLowerCase();
  if (histState.filtro==='cliente' && t) {
    lista = lista.filter(o => (o.clienteNome||'').toLowerCase().includes(t));
  } else if (histState.filtro==='telefone' && t) {
    const d = histState.busca.replace(/\D/g,'');
    lista = lista.filter(o => (o.clienteFone||'').replace(/\D/g,'').includes(d)||(o.clienteFone||'').toLowerCase().includes(t));
  } else if (histState.filtro==='data') {
    if (histState.dataInicio) lista = lista.filter(o => o.criadoEm >= histState.dataInicio);
    if (histState.dataFim)    lista = lista.filter(o => o.criadoEm <= histState.dataFim+'T23:59:59');
  } else if (t) {
    lista = lista.filter(o => (o.clienteNome||'').toLowerCase().includes(t)||(o.clienteFone||'').toLowerCase().includes(t)||((TIPO_LABEL[o.tipo]||'').toLowerCase().includes(t)));
  }
  return lista;
}

function histRenderLista() {
  const lista = histFiltrar();
  const resumo = document.getElementById('histResumo');
  const listEl = document.getElementById('histList');
  if (!listEl) return;
  if (resumo) resumo.textContent = `${lista.length} orçamento${lista.length!==1?'s':''}${histState.orcamentos.length!==lista.length?` de ${histState.orcamentos.length}`:''}`;
  if (lista.length===0) {
    listEl.innerHTML = `<div class="hist-empty"><div class="hist-empty-ic">${histState.orcamentos.length===0?'📭':'🔍'}</div>${histState.orcamentos.length===0?'Nenhum orçamento salvo ainda.\nFaça seu primeiro orçamento!':'Nenhum resultado para esta busca.'}</div>`;
    return;
  }
  listEl.innerHTML = lista.map(orc => histRenderCard(orc)).join('');
}

function histRenderCard(orc) {
  const c = corTipo(orc.tipo);
  const expanded = histState.expandido === orc.id;
  return `
    <div class="orc-card" id="orcCard${orc.id}">
      <div class="orc-card-top" onclick="histToggleExpand(${orc.id})">
        <div class="orc-card-ic" style="background:${c.bg};border:1px solid ${c.brd}">${TIPO_ICON[orc.tipo]||'📋'}</div>
        <div class="orc-card-info">
          <div class="orc-card-titulo">${TIPO_LABEL[orc.tipo]||orc.tipo}${orc.clienteNome?` · ${orc.clienteNome}`:''}</div>
          <div class="orc-card-sub">${orc.larg}×${orc.alt}cm${orc.vidro&&VIDROS[orc.vidro]?' · '+VIDROS[orc.vidro].nome:''}</div>
        </div>
        <div class="orc-card-total">
          <div class="orc-card-valor">${orc.resultado?formatBRL(orc.resultado.total):'—'}</div>
          <div class="orc-card-data">${formatData(orc.criadoEm)}</div>
        </div>
      </div>
      ${expanded?`
        <div class="orc-card-expand">
          <div class="orc-card-detail">
            ${(orc.resultado?.linhas||[]).map(l=>`<div class="orc-detail-row"><span>${l.nome}</span><span>${formatBRL(l.valor)}</span></div>`).join('')}
            ${orc.resultado?.totalAvista<orc.resultado?.total?`<div class="orc-detail-row" style="margin-top:4px"><span style="color:var(--grn)">💚 À vista</span><span style="color:var(--grn)">${formatBRL(orc.resultado.totalAvista)}</span></div>`:''}
            ${orc.clienteFone?`<div class="orc-detail-row"><span>📱 Telefone</span><span>${orc.clienteFone}</span></div>`:''}
          </div>
          <div class="orc-card-actions">
            <button class="orc-act-btn orc-act-editar" onclick="histEditar(${orc.id})">✏️ Editar</button>
            <button class="orc-act-btn orc-act-dupl"   onclick="histDuplicar(${orc.id})">📋 Duplicar</button>
            <button class="orc-act-btn orc-act-excluir" onclick="histExcluir(${orc.id})">🗑️ Excluir</button>
          </div>
        </div>
      `:''}
    </div>
  `;
}

function histToggleExpand(id) {
  histState.expandido = histState.expandido===id ? null : id;
  histRenderLista();
}

function histSetFiltro(id) {
  histState.filtro = id; histState.busca=''; histState.dataInicio=''; histState.dataFim='';
  const fw = document.getElementById('histFiltros');
  if (fw) fw.querySelectorAll('.hist-chip').forEach(b=>{ b.classList.toggle('on', b.textContent.trim()===(['todos','cliente','telefone','data'].map((x,i)=>['📋 Todos','👤 Cliente','📱 Telefone','📅 Data'][i])[['todos','cliente','telefone','data'].indexOf(id)])); });
  // Re-render search area
  const bw = document.getElementById('histBuscaWrap');
  if (bw) bw.innerHTML = histState.filtro!=='data'?`<div class="hist-busca"><span class="hist-busca-ic">🔍</span><input id="histBuscaInput" value="" placeholder="${histPlaceholder()}" oninput="histSetBusca(this.value)" autocomplete="off"></div>`:`<div class="hist-date-row"><div class="hist-date-group"><div class="hist-date-lbl">De</div><input type="date" id="histDataIni" onchange="histSetDatas(this.value,null)"></div><div class="hist-date-group"><div class="hist-date-lbl">Até</div><input type="date" id="histDataFim" onchange="histSetDatas(null,this.value)"></div></div>`;
  // Update chip styles
  document.querySelectorAll('.hist-chip').forEach((b,i)=>b.classList.toggle('on',i===['todos','cliente','telefone','data'].indexOf(id)));
  histRenderLista();
}

function histSetBusca(v) { histState.busca=v; histRenderLista(); }
function histSetDatas(ini,fim) {
  if (ini!==null) histState.dataInicio=ini;
  if (fim!==null) histState.dataFim=fim;
  histRenderLista();
}

function histMostrarToast(msg) {
  const t = document.getElementById('histToast');
  if (!t) return;
  t.innerHTML = `<div class="hist-toast">${msg}</div>`;
  setTimeout(()=>{ if(t) t.innerHTML=''; },2500);
}

async function histExcluir(id) {
  const orc = histState.orcamentos.find(o=>o.id===id);
  if (!orc) return;
  showModalConfirm('🗑️ Excluir orçamento?',`Deseja excluir o orçamento de ${orc.clienteNome||TIPO_LABEL[orc.tipo]}? Esta ação não pode ser desfeita.`,'Excluir',async()=>{
    try {
      await removerOrcamento(id);
      histState.orcamentos = histState.orcamentos.filter(o=>o.id!==id);
      histState.expandido=null;
      histRenderLista();
      closeModal();
      histMostrarToast('🗑️ Orçamento excluído');
    } catch(e) { histMostrarToast('❌ Erro ao excluir'); }
  }, true);
}

async function histDuplicar(id) {
  const orc = histState.orcamentos.find(o=>o.id===id);
  if (!orc) return;
  try {
    await duplicarOrcamento(orc);
    histState.orcamentos = await listarOrcamentos();
    histRenderLista();
    histMostrarToast('📋 Orçamento duplicado!');
  } catch(e) { histMostrarToast('❌ Erro ao duplicar'); }
}

function histEditar(id) {
  const orc = histState.orcamentos.find(o=>o.id===id);
  if (!orc) return;
  showModalEditar(orc, async(atualizado)=>{
    try {
      await atualizarOrcamento(atualizado);
      const idx = histState.orcamentos.findIndex(o=>o.id===id);
      if (idx>=0) histState.orcamentos[idx] = atualizado;
      histRenderLista();
      closeModal();
      histMostrarToast('✅ Orçamento atualizado!');
    } catch(e) { histMostrarToast('❌ Erro ao salvar'); }
  });
}

