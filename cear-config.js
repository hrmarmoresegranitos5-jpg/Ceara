// ════════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ════════════════════════════════════════════════════════════

const DIFERENCIAIS = [
  { ic:'🏆', ttl:'Qualidade',  sub:'Vidros certificados'          },
  { ic:'🔧', ttl:'Instalação', sub:'Profissional especializado'   },
  { ic:'⚡', ttl:'Agilidade',  sub:'Prazo cumprido'               },
  { ic:'💬', ttl:'Suporte',    sub:'Atendimento direto'           },
];
const CONTATOS = [
  { ic:'⏰', lbl:'Horário',    val:'Seg–Sex 8h–18h · Sáb 8h–13h'         },
  { ic:'🚛', lbl:'Frete',     val:'Grátis até 20 km · Acima sob consulta' },
  { ic:'💳', lbl:'Pagamento', val:'PIX · Dinheiro · Cartão · Parcelado'   },
  { ic:'📐', lbl:'Medição',   val:'Visita técnica disponível'              },
];
const SERVICOS = [['🚪','Portas de Vidro'],['🪟','Janelas'],['🛁','Box de Banheiro'],['🪞','Espelhos'],['🏗️','Guarda Corpo'],['🪵','Marcenaria'],['⚙️','Serralheria'],['🔆','Vidros Comuns']];

function renderConfig(wrap) {
  wrap.innerHTML = `
    <div>
      <div class="sobre-hero"><div class="sobre-nm">Ceará Planejados</div><div class="sobre-sub">Vidraçaria · Marcenaria · Serralheria</div></div>
      <div class="section">
        <div class="garantia-grid">
          ${DIFERENCIAIS.map(g=>`<div class="garantia-card"><div class="garantia-ic">${g.ic}</div><div class="garantia-ttl">${g.ttl}</div><div class="garantia-sub">${g.sub}</div></div>`).join('')}
        </div>
        <div class="section-ttl">Contato &amp; Informações</div>
        <div class="card" style="padding:6px 16px">
          ${CONTATOS.map(item=>`<div class="info-item"><span class="info-ic">${item.ic}</span><div class="info-body"><div class="info-lbl">${item.lbl}</div><div class="info-val">${item.val}</div></div></div>`).join('')}
        </div>
        <div class="section-ttl" style="margin-top:20px">Nossos Serviços</div>
        <div class="card">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            ${SERVICOS.map(([ic,nome])=>`<div style="display:flex;align-items:center;gap:9px"><span>${ic}</span><span style="font-size:.78rem;color:var(--t2)">${nome}</span></div>`).join('')}
          </div>
        </div>
        <button class="btn btn-grn btn-full" style="margin-top:18px" onclick="window.open('https://wa.me/5585999999999','_blank')">📲 Falar no WhatsApp</button>
        <div class="divider" style="margin-top:24px"></div>
        <div class="section-ttl" style="margin-top:4px">Configurações do App</div>
        <div class="card" style="background:linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02));border-color:rgba(201,168,76,.2);display:flex;align-items:center;gap:12px">
          <span style="font-size:1.5rem">🚧</span>
          <div><div style="font-size:.76rem;font-weight:700;color:var(--gold2);margin-bottom:3px">Em desenvolvimento</div><div style="font-size:.65rem;color:var(--t4);line-height:1.5">Edição de dados da empresa, margens e configurações gerais em breve.</div></div>
        </div>
        <div style="text-align:center;margin-top:20px"><div style="font-size:.55rem;color:var(--t4);letter-spacing:2px;text-transform:uppercase">Ceará Planejados · v1.0</div></div>
      </div>
      <div style="height:80px"></div>
    </div>
  `;
}

