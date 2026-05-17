// ════════════════════════════════════════════════════════════
// MODAIS
// ════════════════════════════════════════════════════════════

function showModal(html) {
  const c = document.getElementById('modalContainer');
  c.innerHTML = `
    <div class="modal-backdrop" id="modalBackdrop" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()">${html}</div>
    </div>
  `;
}

function closeModal() {
  document.getElementById('modalContainer').innerHTML = '';
}

function showModalConfirm(titulo, mensagem, labelConfirmar, onConfirmar, perigoso=false) {
  showModal(`
    <div class="modal-titulo">${titulo}</div>
    <div class="modal-msg">${mensagem}</div>
    <div class="modal-row">
      <button class="btn btn-ghost btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn ${perigoso?'btn-red':'btn-gold'} btn-full" id="modalConfirmBtn">${labelConfirmar}</button>
    </div>
  `);
  document.getElementById('modalConfirmBtn').onclick = onConfirmar;
}

function showModalWpp(texto, onEnviar) {
  showModal(`
    <div class="modal-titulo">📲 Enviar pelo WhatsApp</div>
    <div class="modal-wpp-preview">${texto}</div>
    <div class="modal-row">
      <button class="btn btn-ghost btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-grn btn-full" id="modalWppBtn">Abrir WhatsApp</button>
    </div>
  `);
  document.getElementById('modalWppBtn').onclick = onEnviar;
}

function showModalEditar(orc, onSalvar) {
  const tiposOpts = TIPOS.map(t=>`<option value="${t.id}"${orc.tipo===t.id?' selected':''}>${t.label}</option>`).join('');
  showModal(`
    <div class="modal-titulo">✏️ Editar Orçamento</div>
    <div style="max-height:60vh;overflow-y:auto">
      <div class="field"><label>Tipo</label><select id="editTipo" onchange="editTipoChange()">${tiposOpts}</select></div>
      <div class="campo-row">
        <div class="field"><label>Largura (cm)</label><input id="editLarg" type="number" value="${orc.larg}" placeholder="cm"></div>
        <div class="field"><label>Altura (cm)</label><input id="editAlt" type="number" value="${orc.alt}" placeholder="cm"></div>
      </div>
      <div class="field"><label>KM para frete</label><input id="editKm" type="number" value="${orc.km||0}" placeholder="0"></div>
      <div class="field"><label>Cliente</label><input id="editCliente" type="text" value="${orc.clienteNome||''}" placeholder="Nome"></div>
      <div class="field"><label>Telefone</label><input id="editFone" type="tel" value="${orc.clienteFone||''}" placeholder="(85) 9..."></div>
    </div>
    <div class="modal-row" style="margin-top:12px">
      <button class="btn btn-ghost btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-gold btn-full" id="modalEditSalvarBtn">Salvar</button>
    </div>
  `);
  document.getElementById('modalEditSalvarBtn').onclick = () => {
    const tipo  = document.getElementById('editTipo').value;
    const larg  = parseFloat(document.getElementById('editLarg').value)||orc.larg;
    const alt   = parseFloat(document.getElementById('editAlt').value)||orc.alt;
    const km    = parseFloat(document.getElementById('editKm').value)||0;
    const clienteNome = document.getElementById('editCliente').value.trim();
    const clienteFone = document.getElementById('editFone').value.trim();
    const novoRes = calcularOrcamento({ tipo, larg, alt, vidro:orc.vidro, accs:orc.accs||{}, km });
    onSalvar({ ...orc, tipo, larg, alt, km, clienteNome, clienteFone, resultado:novoRes||orc.resultado });
  };
}

