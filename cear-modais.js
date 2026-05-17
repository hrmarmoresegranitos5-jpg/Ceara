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


// ════════════════════════════════════════════════════════════
// MODAL COMPARTILHAR — escolha entre PDF e WhatsApp
// ════════════════════════════════════════════════════════════

function showModalCompartilhar(state) {
  const res = state.resultado;
  const cliente = state.cliente || '';
  const fone = state.fone || '';
  const tipoLabel = TIPO_LABEL[state.tipo] || state.tipo;
  const vidroNome = VIDROS[state.vidroKey]?.nome || '';
  const dataStr = new Date().toLocaleDateString('pt-BR');

  showModal(`
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:2rem;margin-bottom:8px">📤</div>
      <div style="font-size:.9rem;font-weight:800;color:var(--tx);margin-bottom:4px">Compartilhar Orçamento</div>
      <div style="font-size:.68rem;color:var(--t4)">Escolha como deseja enviar</div>
    </div>

    <button class="comp-opt" id="compPdfBtn" onclick="orcGerarPDF()">
      <div class="comp-opt-ic" style="background:rgba(212,175,55,0.12);border:1px solid rgba(212,175,55,0.3)">📄</div>
      <div class="comp-opt-body">
        <div class="comp-opt-nm">PDF Profissional</div>
        <div class="comp-opt-sub">Documento formatado com logo, tabela e dados completos</div>
      </div>
      <div class="comp-opt-arr">›</div>
    </button>

    <button class="comp-opt" id="compWppBtn" onclick="orcWppDireto()">
      <div class="comp-opt-ic" style="background:rgba(37,211,102,0.1);border:1px solid rgba(37,211,102,0.25)">💬</div>
      <div class="comp-opt-body">
        <div class="comp-opt-nm">Texto pelo WhatsApp</div>
        <div class="comp-opt-sub">Mensagem formatada enviada direto no WhatsApp</div>
      </div>
      <div class="comp-opt-arr">›</div>
    </button>

    <button class="btn btn-ghost btn-full" style="margin-top:12px" onclick="closeModal()">Cancelar</button>
  `);
}

// ════════════════════════════════════════════════════════════
// GERADOR DE PDF PROFISSIONAL
// ════════════════════════════════════════════════════════════

