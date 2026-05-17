// ════════════════════════════════════════════════════════════
// CONFIGURAÇÕES — UI completa com todos os preços editáveis
// ════════════════════════════════════════════════════════════

function renderConfig(wrap) {
  const e  = CFG.empresa;
  const v  = CFG.vidros;
  const cr = CFG.correr;
  const co = CFG.comercial;

  function inp(key, val, label, prefix, suffix, step) {
    return `
      <div class="cfg-row">
        <span class="cfg-lbl">${label}</span>
        <div class="cfg-inp-wrap">
          ${prefix ? `<span class="cfg-pfx">${prefix}</span>` : ''}
          <input class="cfg-inp" type="number" inputmode="decimal"
                 data-key="${key}" value="${val}" step="${step||'any'}"
                 min="0" oninput="cfgMark()">
          ${suffix ? `<span class="cfg-sfx">${suffix}</span>` : ''}
        </div>
      </div>`;
  }

  function txtInp(key, val, label, placeholder) {
    return `
      <div class="cfg-row">
        <span class="cfg-lbl">${label}</span>
        <input class="cfg-inp cfg-txt" type="text"
               data-key="${key}" value="${escCfg(val)}"
               placeholder="${placeholder||''}" oninput="cfgMark()">
      </div>`;
  }

  function sec(title, icon, content) {
    return `
      <div class="cfg-sec">
        <div class="cfg-sec-ttl">${icon} ${title}</div>
        ${content}
      </div>`;
  }

  wrap.innerHTML = `
    <div id="pgConfig">
      <div class="cfg-header">
        <div class="cfg-header-nm">${escCfg(e.nome)}</div>
        <div class="cfg-header-sub">${escCfg(e.subtitulo)}</div>
      </div>

      <div id="cfgForm">

        ${sec('Empresa', '🏢', `
          ${txtInp('empresa.nome',      e.nome,      'Nome da empresa', 'Ceará Planejados')}
          ${txtInp('empresa.subtitulo', e.subtitulo, 'Subtítulo',       'Vidraçaria · Marcenaria')}
          ${txtInp('empresa.whatsapp',  e.whatsapp,  'WhatsApp (só números)', '5585999999999')}
          ${txtInp('empresa.horario',   e.horario,   'Horário',         'Seg–Sex 8h–18h')}
          ${txtInp('empresa.pagamento', e.pagamento, 'Formas de pagamento', 'PIX · Cartão')}
        `)}

        ${sec('Vidros Temperados', '🔥', `
          ${inp('vidros.temp_trans', v.temp_trans.preco, 'Transparente 8mm', 'R$', '/m²')}
          ${inp('vidros.temp_fume',  v.temp_fume.preco,  'Fumê 8mm',         'R$', '/m²')}
          ${inp('vidros.temp_serig', v.temp_serig.preco, 'Serigrafado 8mm',  'R$', '/m²')}
          ${inp('vidros.temp_jat',   v.temp_jat.preco,   'Jateado 8mm',      'R$', '/m²')}
          ${inp('vidros.temp_esp',   v.temp_esp.preco,   'Espelhado 8mm',    'R$', '/m²')}
        `)}

        ${sec('Vidros Comuns', '🔷', `
          ${inp('vidros.com_4',     v.com_4.preco,    'Incolor 4mm', 'R$', '/m²')}
          ${inp('vidros.com_6',     v.com_6.preco,    'Incolor 6mm', 'R$', '/m²')}
          ${inp('vidros.com_fume3', v.com_fume3.preco,'Fumê 3mm',    'R$', '/m²')}
          ${inp('vidros.com_fume4', v.com_fume4.preco,'Fumê 4mm',    'R$', '/m²')}
        `)}

        ${sec('Espelhos', '🪞', `
          ${inp('vidros.esp_3', v.esp_3.preco, 'Espelho 3mm', 'R$', '/m²')}
          ${inp('vidros.esp_4', v.esp_4.preco, 'Espelho 4mm', 'R$', '/m²')}
        `)}

        ${sec('Porta de Correr — Componentes', '🔲', `
          ${inp('correr.trilho_sup',   cr.trilho_sup,   'Trilho superior',       'R$', '/m')}
          ${inp('correr.guia_inf',     cr.guia_inf,     'Guia inferior',         'R$', '/m')}
          ${inp('correr.kit_carrinho', cr.kit_carrinho, 'Kit carrinho (por folha móvel)', 'R$', '')}
          ${inp('correr.fechadura',    cr.fechadura,    'Fechadura VP (por móvel)', 'R$', '')}
          ${inp('correr.puxador',      cr.puxador,      'Puxador (por móvel)',   'R$', '')}
        `)}

        ${sec('Kits e Acessórios', '🔧', `
          ${inp('acessorios.kit_pivotante',  150, 'Kit Pivotante',      'R$', '')}
          ${inp('acessorios.kit_jumbo',      350, 'Kit Jumbo',          'R$', '')}
          ${inp('acessorios.kit_janela_2',   100, 'Kit Janela 2 folhas','R$', '')}
          ${inp('acessorios.kit_janela_4',   110, 'Kit Janela 4 folhas','R$', '')}
          ${inp('acessorios.kit_basculante', 150, 'Kit Basculante',     'R$', '')}
          ${inp('acessorios.puxador',        100, 'Puxador',            'R$', '')}
          ${inp('acessorios.fixador',         60, 'Fixador',            'R$', '')}
        `)}

        ${sec('Fechaduras', '🔑', `
          ${inp('acessorios.fechadura_vp',      150, 'Fechadura VP (correr)',   'R$', '')}
          ${inp('acessorios.fechadura_vv',      180, 'Fechadura VV (correr)',   'R$', '')}
          ${inp('acessorios.fechadura_macaret', 180, 'Fechadura maçaneta',      'R$', '')}
          ${inp('acessorios.contra_fechadura',   50, 'Contra fechadura (pivot.)','R$', '')}
        `)}

        ${sec('Bate-Fechas e Botões', '🪝', `
          ${inp('acessorios.bate_vp',        50, 'Bate-fecha VP', 'R$', '')}
          ${inp('acessorios.bate_vv',        80, 'Bate-fecha VV', 'R$', '')}
          ${inp('comercial.botao_frances', co.botao_frances, 'Botão francês (unid.)', 'R$', '/un', 0.01)}
          ${inp('comercial.botoes_quant',  co.botoes_quant,  'Qtd. padrão de botões', '', 'un')}
        `)}

        ${sec('Instalações e Extras', '⚙️', `
          ${inp('comercial.mola_hidraulica',  co.mola_hidraulica,  'Mola hidráulica (mola+MO)', 'R$', '')}
          ${inp('comercial.cantoneira_por_m', co.cantoneira_por_m, 'Cantoneira',                'R$', '/m')}
          ${inp('comercial.pu_por_m',         co.pu_por_m,         'PU',                        'R$', '/m')}
          ${inp('comercial.recorte_por_m2',   co.recorte_por_m2,   'Recorte (vidro comum)',     'R$', '/m²')}
          ${inp('comercial.box_por_m2',       co.box_por_m2,       'Box — ferragens+MO',        'R$', '/m²')}
        `)}

        ${sec('Comercial', '💰', `
          ${inp('comercial.desconto_avista',    co.desconto_avista * 100, 'Desconto à vista', '', '%', 0.1)}
          ${inp('comercial.frete_gratis_km',    co.frete_gratis_km,       'Frete grátis até', '', 'km')}
          ${inp('comercial.frete_por_km_extra', co.frete_por_km_extra,    'Frete p/ km extra', 'R$', '/km', 0.5)}
        `)}

      </div><!-- #cfgForm -->

      <div class="cfg-actions">
        <button class="btn btn-grn btn-full" id="btnSalvarCfg" onclick="cfgSalvar()">
          💾 Salvar Configurações
        </button>
        <button class="btn btn-outline btn-full" onclick="cfgResetar()" style="margin-top:8px">
          ↺ Restaurar Padrões
        </button>
      </div>

      <div style="height:80px"></div>
    </div>
  `;
}

