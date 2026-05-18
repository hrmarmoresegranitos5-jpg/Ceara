// ════════════════════════════════════════════════════════════
// CAD SVG — Estilo Bahia Vidros (painéis sólidos, clean)
// ════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';
function el(tag, attrs, txt) {
  const e = document.createElementNS(ns, tag);
  Object.entries(attrs||{}).forEach(([k,v]) => e.setAttribute(k,v));
  if (txt !== undefined) e.textContent = txt;
  return e;
}

// Paleta
const PAL = {
  glass:  '#4EC8DC',
  fixed:  '#7DD9E8',
  frame:  '#1a2233',
  div:    '#0a0a14',
  pivot:  '#0a0a14',
  handle: '#0a0a14',
  lock:   '#ffffff',
  hatch:  'rgba(0,0,0,0.18)',
  dimLn:  'rgba(100,200,255,0.7)',
  dimTx:  'rgba(180,230,255,0.9)',
  numTx:  'rgba(10,20,40,0.5)',
  bandTx: 'rgba(10,20,40,0.45)',
};

// ── Utilitários ───────────────────────────────────────────────
function addDefs(svg) {
  const defs = el('defs');
  // Hachura para fixos
  const pat = el('pattern', {id:'hfix', width:'8', height:'8', patternUnits:'userSpaceOnUse', patternTransform:'rotate(45)'});
  const ln  = el('line', {x1:'0',y1:'0',x2:'0',y2:'8', stroke:'rgba(0,0,0,0.22)', 'stroke-width':'2'});
  pat.appendChild(ln); defs.appendChild(pat);
  // Seta
  const mkArr = (id, d) => {
    const m = el('marker', {id, markerWidth:'6', markerHeight:'6', refX:'3', refY:'3', orient:'auto'});
    m.appendChild(el('path', {d, fill:PAL.dimLn})); return m;
  };
  defs.appendChild(mkArr('arrE', 'M6,1 L0,3 L6,5 Z'));
  defs.appendChild(mkArr('arrD', 'M0,1 L6,3 L0,5 Z'));
  svg.appendChild(defs);
}

function dimH(svg, x1, x2, y, label) {
  svg.appendChild(el('line', {x1, y1:y-3, x2:x1, y2:y+3, stroke:PAL.dimLn, 'stroke-width':'0.8'}));
  svg.appendChild(el('line', {x1:x2, y1:y-3, x2, y2:y+3, stroke:PAL.dimLn, 'stroke-width':'0.8'}));
  svg.appendChild(el('line', {x1, y1:y, x2, y2:y, stroke:PAL.dimLn, 'stroke-width':'1.2', 'marker-start':'url(#arrE)', 'marker-end':'url(#arrD)'}));
  svg.appendChild(el('text', {x:(+x1+ +x2)/2, y:y+9, 'text-anchor':'middle', 'font-size':'9', 'font-family':'Outfit,sans-serif', 'font-weight':'700', fill:PAL.dimTx}, label));
}
function dimV(svg, x, y1, y2, label) {
  svg.appendChild(el('line', {x1:x-3, y1, x2:x+3, y2:y1, stroke:PAL.dimLn, 'stroke-width':'0.8'}));
  svg.appendChild(el('line', {x1:x-3, y1:y2, x2:x+3, y2, stroke:PAL.dimLn, 'stroke-width':'0.8'}));
  svg.appendChild(el('line', {x1:x, y1, x2:x, y2, stroke:PAL.dimLn, 'stroke-width':'1.2', 'marker-start':'url(#arrE)', 'marker-end':'url(#arrD)'}));
  const t = el('text', {x:x+10, y:(+y1+ +y2)/2, 'text-anchor':'middle', 'font-size':'9', 'font-family':'Outfit,sans-serif', 'font-weight':'700', fill:PAL.dimTx, transform:`rotate(-90,${x+10},${(+y1+ +y2)/2})`}, label);
  svg.appendChild(t);
}

