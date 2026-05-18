// ════════════════════════════════════════════════════════════
// CAD SVG — Estilo Bahia Vidros (fundo branco, desenho técnico)
// ════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';
function el(tag, attrs, txt) {
  const e = document.createElementNS(ns, tag);
  Object.entries(attrs||{}).forEach(([k,v]) => e.setAttribute(k,v));
  if (txt !== undefined) e.textContent = txt;
  return e;
}

// Paleta — fiel ao estilo Bahia Vidros
const PAL = {
  bg:     '#ffffff',    // fundo branco
  frame:  '#1a1a1a',    // bordas pretas
  glass:  '#29C4DA',    // azul ciano vivo
  div:    '#000000',    // divisórias pretas espessas
  hw:     '#1a7a1a',    // hardware (furos) verde escuro
  hwFill: '#ffffff',    // interior dos furos branco
  bracket:'#888888',    // cantoneiras cinza
  gold:   '#b8860b',    // dobradiças douradas
  dim:    '#0055aa',    // linhas de cota azul
  dimTx:  '#0055aa',    // texto de cota azul
  num:    '#1a1a1a',    // números dos painéis
  lock:   '#ffffff',    // fechadura branca
  lockBd: '#000000',    // borda fechadura
  mola:   '#cc6600',    // mola hidráulica
};

// ── Utilitários ───────────────────────────────────────────────
function addDefs(svg) {
  const defs = el('defs');
  const mkArr = (id, d) => {
    const m = el('marker',{id,markerWidth:'8',markerHeight:'8',refX:'4',refY:'4',orient:'auto'});
    m.appendChild(el('path',{d,fill:PAL.dim})); return m;
  };
  defs.appendChild(mkArr('aE','M8,2 L0,4 L8,6 Z'));
  defs.appendChild(mkArr('aD','M0,2 L8,4 L0,6 Z'));
  svg.appendChild(defs);
}

function dimH(svg, x1, x2, y, label) {
  svg.appendChild(el('line',{x1,y1:y-4,x2:x1,y2:y+4,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x2,y1:y-4,x2,y2:y+4,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1,y1:y,x2,y2:y,stroke:PAL.dim,'stroke-width':'1','marker-start':'url(#aE)','marker-end':'url(#aD)'}));
  svg.appendChild(el('text',{x:(+x1+ +x2)/2,y:y+10,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dimTx},label));
}
function dimV(svg, x, y1, y2, label) {
  svg.appendChild(el('line',{x1:x-4,y1,x2:x+4,y2:y1,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x-4,y1:y2,x2:x+4,y2,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x,y1,x2:x,y2,stroke:PAL.dim,'stroke-width':'1','marker-start':'url(#aE)','marker-end':'url(#aD)'}));
  const t = el('text',{x:x+10,y:(+y1+ +y2)/2,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dimTx,transform:`rotate(-90,${x+10},${(+y1+ +y2)/2})`},label);
  svg.appendChild(t);
}

// Painel de vidro
function panel(svg, x, y, w, h) {
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:PAL.glass}));
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:'none',stroke:PAL.frame,'stroke-width':'2'}));
}

// Numeração do painel
function panelNum(svg, x, y, w, h, n) {
  svg.appendChild(el('text',{
    x:x+w/2, y:y+h/2+6,
    'text-anchor':'middle','font-size':'16',
    'font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.num
  }, String(n)));
}

// Dobradiça (1101/1103) — grampo metálico na borda
function dobradica(svg, cx, cy, jumbo) {
  const w = jumbo ? 12 : 8, h = jumbo ? 20 : 14;
  svg.appendChild(el('rect',{x:cx-w/2,y:cy-h/2,width:w,height:h,rx:'2',fill:PAL.gold,stroke:'#5a4000','stroke-width':'0.8'}));
  svg.appendChild(el('rect',{x:cx-w/2+1.5,y:cy-h/2+2,width:w-3,height:h-4,rx:'1',fill:'rgba(0,0,0,0.25)'}));
  // Furo de fixação
  svg.appendChild(el('circle',{cx,cy:cy-h/4,r:'2',fill:PAL.hwFill,stroke:PAL.hw,'stroke-width':'1'}));
  svg.appendChild(el('circle',{cx,cy:cy+h/4,r:'2',fill:PAL.hwFill,stroke:PAL.hw,'stroke-width':'1'}));
}

