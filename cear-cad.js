// ════════════════════════════════════════════════════════════
// CAD SVG — Estilo Bahia Vidros (fiel ao sistema real)
// ════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';
function el(tag, attrs, txt) {
  const e = document.createElementNS(ns, tag);
  Object.entries(attrs||{}).forEach(([k,v]) => e.setAttribute(k,v));
  if (txt !== undefined) e.textContent = txt;
  return e;
}

// Paleta fiel à Bahia Vidros
const PAL = {
  glass:  '#4EC8DC',   // azul ciano — TODOS os painéis
  frame:  '#0a0a14',   // moldura/bordas pretas
  div:    '#0a0a14',   // divisórias verticais
  gold:   '#C9A84C',   // dobradiças/pivôs dourados
  lock:   '#222',      // fechadura
  lockW:  '#ffffff',   // centro da fechadura
  roldan: '#0a0a14',   // roldanas (carrinhos)
  corner: '#0a0a14',   // cantoneiras
  dim:    'rgba(100,200,255,0.65)',
  dimTx:  'rgba(180,235,255,0.92)',
  num:    'rgba(10,25,50,0.55)',
};

// ── SVG helpers ───────────────────────────────────────────────
function dimH(svg, x1, x2, y, label) {
  const d='rgba(100,200,255,0.7)';
  svg.appendChild(el('line',{x1,y1:y-3,x2:x1,y2:y+3,stroke:d,'stroke-width':'0.8'}));
  svg.appendChild(el('line',{x1:x2,y1:y-3,x2,y2:y+3,stroke:d,'stroke-width':'0.8'}));
  svg.appendChild(el('line',{x1,y1:y,x2,y2:y,stroke:d,'stroke-width':'1.2','marker-start':'url(#aE)','marker-end':'url(#aD)'}));
  svg.appendChild(el('text',{x:(+x1+ +x2)/2,y:y+9,'text-anchor':'middle','font-size':'9','font-family':'Outfit,sans-serif','font-weight':'700',fill:PAL.dimTx},label));
}
function dimV(svg, x, y1, y2, label) {
  const d='rgba(100,200,255,0.7)';
  svg.appendChild(el('line',{x1:x-3,y1,x2:x+3,y2:y1,stroke:d,'stroke-width':'0.8'}));
  svg.appendChild(el('line',{x1:x-3,y1:y2,x2:x+3,y2,stroke:d,'stroke-width':'0.8'}));
  svg.appendChild(el('line',{x1:x,y1,x2:x,y2,stroke:d,'stroke-width':'1.2','marker-start':'url(#aE)','marker-end':'url(#aD)'}));
  const t=el('text',{x:x+10,y:(+y1+ +y2)/2,'text-anchor':'middle','font-size':'9','font-family':'Outfit,sans-serif','font-weight':'700',fill:PAL.dimTx,transform:`rotate(-90,${x+10},${(+y1+ +y2)/2})`},label);
  svg.appendChild(t);
}
function addDefs(svg) {
  const defs=el('defs');
  const mA=(id,d)=>{const m=el('marker',{id,markerWidth:'6',markerHeight:'6',refX:'3',refY:'3',orient:'auto'});m.appendChild(el('path',{d,fill:PAL.dim}));return m;};
  defs.appendChild(mA('aE','M6,1 L0,3 L6,5 Z'));
  defs.appendChild(mA('aD','M0,1 L6,3 L0,5 Z'));
  svg.appendChild(defs);
}

