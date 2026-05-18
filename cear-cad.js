// ════════════════════════════════════════════════════════════
// CAD SVG — Fiel ao Bahia Vidros (análise pixel a pixel)
// ════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';
function el(tag, a, txt) {
  const e = document.createElementNS(ns, tag);
  Object.entries(a||{}).forEach(([k,v]) => e.setAttribute(k,v));
  if (txt !== undefined) e.textContent = txt;
  return e;
}

// Bahia Vidros exact colors
const C = {
  bg:    '#ffffff',
  outer: '#aac8d8',   // borda externa azul
  inner: '#1a1a1a',   // borda interna
  glass: '#2AC4D8',   // ciano vivo
  line:  '#000000',   // linhas
  hw:    '#1a7a1a',   // verde dos furos
  hwln:  '#00aa00',   // verde linha indicadora
  bar:   '#111111',   // barras pivô
  lock:  '#ffffff',   // fechadura branca
  lockb: '#111111',   // borda fechadura
  dim:   '#0044cc',   // cotas
  num:   'rgba(0,0,0,0.45)',
};

function addArrows(svg) {
  const d=el('defs');
  const mk=(id,path)=>{const m=el('marker',{id,markerWidth:8,markerHeight:8,refX:4,refY:4,orient:'auto'});m.appendChild(el('path',{d:path,fill:C.dim}));return m;};
  d.appendChild(mk('aL','M8,2 L0,4 L8,6 Z'));
  d.appendChild(mk('aR','M0,2 L8,4 L0,6 Z'));
  svg.appendChild(d);
}

// Fundo + dupla borda estilo Bahia Vidros
function bg(svg, W, H) {
  svg.appendChild(el('rect',{x:0,y:0,width:W,height:H,fill:C.bg}));
  svg.appendChild(el('rect',{x:1,y:1,width:W-2,height:H-2,fill:'none',stroke:C.outer,'stroke-width':'7',rx:'3'}));
  svg.appendChild(el('rect',{x:7,y:7,width:W-14,height:H-14,fill:'none',stroke:C.inner,'stroke-width':'1.5',rx:'1'}));
}

// Painel ciano
function panel(svg, x, y, w, h) {
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:C.glass}));
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:'none',stroke:C.line,'stroke-width':'2'}));
}

