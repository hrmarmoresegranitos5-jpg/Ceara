/* ============================================================
   CEARÁ PLANEJADOS — Agenda de Instalações
   Fila sequencial (1 equipe por vez): cada obra começa no dia
   seguinte ao fim da anterior. Duração informada manualmente
   por obra. Fins de semana são pulados automaticamente.
   ============================================================ */

var AG_STORE_KEY = 'cearAgendaObras';
var AG_START_KEY = 'cearAgendaInicio';
var _agFormAberto = false;
var _agMostrarConcluidas = false;

// ── Persistência (localStorage) ──
function _agLoad() {
  try { return JSON.parse(localStorage.getItem(AG_STORE_KEY) || '[]'); } catch(e) { return []; }
}
function _agSave(list) {
  try { localStorage.setItem(AG_STORE_KEY, JSON.stringify(list)); } catch(e) {}
}
function _agGetInicioFila() {
  var v = localStorage.getItem(AG_START_KEY);
  var d = v ? new Date(v+'T00:00:00') : new Date();
  d.setHours(0,0,0,0);
  return d;
}
function _agSetInicioFila(dateStr) { localStorage.setItem(AG_START_KEY, dateStr); }
function _agId() { return 'ag'+Date.now()+Math.random().toString(36).slice(2,7); }