// Painel de vidro (TODOS mesma cor, sem hachura)
function panel(svg, x, y, w, h) {
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:PAL.glass}));
}
// Numeração do painel
function panelNum(svg, x, y, w, h, n) {
  svg.appendChild(el('text',{x:x+w/2,y:y+h/2+5,'text-anchor':'middle','font-size':'15','font-family':'Outfit,sans-serif','font-weight':'700',fill:PAL.num},String(n)));
}
// Roldana (carrinho) — suporte do painel móvel no trilho
// Aparece como pequenos brackets no topo dos painéis móveis
function roldana(svg, x, y, lado) {
  // Trilho superior fica em y, roldana fica no canto superior do painel
  const dx = lado === 'esq' ? 0 : -6;
  svg.appendChild(el('rect',{x:x+dx,y:y-2,width:6,height:8,fill:PAL.roldan,rx:'1'}));
  svg.appendChild(el('circle',{cx:x+dx+3,cy:y+3,r:'2',fill:'#fff',opacity:'0.6'}));
}
// Cantoneira em L nos 4 cantos de um painel fixo
function corners(svg, x, y, w, h) {
  const s=7, t=2;
  [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([cx,cy,dx,dy])=>{
    svg.appendChild(el('rect',{x:cx,y:cy,width:s*dx,height:t,fill:PAL.corner}));
    svg.appendChild(el('rect',{x:cx,y:cy,width:t,height:s*dy,fill:PAL.corner}));
  });
}
// Roldanas nos cantos superiores de painéis móveis (dois brackets)
function roldanasPanel(svg, x, y, w) {
  roldana(svg, x+2, y, 'esq');
  roldana(svg, x+w-2, y, 'dir');
}
// Fechadura VV — cluster de pontos no encontro dos painéis móveis
function fechaduraVV(svg, x, y, h) {
  const cy = y + h * 0.5;
  // Cluster de círculos
  [[0,-7],[0,0],[0,7],[-5,0],[5,0]].forEach(([dx,dy]) => {
    svg.appendChild(el('circle',{cx:x+dx,cy:cy+dy,r:'2.5',fill:PAL.lock}));
    svg.appendChild(el('circle',{cx:x+dx,cy:cy+dy,r:'1.2',fill:PAL.lockW}));
  });
}
// Fechadura VP — retângulo na borda do painel móvel
function fechaduraVP(svg, x, y, h) {
  const cy = y + h * 0.5;
  svg.appendChild(el('rect',{x:x-3,y:cy-10,width:6,height:20,rx:'1',fill:PAL.lock}));
  svg.appendChild(el('circle',{cx:x,cy:cy,r:'2',fill:PAL.lockW}));
  svg.appendChild(el('circle',{cx:x,cy:cy-5,r:'1.5',fill:PAL.lockW}));
  svg.appendChild(el('circle',{cx:x,cy:cy+5,r:'1.5',fill:PAL.lockW}));
}
// Puxador — barra vertical (tubo inox) fixada no vidro
function puxador(svg, x, y, h) {
  const barLen = Math.min(h * 0.28, 55);  // comprimento da barra
  const py = y + h * 0.45;
  const px = x - 8; // barra fica recuada da borda
  // Base/rosca superior
  svg.appendChild(el('circle',{cx:px,cy:py,r:'3.5',fill:PAL.gold,opacity:'0.9'}));
  svg.appendChild(el('circle',{cx:px,cy:py,r:'1.8',fill:PAL.frame}));
  // Corpo da barra
  svg.appendChild(el('rect',{x:px-3,y:py,width:6,height:barLen,rx:'3',fill:PAL.gold,opacity:'0.85'}));
  svg.appendChild(el('rect',{x:px-1.5,y:py+4,width:3,height:barLen-8,rx:'1.5',fill:'rgba(0,0,0,0.25)'}));
  // Base/rosca inferior
  svg.appendChild(el('circle',{cx:px,cy:py+barLen,r:'3.5',fill:PAL.gold,opacity:'0.9'}));
  svg.appendChild(el('circle',{cx:px,cy:py+barLen,r:'1.8',fill:PAL.frame}));
}
// Dobradiça (bracket/grampo na borda do vidro) — forma real da 1101S/1101J
function pivots(svg, x, y, h, kit) {
  const isJ = kit === 'jumbo';
  const bW = isJ ? 10 : 7;   // largura do grampo
  const bH = isJ ? 22 : 16;  // altura do grampo
  const off = isJ ? 22 : 16; // distância das bordas
  // Grampo superior (dobradiça 1101)
  const topY = y + off;
  svg.appendChild(el('rect',{x:x-bW/2,y:topY,width:bW,height:bH,rx:'2',fill:PAL.gold,opacity:'0.9'}));
  svg.appendChild(el('rect',{x:x-bW/2+1,y:topY+2,width:bW-2,height:bH-4,rx:'1',fill:'rgba(0,0,0,0.3)'}));
  // Pivô superior (pino)
  svg.appendChild(el('rect',{x:x-1,y:topY-6,width:2,height:6,fill:PAL.frame}));
  // Grampo inferior (dobradiça 1103)
  const botY = y + h - off - bH;
  svg.appendChild(el('rect',{x:x-bW/2,y:botY,width:bW,height:bH,rx:'2',fill:PAL.gold,opacity:'0.9'}));
  svg.appendChild(el('rect',{x:x-bW/2+1,y:botY+2,width:bW-2,height:bH-4,rx:'1',fill:'rgba(0,0,0,0.3)'}));
  // Pivô inferior (pino)
  svg.appendChild(el('rect',{x:x-1,y:botY+bH,width:2,height:6,fill:PAL.frame}));
  // Jumbo: grampo central adicional
  if (isJ) {
    const midY = y + h/2 - bH/2;
    svg.appendChild(el('rect',{x:x-bW/2,y:midY,width:bW,height:bH,rx:'2',fill:PAL.gold,opacity:'0.85'}));
    svg.appendChild(el('rect',{x:x-bW/2+1,y:midY+2,width:bW-2,height:bH-4,rx:'1',fill:'rgba(0,0,0,0.3)'}));
  }
}
// Contra-fechadura VV — quadrado branco com detalhe
function contraFechadura(svg, x, y, h) {
  const cy = y + h/2;
  svg.appendChild(el('rect',{x:x-5,y:cy-6,width:10,height:12,fill:PAL.lockW,stroke:PAL.lock,'stroke-width':'1.5'}));
  svg.appendChild(el('line',{x1:x-2,y1:cy-3,x2:x+2,y2:cy-3,stroke:PAL.lock,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x-2,y1:cy+3,x2:x+2,y2:cy+3,stroke:PAL.lock,'stroke-width':'1'}));
}
// Trilho — barra preta no topo e embaixo
function trilho(svg, x, y, w, top) {
  svg.appendChild(el('rect',{x:x-2,y:top?y-5:y+1,width:w+4,height:5,rx:'1',fill:PAL.frame}));
}
// Moldura do painel
function frameLine(svg, x, y, w, h) {
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:'none',stroke:PAL.frame,'stroke-width':'2.5',rx:'1'}));
}
// Divisória vertical
function divLine(svg, x, y, h) {
  svg.appendChild(el('line',{x1:x,y1:y,x2:x,y2:y+h,stroke:PAL.div,'stroke-width':'3','stroke-linecap':'round'}));
}
// Mola hidráulica — barra dourada no piso
function molaBar(svg, x, y, w) {
  svg.appendChild(el('rect',{x:x+w*0.2,y:y-5,width:w*0.6,height:4,rx:'2',fill:PAL.gold,opacity:'0.9'}));
  svg.appendChild(el('text',{x:x+w/2,y:y-8,'text-anchor':'middle','font-size':'5.5','font-family':'Outfit,sans-serif','font-weight':'700',fill:PAL.gold},'MOLA'));
}