// Painel de vidro (azul sólido)
function panel(svg, x, y, w, h) {
  svg.appendChild(el('rect', {x, y, width:w, height:h, fill:PAL.glass}));
}
// Painel fixo (azul mais claro + hachura)
function panelFixed(svg, x, y, w, h) {
  svg.appendChild(el('rect', {x, y, width:w, height:h, fill:PAL.fixed}));
  svg.appendChild(el('rect', {x, y, width:w, height:h, fill:'url(#hfix)'}));
}
// Numeração do painel
function panelNum(svg, x, y, w, h, n) {
  svg.appendChild(el('text', {
    x: x + w/2, y: y + h/2 + 5,
    'text-anchor':'middle', 'font-size':'16',
    'font-family':'Outfit,sans-serif', 'font-weight':'700',
    fill:PAL.numTx
  }, String(n)));
}
// Pivô (bolinhas no topo/base da borda esquerda)
function pivots(svg, x, y, h, kit) {
  const r = kit === 'jumbo' ? 5 : 3.5;
  const off = kit === 'jumbo' ? 18 : 12;
  svg.appendChild(el('circle', {cx:x, cy:y+off,    r, fill:PAL.pivot}));
  svg.appendChild(el('circle', {cx:x, cy:y+h-off,  r, fill:PAL.pivot}));
  if (kit === 'jumbo') svg.appendChild(el('circle', {cx:x, cy:y+h/2, r, fill:PAL.pivot}));
}
// Puxador (barra escura)
function handle(svg, x, y, h, side) {
  const px = side === 'left' ? x + 8 : x - 8;
  svg.appendChild(el('rect', {x:px-2, y:y+h*0.38, width:4, height:h*0.24, rx:2, fill:PAL.handle}));
}
// Fechadura (VV = quadrado branco no encontro das folhas)
function lockVV(svg, x, y, h) {
  const sz = 8;
  svg.appendChild(el('rect', {x:x-sz/2, y:y+h/2-sz/2, width:sz, height:sz, fill:PAL.lock, stroke:PAL.pivot, 'stroke-width':'1.2'}));
}
// Fechadura VP (barra preta na borda)
function lockVP(svg, x, y, h, side) {
  const px = side === 'right' ? x - 3 : x;
  svg.appendChild(el('rect', {x:px, y:y+h/2-10, width:4, height:20, rx:1, fill:PAL.pivot}));
}
// Divisória (linha preta grossa)
function divLine(svg, x, y, h) {
  svg.appendChild(el('line', {x1:x, y1:y, x2:x, y2:y+h, stroke:PAL.div, 'stroke-width':'3.5', 'stroke-linecap':'round'}));
}
// Moldura externa
function frame(svg, x, y, w, h) {
  svg.appendChild(el('rect', {x, y, width:w, height:h, fill:'none', stroke:PAL.frame, 'stroke-width':'3', rx:'2'}));
}
// Trilho superior/inferior (barra preta fina)
function rail(svg, x, y, w, top) {
  svg.appendChild(el('rect', {x:x-2, y:top?y-5:y+1, width:w+4, height:5, rx:1, fill:PAL.pivot}));
}
// Mola (barra dourada no piso)
function mola(svg, x, y, w) {
  svg.appendChild(el('rect', {x:x+w*0.2, y:y-5, width:w*0.6, height:5, rx:2, fill:'#C9A84C', opacity:'0.85'}));
  svg.appendChild(el('text', {x:x+w/2, y:y-8, 'text-anchor':'middle', 'font-size':'5.5', 'font-family':'Outfit,sans-serif', 'font-weight':'700', fill:'#C9A84C'}, 'MOLA'));
}
// Label VP/VV
function vpvvLabel(svg, x, y, txt) {
  svg.appendChild(el('text', {x, y, 'text-anchor':'middle', 'font-size':'8', 'font-family':'Outfit,sans-serif', 'font-weight':'800', fill:'rgba(255,200,80,0.9)'}, txt));
}


// Cantoneiras nos 4 cantos (L-shapes, estilo Bahia Vidros)
function corners(svg, x, y, w, h, color) {
  const sz=8, th=2.5;
  const pts = [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]];
  pts.forEach(([cx,cy,dx,dy]) => {
    svg.appendChild(el('rect', {x:cx, y:cy, width:sz*dx, height:th, fill:color}));
    svg.appendChild(el('rect', {x:cx, y:cy, width:th, height:sz*dy, fill:color}));
  });
}