// ── Datas úteis (pula sábado/domingo) ──
function _agIsWeekend(d) { var wd=d.getDay(); return wd===0||wd===6; }
function _agEnsureBizDay(d) { var nd=new Date(d); while(_agIsWeekend(nd)) nd.setDate(nd.getDate()+1); return nd; }
function _agNextBizDay(d) { var nd=new Date(d); nd.setDate(nd.getDate()+1); while(_agIsWeekend(nd)) nd.setDate(nd.getDate()+1); return nd; }
function _agAddBizDays(start, n) {
  var d = new Date(start), count = 1;
  while (count < (n||1)) { d = _agNextBizDay(d); count++; }
  return d;
}
function _agToday0() { var d=new Date(); d.setHours(0,0,0,0); return d; }
function _agFmtDate(d) {
  var dias=['dom','seg','ter','qua','qui','sex','sáb'];
  return dias[d.getDay()]+' '+String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');
}
function _esc(s) { return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── Recalcula início/fim de cada obra PENDENTE, em ordem de fila.
//    Obras concluídas não consomem tempo de fila. ──
function _agComputeSchedule(list) {
  var cursor = _agEnsureBizDay(_agGetInicioFila());
  var out = [];
  list.forEach(function(obra) {
    if (obra.status === 'concluida') { out.push(Object.assign({}, obra)); return; }
    var inicio = cursor;
    var fim = _agAddBizDays(inicio, obra.dias||1);
    out.push(Object.assign({}, obra, {_inicio:inicio, _fim:fim}));
    cursor = _agNextBizDay(fim);
  });
  return out;
}

// ── Ações ──
// Função pública: outros módulos (histórico, clientes) poderão futuramente
// chamar agAdicionarObra(cliente, dias, obs) pra jogar uma obra na fila direto.
function agAdicionarObra(cliente, dias, obs) {
  var list = _agLoad();
  list.push({ id:_agId(), cliente:(cliente||'').trim(), dias:parseInt(dias)||1, obs:(obs||'').trim(), status:'pendente', criadoEm:Date.now() });
  _agSave(list);
  if (document.getElementById('pgAgenda')) renderAgenda(document.getElementById('pgWrap'));
}
function agMover(id, dir) {
  var list = _agLoad();
  var idx = list.findIndex(function(o){return o.id===id;});
  if (idx<0) return;
  var novoIdx = idx+dir;
  if (novoIdx<0 || novoIdx>=list.length) return;
  var tmp=list[idx]; list[idx]=list[novoIdx]; list[novoIdx]=tmp;
  _agSave(list);
  renderAgenda(document.getElementById('pgWrap'));
}
function agConcluir(id) {
  var list = _agLoad();
  var o = list.find(function(x){return x.id===id;});
  if (!o) return;
  o.status = (o.status==='concluida') ? 'pendente' : 'concluida';
  _agSave(list);
  renderAgenda(document.getElementById('pgWrap'));
}
function agExcluir(id) {
  var doDelete = function(){
    _agSave(_agLoad().filter(function(o){return o.id!==id;}));
    renderAgenda(document.getElementById('pgWrap'));
  };
  if (typeof showModalConfirm === 'function') {
    showModalConfirm('🗑️ Excluir obra?','Essa ação não pode ser desfeita.','Excluir', doDelete);
  } else if (confirm('Excluir esta obra da fila?')) {
    doDelete();
  }
}
function agAtualizarDias(id, novoDias) {
  var list = _agLoad();
  var o = list.find(function(x){return x.id===id;});
  if (!o) return;
  o.dias = Math.max(1, parseInt(novoDias)||1);
  _agSave(list);
  renderAgenda(document.getElementById('pgWrap'));
}
function agAtualizarInicioFila(dateStr) { _agSetInicioFila(dateStr); renderAgenda(document.getElementById('pgWrap')); }
function agAbrirForm() { _agFormAberto = true; renderAgenda(document.getElementById('pgWrap')); }
function agFecharForm() { _agFormAberto = false; renderAgenda(document.getElementById('pgWrap')); }
function agToggleConcluidas() { _agMostrarConcluidas = !_agMostrarConcluidas; renderAgenda(document.getElementById('pgWrap')); }
function agSalvarNovo() {
  var cliente = (document.getElementById('agNovoCliente')||{}).value || '';
  var dias    = (document.getElementById('agNovoDias')||{}).value || 1;
  var obs     = (document.getElementById('agNovoObs')||{}).value || '';
  if (!cliente.trim()) { var el=document.getElementById('agNovoCliente'); if(el) el.focus(); return; }
  agAdicionarObra(cliente, dias, obs);
  _agFormAberto = false;
}

// ── Prompt "agendar instalação?" — chamado logo depois de salvar um orçamento ──
function agPromptAgendar(cliente) {
  if (typeof showModal !== 'function') return; // cear-modais.js não carregado ainda
  var nomeExib = cliente ? '<b>'+_esc(cliente)+'</b>' : 'este cliente';
  showModal(
    '<div class="modal-titulo">📅 Agendar instalação?</div>'
    + '<div class="modal-msg">Quantos dias úteis a instalação de '+nomeExib+' deve levar?</div>'
    + '<div class="field" style="margin:14px 0 6px;text-align:left">'
      + '<label>Duração (dias úteis)</label>'
      + '<input type="number" id="agPromptDias" min="1" value="1">'
    + '</div>'
    + '<div class="modal-row">'
      + '<button class="btn btn-ghost btn-full" onclick="closeModal()">Agora não</button>'
      + '<button class="btn btn-gold btn-full" id="agPromptBtn">📅 Agendar</button>'
    + '</div>'
  );
  var btn = document.getElementById('agPromptBtn');
  if (btn) btn.onclick = function(){
    var dias = document.getElementById('agPromptDias').value;
    agAdicionarObra(cliente||'', dias);
    closeModal();
    if (typeof histMostrarToast === 'function') histMostrarToast('📅 Adicionado à Agenda');
  };
}

// ── Render principal ──
function renderAgenda(wrap) {
  if (!wrap) return;
  var lista = _agComputeSchedule(_agLoad());
  var pendentes = lista.filter(function(o){return o.status!=='concluida';});
  var concluidas = lista.filter(function(o){return o.status==='concluida';});
  var hoje = _agToday0();
  var inicioFilaStr = _agGetInicioFila().toISOString().slice(0,10);

  var header = '<div class="ag-hero">'
    + '<div class="ag-hero-ttl">📅 Agenda de Instalações</div>'
    + '<div class="ag-hero-sub">'+(pendentes.length ? pendentes.length+' obra'+(pendentes.length>1?'s':'')+' na fila' : 'Nenhuma obra na fila')+'</div>'
    + '</div>';

  var inicioBlock = '<div class="field">'
    + '<label>Início da fila</label>'
    + '<input type="date" id="agInicioFila" value="'+inicioFilaStr+'" onchange="agAtualizarInicioFila(this.value)">'
    + '</div>';

  var proximaBlock = '';
  if (pendentes[0]) {
    var p = pendentes[0];
    proximaBlock = '<div class="ag-proxima">'
      + '<span class="ag-proxima-lbl">Próxima instalação</span>'
      + '<span class="ag-proxima-cliente">'+_esc(p.cliente)+'</span>'
      + '<span class="ag-proxima-data">'+_agFmtDate(p._inicio)+' → '+_agFmtDate(p._fim)+'</span>'
      + '</div>';
  }

  var cards = '';
  pendentes.forEach(function(o, i) {
    var emAndamento = hoje >= o._inicio && hoje <= o._fim;
    cards += '<div class="ag-card'+(emAndamento?' is-atual':'')+'" style="animation-delay:'+(i*40)+'ms">'
      + '<div class="ag-card-top">'
        + '<span class="ag-card-num">#'+(i+1)+'</span>'
        + (emAndamento ? '<span class="ag-card-badge">Em andamento</span>' : '')
      + '</div>'
      + '<div class="ag-card-cliente">'+_esc(o.cliente)+'</div>'
      + (o.obs ? '<div class="ag-card-obs">'+_esc(o.obs)+'</div>' : '')
      + '<div class="ag-card-datas">'+_agFmtDate(o._inicio)+' → '+_agFmtDate(o._fim)+'</div>'
      + '<div class="ag-card-row">'
        + '<label class="ag-card-dias-lbl">Dias úteis</label>'
        + '<input type="number" min="1" class="ag-card-dias" value="'+o.dias+'" onchange="agAtualizarDias(\''+o.id+'\',this.value)">'
      + '</div>'
      + '<div class="ag-card-actions">'
        + '<button class="ag-act" onclick="agMover(\''+o.id+'\',-1)" '+(i===0?'disabled':'')+'>▲</button>'
        + '<button class="ag-act" onclick="agMover(\''+o.id+'\',1)" '+(i===pendentes.length-1?'disabled':'')+'>▼</button>'
        + '<button class="ag-act ag-act-ok" onclick="agConcluir(\''+o.id+'\')">✓ Concluir</button>'
        + '<button class="ag-act ag-act-del" onclick="agExcluir(\''+o.id+'\')">🗑</button>'
      + '</div>'
      + '</div>';
  });

  var emptyState = pendentes.length ? '' : '<div class="ag-empty">📋 Nenhuma obra na fila ainda — adicione a primeira instalação abaixo</div>';

  var formBlock;
  if (_agFormAberto) {
    formBlock = '<div class="ag-form">'
      + '<div class="field"><label>Cliente</label><input type="text" id="agNovoCliente" placeholder="Nome do cliente"></div>'
      + '<div class="field"><label>Duração (dias úteis)</label><input type="number" id="agNovoDias" min="1" value="1"></div>'
      + '<div class="field"><label>Observação (opcional)</label><input type="text" id="agNovoObs" placeholder="Endereço, detalhes..."></div>'
      + '<div class="ag-form-actions">'
        + '<button class="btn btn-ghost" onclick="agFecharForm()">Cancelar</button>'
        + '<button class="btn btn-gold" onclick="agSalvarNovo()">Adicionar à fila</button>'
      + '</div>'
      + '</div>';
  } else {
    formBlock = '<button class="ag-add-btn" onclick="agAbrirForm()">+ Adicionar obra à fila</button>';
  }

  var concluidasBlock = '';
  if (concluidas.length) {
    concluidasBlock = '<button class="ag-concluidas-toggle" onclick="agToggleConcluidas()">'
      + (_agMostrarConcluidas?'▾':'▸') + ' Concluídas ('+concluidas.length+')'
      + '</button>';
    if (_agMostrarConcluidas) {
      concluidas.forEach(function(o){
        concluidasBlock += '<div class="ag-card ag-card-done">'
          + '<div class="ag-card-cliente">'+_esc(o.cliente)+'</div>'
          + '<div class="ag-card-actions">'
            + '<button class="ag-act" onclick="agConcluir(\''+o.id+'\')">↺ Reabrir</button>'
            + '<button class="ag-act ag-act-del" onclick="agExcluir(\''+o.id+'\')">🗑</button>'
          + '</div>'
          + '</div>';
      });
    }
  }

  wrap.innerHTML = '<div id="pgAgenda">'
    + header
    + inicioBlock
    + proximaBlock
    + '<div class="ag-lista">'+cards+'</div>'
    + emptyState
    + formBlock
    + concluidasBlock
    + '<div style="height:32px"></div>'
    + '</div>';
}
