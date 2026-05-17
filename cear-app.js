// ════════════════════════════════════════════════════════════
// SPLASH SCREEN (entrada animada)
// ════════════════════════════════════════════════════════════

function showSplash(onDone) {
  // Esconde o app enquanto o splash roda
  const sAppEl = document.getElementById('sApp');
  if (sAppEl) sAppEl.style.display = 'none';

  const splash = document.createElement('div');
  splash.id = 'splash';
  splash.innerHTML = `
    <div id="splashBg"></div>
    <div id="splashParticles"></div>
    <div id="splashInner">
      <div id="splashLogoWrap">
        <div id="splashLogo">🪨</div>
        <div id="splashLogoShimmer"></div>
      </div>
      <div id="splashNome">Ceará Planejados</div>
      <div id="splashSub">Vidraçaria · Marcenaria · Serralheria</div>
      <div id="splashBar"><div id="splashBarFill"></div></div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #splash {
      position: fixed; inset: 0; z-index: 9999;
      background: #0A0A16;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    #splashBg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%),
                  radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 60%),
                  linear-gradient(180deg, #0D0D1C 0%, #0A0A14 100%);
    }
    #splashParticles {
      position: absolute; inset: 0; pointer-events: none;
    }
    .sp-dot {
      position: absolute; border-radius: 50%;
      background: rgba(212,175,55,0.4);
      animation: spFloat var(--dur,3s) ease-in-out infinite alternate;
    }
    @keyframes spFloat {
      from { transform: translateY(0) scale(1); opacity: var(--op,0.3); }
      to   { transform: translateY(-12px) scale(1.2); opacity: calc(var(--op,0.3)*1.8); }
    }
    #splashInner {
      display: flex; flex-direction: column; align-items: center;
      gap: 10px; padding: 0 40px; position: relative; z-index: 1;
      animation: splashIn 560ms cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes splashIn {
      from { opacity: 0; transform: scale(.78) translateY(24px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes splashOut {
      from { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
      to   { opacity: 0; transform: scale(1.08) translateY(-8px); filter: blur(4px); }
    }
    #splashLogoWrap {
      position: relative; width: 88px; height: 88px;
      margin-bottom: 10px;
    }
    #splashLogo {
      width: 88px; height: 88px;
      border-radius: 24px;
      background: linear-gradient(145deg, #1E1E32, #12121E);
      border: 1px solid rgba(212,175,55,0.45);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.8rem; position: relative; overflow: hidden;
      box-shadow:
        0 0 0 1px rgba(212,175,55,0.1),
        0 0 40px rgba(212,175,55,0.18),
        0 12px 48px rgba(0,0,0,0.8);
      animation: splashBloom 2.4s ease-in-out infinite alternate;
    }
    @keyframes splashBloom {
      from {
        box-shadow: 0 0 0 1px rgba(212,175,55,0.1), 0 0 24px rgba(212,175,55,0.12), 0 12px 48px rgba(0,0,0,0.8);
      }
      to {
        box-shadow: 0 0 0 1px rgba(212,175,55,0.25), 0 0 52px rgba(212,175,55,0.32), 0 0 80px rgba(212,175,55,0.10), 0 12px 48px rgba(0,0,0,0.8);
      }
    }
    #splashLogoShimmer {
      position: absolute; inset: 0; border-radius: 24px;
      background: linear-gradient(105deg, transparent 30%, rgba(237,208,96,0.22) 50%, transparent 70%);
      background-size: 200% 100%;
      animation: splashShimmer 2s ease-in-out infinite;
      pointer-events: none;
    }
    #splashNome {
      font-family: 'Outfit', sans-serif;
      font-size: 1.45rem; font-weight: 800;
      color: #EDEAE0; letter-spacing: -.015em;
      background: linear-gradient(135deg, #EDD060 0%, #C9A84C 50%, #EDD060 100%);
      background-size: 200% 100%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: splashShimmer 3s ease-in-out infinite;
    }
    #splashSub {
      font-family: 'Outfit', sans-serif;
      font-size: .72rem; font-weight: 400;
      color: #6A6870; letter-spacing: .05em;
    }
    #splashBar {
      width: 130px; height: 3px;
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      margin-top: 32px;
      overflow: hidden;
      box-shadow: 0 0 8px rgba(0,0,0,0.4);
    }
    #splashBarFill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, #A88030, #EDD060, #C9A84C);
      border-radius: 10px;
      transition: width 1.5s cubic-bezier(.4,0,.2,1);
      box-shadow: 0 0 8px rgba(237,208,96,0.5);
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(splash);

  // Gera partículas douradas decorativas
  const particles = splash.querySelector('#splashParticles');
  const dots = [
    { x:15, y:20, s:3, op:0.3, dur:'2.8s', delay:'0s' },
    { x:82, y:15, s:2, op:0.25, dur:'3.2s', delay:'.4s' },
    { x:90, y:70, s:4, op:0.2, dur:'2.5s', delay:'.8s' },
    { x:8,  y:75, s:2, op:0.3, dur:'3.5s', delay:'.2s' },
    { x:50, y:88, s:3, op:0.2, dur:'2.9s', delay:'1s' },
    { x:70, y:30, s:2, op:0.15, dur:'3.8s', delay:'.6s' },
    { x:25, y:60, s:2, op:0.2, dur:'4s', delay:'1.2s' },
  ];
  dots.forEach(d => {
    const el = document.createElement('div');
    el.className = 'sp-dot';
    el.style.cssText = `left:${d.x}%;top:${d.y}%;width:${d.s}px;height:${d.s}px;--op:${d.op};--dur:${d.dur};animation-delay:${d.delay};`;
    particles.appendChild(el);
  });

  // Animação da barra de progresso
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('splashBarFill').style.width = '100%';
    }, 80);
  });

  // Sair após 1.9s
  setTimeout(() => {
    splash.style.animation = 'splashOut 420ms cubic-bezier(.4,0,1,1) both';
    setTimeout(() => {
      splash.remove();
      style.remove();
      const sApp2 = document.getElementById('sApp');
      if (sApp2) sApp2.style.display = '';
      onDone();
    }, 400);
  }, 1900);
}

// ════════════════════════════════════════════════════════════
// PWA INSTALL PROMPT
// ════════════════════════════════════════════════════════════

let _pwaPrompt = null;
const _isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
const _isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const _isAndroid = /android/i.test(navigator.userAgent);

// Captura o prompt ANTES da splash (Android/Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _pwaPrompt = e;
  const banner = document.getElementById('pwaInstallBanner');
  if (banner && !banner.classList.contains('show')) banner.classList.add('show');
});

window.addEventListener('appinstalled', () => {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.classList.remove('show');
  _pwaPrompt = null;
});

function setupPWAButtons() {
  if (_isInstalled) return; // já instalado, não mostra nada

  const banner     = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('pwaInstallBtn');
  const closeBtn   = document.getElementById('pwaInstallClose');
  const subEl      = banner ? banner.querySelector('.pib-sub') : null;

  if (!banner) return;

  if (_isIOS) {
    // iOS Safari: instrução manual
    if (subEl) subEl.textContent = 'Safari → botão Compartilhar → "Adicionar à Tela de Início"';
    if (installBtn) { installBtn.textContent = 'Ver instruções'; installBtn.style.fontSize = '.65rem'; }
    banner.classList.add('show');
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        alert('Instalar no iPhone/iPad:\n\n1. Toque no botão Compartilhar (□ com seta ↑) no Safari\n2. Role a lista e toque em "Adicionar à Tela de Início"\n3. Toque em "Adicionar" para confirmar');
      });
    }
  } else if (_pwaPrompt) {
    // Prompt já capturado: exibe banner
    banner.classList.add('show');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        try {
          _pwaPrompt.prompt();
          const { outcome } = await _pwaPrompt.userChoice;
          if (outcome === 'accepted') {
            banner.classList.remove('show');
            _pwaPrompt = null;
          }
        } catch(e) { console.warn('PWA prompt error:', e); }
      });
    }
  }
  // Android/Chrome sem prompt ainda: aguarda o evento chegar naturalmente
  // (o listener 'beforeinstallprompt' no topo vai mostrar o banner quando disponível)

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      sessionStorage.setItem('pwaBannerClosed', '1');
    });
  }

  // Não mostra se o usuário fechou nesta sessão
  if (sessionStorage.getItem('pwaBannerClosed')) {
    banner.classList.remove('show');
  }
}

// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════

function initApp() {
  try {
    // Header date
    function getDataHdr() {
      const d = new Date();
      const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
      return `${dias[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`;
    }
    const hdrDataEl = document.getElementById('hdrData');
    if (hdrDataEl) hdrDataEl.textContent = getDataHdr();

    // Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(()=>{});
      });
    }

    // Destino inicial: respeita atalho PWA (?pg=...) mas nunca no carregamento normal
    const urlParams = new URLSearchParams(window.location.search);
    const pgParam = urlParams.get('pg');
    const paginaInicial = (pgParam && NAV_ITEMS.some(n => n.id === pgParam)) ? pgParam : 'home';

    // Garante que o #sApp existe antes de rodar o splash
    const sAppEl = document.getElementById('sApp');
    if (!sAppEl) { console.error('Ceará: #sApp não encontrado'); return; }

    // Mostra splash, depois monta o app
    showSplash(() => {
      paginaAtiva = paginaInicial;
      buildNav();
      renderPage();
      setupPWAButtons();
    });

  } catch(err) {
    // Se houver erro, mostra o app diretamente sem splash
    console.error('Ceará init error:', err);
    const sApp = document.getElementById('sApp');
    if (sApp) sApp.style.display = '';
    try { buildNav(); renderPage(); } catch(e2) { console.error('Ceará render error:', e2); }
  }
}

// Inicia quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
