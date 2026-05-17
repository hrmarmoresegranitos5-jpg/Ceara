// ════════════════════════════════════════════════════════════
// CLIENTES
// ════════════════════════════════════════════════════════════

const CLIENTES_MOCK = [
  { nome:'João Silva',  fone:'(85) 99111-2233', ult:'Porta Pivotante · R$ 2.840', data:'14 Mai 2025' },
  { nome:'Maria Costa', fone:'(85) 98222-3344', ult:'Box de Banheiro · R$ 1.560', data:'10 Mai 2025' },
  { nome:'Pedro Alves', fone:'(85) 97333-4455', ult:'Janela Correr · R$ 980',     data:'05 Mai 2025' },
  { nome:'Ana Souza',   fone:'(85) 96444-5566', ult:'Espelho · R$ 430',           data:'28 Abr 2025' },
  { nome:'Carlos Lima', fone:'(85) 95555-6677', ult:'Guarda Corpo · R$ 3.200',    data:'20 Abr 2025' },
];

let clientesBusca = '';

function renderClientes(wrap) {
  const filtrados = clientesBusca.trim()==='' ? CLIENTES_MOCK : CLIENTES_MOCK.filter(c=>c.nome.toLowerCase().includes(clientesBusca.toLowerCase())||c.fone.includes(clientesBusca));
  wrap.innerHTML = `
    <div>
      <div class="hero"><div class="hero-ttl">👥 Clientes</div><div class="hero-sub">Cadastro e histórico de atendimentos</div></div>
      <div class="section">
        <div class="card" style="background:linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02));border-color:rgba(201,168,76,.2);margin-bottom:20px;display:flex;align-items:center;gap:12px">
          <span style="font-size:1.5rem">🚧</span>
          <div><div style="font-size:.76rem;font-weight:700;color:var(--gold2);margin-bottom:3px">Em desenvolvimento</div><div style="font-size:.65rem;color:var(--t4);line-height:1.5">CRM completo com histórico e cadastro total de clientes em breve.</div></div>
        </div>
        <div class="field" style="margin-bottom:16px">
          <input type="text" placeholder="🔍  Buscar por nome ou telefone…" value="${clientesBusca}" oninput="clientesBuscar(this.value)">
        </div>
        <div class="section-ttl">${filtrados.length} cliente${filtrados.length!==1?'s':''}</div>
        ${filtrados.length===0?`<div class="card" style="text-align:center;padding:28px 16px"><div style="font-size:1.5rem;margin-bottom:8px">🔍</div><div style="font-size:.76rem;color:var(--t4)">Nenhum cliente encontrado</div></div>`:
        filtrados.map(c=>`
          <div class="cliente-card">
            <div class="cliente-top">
              <div style="display:flex;align-items:center;gap:12px">
                <div class="cliente-avatar">${c.nome.charAt(0)}</div>
                <div><div style="font-size:.82rem;font-weight:700;color:var(--tx);margin-bottom:2px">${c.nome}</div><div style="font-size:.66rem;color:var(--t3)">${c.fone}</div></div>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="window.open('https://wa.me/55${c.fone.replace(/\D/g,'')}','_blank')">📲</button>
            </div>
            <div class="cliente-ult">
              <div style="font-size:.65rem;color:var(--t4)">Último: <span style="color:var(--t2);font-weight:600">${c.ult}</span></div>
              <div style="font-size:.6rem;color:var(--t4)">${c.data}</div>
            </div>
          </div>
        `).join('')}
        <button class="btn btn-gold btn-full" style="margin-top:8px" onclick="alert('Cadastro de cliente: em desenvolvimento')">+ Novo Cliente</button>
      </div>
      <div style="height:80px"></div>
    </div>
  `;
}

function clientesBuscar(v) {
  clientesBusca = v;
  renderClientes(document.getElementById('pgWrap'));
}