// Pivô (pino no topo/base)
function pivo(svg, cx, cy) {
  svg.appendChild(el('circle',{cx,cy,r:'4',fill:PAL.frame}));
  svg.appendChild(el('circle',{cx,cy,r:'2',fill:'#888'}));
}

// Puxador — barra vertical com roscas
function puxador(svg, x, y, h) {
  const barLen = Math.min(h*0.28, 52);
  const py = y + h*0.44;
  const px = x - 9;
  svg.appendChild(el('rect',{x:px-3,y:py,width:6,height:barLen,rx:'3',fill:'#c0c0c0',stroke:'#666','stroke-width':'0.8'}));
  svg.appendChild(el('circle',{cx:px,cy:py,r:'4',fill:'#888',stroke:'#444','stroke-width':'1'}));
  svg.appendChild(el('circle',{cx:px,cy:py,r:'2',fill:PAL.hwFill}));
  svg.appendChild(el('circle',{cx:px,cy:py+barLen,r:'4',fill:'#888',stroke:'#444','stroke-width':'1'}));
  svg.appendChild(el('circle',{cx:px,cy:py+barLen,r:'2',fill:PAL.hwFill}));
}

// Fechadura pivotante (1520+1504)
function fechaduraPiv(svg, x, cy) {
  svg.appendChild(el('rect',{x:x-5,y:cy-8,width:10,height:16,rx:'2',fill:PAL.lock,stroke:PAL.lockBd,'stroke-width':'1.5'}));
  svg.appendChild(el('circle',{cx:x,cy,r:'3',fill:'#ddd',stroke:'#999','stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x,y1:cy-4,x2:x,y2:cy+4,stroke:'#999','stroke-width':'1'}));
}

// Contra-fechadura VV
function contraFechadura(svg, x, cy) {
  svg.appendChild(el('rect',{x:x-6,y:cy-8,width:12,height:16,rx:'2',fill:PAL.lock,stroke:PAL.lockBd,'stroke-width':'1.5'}));
  svg.appendChild(el('line',{x1:x-3,y1:cy-3,x2:x+3,y2:cy-3,stroke:'#999','stroke-width':'1.2'}));
  svg.appendChild(el('line',{x1:x-3,y1:cy+3,x2:x+3,y2:cy+3,stroke:'#999','stroke-width':'1.2'}));
}

// Roldana (carrinho de correr) — suporte no trilho
function roldana(svg, x, y) {
  svg.appendChild(el('rect',{x:x-4,y:y-6,width:8,height:8,rx:'1',fill:'#c8c8c8',stroke:PAL.frame,'stroke-width':'1'}));
  svg.appendChild(el('circle',{cx:x,cy:y-2,r:'2.5',fill:PAL.hwFill,stroke:PAL.hw,'stroke-width':'0.8'}));
}

// Trilho horizontal
function trilho(svg, x, y, w, top) {
  svg.appendChild(el('rect',{x:x-3,y:top?y-7:y+1,width:w+6,height:6,rx:'1',fill:PAL.frame}));
}

// Cantoneiras nos cantos (1302)
function corners(svg, x, y, w, h) {
  const s=7, t=2.5;
  [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([cx,cy,dx,dy])=>{
    svg.appendChild(el('rect',{x:cx,y:cy,width:s*dx,height:t,fill:PAL.bracket}));
    svg.appendChild(el('rect',{x:cx,y:cy,width:t,height:s*dy,fill:PAL.bracket}));
  });
}

// Divisória vertical
function divLine(svg, x, y, h) {
  svg.appendChild(el('line',{x1:x,y1:y,x2:x,y2:y+h,stroke:PAL.div,'stroke-width':'3.5','stroke-linecap':'butt'}));
}

// Fechadura de correr (cluster VV)
function fechaduraVV(svg, x, cy) {
  [[-5,-5],[5,-5],[0,0],[-5,5],[5,5]].forEach(([dx,dy])=>{
    svg.appendChild(el('circle',{cx:x+dx,cy:cy+dy,r:'2.5',fill:'#444',stroke:PAL.hwFill,'stroke-width':'0.8'}));
  });
}

// Mola hidráulica
function molaBar(svg, x, y, w) {
  svg.appendChild(el('rect',{x:x+w*.25,y:y-5,width:w*.5,height:4,rx:'2',fill:PAL.mola}));
  const t=el('text',{x:x+w/2,y:y-7,'text-anchor':'middle','font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.mola},'MOLA');
  svg.appendChild(t);
}

// Fundo branco do SVG
function bgRect(svg, W, H) {
  svg.appendChild(el('rect',{x:0,y:0,width:W,height:H,fill:PAL.bg}));
}

// ── RENDERIZADOR PRINCIPAL ────────────────────────────────────
function renderCAD(svgEl, state) {
  const { tipo, larg, alt, folhas, fixoLarg, bandH, temFixo, temBandeirola,
          pivFolhas, kitPivotante, temMola, accs, janelaFolhas } = state;
  if (!svgEl || !larg || !alt) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const W=320, H=220;
  addDefs(svgEl);
  bgRect(svgEl, W, H);

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
  const kit = kitPivotante||'comum';
  const isJumbo = kit==='jumbo';

  // ── PIVOTANTE ──────────────────────────────────────────────
  if (tipo==='pivotante') {
    const nFolhas=Number(pivFolhas)||1;
    // Bandeirola
    if (hasBand) {
      panel(svgEl, portaX, bandY, pw+fxW, bdH);
      corners(svgEl, portaX, bandY, pw+fxW, bdH);
      panelNum(svgEl, portaX, bandY, pw+fxW, bdH, nFolhas+(hasFixo?1:0)+1);
      svgEl.appendChild(el('line',{x1:portaX,y1:portaY,x2:portaX+pw+fxW,y2:portaY,stroke:PAL.frame,'stroke-width':'3'}));
    }
    // Fixo lateral
    if (hasFixo) {
      panel(svgEl, fxX, portaY, fxW, ph);
      corners(svgEl, fxX, portaY, fxW, ph);
      panelNum(svgEl, fxX, portaY, fxW, ph, nFolhas+1);
      divLine(svgEl, fxX, portaY, ph);
    }
    if (nFolhas===2) {
      const hw=Math.round(pw/2);
      // Folha 1
      panel(svgEl, portaX, portaY, hw, ph);
      panelNum(svgEl, portaX, portaY, hw, ph, 1);
      dobradica(svgEl, portaX+3, portaY+ph*0.2, isJumbo);
      dobradica(svgEl, portaX+3, portaY+ph*0.8, isJumbo);
      if (isJumbo) dobradica(svgEl, portaX+3, portaY+ph*0.5, true);
      pivo(svgEl, portaX, portaY+5);
      pivo(svgEl, portaX, portaY+ph-5);
      if (accs&&accs.puxador) puxador(svgEl, portaX+hw, portaY, ph);
      // Folha 2
      panel(svgEl, portaX+hw, portaY, hw, ph);
      panelNum(svgEl, portaX+hw, portaY, hw, ph, 2);
      dobradica(svgEl, portaX+pw-3, portaY+ph*0.2, isJumbo);
      dobradica(svgEl, portaX+pw-3, portaY+ph*0.8, isJumbo);
      if (isJumbo) dobradica(svgEl, portaX+pw-3, portaY+ph*0.5, true);
      pivo(svgEl, portaX+pw, portaY+5);
      pivo(svgEl, portaX+pw, portaY+ph-5);
      if (accs&&accs.puxador) puxador(svgEl, portaX+hw, portaY, ph);
      contraFechadura(svgEl, portaX+hw, portaY+ph/2);
      divLine(svgEl, portaX+hw, portaY, ph);
    } else {
      panel(svgEl, portaX, portaY, pw, ph);
      panelNum(svgEl, portaX, portaY, pw, ph, 1);
      dobradica(svgEl, portaX+3, portaY+ph*0.2, isJumbo);
      dobradica(svgEl, portaX+3, portaY+ph*0.8, isJumbo);
      if (isJumbo) dobradica(svgEl, portaX+3, portaY+ph*0.5, true);
      pivo(svgEl, portaX, portaY+5);
      pivo(svgEl, portaX, portaY+ph-5);
      if (accs&&accs.puxador) puxador(svgEl, portaX+pw, portaY, ph);
      fechaduraPiv(svgEl, portaX+pw-2, portaY+ph/2);
    }
    // Fixador
    if (accs&&accs.fixador) {
      const fxX2=portaX+pw-14;
      svgEl.appendChild(el('circle',{cx:fxX2,cy:portaY+ph+3,r:'5',fill:'#888',stroke:PAL.frame,'stroke-width':'1'}));
      svgEl.appendChild(el('circle',{cx:fxX2,cy:portaY+ph+3,r:'2.5',fill:PAL.hwFill,stroke:PAL.hw,'stroke-width':'0.8'}));
    }
    if (temMola) molaBar(svgEl, portaX, portaY+ph, pw);
    // Trilho inferior
    trilho(svgEl, portaX, portaY+ph, pw+(hasFixo?fxW:0), false);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    if (hasFixo) dimH(svgEl, fxX, fxX+fxW, portaY+ph+18, (fixoLarg||0)+' cm');
    dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, portaY, portaY+ph, alt+' cm');
    if (hasBand) dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, bandY, portaY, (bandH||0)+' cm');

  // ── CORRER ─────────────────────────────────────────────────
  } else if (tipo==='correr') {
    const nF=Number(folhas)||2;
    const nM={1:1,2:2,3:2,4:2}[nF]||2, nFx=nF-nM;
    const fixaIdx = nFx===2?[0,nF-1]:nFx===1?[0]:[];
    const fw=Math.round(pw/nF);
    const vpvv=nM<=1?'VP':'VV';
    trilho(svgEl, portaX, portaY, pw, true);
    for (let i=0; i<nF; i++) {
      const fx=portaX+fw*i, isF=fixaIdx.includes(i);
      panel(svgEl, fx, portaY, fw, ph);
      panelNum(svgEl, fx, portaY, fw, ph, i+1);
      if (!isF) {
        roldana(svgEl, fx+fw*0.25, portaY);
        roldana(svgEl, fx+fw*0.75, portaY);
        if (accs&&accs.puxador) puxador(svgEl, i<nF/2?fx+fw-4:fx+4, portaY, ph);
      } else {
        corners(svgEl, fx, portaY, fw, ph);
      }
      if (i>0) divLine(svgEl, fx, portaY, ph);
    }
    const mI = nFx===2?nF/2:nFx===1?1:nF/2;
    fechaduraVV(svgEl, portaX+fw*mI, portaY+ph/2);
    trilho(svgEl, portaX, portaY+ph, pw, false);
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dim},vpvv));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── JANELA ─────────────────────────────────────────────────
  } else if (tipo==='janela') {
    const nFj=janelaFolhas||(larg<=120?2:4);
    const nMj={2:1,3:2,4:2}[nFj]||1;
    const fixaJ=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    const fw2=Math.round(pw/nFj);
    const vpvv2=nFj===2?'VP':'VV';
    for (let i=0; i<nFj; i++) {
      const fx=portaX+fw2*i, isF=fixaJ.includes(i);
      panel(svgEl, fx, portaY, fw2, ph);
      panelNum(svgEl, fx, portaY, fw2, ph, i+1);
      if (!isF) {
        roldana(svgEl, fx+fw2*0.3, portaY);
        roldana(svgEl, fx+fw2*0.7, portaY);
      } else corners(svgEl, fx, portaY, fw2, ph);
      if (i>0) divLine(svgEl, fx, portaY, ph);
    }
    // Bate-fecha
    const mJi=nFj===4?1:nFj===3?1:nFj-1;
    const bfX=portaX+fw2*mJi;
    svgEl.appendChild(el('rect',{x:bfX-4,y:portaY+ph*.43,width:8,height:14,rx:'2',fill:'#999',stroke:'#333','stroke-width':'1'}));
    svgEl.appendChild(el('rect',{x:bfX-2,y:portaY+ph*.43+2,width:4,height:10,rx:'1',fill:PAL.hwFill}));
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dim},nFj+' folhas · '+vpvv2));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── BOX ────────────────────────────────────────────────────
  } else if (tipo==='box') {
    const hw3=Math.round(pw/2);
    panel(svgEl, portaX, portaY, hw3, ph);   panelNum(svgEl, portaX, portaY, hw3, ph, 1);
    roldana(svgEl, portaX+hw3*0.3, portaY);  roldana(svgEl, portaX+hw3*0.7, portaY);
    panel(svgEl, portaX+hw3, portaY, hw3, ph); panelNum(svgEl, portaX+hw3, portaY, hw3, ph, 2);
    roldana(svgEl, portaX+hw3+hw3*0.3, portaY); roldana(svgEl, portaX+hw3+hw3*0.7, portaY);
    fechaduraVV(svgEl, portaX+hw3, portaY+ph/2);
    divLine(svgEl, portaX+hw3, portaY, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── ESPELHO ────────────────────────────────────────────────
  } else if (tipo==='espelho') {
    svgEl.appendChild(el('rect',{x:portaX,y:portaY,width:pw,height:ph,fill:'#e8f4f8'}));
    svgEl.appendChild(el('rect',{x:portaX,y:portaY,width:pw,height:ph,fill:'none',stroke:PAL.frame,'stroke-width':'2'}));
    svgEl.appendChild(el('line',{x1:portaX+pw*.2,y1:portaY+4,x2:portaX+pw*.05,y2:portaY+ph-4,stroke:'rgba(255,255,255,0.7)','stroke-width':'4','stroke-linecap':'round'}));
    svgEl.appendChild(el('line',{x1:portaX+pw*.35,y1:portaY+4,x2:portaX+pw*.2,y2:portaY+ph-4,stroke:'rgba(255,255,255,0.4)','stroke-width':'2.5','stroke-linecap':'round'}));
    corners(svgEl, portaX, portaY, pw, ph);
    panelNum(svgEl, portaX, portaY, pw, ph, 1);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── BASCULANTE ─────────────────────────────────────────────
  } else if (tipo==='basculante') {
    panel(svgEl, portaX, portaY, pw, ph);
    panelNum(svgEl, portaX, portaY, pw, ph, 1);
    const pcx=portaX+pw/2;
    svgEl.appendChild(el('path',{d:`M${pcx-7},${portaY} Q${pcx},${portaY-10} ${pcx+7},${portaY}`,fill:PAL.frame}));
    svgEl.appendChild(el('circle',{cx:pcx,cy:portaY-2,r:'3.5',fill:'#888',stroke:PAL.frame,'stroke-width':'1'}));
    svgEl.appendChild(el('circle',{cx:portaX+pw*.8,cy:portaY+ph*.75,r:'5',fill:'none',stroke:'#555','stroke-width':'1.5'}));
    svgEl.appendChild(el('circle',{cx:portaX+pw*.8,cy:portaY+ph*.75,r:'2.5',fill:PAL.hwFill,stroke:PAL.hw,'stroke-width':'0.8'}));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── GUARDA CORPO ───────────────────────────────────────────
  } else if (tipo==='guarda') {
    panel(svgEl, portaX, portaY, pw, ph);
    const mods=Math.max(1,Math.ceil(larg/120));
    for (let m=1; m<mods; m++) divLine(svgEl, portaX+Math.round((pw/mods)*m), portaY, ph);
    svgEl.appendChild(el('rect',{x:portaX+2,y:portaY+2,width:pw-4,height:8,rx:'2',fill:PAL.frame,opacity:'0.7'}));
    corners(svgEl, portaX, portaY, pw, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── VIDRO COMUM ────────────────────────────────────────────
  } else {
    panel(svgEl, portaX, portaY, pw, ph);
    corners(svgEl, portaX, portaY, pw, ph);
    const area=(larg/100)*(alt/100);
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY+ph/2+5,'text-anchor':'middle','font-size':'11','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.num},area.toFixed(2)+' m²'));
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
  const G=PAL.glass, FR=PAL.frame, GD=PAL.gold;
  const { tipo, fixo, band, folhas } = config;
  function r(x,y,w,h,a){const e=document.createElementNS(ns,'rect');Object.entries({x,y,width:w,height:h,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function l(x1,y1,x2,y2,a){const e=document.createElementNS(ns,'line');Object.entries({x1,y1,x2,y2,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function c(cx,cy,rv,a){const e=document.createElementNS(ns,'circle');Object.entries({cx,cy,r:rv,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  // fundo branco
  svg.appendChild(r(0,0,W,H,{fill:'#fff'}));
  if (tipo==='pivotante') {
    const fxW=fixo?W*0.28:0, bdH=band?H*0.2:0;
    const nFl=folhas||1;
    const px=M, py=M+bdH, pw=W-M*2-fxW, ph=H-M*2-bdH;
    if (band){svg.appendChild(r(px,M,pw,bdH,{fill:G,'stroke':FR,'stroke-width':'1.2'}));svg.appendChild(l(px,py,px+pw,py,{stroke:FR,'stroke-width':'2'}));}
    if (fixo){svg.appendChild(r(px+pw,py,fxW,ph,{fill:G,'stroke':FR,'stroke-width':'1.2'}));svg.appendChild(l(px+pw,py,px+pw,py+ph,{stroke:FR,'stroke-width':'2.5'}));}
    if (nFl===2){
      const hw=pw/2;
      svg.appendChild(r(px,py,hw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(r(px+hw,py,hw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(l(px+hw,py,px+hw,py+ph,{stroke:FR,'stroke-width':'2.5'}));
      // dobradiças esq e dir
      svg.appendChild(r(px,py+ph*.2-4,6,8,{rx:'1',fill:GD}));
      svg.appendChild(r(px,py+ph*.8-4,6,8,{rx:'1',fill:GD}));
      svg.appendChild(r(px+pw-6,py+ph*.2-4,6,8,{rx:'1',fill:GD}));
      svg.appendChild(r(px+pw-6,py+ph*.8-4,6,8,{rx:'1',fill:GD}));
      svg.appendChild(r(px+hw-4,py+ph/2-5,8,10,{rx:'2',fill:'#fff','stroke':FR,'stroke-width':'1'}));
    } else {
      svg.appendChild(r(px,py,pw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(r(px,py+ph*.2-4,6,8,{rx:'1',fill:GD}));
      svg.appendChild(r(px,py+ph*.8-4,6,8,{rx:'1',fill:GD}));
      svg.appendChild(r(px+pw-5,py+ph*.35,4,ph*.3,{rx:'2',fill:'#aaa','stroke':'#666','stroke-width':'0.5'}));
    }
  } else if (tipo==='correr') {
    const nF=folhas||2, fw=(W-M*2)/nF;
    const fixaIdx=nF===4?[0,nF-1]:nF===3?[0]:[];
    svg.appendChild(r(M-1,M-3,W-M*2+2,3,{rx:'1',fill:FR}));
    for(let f=0;f<nF;f++){
      const fx=M+fw*f, isF=fixaIdx.includes(f);
      svg.appendChild(r(fx,M,fw,H-M*2,{fill:G,'stroke':FR,'stroke-width':'1.2'}));
      if(!isF){
        svg.appendChild(r(fx+fw*.2,M-1,fw*.25,5,{rx:'1',fill:'#bbb','stroke':FR,'stroke-width':'0.8'}));
        svg.appendChild(r(fx+fw*.55,M-1,fw*.25,5,{rx:'1',fill:'#bbb','stroke':FR,'stroke-width':'0.8'}));
      }
      if(f>0) svg.appendChild(l(fx,M,fx,H-M,{stroke:FR,'stroke-width':'2.5'}));
    }
    svg.appendChild(r(M-1,H-M,W-M*2+2,3,{rx:'1',fill:FR}));
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none','stroke':FR,'stroke-width':'1.5'}));
  } else if (tipo==='janela') {
    const nFj=folhas||2, fw2=(W-M*2)/nFj, fixI=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    for(let f=0;f<nFj;f++){
      const fx2=M+fw2*f;
      svg.appendChild(r(fx2,M,fw2,H-M*2,{fill:G,'stroke':FR,'stroke-width':'1.2'}));
      if(!fixI.includes(f)){
        svg.appendChild(r(fx2+fw2*.2,M-1,fw2*.25,5,{rx:'1',fill:'#bbb','stroke':FR,'stroke-width':'0.8'}));
        svg.appendChild(r(fx2+fw2*.55,M-1,fw2*.25,5,{rx:'1',fill:'#bbb','stroke':FR,'stroke-width':'0.8'}));
      }
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
  const G=PAL.glass, K=PAL.frame, GLD=PAL.gold;
  function e2(tag,a,t){const el2=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>el2.setAttribute(k,v));if(t!==undefined)el2.textContent=t;return el2;}
  // Fundo branco
  svg.appendChild(e2('rect',{x:0,y:0,width:50,height:50,fill:'#fff'}));
  // Vidro da porta
  svg.appendChild(e2('rect',{x:16,y:4,width:24,height:42,rx:2,fill:G,stroke:K,'stroke-width':'1.5'}));
  if (tipo==='comum') {
    // Dobradiça comum: grampos dourados na borda esquerda
    svg.appendChild(e2('rect',{x:11,y:9,width:7,height:13,rx:2,fill:GLD,stroke:'#5a4000','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14.5,cy:12,r:2,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14.5,cy:17,r:2,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    svg.appendChild(e2('rect',{x:11,y:28,width:7,height:13,rx:2,fill:GLD,stroke:'#5a4000','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14.5,cy:31,r:2,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14.5,cy:36,r:2,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    // Puxador
    svg.appendChild(e2('rect',{x:33,y:17,width:5,height:16,rx:2.5,fill:'#aaa',stroke:'#666','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:35.5,cy:17,r:3,fill:'#aaa',stroke:'#666','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:35.5,cy:33,r:3,fill:'#aaa',stroke:'#666','stroke-width':'0.8'}));
  } else {
    // Dobradiça jumbo: grampos maiores + central
    svg.appendChild(e2('rect',{x:9,y:7,width:10,height:14,rx:2,fill:GLD,stroke:'#5a4000','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14,cy:11,r:2.5,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14,cy:17,r:2.5,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    svg.appendChild(e2('rect',{x:9,y:18,width:10,height:14,rx:2,fill:GLD,stroke:'#5a4000','stroke-width':'0.8'}));
    svg.appendChild(e2('rect',{x:9,y:29,width:10,height:14,rx:2,fill:GLD,stroke:'#5a4000','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14,cy:32,r:2.5,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:14,cy:38,r:2.5,fill:'#fff',stroke:'#2a7a2a','stroke-width':'0.8'}));
    // Puxador robusto
    svg.appendChild(e2('rect',{x:32,y:15,width:6,height:20,rx:3,fill:'#aaa',stroke:'#666','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:35,cy:15,r:3.5,fill:'#aaa',stroke:'#666','stroke-width':'0.8'}));
    svg.appendChild(e2('circle',{cx:35,cy:35,r:3.5,fill:'#aaa',stroke:'#666','stroke-width':'0.8'}));
  }
}