// Número centralizado
function num(svg, x, y, w, h, n) {
  svg.appendChild(el('text',{x:x+w/2,y:y+h/2+8,'text-anchor':'middle','font-size':'18','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.num},String(n)));
}

// Furo (círculo duplo com linha + label) — exatamente como Bahia Vidros
// cx, cy = posição no vidro
// lx, ly = onde o label aparece
// label = texto do código
function furo(svg, cx, cy, lx, ly, label) {
  svg.appendChild(el('circle',{cx,cy,r:'4.5',fill:'none',stroke:C.hw,'stroke-width':'1.2'}));
  svg.appendChild(el('circle',{cx,cy,r:'1.8',fill:'none',stroke:C.hw,'stroke-width':'0.8'}));
  if (label) {
    svg.appendChild(el('line',{x1:cx,y1:cy,x2:lx,y2:ly,stroke:C.hwln,'stroke-width':'1'}));
    svg.appendChild(el('text',{x:lx,y:ly-2,'font-size':'7','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.hw},label));
  }
}

// Dobradiça (1101/1103) = 2 furos empilhados no canto do vidro
// ex = borda X do vidro, ey = posição Y, side = 'esq'|'dir'
function dob(svg, ex, ey, label, side, jumbo) {
  const cx = side==='esq' ? ex+9 : ex-9;
  const gap = jumbo ? 9 : 7;
  const lx = side==='esq' ? ex-30 : ex+12;
  const ly = ey - 12;
  furo(svg, cx, ey-gap/2, lx, ly, label);
  furo(svg, cx, ey+gap/2, null, null, null);
  // Linha vai do ponto médio
  svg.appendChild(el('line',{x1:cx,y1:ey,x2:lx,y2:ly,stroke:C.hwln,'stroke-width':'1'}));
  svg.appendChild(el('text',{x:lx+(side==='esq'?-2:2),y:ly-2,'font-size':'7','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':side==='esq'?'end':'start',fill:C.hw},label));
}

// Barra pivô (1201 topo / 1013 base)
function barPivo(svg, cx, y, label, above) {
  svg.appendChild(el('rect',{x:cx-8,y:y+(above?-6:0),width:16,height:5,rx:'1',fill:C.bar}));
  svg.appendChild(el('circle',{cx:cx-5,cy:y+(above?-3:2),r:'2',fill:'none',stroke:C.hwln,'stroke-width':'0.8'}));
  svg.appendChild(el('circle',{cx:cx+2,cy:y+(above?-3:2),r:'2',fill:'none',stroke:C.hwln,'stroke-width':'0.8'}));
  svg.appendChild(el('text',{x:cx,y:y+(above?-9:12),'text-anchor':'middle','font-size':'6.5','font-family':'Arial,sans-serif',fill:'#555'},label));
}

// Fechadura 1504A = retângulo branco saindo pela borda direita + barra preta ao lado
function fechadura1504(svg, ex, cy) {
  // Retângulo branco saindo do vidro
  svg.appendChild(el('rect',{x:ex,y:cy-9,width:10,height:18,fill:C.lock,stroke:C.lockb,'stroke-width':'1.5'}));
  // Barra preta ao lado
  svg.appendChild(el('rect',{x:ex+9,y:cy-12,width:4,height:24,fill:C.lockb}));
  // Label
  svg.appendChild(el('text',{x:ex+14,y:cy-10,'font-size':'7','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.hw},'1504A'));
}

// Puxador PX300 = furo com linha diagonal longa para label
function pxFuro(svg, cx, cy, label, side) {
  const lx = side==='esq' ? cx-30 : cx+30;
  const ly = cy - 28;
  furo(svg, cx, cy, null, null, null);
  svg.appendChild(el('line',{x1:cx,y1:cy,x2:lx,y2:ly,stroke:C.hwln,'stroke-width':'1'}));
  svg.appendChild(el('text',{x:lx+(side==='esq'?-2:2),y:ly-2,'font-size':'7','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':side==='esq'?'end':'start',fill:C.hw},label));
}

// 1520 = furo com label curto
function furo1520(svg, cx, cy) {
  furo(svg, cx, cy, cx, cy-14, '1520');
}

// Roldana (trilho correr) 1125
function roldana(svg, cx, cy) {
  svg.appendChild(el('rect',{x:cx-5,y:cy-4,width:10,height:5,rx:'1',fill:'#d0d0d0',stroke:C.line,'stroke-width':'0.8'}));
  svg.appendChild(el('circle',{cx,cy:cy-1,r:'2',fill:'none',stroke:C.hw,'stroke-width':'0.8'}));
}

// Trilho horizontal
function trilho(svg, x, y, w) {
  svg.appendChild(el('rect',{x:x-3,y:y-2,width:w+6,height:4,rx:'1',fill:C.bar}));
}

// Divisória
function div(svg, x, y, h) {
  svg.appendChild(el('line',{x1:x,y1:y,x2:x,y2:y+h,stroke:C.line,'stroke-width':'3.5'}));
}

// Cotas
function dimH(svg, x1, x2, y, label) {
  svg.appendChild(el('line',{x1,y1:y-4,x2:x1,y2:y+4,stroke:C.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x2,y1:y-4,x2,y2:y+4,stroke:C.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1,y1:y,x2,y2:y,stroke:C.dim,'stroke-width':'1.2','marker-start':'url(#aL)','marker-end':'url(#aR)'}));
  svg.appendChild(el('text',{x:(+x1+ +x2)/2,y:y+11,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.dim},label));
}
function dimV(svg, x, y1, y2, label) {
  svg.appendChild(el('line',{x1:x-4,y1,x2:x+4,y2:y1,stroke:C.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x-4,y1:y2,x2:x+4,y2,stroke:C.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x,y1,x2:x,y2,stroke:C.dim,'stroke-width':'1.2','marker-start':'url(#aL)','marker-end':'url(#aR)'}));
  const t=el('text',{x:x+11,y:(+y1+ +y2)/2,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.dim,transform:`rotate(-90,${x+11},${(+y1+ +y2)/2})`},label);
  svg.appendChild(t);
}

// ── RENDERIZADOR PRINCIPAL ────────────────────────────────────
function renderCAD(svgEl, state) {
  const { tipo, larg, alt, folhas, fixoLarg, bandH, temFixo, temBandeirola,
          pivFolhas, kitPivotante, temMola, accs, janelaFolhas } = state;
  if (!svgEl || !larg || !alt) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const W=320, H=220;
  addArrows(svgEl);
  bg(svgEl, W, H);

  // Calcular escala e posição
  const MH=22, MV=20; // margem
  const hasFixo = temFixo && fixoLarg>0 && tipo==='pivotante';
  const hasBand = temBandeirola && bandH>0 && tipo==='pivotante';
  const tW = hasFixo ? larg+(Number(fixoLarg)||0) : larg;
  const tH = hasBand ? alt+(Number(bandH)||0) : alt;

  const sc = Math.min((W-MH*2-50)/tW, (H-MV*2-40)/tH);
  const pw=Math.round(larg*sc), ph=Math.round(alt*sc);
  const fxW=hasFixo?Math.round((Number(fixoLarg)||0)*sc):0;
  const bdH=hasBand?Math.round((Number(bandH)||0)*sc):0;

  // Centraliza considerando espaço para hardware fora do vidro
  const totalDrawW = pw + fxW + 30; // 30 = espaço para fechadura à direita
  const ox = Math.round((W - totalDrawW)/2 + 5);
  const oy = Math.round((H - (ph+bdH))/2 - 4);

  const pX=ox, pY=oy+bdH, fX=ox+pw, bY=oy;
  const isJ = kitPivotante==='jumbo';

  // ── PIVOTANTE ──────────────────────────────────────────────
  if (tipo==='pivotante') {
    const nF = Number(pivFolhas)||1;

    // Bandeirola (fixo superior)
    if (hasBand) {
      panel(svgEl, pX, bY, pw+fxW, bdH);
      num(svgEl, pX, bY, pw+fxW, bdH, nF+(hasFixo?1:0)+1);
      svgEl.appendChild(el('line',{x1:pX,y1:pY,x2:pX+pw+fxW,y2:pY,stroke:C.line,'stroke-width':'3'}));
    }

    // Fixo lateral
    if (hasFixo) {
      panel(svgEl, fX, pY, fxW, ph);
      num(svgEl, fX, pY, fxW, ph, nF+1);
      div(svgEl, fX, pY, ph);
    }

    // Barra pivô superior (1201)
    barPivo(svgEl, pX + pw*0.15, pY, '1201', true);
    // Barra pivô inferior (1013)
    barPivo(svgEl, pX + pw*0.15, pY+ph, '1013', false);

    if (nF===2) {
      const hw=Math.round(pw/2);
      // Folha 1
      panel(svgEl, pX, pY, hw, ph);
      num(svgEl, pX, pY, hw, ph, 1);
      // 1101 no topo-esq
      dob(svgEl, pX, pY+ph*0.12, isJ?'1101J':'1101', 'dir', isJ);
      // 1103 no base-esq
      dob(svgEl, pX, pY+ph*0.88, isJ?'1103J':'1103', 'dir', isJ);
      if (accs&&accs.puxador) {
        pxFuro(svgEl, pX+hw-12, pY+ph*0.43, 'PX300', 'esq');
        furo1520(svgEl, pX+hw-8, pY+ph*0.52);
      }
      // Folha 2
      panel(svgEl, pX+hw, pY, hw, ph);
      num(svgEl, pX+hw, pY, hw, ph, 2);
      dob(svgEl, pX+pw, pY+ph*0.12, isJ?'1101J':'1101', 'esq', isJ);
      dob(svgEl, pX+pw, pY+ph*0.88, isJ?'1103J':'1103', 'esq', isJ);
      if (accs&&accs.puxador) {
        pxFuro(svgEl, pX+hw+12, pY+ph*0.43, 'PX300', 'dir');
        furo1520(svgEl, pX+hw+8, pY+ph*0.52);
      }
      // Contra-fechadura centro
      svgEl.appendChild(el('rect',{x:pX+hw-6,y:pY+ph/2-9,width:12,height:18,fill:C.lock,stroke:C.lockb,'stroke-width':'1.5'}));
      div(svgEl, pX+hw, pY, ph);
    } else {
      panel(svgEl, pX, pY, pw, ph);
      num(svgEl, pX, pY, pw, ph, 1);
      // 1101 topo-esquerda (dentro do vidro, próximo à borda)
      dob(svgEl, pX, pY+ph*0.1, isJ?'1101J':'1101', 'dir', isJ);
      // 1103 base-esquerda
      dob(svgEl, pX, pY+ph*0.9, isJ?'1103J':'1103', 'dir', isJ);
      // Puxador PX300 (se selecionado)
      if (accs&&accs.puxador) {
        pxFuro(svgEl, pX+pw-18, pY+ph*0.42, 'PX300', 'esq');
        furo1520(svgEl, pX+pw-12, pY+ph*0.51);
      }
      // Fechadura 1504A
      fechadura1504(svgEl, pX+pw, pY+ph*0.48);
      // 1335 (fixador)
      if (accs&&accs.fixador) {
        furo(svgEl, pX+pw-14, pY+ph*0.92, pX+pw+8, pY+ph*0.92-10, '1335');
      }
    }

    // Mola
    if (temMola) {
      svgEl.appendChild(el('rect',{x:pX+pw*.2,y:pY+ph+4,width:pw*.6,height:4,rx:'2',fill:'#cc6600'}));
      svgEl.appendChild(el('text',{x:pX+pw/2,y:pY+ph+15,'text-anchor':'middle','font-size':'6.5','font-family':'Arial,sans-serif','font-weight':'bold',fill:'#cc6600'},'MOLA'));
    }

    // Cotas
    const cY = pY+ph+22;
    dimH(svgEl, pX, pX+pw, cY, larg+' cm');
    if (hasFixo) dimH(svgEl, fX, fX+fxW, cY, (fixoLarg||0)+' cm');
    dimV(svgEl, pX+pw+(hasFixo?fxW:0)+28, pY, pY+ph, alt+' cm');
    if (hasBand) dimV(svgEl, pX+pw+(hasFixo?fxW:0)+28, bY, pY, (bandH||0)+' cm');

  // ── CORRER ─────────────────────────────────────────────────
  } else if (tipo==='correr') {
    const nF=Number(folhas)||2;
    const nM={1:1,2:2,3:2,4:2}[nF]||2, nFx=nF-nM;
    const fixaIdx = nFx===2?[0,nF-1]:nFx===1?[0]:[];
    const fw=Math.round(pw/nF);
    const vpvv=nM<=1?'VP':'VV';
    trilho(svgEl, pX, pY, pw);
    for (let i=0; i<nF; i++) {
      const fx=pX+fw*i, isF=fixaIdx.includes(i);
      panel(svgEl, fx, pY, fw, ph);
      num(svgEl, fx, pY, fw, ph, i+1);
      if (!isF) {
        roldana(svgEl, fx+fw*.28, pY+1);
        roldana(svgEl, fx+fw*.72, pY+1);
        if (accs&&accs.puxador) furo(svgEl, i<nF/2?fx+fw-12:fx+12, pY+ph*.5, null, null, null);
      }
      if (i>0) div(svgEl, fx, pY, ph);
    }
    const mI=nFx===2?nF/2:nFx===1?1:nF/2;
    svgEl.appendChild(el('rect',{x:pX+fw*mI-7,y:pY+ph/2-9,width:14,height:18,fill:C.lock,stroke:C.lockb,'stroke-width':'1.5'}));
    trilho(svgEl, pX, pY+ph, pw);
    svgEl.appendChild(el('text',{x:pX+pw/2,y:pY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.dim},vpvv));
    dimH(svgEl, pX, pX+pw, pY+ph+18, larg+' cm');
    dimV(svgEl, pX+pw+22, pY, pY+ph, alt+' cm');

  // ── JANELA ─────────────────────────────────────────────────
  } else if (tipo==='janela') {
    const nFj=janelaFolhas||(larg<=120?2:4);
    const fixaJ=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    const fw2=Math.round(pw/nFj), vpvv2=nFj===2?'VP':'VV';
    for (let i=0; i<nFj; i++) {
      const fx=pX+fw2*i, isF=fixaJ.includes(i);
      panel(svgEl, fx, pY, fw2, ph);
      num(svgEl, fx, pY, fw2, ph, i+1);
      if (!isF) { roldana(svgEl, fx+fw2*.3, pY+1); roldana(svgEl, fx+fw2*.7, pY+1); }
      if (i>0) div(svgEl, fx, pY, ph);
    }
    svgEl.appendChild(el('text',{x:pX+pw/2,y:pY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.dim},nFj+' folhas · '+vpvv2));
    dimH(svgEl, pX, pX+pw, pY+ph+18, larg+' cm');
    dimV(svgEl, pX+pw+22, pY, pY+ph, alt+' cm');

  } else {
    // Demais tipos: painel simples
    panel(svgEl, pX, pY, pw, ph);
    num(svgEl, pX, pY, pw, ph, 1);
    if (tipo==='basculante') {
      const pcx=pX+pw/2;
      svgEl.appendChild(el('path',{d:`M${pcx-8},${pY} Q${pcx},${pY-12} ${pcx+8},${pY}`,fill:C.bar}));
    } else if (tipo==='box') {
      const hw3=Math.round(pw/2);
      div(svgEl, pX+hw3, pY, ph);
      svgEl.appendChild(el('rect',{x:pX+hw3-6,y:pY+ph/2-9,width:12,height:18,fill:C.lock,stroke:C.lockb,'stroke-width':'1.5'}));
      roldana(svgEl, pX+hw3*.4, pY+1); roldana(svgEl, pX+hw3*.8, pY+1);
      roldana(svgEl, pX+hw3+hw3*.2, pY+1); roldana(svgEl, pX+hw3+hw3*.6, pY+1);
      panel(svgEl, pX, pY, hw3, ph); num(svgEl, pX, pY, hw3, ph, 2);
    } else if (tipo==='espelho') {
      svgEl.appendChild(el('line',{x1:pX+pw*.12,y1:pY+6,x2:pX+pw*.03,y2:pY+ph-6,stroke:'rgba(255,255,255,0.55)','stroke-width':'5','stroke-linecap':'round'}));
    } else if (tipo==='guarda') {
      const mods=Math.max(1,Math.ceil(larg/120));
      for (let m=1;m<mods;m++) div(svgEl, pX+Math.round((pw/mods)*m), pY, ph);
      svgEl.appendChild(el('rect',{x:pX+2,y:pY+2,width:pw-4,height:8,rx:'2',fill:C.bar,opacity:'0.7'}));
    } else {
      const a=(larg/100)*(alt/100);
      svgEl.appendChild(el('text',{x:pX+pw/2,y:pY+ph/2+5,'text-anchor':'middle','font-size':'11','font-family':'Arial,sans-serif','font-weight':'bold',fill:C.num},a.toFixed(2)+' m²'));
    }
    dimH(svgEl, pX, pX+pw, pY+ph+18, larg+' cm');
    dimV(svgEl, pX+pw+22, pY, pY+ph, alt+' cm');
  }
}

// ── Mini-CADs ─────────────────────────────────────────────────
function renderMiniCAD(svgId, config) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const W=60, H=44, M=5;
  const { tipo, fixo, band, folhas } = config;
  function r(x,y,w,h,a){const e=document.createElementNS(ns,'rect');Object.entries({x,y,width:w,height:h,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function l(x1,y1,x2,y2,a){const e=document.createElementNS(ns,'line');Object.entries({x1,y1,x2,y2,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function c(cx,cy,rv,a){const e=document.createElementNS(ns,'circle');Object.entries({cx,cy,r:rv,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  svg.appendChild(r(0,0,W,H,{fill:'#fff'}));
  svg.appendChild(r(1,1,W-2,H-2,{fill:'none',stroke:'#aac8d8','stroke-width':'2.5',rx:'1'}));
  if (tipo==='pivotante') {
    const fxW=fixo?W*.28:0, bdH=band?H*.2:0;
    const nFl=folhas||1, px=M, py=M+bdH, pw=W-M*2-fxW, ph=H-M*2-bdH;
    if (band){svg.appendChild(r(px,M,pw,bdH,{fill:C.glass,stroke:C.line,'stroke-width':'1.2'}));svg.appendChild(l(px,py,px+pw,py,{stroke:C.line,'stroke-width':'2'}));}
    if (fixo){svg.appendChild(r(px+pw,py,fxW,ph,{fill:C.glass,stroke:C.line,'stroke-width':'1.2'}));svg.appendChild(l(px+pw,py,px+pw,py+ph,{stroke:C.line,'stroke-width':'2.5'}));}
    if (nFl===2){
      const hw=pw/2;
      svg.appendChild(r(px,py,hw,ph,{fill:C.glass,stroke:C.line,'stroke-width':'1.5'}));
      svg.appendChild(r(px+hw,py,hw,ph,{fill:C.glass,stroke:C.line,'stroke-width':'1.5'}));
      svg.appendChild(l(px+hw,py,px+hw,py+ph,{stroke:C.line,'stroke-width':'2.5'}));
      svg.appendChild(c(px+4,py+ph*.12,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+4,py+ph*.18,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+pw-4,py+ph*.12,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+pw-4,py+ph*.18,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(r(px+hw-5,py+ph*.44,10,12,{fill:'#fff',stroke:C.line,'stroke-width':'1'}));
    } else {
      svg.appendChild(r(px,py,pw,ph,{fill:C.glass,stroke:C.line,'stroke-width':'1.5'}));
      svg.appendChild(c(px+4,py+ph*.1,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+4,py+ph*.17,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+4,py+ph*.83,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+4,py+ph*.9,2.5,{fill:'none',stroke:C.hw,'stroke-width':'1'}));
      svg.appendChild(r(px+pw,py+ph*.44,7,ph*.12,{fill:'#fff',stroke:C.line,'stroke-width':'1'}));
    }
  } else if (tipo==='correr') {
    const nF=folhas||2, fw=(W-M*2)/nF, fixaIdx=nF===4?[0,nF-1]:nF===3?[0]:[];
    svg.appendChild(r(M-2,M-2,W-M*2+4,3,{rx:'1',fill:C.bar}));
    for(let f=0;f<nF;f++){
      const fx=M+fw*f, isF=fixaIdx.includes(f);
      svg.appendChild(r(fx,M,fw,H-M*2,{fill:C.glass,stroke:C.line,'stroke-width':'1.2'}));
      if(!isF){svg.appendChild(r(fx+fw*.2,M-1,fw*.22,4,{rx:'1',fill:'#ccc',stroke:C.line,'stroke-width':'0.8'}));svg.appendChild(r(fx+fw*.58,M-1,fw*.22,4,{rx:'1',fill:'#ccc',stroke:C.line,'stroke-width':'0.8'}));}
      if(f>0) svg.appendChild(l(fx,M,fx,H-M,{stroke:C.line,'stroke-width':'2.5'}));
    }
    svg.appendChild(r(M-2,H-M-1,W-M*2+4,3,{rx:'1',fill:C.bar}));
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none',stroke:C.line,'stroke-width':'1.5'}));
  } else if (tipo==='janela') {
    const nFj=folhas||2, fw2=(W-M*2)/nFj, fixI=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    for(let f=0;f<nFj;f++){
      const fx2=M+fw2*f;
      svg.appendChild(r(fx2,M,fw2,H-M*2,{fill:C.glass,stroke:C.line,'stroke-width':'1.2'}));
      if(!fixI.includes(f)){svg.appendChild(r(fx2+fw2*.2,M-1,fw2*.22,4,{rx:'1',fill:'#ccc',stroke:C.line,'stroke-width':'0.8'}));svg.appendChild(r(fx2+fw2*.58,M-1,fw2*.22,4,{rx:'1',fill:'#ccc',stroke:C.line,'stroke-width':'0.8'}));}
      if(f>0) svg.appendChild(l(fx2,M,fx2,H-M,{stroke:C.line,'stroke-width':'2'}));
    }
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none',stroke:C.line,'stroke-width':'1.5'}));
  }
}

// ── Mini-kits ─────────────────────────────────────────────────
function _renderMiniKitCADs() { _drawKitSVG('mkitComum','comum'); _drawKitSVG('mkitJumbo','jumbo'); }
function _drawKitSVG(svgId, tipo) {
  const svg = document.getElementById(svgId); if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  function e2(tag,a,t){const el2=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>el2.setAttribute(k,v));if(t!==undefined)el2.textContent=t;return el2;}
  svg.appendChild(e2('rect',{x:0,y:0,width:50,height:50,fill:'#fff'}));
  svg.appendChild(e2('rect',{x:1,y:1,width:48,height:48,fill:'none',stroke:'#aac8d8','stroke-width':'2',rx:'1'}));
  // Vidro
  svg.appendChild(e2('rect',{x:14,y:4,width:27,height:42,rx:1,fill:C.glass,stroke:C.line,'stroke-width':'1.5'}));
  // Furos de dobradiça: tipo=comum→2 furos, jumbo→4 furos
  const yPos = tipo==='jumbo' ? [9,14,30,36] : [11,17,34,40];
  yPos.forEach(function(fy) {
    svg.appendChild(e2('circle',{cx:17,cy:fy,r:2.5,fill:'none',stroke:C.hw,'stroke-width':'1'}));
    svg.appendChild(e2('circle',{cx:17,cy:fy,r:1,fill:'none',stroke:C.hw,'stroke-width':'0.8'}));
  });
  // Linha indicadora
  svg.appendChild(e2('line',{x1:17,y1:12,x2:10,y2:6,stroke:C.hwln,'stroke-width':'0.8'}));
  svg.appendChild(e2('text',{x:9,y:5,'font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':'end',fill:C.hw},tipo==='jumbo'?'1101J':'1101'));
  // Fechadura
  svg.appendChild(e2('rect',{x:40,y:21,width:8,height:8,fill:'#fff',stroke:C.line,'stroke-width':'1'}));
  // Furo puxador
  svg.appendChild(e2('circle',{cx:35,cy:22,r:2,fill:'none',stroke:C.hw,'stroke-width':'0.8'}));
  svg.appendChild(e2('circle',{cx:35,cy:28,r:2,fill:'none',stroke:C.hw,'stroke-width':'0.8'}));
}