// ── RENDERIZADOR PRINCIPAL ────────────────────────────────────
function renderCAD(svgEl, state) {
  const { tipo, larg, alt, folhas, fixoLarg, bandH, temFixo, temBandeirola,
          pivFolhas, kitPivotante, temMola, accs, janelaFolhas } = state;
  if (!svgEl || !larg || !alt) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const W=320, H=220;
  addDefs(svgEl);

  const MARGIN=28;
  const hasFixo = temFixo && (fixoLarg>0) && tipo==='pivotante';
  const hasBand = temBandeirola && (bandH>0) && tipo==='pivotante';
  const totalW  = hasFixo ? larg+(Number(fixoLarg)||0) : larg;
  const totalH  = hasBand ? alt+(Number(bandH)||0) : alt;

  const scale = Math.min((W-MARGIN*2-30)/totalW, (H-MARGIN*2-30)/totalH);
  const tpW=totalW*scale, tpH=totalH*scale;
  const ox0=Math.round((W-tpW)/2-12), oy0=Math.round((H-tpH)/2-8);

  const pw=Math.round(larg*scale), ph=Math.round(alt*scale);
  const fxW=hasFixo?Math.round((Number(fixoLarg)||0)*scale):0;
  const bdH=hasBand?Math.round((Number(bandH)||0)*scale):0;

  const portaX=ox0, portaY=oy0+bdH, fxX=ox0+pw, bandY=oy0;

  // ── PIVOTANTE ──────────────────────────────────────────────
  if (tipo==='pivotante') {
    const nFolhas=Number(pivFolhas)||1, kit=kitPivotante||'comum';

    // Bandeirola (fixo superior)
    if (hasBand) {
      panel(svgEl, portaX, bandY, pw+fxW, bdH);
      frameLine(svgEl, portaX, bandY, pw+fxW, bdH);
      corners(svgEl, portaX, bandY, pw+fxW, bdH);
      panelNum(svgEl, portaX, bandY, pw+fxW, bdH, nFolhas+(hasFixo?1:0)+1);
      svgEl.appendChild(el('line',{x1:portaX,y1:portaY,x2:portaX+pw+fxW,y2:portaY,stroke:PAL.frame,'stroke-width':'3'}));
    }
    // Fixo lateral
    if (hasFixo) {
      panel(svgEl, fxX, portaY, fxW, ph);
      frameLine(svgEl, fxX, portaY, fxW, ph);
      corners(svgEl, fxX, portaY, fxW, ph);
      panelNum(svgEl, fxX, portaY, fxW, ph, nFolhas+1);
      divLine(svgEl, fxX, portaY, ph);
    }
    // Porta(s)
    if (nFolhas===2) {
      const hw=Math.round(pw/2);
      // Folha 1
      panel(svgEl, portaX, portaY, hw, ph);
      frameLine(svgEl, portaX, portaY, hw, ph);
      pivots(svgEl, portaX+3, portaY, ph, kit);
      if (accs&&accs.puxador) puxador(svgEl, portaX+hw-8, portaY, ph);
      panelNum(svgEl, portaX, portaY, hw, ph, 1);
      // Folha 2
      panel(svgEl, portaX+hw, portaY, hw, ph);
      frameLine(svgEl, portaX+hw, portaY, hw, ph);
      pivots(svgEl, portaX+pw-3, portaY, ph, kit);
      if (accs&&accs.puxador) puxador(svgEl, portaX+hw+8, portaY, ph);
      panelNum(svgEl, portaX+hw, portaY, hw, ph, 2);
      // Contra-fechadura
      contraFechadura(svgEl, portaX+hw, portaY, ph);
      divLine(svgEl, portaX+hw, portaY, ph);
    } else {
      panel(svgEl, portaX, portaY, pw, ph);
      frameLine(svgEl, portaX, portaY, pw, ph);
      pivots(svgEl, portaX+3, portaY, ph, kit);
      if (accs&&accs.puxador) puxador(svgEl, portaX+pw-12, portaY, ph);
      fechaduraVP(svgEl, portaX+pw, portaY, ph);
      panelNum(svgEl, portaX, portaY, pw, ph, 1);
    }
    // Fixador (batedor magnético) — disco no chão perto da borda livre
    if (accs&&accs.fixador) {
      const fxX2=portaX+pw-14, fxY=portaY+ph-2;
      // Base no chão
      svgEl.appendChild(el('ellipse',{cx:fxX2,cy:fxY+4,rx:'7',ry:'3',fill:PAL.gold,opacity:'0.7'}));
      // Disco magnético
      svgEl.appendChild(el('circle',{cx:fxX2,cy:fxY,r:'5',fill:PAL.gold,opacity:'0.85'}));
      svgEl.appendChild(el('circle',{cx:fxX2,cy:fxY,r:'3',fill:PAL.frame}));
      svgEl.appendChild(el('circle',{cx:fxX2,cy:fxY,r:'1.5',fill:PAL.gold,opacity:'0.6'}));
    }
    if (temMola) molaBar(svgEl, portaX, portaY+ph, pw);
    // Trilho inferior
    trilho(svgEl, portaX, portaY+ph, pw, false);
    // Cotas
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    if (hasFixo) dimH(svgEl, fxX, fxX+fxW, portaY+ph+18, (fixoLarg||0)+' cm');
    dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, portaY, portaY+ph, alt+' cm');
    if (hasBand) dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, bandY, portaY, (bandH||0)+' cm');

  // ── CORRER ─────────────────────────────────────────────────
  } else if (tipo==='correr') {
    const nF=Number(folhas)||2;
    const nM={1:1,2:2,3:2,4:2}[nF]||2, nFx=nF-nM;
    // Fixos nas extremidades, móveis no centro
    const fixaIdx = nFx===2 ? [0,nF-1] : nFx===1 ? [0] : [];
    const fw=Math.round(pw/nF);
    const vpvv = nM<=1?'VP':'VV';

    // Trilho superior
    trilho(svgEl, portaX, portaY, pw, true);
    // Painel por painel
    for (let i=0; i<nF; i++) {
      const fx=portaX+fw*i, isFixo=fixaIdx.includes(i);
      panel(svgEl, fx, portaY, fw, ph);
      panelNum(svgEl, fx, portaY, fw, ph, i+1);
      if (!isFixo) {
        // Móvel: roldanas no topo
        roldanasPanel(svgEl, fx, portaY, fw);
        // Puxador
        if (accs&&accs.puxador) puxador(svgEl, i<nF/2 ? fx+fw-10 : fx+10, portaY, ph);
      } else {
        // Fixo: cantoneiras
        corners(svgEl, fx, portaY, fw, ph);
      }
      if (i>0) divLine(svgEl, fx, portaY, ph);
    }
    // Fechadura entre os dois painéis móveis
    const mI = fixaIdx.length===2 ? nF/2 : fixaIdx.length===1 ? 1 : nF/2;
    fechaduraVV(svgEl, portaX+fw*mI, portaY, ph);
    // Frame geral
    frameLine(svgEl, portaX, portaY, pw, ph);
    // Trilho inferior
    trilho(svgEl, portaX, portaY+ph, pw, false);
    // Label VP/VV
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY-8,'text-anchor':'middle','font-size':'8','font-family':'Outfit,sans-serif','font-weight':'800',fill:'rgba(255,200,80,0.9)'},vpvv));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── JANELA ─────────────────────────────────────────────────
  } else if (tipo==='janela') {
    const nFj=janelaFolhas||(larg<=120?2:4);
    const nMj={2:1,3:2,4:2}[nFj]||1, nFxj=nFj-nMj;
    const fixaJ = nFxj===2 ? [0,nFj-1] : [0];
    const fw2=Math.round(pw/nFj);
    const vpvv2=nFj===2?'VP':'VV';

    for (let i=0; i<nFj; i++) {
      const fx=portaX+fw2*i, isFixo=fixaJ.includes(i);
      panel(svgEl, fx, portaY, fw2, ph);
      panelNum(svgEl, fx, portaY, fw2, ph, i+1);
      if (!isFixo) roldanasPanel(svgEl, fx, portaY, fw2);
      else corners(svgEl, fx, portaY, fw2, ph);
      if (i>0) divLine(svgEl, fx, portaY, ph);
    }
    const mJi = fixaJ.length===2 ? 1 : nFj-1;
    // Bate-fecha VP — peça pequena em U na borda de encontro do painel móvel
  const bfX = portaX + fw2 * mJi;
  svgEl.appendChild(el('rect',{x:bfX-4,y:portaY+ph*0.45-4,width:8,height:12,rx:'2',fill:PAL.gold,opacity:'0.85'}));
  svgEl.appendChild(el('rect',{x:bfX-2,y:portaY+ph*0.45-2,width:4,height:8,rx:'1',fill:PAL.frame}));
    frameLine(svgEl, portaX, portaY, pw, ph);
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY-8,'text-anchor':'middle','font-size':'8','font-family':'Outfit,sans-serif','font-weight':'800',fill:'rgba(255,200,80,0.9)'},nFj+' folhas · '+vpvv2));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── BOX ────────────────────────────────────────────────────
  } else if (tipo==='box') {
    const hw3=Math.round(pw/2);
    panel(svgEl, portaX, portaY, hw3, ph); panelNum(svgEl, portaX, portaY, hw3, ph, 1);
    roldanasPanel(svgEl, portaX, portaY, hw3);
    panel(svgEl, portaX+hw3, portaY, hw3, ph); panelNum(svgEl, portaX+hw3, portaY, hw3, ph, 2);
    roldanasPanel(svgEl, portaX+hw3, portaY, hw3);
    fechaduraVV(svgEl, portaX+hw3, portaY, ph);
    divLine(svgEl, portaX+hw3, portaY, ph);
    frameLine(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── ESPELHO ────────────────────────────────────────────────
  } else if (tipo==='espelho') {
    panel(svgEl, portaX, portaY, pw, ph);
    svgEl.appendChild(el('line',{x1:portaX+pw*0.2,y1:portaY+4,x2:portaX+pw*0.05,y2:portaY+ph-4,stroke:'rgba(255,255,255,0.35)','stroke-width':'4','stroke-linecap':'round'}));
    svgEl.appendChild(el('line',{x1:portaX+pw*0.35,y1:portaY+4,x2:portaX+pw*0.2,y2:portaY+ph-4,stroke:'rgba(255,255,255,0.18)','stroke-width':'2.5','stroke-linecap':'round'}));
    frameLine(svgEl, portaX, portaY, pw, ph);
    corners(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── BASCULANTE ─────────────────────────────────────────────
  } else if (tipo==='basculante') {
    panel(svgEl, portaX, portaY, pw, ph);
    // Pivô central no topo (teardrop)
    const px2=portaX+pw/2;
    svgEl.appendChild(el('path',{d:`M${px2-6},${portaY} Q${px2},${portaY-8} ${px2+6},${portaY}`,fill:PAL.frame}));
    svgEl.appendChild(el('circle',{cx:px2,cy:portaY-2,r:'3',fill:PAL.gold}));
    svgEl.appendChild(el('circle',{cx:portaX+pw*0.8,cy:portaY+ph*0.8,r:'4',fill:'none',stroke:PAL.frame,'stroke-width':'1.5'}));
    frameLine(svgEl, portaX, portaY, pw, ph);
    panelNum(svgEl, portaX, portaY, pw, ph, 1);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── GUARDA CORPO ───────────────────────────────────────────
  } else if (tipo==='guarda') {
    panel(svgEl, portaX, portaY, pw, ph);
    const mods=Math.max(1,Math.ceil(larg/120));
    for (let m=1; m<mods; m++) divLine(svgEl, portaX+Math.round((pw/mods)*m), portaY, ph);
    svgEl.appendChild(el('rect',{x:portaX+2,y:portaY+2,width:pw-4,height:10,rx:'2',fill:PAL.frame,opacity:'0.7'}));
    frameLine(svgEl, portaX, portaY, pw, ph);
    corners(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── VIDRO COMUM ────────────────────────────────────────────
  } else {
    panel(svgEl, portaX, portaY, pw, ph);
    frameLine(svgEl, portaX, portaY, pw, ph);
    corners(svgEl, portaX, portaY, pw, ph);
    const area=(larg/100)*(alt/100);
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY+ph/2+4,'text-anchor':'middle','font-size':'11','font-family':'Outfit,sans-serif','font-weight':'700',fill:PAL.num},area.toFixed(2)+' m²'));
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
  const G='#4EC8DC', FR='#0a0a14', GD='#C9A84C';
  const { tipo, fixo, band, folhas } = config;

  function r(x,y,w,h,a){const e=document.createElementNS(ns,'rect');Object.entries({x,y,width:w,height:h,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function l(x1,y1,x2,y2,a){const e=document.createElementNS(ns,'line');Object.entries({x1,y1,x2,y2,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function c(cx,cy,rv,a){const e=document.createElementNS(ns,'circle');Object.entries({cx,cy,r:rv,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}

  if (tipo==='pivotante') {
    const fxW=fixo?W*0.28:0, bdH=band?H*0.2:0;
    const nFl=folhas||1;
    const px=M, py=M+bdH, pw=W-M*2-fxW, ph=H-M*2-bdH;
    // Bandeirola
    if (band){svg.appendChild(r(px,M,pw,bdH,{fill:G,'stroke':FR,'stroke-width':'1.2'}));svg.appendChild(l(px,py,px+pw,py,{stroke:FR,'stroke-width':'2'}));}
    // Fixo
    if (fixo){svg.appendChild(r(px+pw,py,fxW,ph,{fill:G,'stroke':FR,'stroke-width':'1.2'}));svg.appendChild(l(px+pw,py,px+pw,py+ph,{stroke:FR,'stroke-width':'2.5'}));}
    if (nFl===2){
      const hw=pw/2;
      svg.appendChild(r(px,py,hw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(r(px+hw,py,hw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(l(px+hw,py,px+hw,py+ph,{stroke:FR,'stroke-width':'2.5'}));
      svg.appendChild(c(px+hw,py+ph/2,3,{fill:'#fff',stroke:FR,'stroke-width':'1.2'}));
      svg.appendChild(c(px+3,py+6,2.5,{fill:FR}));svg.appendChild(c(px+3,py+ph-6,2.5,{fill:FR}));
      svg.appendChild(c(px+pw-3,py+6,2.5,{fill:FR}));svg.appendChild(c(px+pw-3,py+ph-6,2.5,{fill:FR}));
    } else {
      svg.appendChild(r(px,py,pw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(c(px+3,py+7,2.5,{fill:FR}));svg.appendChild(c(px+3,py+ph-7,2.5,{fill:FR}));
      svg.appendChild(r(px+pw-6,py+ph*0.35,3,ph*0.3,{rx:'1.5',fill:FR}));
    }
    svg.appendChild(r(px,py+ph,pw,3,{rx:'1',fill:FR}));

  } else if (tipo==='correr') {
    const nF=folhas||2, fw=(W-M*2)/nF;
    const fixaIdx=nF===4?[0,nF-1]:nF===3?[0]:[];
    svg.appendChild(r(M-1,M-3,W-M*2+2,3,{rx:'1',fill:FR}));
    for(let f=0;f<nF;f++){
      const fx=M+fw*f, isF=fixaIdx.includes(f);
      svg.appendChild(r(fx,M,fw,H-M*2,{fill:G}));
      if(!isF){
        svg.appendChild(r(fx+1,M-1,4,5,{fill:FR,rx:'1'}));
        svg.appendChild(r(fx+fw-5,M-1,4,5,{fill:FR,rx:'1'}));
      }
      if(f>0) svg.appendChild(l(fx,M,fx,H-M,{stroke:FR,'stroke-width':'2.5'}));
    }
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none','stroke':FR,'stroke-width':'1.5'}));
    svg.appendChild(r(M-1,H-M,W-M*2+2,3,{rx:'1',fill:FR}));

  } else if (tipo==='janela') {
    const nFj=folhas||2, fw2=(W-M*2)/nFj, fixI=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    for(let f=0;f<nFj;f++){
      const fx2=M+fw2*f, isF=fixI.includes(f);
      svg.appendChild(r(fx2,M,fw2,H-M*2,{fill:G}));
      if(!isF){svg.appendChild(r(fx2+1,M-1,4,5,{fill:FR,rx:'1'}));svg.appendChild(r(fx2+fw2-5,M-1,4,5,{fill:FR,rx:'1'}));}
      if(f>0) svg.appendChild(l(fx2,M,fx2,H-M,{stroke:FR,'stroke-width':'2'}));
    }
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none','stroke':FR,'stroke-width':'1.5'}));
  }
}

// ── Mini-desenhos dos kits pivotante ─────────────────────────
function _renderMiniKitCADs() {
  _drawKitSVG('mkitComum', 'comum');
  _drawKitSVG('mkitJumbo', 'jumbo');
}
function _drawKitSVG(svgId, tipo) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const G='#4EC8DC', K='#0a0a14', GLD='#C9A84C';
  function e2(tag,a,t){const el2=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>el2.setAttribute(k,v));if(t!==undefined)el2.textContent=t;return el2;}

  // Vidro da porta (fundo ciano)
  svg.appendChild(e2('rect',{x:16,y:4,width:24,height:42,rx:2,fill:G,stroke:K,'stroke-width':'1.5'}));

  if (tipo==='comum') {
    // Dobradiça comum: grampo pequeno na borda esquerda (topo e base)
    // Grampo superior (1101 S)
    svg.appendChild(e2('rect',{x:11,y:8,width:7,height:14,rx:2,fill:GLD}));
    svg.appendChild(e2('rect',{x:12,y:10,width:5,height:10,rx:1,fill:'rgba(0,0,0,0.3)'}));
    svg.appendChild(e2('rect',{x:14,y:4,width:2,height:5,rx:1,fill:K})); // pino
    // Grampo inferior (1103 S)
    svg.appendChild(e2('rect',{x:11,y:28,width:7,height:14,rx:2,fill:GLD}));
    svg.appendChild(e2('rect',{x:12,y:30,width:5,height:10,rx:1,fill:'rgba(0,0,0,0.3)'}));
    svg.appendChild(e2('rect',{x:14,y:41,width:2,height:5,rx:1,fill:K})); // pino
    // Puxador: barra vertical no vidro
    svg.appendChild(e2('rect',{x:32,y:17,width:5,height:16,rx:2.5,fill:GLD,opacity:'0.9'}));
    svg.appendChild(e2('circle',{cx:34.5,cy:17,r:'3',fill:GLD,opacity:'0.9'}));
    svg.appendChild(e2('circle',{cx:34.5,cy:33,r:'3',fill:GLD,opacity:'0.9'}));

  } else { // jumbo
    // Dobradiça jumbo: grampos maiores + central
    // Grampo superior (1101 J) - maior
    svg.appendChild(e2('rect',{x:9,y:6,width:10,height:16,rx:2,fill:GLD}));
    svg.appendChild(e2('rect',{x:10,y:8,width:8,height:12,rx:1,fill:'rgba(0,0,0,0.3)'}));
    svg.appendChild(e2('rect',{x:13,y:2,width:2,height:5,rx:1,fill:K}));
    // Grampo central (adicional no jumbo)
    svg.appendChild(e2('rect',{x:9,y:17,width:10,height:16,rx:2,fill:GLD,opacity:'0.85'}));
    svg.appendChild(e2('rect',{x:10,y:19,width:8,height:12,rx:1,fill:'rgba(0,0,0,0.3)'}));
    // Grampo inferior (1103 J)
    svg.appendChild(e2('rect',{x:9,y:28,width:10,height:16,rx:2,fill:GLD}));
    svg.appendChild(e2('rect',{x:10,y:30,width:8,height:12,rx:1,fill:'rgba(0,0,0,0.3)'}));
    svg.appendChild(e2('rect',{x:13,y:43,width:2,height:5,rx:1,fill:K}));
    // Puxador robusto
    svg.appendChild(e2('rect',{x:32,y:15,width:6,height:20,rx:3,fill:GLD,opacity:'0.9'}));
    svg.appendChild(e2('circle',{cx:35,cy:15,r:'3.5',fill:GLD,opacity:'0.9'}));
    svg.appendChild(e2('circle',{cx:35,cy:35,r:'3.5',fill:GLD,opacity:'0.9'}));
  }
}