// ── RENDERIZADOR PRINCIPAL ────────────────────────────────────
function renderCAD(svgEl, state) {
  const { tipo, larg, alt, folhas, fixoLarg, bandH, temFixo, temBandeirola, pivFolhas, kitPivotante, temMola, accs } = state;
  if (!svgEl || !larg || !alt || isNaN(larg) || isNaN(alt)) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const W = 320, H = 220;
  addDefs(svgEl);

  const MARGIN = 30;
  const hasFixo = temFixo && (fixoLarg > 0) && tipo === 'pivotante';
  const hasBand = temBandeirola && (bandH > 0) && tipo === 'pivotante';
  const totalW  = hasFixo ? larg + (Number(fixoLarg)||0) : larg;
  const totalH  = hasBand ? alt  + (Number(bandH)||0)    : alt;

  const maxW = W - MARGIN*2 - 30, maxH = H - MARGIN*2 - 30;
  const scale = Math.min(maxW / totalW, maxH / totalH);
  const tpW = totalW * scale, tpH = totalH * scale;
  const ox0 = Math.round((W - tpW) / 2 - 12);
  const oy0 = Math.round((H - tpH) / 2 - 8);

  const pw   = Math.round(larg * scale);
  const ph   = Math.round(alt  * scale);
  const fxW  = hasFixo ? Math.round((Number(fixoLarg)||0) * scale) : 0;
  const bdH  = hasBand ? Math.round((Number(bandH)||0) * scale)    : 0;

  const portaX = ox0;          // X da porta (fixo vai à direita)
  const portaY = oy0 + bdH;    // Y da porta (bandeirola fica em cima)
  const fxX    = ox0 + pw;     // X do fixo lateral
  const bandY  = oy0;          // Y da bandeirola

  if (tipo === 'pivotante') {
    const nFolhas = Number(pivFolhas)||1;
    const kit     = kitPivotante||'comum';

    // ── Bandeirola ──
    if (hasBand) {
      panelFixed(svgEl, portaX, bandY, pw + fxW, bdH);
      frame(svgEl, portaX, bandY, pw + fxW, bdH);
      svgEl.appendChild(el('text', {
        x: portaX + (pw+fxW)/2, y: bandY + bdH/2 + 4,
        'text-anchor':'middle', 'font-size':'9', 'font-family':'Outfit,sans-serif',
        fill:PAL.bandTx, 'font-weight':'600'
      }, hasBand ? String(nFolhas + (hasFixo?1:0) + 1) : ''));
      // Separador bandeirola/porta
      svgEl.appendChild(el('line', {x1:portaX, y1:portaY, x2:portaX+pw+fxW, y2:portaY, stroke:PAL.div, 'stroke-width':'3'}));
    }

    // ── Fixo lateral ──
    if (hasFixo) {
      panelFixed(svgEl, fxX, portaY, fxW, ph);
      svgEl.appendChild(el('text', {
        x: fxX + fxW/2, y: portaY + ph/2 + 4,
        'text-anchor':'middle', 'font-size':'9', 'font-family':'Outfit,sans-serif',
        fill:PAL.bandTx, 'font-weight':'600'
      }, String(nFolhas + 1)));
    }

    // ── Porta (1 ou 2 folhas) ──
    if (nFolhas === 2) {
      const hw = Math.round(pw/2);
      // Folha 1
      panel(svgEl, portaX, portaY, hw, ph);
      panelNum(svgEl, portaX, portaY, hw, ph, 1);
      pivots(svgEl, portaX+3, portaY, ph, kit);
      if (accs && accs.puxador) handle(svgEl, portaX+hw, portaY, ph, 'right');
      // Folha 2
      panel(svgEl, portaX+hw, portaY, hw, ph);
      panelNum(svgEl, portaX+hw, portaY, hw, ph, 2);
      pivots(svgEl, portaX+pw-3, portaY, ph, kit);
      if (accs && accs.puxador) handle(svgEl, portaX+hw, portaY, ph, 'left');
      // Contra-fechadura (VV) no centro
      lockVV(svgEl, portaX+hw, portaY, ph);
      divLine(svgEl, portaX+hw, portaY, ph);
    } else {
      panel(svgEl, portaX, portaY, pw, ph);
      panelNum(svgEl, portaX, portaY, pw, ph, 1);
      pivots(svgEl, portaX+3, portaY, ph, kit);
      if (accs && accs.puxador) handle(svgEl, portaX+pw, portaY, ph, 'right');
      lockVP(svgEl, portaX+pw, portaY, ph, 'right');
    }

    // Fixador (bolinha no piso)
    if (accs && accs.fixador) {
      const fx2x = portaX + pw - 14;
      svgEl.appendChild(el('circle', {cx:fx2x, cy:portaY+ph-6, r:'4', fill:'#C9A84C', opacity:'0.85'}));
      svgEl.appendChild(el('text', {x:fx2x, y:portaY+ph-14, 'text-anchor':'middle', 'font-size':'5', 'font-family':'Outfit,sans-serif', 'font-weight':'700', fill:'#C9A84C'}, 'FIX'));
    }

    // Mola
    if (temMola) mola(svgEl, portaX, portaY+ph, pw);

    // Cantoneiras nos cantos (estilo Bahia Vidros 1302)
    corners(svgEl, portaX, portaY, pw, ph, PAL.frame);
    if (hasFixo) corners(svgEl, fxX, portaY, fxW, ph, PAL.frame);
    if (hasBand) corners(svgEl, portaX, bandY, pw+(hasFixo?fxW:0), bdH, PAL.frame);

    // Moldura geral
    frame(svgEl, portaX, portaY, pw, ph);
    if (hasFixo) { divLine(svgEl, fxX, portaY, ph); frame(svgEl, fxX, portaY, fxW, ph); }
    if (hasBand) rail(svgEl, portaX, portaY, pw+fxW, true);
    rail(svgEl, portaX, portaY+ph, pw, false);

    // Cotas
    dimH(svgEl, portaX, portaX+pw,   portaY+ph+18, larg + ' cm');
    if (hasFixo) dimH(svgEl, fxX, fxX+fxW, portaY+ph+18, (fixoLarg||0)+' cm');
    dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, portaY, portaY+ph, alt+' cm');
    if (hasBand) dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, bandY, portaY, (bandH||0)+' cm');

  } else if (tipo === 'correr') {
    const nF = Number(folhas)||2;
    const nM = {1:1,2:2,4:2}[nF]||2;
    const fixaIdx = nF===4 ? [0, nF-1] : [];
    const fw = Math.round(pw / nF);
    const vpvv = nM<=1 ? 'VP' : 'VV';

    rail(svgEl, portaX, portaY, pw, true);
    for (let i=0; i<nF; i++) {
      const fx = portaX + fw*i;
      const isF = fixaIdx.includes(i);
      if (isF) panelFixed(svgEl, fx+1, portaY+1, fw-2, ph-2);
      else      panel(svgEl, fx+1, portaY+1, fw-2, ph-2);
      panelNum(svgEl, fx, portaY, fw, ph, i+1);
      if (!isF) handle(svgEl, fx+fw, portaY, ph, i < nF/2 ? 'right' : 'left');
    }
    for (let i=1; i<nF; i++) divLine(svgEl, portaX+fw*i, portaY, ph);
    frame(svgEl, portaX, portaY, pw, ph);
    rail(svgEl, portaX, portaY+ph, pw, false);
    vpvvLabel(svgEl, portaX+pw/2, portaY-8, vpvv);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  } else if (tipo === 'janela') {
    const nFj = state.janelaFolhas || (larg <= 120 ? 2 : 4);
    const fixaJ = nFj===4 ? [0, nFj-1] : [];
    const fw2 = Math.round(pw / nFj);
    const vpvv2 = nFj===2 ? 'VP' : 'VV';

    for (let i=0; i<nFj; i++) {
      const fx = portaX + fw2*i;
      const isF = fixaJ.includes(i);
      if (isF) panelFixed(svgEl, fx, portaY, fw2, ph);
      else      panel(svgEl, fx, portaY, fw2, ph);
      panelNum(svgEl, fx, portaY, fw2, ph, i+1);
    }
    for (let i=1; i<nFj; i++) divLine(svgEl, portaX+fw2*i, portaY, ph);
    frame(svgEl, portaX, portaY, pw, ph);
    vpvvLabel(svgEl, portaX+pw/2, portaY-8, nFj+' folhas · '+vpvv2);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  } else if (tipo === 'espelho') {
    panel(svgEl, portaX, portaY, pw, ph);
    // reflexo diagonal
    svgEl.appendChild(el('line', {x1:portaX+pw*0.25, y1:portaY+4, x2:portaX+pw*0.1, y2:portaY+ph-4, stroke:'rgba(255,255,255,0.35)', 'stroke-width':'4', 'stroke-linecap':'round'}));
    svgEl.appendChild(el('line', {x1:portaX+pw*0.42, y1:portaY+4, x2:portaX+pw*0.28, y2:portaY+ph-4, stroke:'rgba(255,255,255,0.18)', 'stroke-width':'2.5', 'stroke-linecap':'round'}));
    frame(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  } else if (tipo === 'box') {
    const hw3 = Math.round(pw/2);
    panel(svgEl, portaX, portaY, hw3, ph);    panelNum(svgEl, portaX, portaY, hw3, ph, 1);
    panel(svgEl, portaX+hw3, portaY, hw3, ph); panelNum(svgEl, portaX+hw3, portaY, hw3, ph, 2);
    divLine(svgEl, portaX+hw3, portaY, ph);
    lockVV(svgEl, portaX+hw3, portaY, ph);
    frame(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  } else if (tipo === 'basculante') {
    panel(svgEl, portaX, portaY, pw, ph);
    svgEl.appendChild(el('line', {x1:portaX+3, y1:portaY+ph-4, x2:portaX+pw-3, y2:portaY+ph-4, stroke:PAL.pivot, 'stroke-width':'3', 'stroke-linecap':'round'}));
    frame(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  } else if (tipo === 'guarda') {
    panel(svgEl, portaX, portaY, pw, ph);
    const mods = Math.max(1, Math.ceil(larg/120));
    for (let m=1; m<mods; m++) { const gx=portaX+Math.round((pw/mods)*m); divLine(svgEl, gx, portaY, ph); }
    svgEl.appendChild(el('rect', {x:portaX+2, y:portaY+2, width:pw-4, height:12, rx:2, fill:PAL.pivot, opacity:'0.7'}));
    frame(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  } else {
    panel(svgEl, portaX, portaY, pw, ph);
    const area = (larg/100)*(alt/100);
    svgEl.appendChild(el('text', {x:portaX+pw/2, y:portaY+ph/2+4, 'text-anchor':'middle', 'font-size':'11', 'font-family':'Outfit,sans-serif', 'font-weight':'700', fill:PAL.numTx}, area.toFixed(2)+' m²'));
    frame(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');
  }
}

// ── Mini-CADs do seletor de configuração ──────────────────────
function renderMiniCAD(svgId, config) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const W=60, H=44, M=4;
  const { tipo, fixo, band, folhas } = config;

  function r(x,y,w,h,a) { const e=document.createElementNS(ns,'rect'); Object.entries({x,y,width:w,height:h,...a}).forEach(([k,v])=>e.setAttribute(k,v)); return e; }
  function l(x1,y1,x2,y2,a) { const e=document.createElementNS(ns,'line'); Object.entries({x1,y1,x2,y2,...a}).forEach(([k,v])=>e.setAttribute(k,v)); return e; }
  function c(cx,cy,rv,a) { const e=document.createElementNS(ns,'circle'); Object.entries({cx,cy,r:rv,...a}).forEach(([k,v])=>e.setAttribute(k,v)); return e; }

  // Hatch defs
  const defs=document.createElementNS(ns,'defs');
  const pat=document.createElementNS(ns,'pattern');
  pat.setAttribute('id',svgId+'h'); pat.setAttribute('width','5'); pat.setAttribute('height','5');
  pat.setAttribute('patternUnits','userSpaceOnUse'); pat.setAttribute('patternTransform','rotate(45)');
  const pl=document.createElementNS(ns,'line');
  Object.entries({x1:'0',y1:'0',x2:'0',y2:'5',stroke:'rgba(0,0,0,0.2)','stroke-width':'1.5'}).forEach(([k,v])=>pl.setAttribute(k,v));
  pat.appendChild(pl); defs.appendChild(pat); svg.appendChild(defs);

  const GLASS='#4EC8DC', FIXED='#7DD9E8', FRAME='#1a2233', DIV='#0a0a14';

  if (tipo==='pivotante') {
    const fxW = fixo ? W*0.3 : 0;
    const bdH = band ? H*0.22 : 0;
    const nFl = folhas||1;
    const px=M, py=M+bdH, pw=W-M*2-fxW, ph=H-M*2-bdH;

    // Bandeirola
    if (band) {
      svg.appendChild(r(px, M, pw, bdH, {fill:FIXED}));
      svg.appendChild(r(px, M, pw, bdH, {fill:`url(#${svgId}h)`}));
      svg.appendChild(r(px, M, pw, bdH, {fill:'none', stroke:FRAME, 'stroke-width':'1.2'}));
    }
    // Fixo
    if (fixo) {
      svg.appendChild(r(px+pw, py, fxW, ph, {fill:FIXED}));
      svg.appendChild(r(px+pw, py, fxW, ph, {fill:`url(#${svgId}h)`}));
      svg.appendChild(r(px+pw, py, fxW, ph, {fill:'none', stroke:FRAME, 'stroke-width':'1.2'}));
    }
    if (nFl === 2) {
      const hw=pw/2;
      svg.appendChild(r(px, py, hw, ph, {fill:GLASS}));
      svg.appendChild(r(px+hw, py, hw, ph, {fill:GLASS}));
      svg.appendChild(l(px+hw, py, px+hw, py+ph, {stroke:DIV,'stroke-width':'2.5'}));
      svg.appendChild(c(px+3, py+5, 2, {fill:DIV})); svg.appendChild(c(px+3, py+ph-5, 2, {fill:DIV}));
      svg.appendChild(c(px+pw-3, py+5, 2, {fill:DIV})); svg.appendChild(c(px+pw-3, py+ph-5, 2, {fill:DIV}));
    } else {
      svg.appendChild(r(px, py, pw, ph, {fill:GLASS}));
      svg.appendChild(c(px+3, py+5, 2, {fill:DIV})); svg.appendChild(c(px+3, py+ph-5, 2, {fill:DIV}));
      svg.appendChild(r(px+pw-5, py+ph*0.35, 3, ph*0.3, {rx:'1.5', fill:DIV}));
    }
    svg.appendChild(r(px, py, pw, ph, {fill:'none', stroke:FRAME, 'stroke-width':'1.5'}));
    // trilho baixo
    svg.appendChild(r(px-1, py+ph, pw+2, 3, {rx:'1', fill:DIV}));

  } else if (tipo==='correr') {
    const nF=folhas||2, fw=(W-M*2)/nF;
    const fixaIdx=nF===4?[0,nF-1]:[];
    svg.appendChild(r(M-1, M-3, W-M*2+2, 3, {rx:'1', fill:DIV}));
    for(let f=0;f<nF;f++){
      const fx=M+fw*f;
      const isF=fixaIdx.includes(f);
      svg.appendChild(r(fx+0.5, M, fw-1, H-M*2, {fill:isF?FIXED:GLASS}));
      if(isF) svg.appendChild(r(fx+0.5, M, fw-1, H-M*2, {fill:`url(#${svgId}h)`}));
      if(f>0) svg.appendChild(l(fx, M, fx, H-M, {stroke:DIV,'stroke-width':'2'}));
    }
    svg.appendChild(r(M, M, W-M*2, H-M*2, {fill:'none', stroke:FRAME, 'stroke-width':'1.5'}));
    svg.appendChild(r(M-1, H-M, W-M*2+2, 3, {rx:'1', fill:DIV}));

  } else if (tipo==='janela') {
    const nFj=folhas||2, fw2=(W-M*2)/nFj, fixI=nFj===4?[0,nFj-1]:[0];
    for(let f=0;f<nFj;f++){
      const fx2=M+fw2*f;
      svg.appendChild(r(fx2, M, fw2, H-M*2, {fill:fixI.includes(f)?FIXED:GLASS}));
      if(fixI.includes(f)) svg.appendChild(r(fx2, M, fw2, H-M*2, {fill:`url(#${svgId}h)`}));
      if(f>0) svg.appendChild(l(fx2, M, fx2, H-M, {stroke:DIV,'stroke-width':'2'}));
    }
    svg.appendChild(r(M, M, W-M*2, H-M*2, {fill:'none', stroke:FRAME, 'stroke-width':'1.5'}));
  }
}

// ── Mini-desenhos dos kits pivotante ─────────────────────────
function _renderMiniKitCADs() {
  _drawKitSVG('mkitComum', 'comum');
  _drawKitSVG('mkitJumbo', 'jumbo');
  _drawKitSVG('mkitMola',  'mola');
}
function _drawKitSVG(svgId, tipo) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const G='#4EC8DC', K='#0a0a14', GLD='#C9A84C';
  function e2(tag,a,t) { const el2=document.createElementNS(ns,tag); Object.entries(a).forEach(([k,v])=>el2.setAttribute(k,v)); if(t!==undefined) el2.textContent=t; return el2; }

  if (tipo==='comum') {
    svg.appendChild(e2('rect',{x:14,y:5,width:22,height:40,rx:2,fill:G,stroke:K,'stroke-width':'1.5'}));
    svg.appendChild(e2('rect',{x:14,y:5,width:5,height:40,rx:1,fill:GLD}));
    svg.appendChild(e2('circle',{cx:16.5,cy:8,r:3.5,fill:K}));
    svg.appendChild(e2('circle',{cx:16.5,cy:42,r:3.5,fill:K}));
    svg.appendChild(e2('rect',{x:30,y:18,width:4,height:14,rx:2,fill:K}));
  } else if (tipo==='jumbo') {
    svg.appendChild(e2('rect',{x:12,y:5,width:26,height:40,rx:2,fill:G,stroke:K,'stroke-width':'1.5'}));
    svg.appendChild(e2('rect',{x:12,y:5,width:7,height:40,rx:2,fill:GLD}));
    svg.appendChild(e2('rect',{x:10,y:18,width:11,height:14,rx:2,fill:'rgba(201,168,76,0.4)',stroke:GLD,'stroke-width':'1.2'}));
    svg.appendChild(e2('circle',{cx:15.5,cy:8,r:4.5,fill:K}));
    svg.appendChild(e2('circle',{cx:15.5,cy:22,r:2.5,fill:K}));
    svg.appendChild(e2('circle',{cx:15.5,cy:32,r:2.5,fill:K}));
    svg.appendChild(e2('circle',{cx:15.5,cy:42,r:4.5,fill:K}));
    svg.appendChild(e2('rect',{x:31,y:16,width:5,height:18,rx:2.5,fill:K}));
  } else {
    svg.appendChild(e2('rect',{x:14,y:5,width:22,height:35,rx:2,fill:G,stroke:K,'stroke-width':'1.5'}));
    svg.appendChild(e2('rect',{x:14,y:5,width:5,height:35,rx:1,fill:GLD}));
    const p=document.createElementNS(ns,'path');
    p.setAttribute('d','M14,43 Q22,39 30,43 Q38,47 46,43');
    p.setAttribute('fill','none'); p.setAttribute('stroke',GLD); p.setAttribute('stroke-width','2.5'); p.setAttribute('stroke-linecap','round');
    svg.appendChild(p);
    svg.appendChild(e2('rect',{x:30,y:18,width:4,height:12,rx:2,fill:K}));
    svg.appendChild(e2('text',{x:'28',y:'14','font-size':'8','font-family':'Outfit,sans-serif','font-weight':'800',fill:GLD,'text-anchor':'middle'},'∿'));
  }
}
