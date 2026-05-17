// ════════════════════════════════════════════════════════════
// HOME / DASHBOARD
// ════════════════════════════════════════════════════════════

const ATALHOS = [
  { tipo:'pivotante', icone:'🚪', nome:'Porta Pivotante', sub:'Temperado 8mm',       cor:'rgba(212,175,55,0.12)', borda:'rgba(212,175,55,0.25)' },
  { tipo:'correr',    icone:'🔲', nome:'Porta de Correr', sub:'2 ou 4 folhas',       cor:'rgba(80,160,220,0.1)',  borda:'rgba(80,160,220,0.2)'  },
  { tipo:'janela',    icone:'🪟', nome:'Janela',          sub:'Correr / Basculante',  cor:'rgba(100,200,140,0.1)',borda:'rgba(100,200,140,0.2)' },
  { tipo:'box',       icone:'🛁', nome:'Box de Banheiro', sub:'Pivotante / Correr',  cor:'rgba(160,120,220,0.1)',borda:'rgba(160,120,220,0.2)' },
  { tipo:'espelho',   icone:'🪞', nome:'Espelho',         sub:'Com / sem bisotê',     cor:'rgba(220,180,80,0.1)', borda:'rgba(220,180,80,0.2)'  },
  { tipo:'guarda',    icone:'🏗️', nome:'Guarda Corpo',    sub:'Módulos de 120cm',    cor:'rgba(220,100,100,0.1)',borda:'rgba(220,100,100,0.2)' },
];

const INFOS = [
  { ic:'⏰', lbl:'Horário',    val:'Seg–Sex 8h–18h · Sáb 8h–13h',          bg:'rgba(212,175,55,0.1)', border:'rgba(212,175,55,0.2)' },
  { ic:'🚛', lbl:'Frete',     val:'Grátis até 20 km · Acima sob consulta',  bg:'rgba(58,158,106,0.1)', border:'rgba(58,158,106,0.2)' },
  { ic:'💳', lbl:'Pagamento', val:'10% desconto à vista · 6x sem juros',    bg:'rgba(80,160,220,0.1)', border:'rgba(80,160,220,0.2)' },
  { ic:'🔧', lbl:'Instalação',val:'Profissional capacitado · Garantia inclusa',bg:'rgba(160,120,220,0.1)',border:'rgba(160,120,220,0.2)' },
];

function renderHome(wrap) {
  const isAberto = (() => {
    const d = new Date();
    const h = d.getHours(), day = d.getDay();
    if (day === 0) return false; // Domingo
    if (day === 6) return h >= 8 && h < 13; // Sábado
    return h >= 8 && h < 18; // Seg-Sex
  })();

  wrap.innerHTML = `
    <div id="pgHome">
      <!-- BANNER HERO -->
      <div class="home-banner" style="animation:slideUp 200ms ease both">
        <div class="home-banner-glow"></div>
        <div class="home-banner-top">
          <div>
            <div class="home-banner-nm">Ceará Planejados</div>
            <div class="home-banner-sub">Vidraçaria · Marcenaria · Serralheria</div>
          </div>
          <div style="
            background:${isAberto ? 'rgba(58,158,106,0.18)' : 'rgba(200,80,80,0.15)'};
            border:1px solid ${isAberto ? 'rgba(58,158,106,0.35)' : 'rgba(200,80,80,0.3)'};
            border-radius:20px;padding:5px 12px;font-size:.6rem;font-weight:700;
            color:${isAberto ? '#4DBF88' : '#E07070'};
            letter-spacing:.05em;display:flex;align-items:center;gap:5px;
            white-space:nowrap;margin-top:2px;
            box-shadow:0 2px 10px ${isAberto ? 'rgba(58,158,106,0.15)' : 'rgba(200,80,80,0.12)'};
          ">
            <span style="
              width:6px;height:6px;border-radius:50%;
              background:${isAberto ? '#4DBF88' : '#E07070'};
              box-shadow:0 0 8px ${isAberto ? 'rgba(58,158,106,0.9)' : 'rgba(200,80,80,0.7)'};
              display:inline-block;
              ${isAberto ? 'animation:pulse 2s infinite' : ''}
            "></span>${isAberto ? 'ABERTO' : 'FECHADO'}
          </div>
        </div>
        <div class="home-stats">
          <div class="stat-card">
            <div class="stat-val">8mm</div>
            <div class="stat-lbl">Temperado</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">10%</div>
            <div class="stat-lbl">À vista</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">20km</div>
            <div class="stat-lbl">Frete grátis</div>
          </div>
        </div>
      </div>

      <!-- ATALHOS ORÇAMENTO -->
      <div class="section">
        <div class="section-ttl">Calcular Orçamento</div>
        <div class="qa-grid">
          ${ATALHOS.map((a,i) => `
            <div class="qa-btn" style="animation-delay:${60+i*35}ms;--qa-color:${a.borda}" onclick="goOrc('${a.tipo}')">
              <span class="qa-ic" style="background:${a.cor};border:1px solid ${a.borda}">${a.icone}</span>
              <div class="qa-nm">${a.nome}</div>
              <div class="qa-sm">${a.sub}</div>
              <div class="qa-arr">›</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- INFORMAÇÕES -->
      <div class="section">
        <div class="section-ttl">Informações</div>
        <div class="card" style="padding:2px 16px">
          ${INFOS.map(info => `
            <div class="info-item">
              <span class="info-ic" style="background:${info.bg};border:1px solid ${info.border}">${info.ic}</span>
              <div class="info-body">
                <div class="info-lbl">${info.lbl}</div>
                <div class="info-val">${info.val}</div>
              </div>
            </div>
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