function gerarPDFOrcamento(state) {
  const res = state.resultado;
  if (!res) return;

  const tipoLabel = TIPO_LABEL[state.tipo] || state.tipo;
  const vidroObj  = VIDROS[state.vidroKey];
  const cliente   = state.cliente || '—';
  const fone      = state.fone    || '—';
  const dataStr   = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
  const dataNum   = new Date().toLocaleDateString('pt-BR');
  const numOrc    = 'ORC-' + Date.now().toString().slice(-6);

  const linhasHTML = res.linhas.map(l => `
    <tr>
      <td style="padding:10px 14px;color:#444;font-size:13px;border-bottom:1px solid #f0ede6">${l.nome}</td>
      <td style="padding:10px 14px;text-align:right;font-weight:600;color:#1a1a2e;font-size:13px;border-bottom:1px solid #f0ede6">${formatBRL(l.valor)}</td>
    </tr>
  `).join('');

  const logoSrc = typeof LOGO_B64 !== 'undefined' ? LOGO_B64 : '';
  const logoHtml = logoSrc
    ? `<img src="${logoSrc}" style="height:80px;object-fit:contain;display:block">`
    : `<div style="font-size:24px;font-weight:900;background:linear-gradient(135deg,#C9A84C,#EDD060);-webkit-background-clip:text;-webkit-text-fill-color:transparent">CP</div>`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Orçamento ${numOrc} — Ceará Planejados</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin:0;padding:0;box-sizing:border-box }
  body { font-family:'Outfit',sans-serif;background:#f7f5f0;color:#1a1a2e;min-height:100vh }
  .page { max-width:680px;margin:0 auto;background:#fff;min-height:100vh }

  /* Header */
  .pdf-header {
    background:linear-gradient(135deg,#0e0e1a 0%,#1a1a2e 60%,#14141f 100%);
    padding:32px 36px 28px;
    display:flex;align-items:center;justify-content:space-between;
    position:relative;overflow:hidden;
  }
  .pdf-header::before {
    content:'';position:absolute;bottom:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,#C9A84C 30%,#EDD060 50%,#C9A84C 70%,transparent);
  }
  .pdf-header::after {
    content:'';position:absolute;top:-60px;right:-40px;
    width:200px;height:200px;border-radius:50%;
    background:radial-gradient(circle,rgba(201,168,76,0.15) 0%,transparent 65%);
  }
  .pdf-logo-block { position:relative;z-index:1 }
  .pdf-header-right { text-align:right;position:relative;z-index:1 }
  .pdf-orcnum { font-size:11px;font-weight:600;color:rgba(212,175,55,0.7);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px }
  .pdf-orcdata { font-size:12px;color:rgba(255,255,255,0.5) }
  .pdf-empresa-nome { font-size:20px;font-weight:800;color:#EDD060;margin-bottom:2px }
  .pdf-empresa-sub { font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:.06em }

  /* Body */
  .pdf-body { padding:32px 36px }

  /* Título do orçamento */
  .pdf-title-row {
    display:flex;align-items:center;justify-content:space-between;
    margin-bottom:24px;padding-bottom:16px;
    border-bottom:2px solid #f0ede6;
  }
  .pdf-title { font-size:22px;font-weight:800;color:#1a1a2e }
  .pdf-badge {
    background:linear-gradient(135deg,#C9A84C,#EDD060);
    color:#0e0e1a;padding:6px 14px;border-radius:20px;
    font-size:11px;font-weight:800;letter-spacing:.05em;
  }

  /* Cliente */
  .pdf-section-lbl {
    font-size:9px;font-weight:700;color:#bbb;letter-spacing:.12em;
    text-transform:uppercase;margin-bottom:10px;
    display:flex;align-items:center;gap:8px;
  }
  .pdf-section-lbl::before {
    content:'';width:16px;height:2px;
    background:linear-gradient(90deg,#C9A84C,transparent);
    border-radius:2px;display:inline-block;
  }
  .pdf-cliente-card {
    background:#faf9f6;border:1px solid #ede9df;border-radius:12px;
    padding:16px 20px;margin-bottom:24px;
    display:flex;gap:32px;
  }
  .pdf-cliente-item label { font-size:10px;color:#999;font-weight:600;display:block;margin-bottom:3px }
  .pdf-cliente-item span { font-size:14px;font-weight:700;color:#1a1a2e }

  /* Produto */
  .pdf-produto-card {
    background:linear-gradient(135deg,rgba(201,168,76,0.06),rgba(201,168,76,0.02));
    border:1px solid rgba(201,168,76,0.2);border-radius:12px;
    padding:16px 20px;margin-bottom:24px;
    display:flex;gap:24px;flex-wrap:wrap;
  }
  .pdf-produto-item label { font-size:10px;color:#a08030;font-weight:600;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em }
  .pdf-produto-item span { font-size:14px;font-weight:700;color:#1a1a2e }

  /* Tabela */
  .pdf-table { width:100%;border-collapse:collapse;margin-bottom:0 }
  .pdf-table thead tr { background:linear-gradient(135deg,#0e0e1a,#1a1a2e) }
  .pdf-table thead th {
    padding:11px 14px;text-align:left;font-size:10px;font-weight:700;
    color:rgba(212,175,55,0.9);letter-spacing:.08em;text-transform:uppercase;
  }
  .pdf-table thead th:last-child { text-align:right }
  .pdf-table tbody tr:last-child td { border-bottom:none }
  .pdf-table tbody tr:nth-child(even) td { background:#faf9f6 }

  /* Total */
  .pdf-total-box {
    background:linear-gradient(135deg,#0e0e1a,#1a1a2e);
    border-radius:0 0 12px 12px;
    padding:20px 14px;
    display:flex;justify-content:space-between;align-items:center;
    position:relative;overflow:hidden;
  }
  .pdf-total-box::before {
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent);
  }
  .pdf-total-lbl { font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:.06em;text-transform:uppercase }
  .pdf-total-val { font-size:26px;font-weight:800;background:linear-gradient(135deg,#EDD060,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text }
  .pdf-avista {
    margin-top:12px;background:rgba(37,180,90,0.1);border:1px solid rgba(37,180,90,0.2);
    border-radius:8px;padding:10px 14px;
    display:flex;justify-content:space-between;align-items:center;
  }
  .pdf-avista-lbl { font-size:11px;color:#2a9e5a;font-weight:700 }
  .pdf-avista-val { font-size:16px;font-weight:800;color:#2a9e5a }

  /* Rodapé */
  .pdf-footer {
    background:#0e0e1a;padding:20px 36px;
    display:flex;align-items:center;justify-content:space-between;
  }
  .pdf-footer-txt { font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:.03em }
  .pdf-footer-brand { font-size:11px;font-weight:700;color:rgba(201,168,76,0.6) }

  /* Tabela wrapper */
  .pdf-table-wrap { border:1px solid #ede9df;border-radius:12px;overflow:hidden;margin-bottom:16px }

  @media print {
    body { background:#fff }
    .page { max-width:100%;box-shadow:none }
    .no-print { display:none }
  }
</style>
</head>
<body>
<div class="page">

  <div class="pdf-header">
    <div class="pdf-logo-block">
      ${logoHtml}
      <div style="margin-top:8px">
        <div class="pdf-empresa-nome">Ceará Planejados</div>
        <div class="pdf-empresa-sub">Vidraçaria · Marcenaria · Serralheria</div>
      </div>
    </div>
    <div class="pdf-header-right">
      <div class="pdf-orcnum">Orçamento</div>
      <div style="font-size:16px;font-weight:800;color:#EDD060;margin-bottom:4px">${numOrc}</div>
      <div class="pdf-orcdata">${dataStr}</div>
    </div>
  </div>

  <div class="pdf-body">

    <div class="pdf-title-row">
      <div class="pdf-title">Proposta Comercial</div>
      <div class="pdf-badge">VÁLIDO 7 DIAS</div>
    </div>

    ${(cliente !== '—' || fone !== '—') ? `
    <div class="pdf-section-lbl">Cliente</div>
    <div class="pdf-cliente-card">
      ${cliente !== '—' ? `<div class="pdf-cliente-item"><label>Nome</label><span>${cliente}</span></div>` : ''}
      ${fone !== '—' ? `<div class="pdf-cliente-item"><label>Telefone</label><span>${fone}</span></div>` : ''}
      <div class="pdf-cliente-item"><label>Data</label><span>${dataNum}</span></div>
    </div>` : ''}

    <div class="pdf-section-lbl">Produto</div>
    <div class="pdf-produto-card">
      <div class="pdf-produto-item"><label>Tipo</label><span>${tipoLabel}</span></div>
      <div class="pdf-produto-item"><label>Medidas</label><span>${state.larg} × ${state.alt} cm</span></div>
      ${vidroObj ? `<div class="pdf-produto-item"><label>Vidro</label><span>${vidroObj.nome}</span></div>` : ''}
    </div>

    <div class="pdf-section-lbl">Composição do Valor</div>
    <div class="pdf-table-wrap">
      <table class="pdf-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th style="text-align:right">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${linhasHTML}
        </tbody>
      </table>
      <div class="pdf-total-box">
        <div>
          <div class="pdf-total-lbl">Total</div>
        </div>
        <div class="pdf-total-val">${formatBRL(res.total)}</div>
      </div>
    </div>

    <div class="pdf-avista">
      <div class="pdf-avista-lbl">💚 Pagamento à vista (10% desconto)</div>
      <div class="pdf-avista-val">${formatBRL(res.totalAvista)}</div>
    </div>

    <div style="margin-top:28px;background:#faf9f6;border:1px solid #ede9df;border-radius:12px;padding:16px 20px">
      <div style="font-size:9px;font-weight:700;color:#bbb;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Condições Gerais</div>
      <div style="font-size:12px;color:#777;line-height:1.7">
        • Vidro temperado 8mm — resistente e seguro<br>
        • Frete grátis em até 20 km<br>
        • Instalação profissional disponível<br>
        • Garantia inclusa no serviço<br>
        • Orçamento válido por 7 dias corridos
      </div>
    </div>

  </div>

  <div class="pdf-footer">
    <div class="pdf-footer-txt">Gerado em ${dataStr} · ${numOrc}</div>
    <div class="pdf-footer-brand">Ceará Planejados</div>
  </div>

</div>

<script>
  // Abre diálogo de impressão/salvar PDF automaticamente
  window.onload = function() {
    setTimeout(function() { window.print(); }, 600);
  };
<\/script>
</body>
</html>`;

  // Abrir em nova aba — o print() vai oferecer "Salvar como PDF"
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