function escCfg(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

let _cfgDirty = false;
function cfgMark() {
  _cfgDirty = true;
  const btn = document.getElementById('btnSalvarCfg');
  if (btn) { btn.textContent = '💾 Salvar Configurações *'; btn.style.opacity = '1'; }
}

function cfgSalvar() {
  const saved = {};
  try { Object.assign(saved, JSON.parse(localStorage.getItem('ceara_cfg') || '{}')); } catch(e) {}

  document.querySelectorAll('#cfgForm [data-key]').forEach(el => {
    const keys = el.dataset.key.split('.');
    const isText = el.classList.contains('cfg-txt');
    let val = isText ? el.value.trim() : parseFloat(el.value);
    if (!isText && isNaN(val)) return;

    // Percentual → decimal
    if (keys[1] === 'desconto_avista') val = val / 100;

    if (!saved[keys[0]]) saved[keys[0]] = {};
    saved[keys[0]][keys[1]] = val;
  });

  saveCFG(saved);
  _cfgDirty = false;

  // Feedback visual
  const btn = document.getElementById('btnSalvarCfg');
  if (btn) { btn.textContent = '✅ Salvo!'; setTimeout(() => { btn.textContent = '💾 Salvar Configurações'; }, 2000); }

  histMostrarToast('✅ Configurações salvas!');
}

function cfgResetar() {
  if (!confirm('Restaurar todos os preços para os valores padrão da tabela oficial?')) return;
  resetCFG();
  // Re-render
  const wrap = document.getElementById('mainContent');
  if (wrap) renderConfig(wrap);
  histMostrarToast('↺ Valores padrão restaurados');
}
