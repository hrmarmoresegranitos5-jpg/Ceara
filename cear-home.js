// ════════════════════════════════════════════════════════════
// HOME / DASHBOARD — Layout minimalista
// ════════════════════════════════════════════════════════════

const ATALHOS = [
  { tipo:'pivotante', icone:'🚪', nome:'Porta Pivotante', sub:'Temperado 8mm',       cor:'rgba(212,175,55,0.12)', borda:'rgba(212,175,55,0.25)' },
  { tipo:'correr',    icone:'🔲', nome:'Porta de Correr', sub:'2 ou 4 folhas',       cor:'rgba(80,160,220,0.1)',  borda:'rgba(80,160,220,0.2)'  },
  { tipo:'janela',    icone:'🪟', nome:'Janela',          sub:'Correr / Basculante',  cor:'rgba(100,200,140,0.1)',borda:'rgba(100,200,140,0.2)' },
  { tipo:'box',       icone:'🛁', nome:'Box de Banheiro', sub:'Pivotante / Correr',  cor:'rgba(160,120,220,0.1)',borda:'rgba(160,120,220,0.2)' },
  { tipo:'espelho',   icone:'🪞', nome:'Espelho',         sub:'Com / sem bisotê',     cor:'rgba(220,180,80,0.1)', borda:'rgba(220,180,80,0.2)'  },
  { tipo:'guarda',    icone:'🏗️', nome:'Guarda Corpo',    sub:'Módulos de 120cm',    cor:'rgba(220,100,100,0.1)',borda:'rgba(220,100,100,0.2)' },
];

const MENU_CARDS = [
  { id:'orc',        icone:'🧮', nome:'Orçamento',  sub:'Calcule preços',      cor:'rgba(212,175,55,0.13)', borda:'rgba(212,175,55,0.28)' },
  { id:'financeiro', icone:'💎', nome:'Preços',      sub:'Tabela de vidros',    cor:'rgba(80,160,220,0.1)',  borda:'rgba(80,160,220,0.22)' },
  { id:'historico',  icone:'📂', nome:'Histórico',   sub:'Orçamentos salvos',   cor:'rgba(100,200,140,0.1)',borda:'rgba(100,200,140,0.22)' },
  { id:'clientes',   icone:'👥', nome:'Clientes',    sub:'Cadastro de clientes',cor:'rgba(160,120,220,0.1)',borda:'rgba(160,120,220,0.22)' },
  { id:'config',     icone:'⚙️', nome:'Config.',     sub:'Ajustes do sistema',  cor:'rgba(180,180,180,0.08)',borda:'rgba(180,180,180,0.15)' },
];

function renderHome(wrap) {
  const isAberto = (() => {
    const d = new Date();
    const h = d.getHours(), day = d.getDay();
    if (day === 0) return false;
    if (day === 6) return h >= 8 && h < 13;
    return h >= 8 && h < 18;
  })();

  const d = new Date();
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const saudacao = d.getHours() < 12 ? 'Bom dia' : d.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  wrap.innerHTML = `
    <div id="pgHome" class="home-minimal">

      <!-- SAUDAÇÃO TOPO -->
      <div class="hm-top" style="animation:slideUp 160ms ease both">
        <div class="hm-greet">${saudacao} 👋</div>
        <div class="hm-status ${isAberto ? 'aberto' : 'fechado'}">
          <span class="hm-dot ${isAberto ? 'pulsing' : ''}"></span>
          ${isAberto ? 'Aberto agora' : 'Fechado'}
        </div>
      </div>

      <!-- ORÇAMENTO RÁPIDO -->
      <div class="hm-section" style="animation:slideUp 200ms ease both">
        <div class="hm-section-lbl">Orçamento rápido</div>
        <div class="hm-orc-grid">
          ${ATALHOS.map((a,i) => `
            <button class="hm-orc-btn" style="animation-delay:${i*30}ms;--hob-color:${a.borda};--hob-bg:${a.cor}" onclick="goOrc('${a.tipo}')">
              <span class="hm-orc-ic">${a.icone}</span>
              <span class="hm-orc-nm">${a.nome}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- MENU PRINCIPAL -->
      <div class="hm-section" style="animation:slideUp 240ms ease both">
        <div class="hm-section-lbl">Menu</div>
        <div class="hm-menu-list">
          ${MENU_CARDS.map((m,i) => `
            <button class="hm-menu-row" style="animation-delay:${i*35}ms" onclick="navTo('${m.id}')">
              <span class="hm-menu-ic" style="background:${m.cor};border:1px solid ${m.borda}">${m.icone}</span>
              <div class="hm-menu-txt">
                <div class="hm-menu-nm">${m.nome}</div>
                <div class="hm-menu-sub">${m.sub}</div>
              </div>
              <span class="hm-menu-arr">›</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div style="height:88px"></div>
    </div>
  `;
}

function goOrc(tipo) {
  orcState.tipo = tipo;
  orcState.larg = DEFAULTS[tipo]?.larg ?? 80;
  orcState.alt  = DEFAULTS[tipo]?.alt ?? 120;
  orcState.vidroKey = (VIDROS_POR_TIPO[tipo]||[])[0]||'';
  orcState.accs = {};
  orcState.resultado = null;
  navTo('orc');
}
