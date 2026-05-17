// ════════════════════════════════════════════════════════════
// DADOS / CONFIGURAÇÃO
// ════════════════════════════════════════════════════════════

const VIDROS = {
  temp_trans: { nome:'Transparente 8mm (Temp.)', preco:420,  temperado:true  },
  temp_fume:  { nome:'Fumê 8mm (Temp.)',         preco:455,  temperado:true  },
  temp_serig: { nome:'Serigrafado 8mm (Temp.)',  preco:650,  temperado:true  },
  temp_jat:   { nome:'Jateado 8mm (Temp.)',      preco:440,  temperado:true  },
  temp_esp:   { nome:'Espelhado 8mm (Temp.)',    preco:620,  temperado:true  },
  com_4:      { nome:'Incolor 4mm',              preco:220,  temperado:false },
  com_6:      { nome:'Incolor 6mm',              preco:240,  temperado:false },
  com_fume3:  { nome:'Fumê 3mm',                 preco:210,  temperado:false },
  com_fume4:  { nome:'Fumê 4mm',                 preco:245,  temperado:false },
  esp_3:      { nome:'Espelho 3mm',              preco:260,  temperado:false },
  esp_4:      { nome:'Espelho 4mm',              preco:280,  temperado:false },
};

const ACESSORIOS_CONFIG = {
  pivotante:  [{ id:'kit',      nome:'Kit Pivotante',       preco:150, obrig:true  },{ id:'puxador', nome:'Puxador',    preco:100, obrig:false },{ id:'fixador', nome:'Fixador',   preco:60,  obrig:false }],
  correr:     [{ id:'kit',      nome:'Kit Porta de Correr', preco:null,obrig:true  },{ id:'fechadura',nome:'Fechadura VP',preco:150,obrig:true  },{ id:'puxador', nome:'Puxador',   preco:100, obrig:true  }],
  janela:     [{ id:'kit',      nome:'Kit Janela',          preco:null,obrig:true  },{ id:'bate',    nome:'Bate-fecha VP',preco:50, obrig:true  }],
  basculante: [{ id:'kit',      nome:'Kit Basculante',      preco:150, obrig:true  }],
  box:        [{ id:'kit',      nome:'Kit Box',             preco:null,obrig:true  }],
  espelho:    [{ id:'botoes',   nome:'Botões (≥60cm larg.)',preco:null,obrig:false },{ id:'colado',  nome:'Fixação Colada',preco:0,  obrig:false }],
  comum:      [{ id:'recorte',  nome:'Recorte (+R$10/m²)',  preco:null,obrig:false }],
  guarda:     [],
};

const VIDROS_POR_TIPO = {
  pivotante:  ['temp_trans','temp_fume','temp_serig','temp_jat','temp_esp'],
  correr:     ['temp_trans','temp_fume','temp_serig','temp_jat','temp_esp'],
  janela:     ['temp_trans','temp_fume','com_4','com_6'],
  box:        ['temp_trans','temp_fume','temp_serig','temp_jat'],
  espelho:    ['esp_3','esp_4'],
  basculante: ['com_4','com_6','temp_trans'],
  guarda:     ['temp_trans','temp_fume','temp_serig'],
  comum:      ['com_4','com_6','com_fume3','com_fume4','esp_3','esp_4'],
};

const DEFAULTS = {
  pivotante:  { larg:90,  alt:210 },
  correr:     { larg:150, alt:210 },
  janela:     { larg:100, alt:120 },
  box:        { larg:80,  alt:195 },
  espelho:    { larg:60,  alt:80  },
  basculante: { larg:60,  alt:40  },
  guarda:     { larg:120, alt:110 },
  comum:      { larg:60,  alt:60  },
};

const TIPOS = [
  { id:'pivotante',  label:'Porta Pivotante', icon:'🚪' },
  { id:'correr',     label:'Porta de Correr', icon:'🔲' },
  { id:'janela',     label:'Janela',          icon:'🪟' },
  { id:'box',        label:'Box de Banheiro', icon:'🛁' },
  { id:'espelho',    label:'Espelho',         icon:'🪞' },
  { id:'basculante', label:'Basculante',      icon:'⬆️' },
  { id:'guarda',     label:'Guarda Corpo',    icon:'🏗️' },
  { id:'comum',      label:'Vidro Comum',     icon:'🔷' },
];

const TIPO_LABEL = { pivotante:'Porta Pivotante',correr:'Porta de Correr',janela:'Janela',box:'Box de Banheiro',espelho:'Espelho',guarda:'Guarda Corpo',basculante:'Basculante',comum:'Vidro Comum' };
const TIPO_ICON  = { pivotante:'🚪',correr:'🔲',janela:'🪟',box:'🛁',espelho:'🪞',guarda:'🏗️',basculante:'⬆️',comum:'🔷' };

const FRETE_GRATIS_KM = 20;
const FRETE_POR_KM_EXTRA = 3;
const DESCONTO_AVISTA = 0.10;

// ── Orçamento state ──
let orcState = {
  tipo: 'pivotante',
  larg: 90, alt: 210,
  vidroKey: 'temp_trans',
  accs: {},
  km: 0,
  cliente: '', fone: '',
  resultado: null,
};

