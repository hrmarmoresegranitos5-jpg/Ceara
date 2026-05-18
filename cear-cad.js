// ════════════════════════════════════════════════════════════
// CAD — Estilo Bahia Vidros: painel ciano + furos verdes + labels
// ════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';
function E(tag, a, txt) {
  const e = document.createElementNS(ns, tag);
  Object.entries(a||{}).forEach(([k,v]) => e.setAttribute(k,v));
  if (txt !== undefined) e.textContent = txt;
  return e;
}

function renderCAD(svgEl, state) {
  const { tipo, larg, alt, folhas, fixoLarg, bandH, temFixo, temBandeirola,
          pivFolhas, kitPivotante, temMola, accs, janelaFolhas } = state;
  if (!svgEl || !larg || !alt) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const W=320, H=220;

  // ── Fundo: branco com dupla borda (azul + preta) ──
  svgEl.appendChild(E('rect',{x:0,y:0,width:W,height:H,fill:'#fff'}));
  svgEl.appendChild(E('rect',{x:1,y:1,width:W-2,height:H-2,fill:'none',stroke:'#aac8d8','stroke-width':'7',rx:'3'}));
  svgEl.appendChild(E('rect',{x:7,y:7,width:W-14,height:H-14,fill:'none',stroke:'#111','stroke-width':'1.2',rx:'1'}));

  // ── Escala ──
  const hasFixo = temFixo && fixoLarg>0 && tipo==='pivotante';
  const hasBand = temBandeirola && bandH>0 && tipo==='pivotante';
  const tW = larg + (hasFixo?(Number(fixoLarg)||0):0);
  const tH = alt  + (hasBand?(Number(bandH)||0):0);

  // Reserva espaço: esquerda p/ labels (35px), direita p/ 1504A+label (50px)
  const avW = W - 55, avH = H - 48;
  const sc = Math.min(avW/tW, avH/tH);

  const pw = Math.round(larg*sc);
  const ph = Math.round(alt*sc);
  const fxW = hasFixo ? Math.round((Number(fixoLarg)||0)*sc) : 0;
  const bdH = hasBand ? Math.round((Number(bandH)||0)*sc) : 0;

  // Posição: ocupa a parte central-esquerda (espaço direito para 1504A)
  const ox = Math.round((W - tW*sc - 40) / 2 + 18);
  const oy = Math.round((H - tH*sc) / 2 - 2);
  const pX=ox, pY=oy+bdH, fX=ox+pw, bY=oy;

  // ── Helpers locais ──
  const gl='#2AC4D8', bl='#000', gn='#1a7a1a', gnl='#00aa00', wh='#fff', dm='#0044cc';

  function glass(x,y,w,h) {
    svgEl.appendChild(E('rect',{x,y,width:w,height:h,fill:gl}));
    svgEl.appendChild(E('rect',{x,y,width:w,height:h,fill:'none',stroke:bl,'stroke-width':'2'}));
  }
  function label(x,y,txt,anchor) {
    svgEl.appendChild(E('text',{x,y,'font-size':'7.5','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':anchor||'start',fill:gn},txt));
  }
  // Furo = 2 círculos concêntricos
  function hole(cx,cy) {
    svgEl.appendChild(E('circle',{cx,cy,r:'4',fill:'none',stroke:gn,'stroke-width':'1.2'}));
    svgEl.appendChild(E('circle',{cx,cy,r:'1.5',fill:'none',stroke:gn,'stroke-width':'0.8'}));
  }
  // Furo + linha + label
  function holeLabel(cx,cy, lx,ly, txt, anchor) {
    hole(cx,cy);
    svgEl.appendChild(E('line',{x1:cx,y1:cy,x2:lx,y2:ly,stroke:gnl,'stroke-width':'1'}));
    label(lx+(anchor==='end'?-2:2), ly-1, txt, anchor);
  }
  // Barra pivô (1201/1013) com dois furos
  function bar(cx,y) {
    svgEl.appendChild(E('rect',{x:cx-9,y,width:18,height:5,rx:'1',fill:bl}));
    svgEl.appendChild(E('circle',{cx:cx-4,cy:y+2.5,r:'1.8',fill:'none',stroke:gnl,'stroke-width':'0.8'}));
    svgEl.appendChild(E('circle',{cx:cx+4,cy:y+2.5,r:'1.8',fill:'none',stroke:gnl,'stroke-width':'0.8'}));
  }
  // Número do painel
  function panelN(x,y,w,h,n) {
    svgEl.appendChild(E('text',{x:x+w/2,y:y+h/2+7,'text-anchor':'middle','font-size':'17','font-family':'Arial,sans-serif','font-weight':'bold',fill:'rgba(0,0,0,0.4)'},String(n)));
  }
  // Cotas
  function cotaH(x1,x2,y,lbl) {
    svgEl.appendChild(E('line',{x1,y1:y-3,x2:x1,y2:y+3,stroke:dm,'stroke-width':'1'}));
    svgEl.appendChild(E('line',{x1:x2,y1:y-3,x2,y2:y+3,stroke:dm,'stroke-width':'1'}));
    svgEl.appendChild(E('line',{x1,y1:y,x2,y2:y,stroke:dm,'stroke-width':'1.2','marker-start':'url(#aL)','marker-end':'url(#aR)'}));
    svgEl.appendChild(E('text',{x:(+x1+ +x2)/2,y:y+11,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:dm},lbl));
  }
  function cotaV(x,y1,y2,lbl) {
    svgEl.appendChild(E('line',{x1:x-3,y1,x2:x+3,y2:y1,stroke:dm,'stroke-width':'1'}));
    svgEl.appendChild(E('line',{x1:x-3,y1:y2,x2:x+3,y2,stroke:dm,'stroke-width':'1'}));
    svgEl.appendChild(E('line',{x1:x,y1,x2:x,y2,stroke:dm,'stroke-width':'1.2','marker-start':'url(#aL)','marker-end':'url(#aR)'}));
    const t=E('text',{x:x+10,y:(+y1+ +y2)/2,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:dm,transform:`rotate(-90,${x+10},${(+y1+ +y2)/2})`},lbl);
    svgEl.appendChild(t);
  }
  // Setas para cotas
  const defs=E('defs');
  const mL=E('marker',{id:'aL',markerWidth:7,markerHeight:7,refX:3.5,refY:3.5,orient:'auto'});
  mL.appendChild(E('path',{d:'M7,1.5 L0,3.5 L7,5.5 Z',fill:dm})); defs.appendChild(mL);
  const mR=E('marker',{id:'aR',markerWidth:7,markerHeight:7,refX:3.5,refY:3.5,orient:'auto'});
  mR.appendChild(E('path',{d:'M0,1.5 L7,3.5 L0,5.5 Z',fill:dm})); defs.appendChild(mR);
  svgEl.appendChild(defs);

  // ════════════════════════════════════════════════════════
  // PIVOTANTE
  // ════════════════════════════════════════════════════════
  if (tipo==='pivotante') {
    const nF = Number(pivFolhas)||1;
    const isJ = kitPivotante==='jumbo';
    const lbl1 = isJ ? '1101J' : '1101';
    const lbl3 = isJ ? '1103J' : '1103';

    // Bandeirola (fixo superior)
    if (hasBand) {
      glass(pX, bY, pw+fxW, bdH);
      panelN(pX, bY, pw+fxW, bdH, nF+(hasFixo?1:0)+1);
      svgEl.appendChild(E('line',{x1:pX,y1:pY,x2:pX+pw+fxW,y2:pY,stroke:bl,'stroke-width':'3'}));
    }

    // Fixo lateral
    if (hasFixo) {
      glass(fX, pY, fxW, ph);
      panelN(fX, pY, fxW, ph, nF+1);
      svgEl.appendChild(E('line',{x1:fX,y1:pY,x2:fX,y2:pY+ph,stroke:bl,'stroke-width':'3.5'}));
    }

    if (nF===2) {
      // ── 2 folhas pivotante ──
      const hw = Math.round(pw/2);
      glass(pX, pY, hw, ph); panelN(pX, pY, hw, ph, 1);
      glass(pX+hw, pY, hw, ph); panelN(pX+hw, pY, hw, ph, 2);
      svgEl.appendChild(E('line',{x1:pX+hw,y1:pY,x2:pX+hw,y2:pY+ph,stroke:bl,'stroke-width':'3.5'}));

      // Barras pivô
      bar(pX+hw*0.12, pY-5); svgEl.appendChild(E('text',{x:pX+hw*0.12,y:pY-8,'text-anchor':'middle','font-size':'6','font-family':'Arial,sans-serif',fill:'#555'},'1201'));
      bar(pX+hw*0.12, pY+ph); svgEl.appendChild(E('text',{x:pX+hw*0.12,y:pY+ph+12,'text-anchor':'middle','font-size':'6','font-family':'Arial,sans-serif',fill:'#555'},'1013'));
      bar(pX+pw-hw*0.12, pY-5);
      bar(pX+pw-hw*0.12, pY+ph);

      // 1101 folha 1 (topo-esq)
      holeLabel(pX+7, pY+ph*0.08, pX+7, pY+ph*0.08-18, lbl1, 'middle');
      hole(pX+7, pY+ph*0.08+8);
      // 1103 folha 1 (base-esq)
      holeLabel(pX+7, pY+ph*0.92, pX+7, pY+ph*0.92-10, lbl3, 'middle');
      hole(pX+7, pY+ph*0.92+8);
      if (isJ) { hole(pX+7, pY+ph*0.5); hole(pX+7, pY+ph*0.5+8); }

      // 1101 folha 2 (topo-dir)
      holeLabel(pX+pw-7, pY+ph*0.08, pX+pw-7, pY+ph*0.08-18, lbl1, 'middle');
      hole(pX+pw-7, pY+ph*0.08+8);
      // 1103 folha 2 (base-dir)
      holeLabel(pX+pw-7, pY+ph*0.92, pX+pw-7, pY+ph*0.92-10, lbl3, 'middle');
      hole(pX+pw-7, pY+ph*0.92+8);
      if (isJ) { hole(pX+pw-7, pY+ph*0.5); hole(pX+pw-7, pY+ph*0.5+8); }

      // Contra-fechadura no centro
      svgEl.appendChild(E('rect',{x:pX+hw-5,y:pY+ph/2-8,width:10,height:16,fill:wh,stroke:bl,'stroke-width':'1.5'}));
      svgEl.appendChild(E('text',{x:pX+hw,y:pY+ph/2-10,'text-anchor':'middle','font-size':'6.5','font-family':'Arial,sans-serif',fill:gn},'1520'));

      // Puxador (se selecionado)
      if (accs&&accs.puxador) {
        holeLabel(pX+hw*0.7, pY+ph*0.43, pX+hw*0.7-24, pY+ph*0.43-22, 'PX300', 'end');
        hole(pX+hw*0.7, pY+ph*0.57);
        holeLabel(pX+hw+hw*0.3, pY+ph*0.43, pX+hw+hw*0.3+24, pY+ph*0.43-22, 'PX300', 'start');
        hole(pX+hw+hw*0.3, pY+ph*0.57);
      }

    } else {
      // ── 1 folha pivotante ──
      glass(pX, pY, pw, ph); panelN(pX, pY, pw, ph, 1);

      // Barra pivô 1201 (topo)
      bar(pX+pw*0.13, pY-5);
      svgEl.appendChild(E('text',{x:pX+pw*0.13,y:pY-8,'text-anchor':'middle','font-size':'6.5','font-family':'Arial,sans-serif',fill:'#555'},'1201'));
      // Barra pivô 1013 (base)
      bar(pX+pw*0.13, pY+ph);
      svgEl.appendChild(E('text',{x:pX+pw*0.13,y:pY+ph+13,'text-anchor':'middle','font-size':'6.5','font-family':'Arial,sans-serif',fill:'#555'},'1013'));

      // 1101 — 2 furos no topo-esquerda
      holeLabel(pX+6, pY+ph*0.07,  pX+28, pY+ph*0.07-2, lbl1, 'start');
      hole(pX+6, pY+ph*0.07+9);

      // 1103 — 2 furos na base-esquerda
      holeLabel(pX+6, pY+ph*0.9,   pX+28, pY+ph*0.9+4, lbl3, 'start');
      hole(pX+6, pY+ph*0.9+9);

      // Jumbo: furo central extra
      if (isJ) {
        holeLabel(pX+6, pY+ph*0.48, pX+28, pY+ph*0.48-2, lbl1, 'start');
        hole(pX+6, pY+ph*0.48+9);
      }

      // Puxador PX300 (se selecionado) — furo no centro-direita
      if (accs&&accs.puxador) {
        holeLabel(pX+pw*0.78, pY+ph*0.43, pX+pw*0.78-30, pY+ph*0.43-26, 'PX300/12', 'end');
        hole(pX+pw*0.78, pY+ph*0.54);
      }

      // 1520 + 1504A — fechadura na borda direita
      hole(pX+pw-8, pY+ph*0.50);
      svgEl.appendChild(E('text',{x:pX+pw-10,y:pY+ph*0.50-7,'text-anchor':'end','font-size':'6.5','font-family':'Arial,sans-serif',fill:gn},'1520'));
      // Retângulo branco 1504A saindo pela direita
      svgEl.appendChild(E('rect',{x:pX+pw,y:pY+ph*0.47,width:9,height:16,fill:wh,stroke:bl,'stroke-width':'1.5'}));
      svgEl.appendChild(E('rect',{x:pX+pw+8,y:pY+ph*0.44,width:3,height:22,fill:bl}));
      svgEl.appendChild(E('text',{x:pX+pw+12,y:pY+ph*0.47-2,'font-size':'6.5','font-family':'Arial,sans-serif',fill:gn},'1504A'));

      // 1335 fixador (se selecionado)
      if (accs&&accs.fixador) {
        holeLabel(pX+pw*0.85, pY+ph*0.93, pX+pw*0.85+14, pY+ph*0.93-10, '1335', 'start');
      }

      // Mola
      if (temMola) {
        svgEl.appendChild(E('rect',{x:pX+pw*0.2,y:pY+ph+4,width:pw*0.6,height:4,rx:'2',fill:'#cc6600'}));
        svgEl.appendChild(E('text',{x:pX+pw/2,y:pY+ph+16,'text-anchor':'middle','font-size':'6.5','font-family':'Arial,sans-serif','font-weight':'bold',fill:'#cc6600'},'MOLA'));
      }
    }

    // Cotas
    cotaH(pX, pX+pw, pY+ph+24, larg+' cm');
    if (hasFixo) cotaH(fX, fX+fxW, pY+ph+24, (fixoLarg||0)+' cm');
    cotaV(pX+pw+(hasFixo?fxW:0)+30, pY, pY+ph, alt+' cm');
    if (hasBand) cotaV(pX+pw+(hasFixo?fxW:0)+30, bY, pY, (bandH||0)+' cm');

  // ════════════════════════════════════════════════════════
  // CORRER
  // ════════════════════════════════════════════════════════
  } else if (tipo==='correr') {
    const nF=Number(folhas)||2;
    const nM={1:1,2:2,3:2,4:2}[nF]||2, nFx=nF-nM;
    const fixaIdx=nFx===2?[0,nF-1]:nFx===1?[0]:[];
    const fw=Math.round(pw/nF), vpvv=nM<=1?'VP':'VV';

    // Trilho
    svgEl.appendChild(E('rect',{x:pX-3,y:pY-4,width:pw+6,height:4,rx:'1',fill:bl}));
    svgEl.appendChild(E('rect',{x:pX-3,y:pY+ph,width:pw+6,height:4,rx:'1',fill:bl}));

    for (let i=0; i<nF; i++) {
      const fx=pX+fw*i, isF=fixaIdx.includes(i);
      glass(fx, pY, fw, ph);
      panelN(fx, pY, fw, ph, i+1);
      if (!isF) {
        // Roldanas no topo
        svgEl.appendChild(E('rect',{x:fx+fw*.2,y:pY-3,width:fw*.22,height:5,rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.8'}));
        svgEl.appendChild(E('circle',{cx:fx+fw*.31,cy:pY-1,r:'1.8',fill:'none',stroke:gn,'stroke-width':'0.8'}));
        svgEl.appendChild(E('rect',{x:fx+fw*.58,y:pY-3,width:fw*.22,height:5,rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.8'}));
        svgEl.appendChild(E('circle',{cx:fx+fw*.69,cy:pY-1,r:'1.8',fill:'none',stroke:gn,'stroke-width':'0.8'}));
        if (accs&&accs.puxador) hole(i<nF/2?fx+fw-12:fx+12, pY+ph*.5);
      }
      if (i>0) svgEl.appendChild(E('line',{x1:fx,y1:pY,x2:fx,y2:pY+ph,stroke:bl,'stroke-width':'3.5'}));
    }
    // Fechadura VV
    const mI=nFx===2?nF/2:nFx===1?1:nF/2;
    svgEl.appendChild(E('rect',{x:pX+fw*mI-6,y:pY+ph*.44,width:12,height:18,fill:wh,stroke:bl,'stroke-width':'1.5'}));
    svgEl.appendChild(E('text',{x:pX+pw/2,y:pY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:dm},vpvv));
    cotaH(pX, pX+pw, pY+ph+18, larg+' cm');
    cotaV(pX+pw+22, pY, pY+ph, alt+' cm');

  // ════════════════════════════════════════════════════════
  // JANELA
  // ════════════════════════════════════════════════════════
  } else if (tipo==='janela') {
    const nFj=janelaFolhas||(larg<=120?2:4);
    const fixaJ=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    const fw2=Math.round(pw/nFj), vpvv2=nFj===2?'VP':'VV';
    for (let i=0; i<nFj; i++) {
      const fx=pX+fw2*i, isF=fixaJ.includes(i);
      glass(fx, pY, fw2, ph); panelN(fx, pY, fw2, ph, i+1);
      if (!isF) {
        svgEl.appendChild(E('rect',{x:fx+fw2*.2,y:pY-3,width:fw2*.22,height:5,rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.8'}));
        svgEl.appendChild(E('rect',{x:fx+fw2*.58,y:pY-3,width:fw2*.22,height:5,rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.8'}));
      }
      if (i>0) svgEl.appendChild(E('line',{x1:fx,y1:pY,x2:fx,y2:pY+ph,stroke:bl,'stroke-width':'3.5'}));
    }
    svgEl.appendChild(E('text',{x:pX+pw/2,y:pY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:dm},nFj+' folhas · '+vpvv2));
    cotaH(pX, pX+pw, pY+ph+18, larg+' cm');
    cotaV(pX+pw+22, pY, pY+ph, alt+' cm');

  // ════════════════════════════════════════════════════════
  // DEMAIS TIPOS
  // ════════════════════════════════════════════════════════
  } else {
    glass(pX, pY, pw, ph); panelN(pX, pY, pw, ph, 1);
    if (tipo==='box') {
      const hw3=Math.round(pw/2);
      svgEl.appendChild(E('line',{x1:pX+hw3,y1:pY,x2:pX+hw3,y2:pY+ph,stroke:bl,'stroke-width':'3.5'}));
      panelN(pX, pY, hw3, ph, 1); panelN(pX+hw3, pY, hw3, ph, 2);
    } else if (tipo==='espelho') {
      svgEl.appendChild(E('line',{x1:pX+pw*.12,y1:pY+6,x2:pX+pw*.03,y2:pY+ph-6,stroke:'rgba(255,255,255,0.5)','stroke-width':'5','stroke-linecap':'round'}));
    } else if (tipo==='basculante') {
      const pcx=pX+pw/2;
      svgEl.appendChild(E('path',{d:`M${pcx-8},${pY} Q${pcx},${pY-11} ${pcx+8},${pY}`,fill:bl}));
    } else if (tipo==='guarda') {
      const m=Math.max(1,Math.ceil(larg/120));
      for (let i=1;i<m;i++) svgEl.appendChild(E('line',{x1:pX+Math.round(pw/m*i),y1:pY,x2:pX+Math.round(pw/m*i),y2:pY+ph,stroke:bl,'stroke-width':'3.5'}));
      svgEl.appendChild(E('rect',{x:pX+2,y:pY+2,width:pw-4,height:8,rx:'2',fill:bl,opacity:'0.7'}));
    } else {
      svgEl.appendChild(E('text',{x:pX+pw/2,y:pY+ph/2+5,'text-anchor':'middle','font-size':'11','font-family':'Arial,sans-serif','font-weight':'bold',fill:'rgba(0,0,0,0.4)'},((larg/100)*(alt/100)).toFixed(2)+' m²'));
    }
    cotaH(pX, pX+pw, pY+ph+18, larg+' cm');
    cotaV(pX+pw+22, pY, pY+ph, alt+' cm');
  }
}

// ── Mini-CADs seletor configuração ────────────────────────────
function renderMiniCAD(svgId, config) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const W=60, H=44, M=5;
  const { tipo, fixo, band, folhas } = config;
  const gl='#2AC4D8', bl='#000', gn='#1a7a1a';
  function R(x,y,w,h,a){const e=document.createElementNS(ns,'rect');Object.entries({x,y,width:w,height:h,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function L(x1,y1,x2,y2,a){const e=document.createElementNS(ns,'line');Object.entries({x1,y1,x2,y2,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function C(cx,cy,r,a){const e=document.createElementNS(ns,'circle');Object.entries({cx,cy,r,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  svg.appendChild(R(0,0,W,H,{fill:'#fff'}));
  svg.appendChild(R(1,1,W-2,H-2,{fill:'none',stroke:'#aac8d8','stroke-width':'2.5',rx:'1'}));
  if (tipo==='pivotante') {
    const fxW=fixo?W*.27:0, bdH=band?H*.2:0;
    const nFl=folhas||1, px=M, py=M+bdH, pw=W-M*2-fxW, ph=H-M*2-bdH;
    if (band){svg.appendChild(R(px,M,pw,bdH,{fill:gl,stroke:bl,'stroke-width':'1.2'}));svg.appendChild(L(px,py,px+pw,py,{stroke:bl,'stroke-width':'2'}));}
    if (fixo){svg.appendChild(R(px+pw,py,fxW,ph,{fill:gl,stroke:bl,'stroke-width':'1.2'}));svg.appendChild(L(px+pw,py,px+pw,py+ph,{stroke:bl,'stroke-width':'2.5'}));}
    if (nFl===2) {
      const hw=pw/2;
      svg.appendChild(R(px,py,hw,ph,{fill:gl,stroke:bl,'stroke-width':'1.5'}));
      svg.appendChild(R(px+hw,py,hw,ph,{fill:gl,stroke:bl,'stroke-width':'1.5'}));
      svg.appendChild(L(px+hw,py,px+hw,py+ph,{stroke:bl,'stroke-width':'2.5'}));
      [px+3,px+pw-3].forEach(x=>{
        svg.appendChild(C(x,py+ph*.1,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
        svg.appendChild(C(x,py+ph*.17,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
        svg.appendChild(C(x,py+ph*.83,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
        svg.appendChild(C(x,py+ph*.9,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
      });
      svg.appendChild(R(px+hw-4,py+ph*.44,8,ph*.12,{fill:'#fff',stroke:bl,'stroke-width':'1'}));
    } else {
      svg.appendChild(R(px,py,pw,ph,{fill:gl,stroke:bl,'stroke-width':'1.5'}));
      svg.appendChild(C(px+3,py+ph*.1,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
      svg.appendChild(C(px+3,py+ph*.17,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
      svg.appendChild(C(px+3,py+ph*.83,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
      svg.appendChild(C(px+3,py+ph*.9,2.2,{fill:'none',stroke:gn,'stroke-width':'1'}));
      svg.appendChild(R(px+pw,py+ph*.43,7,ph*.14,{fill:'#fff',stroke:bl,'stroke-width':'1'}));
    }
  } else if (tipo==='correr') {
    const nF=folhas||2, fw=(W-M*2)/nF, fxI=nF===4?[0,nF-1]:nF===3?[0]:[];
    svg.appendChild(R(M-2,M-2,W-M*2+4,3,{rx:'1',fill:bl}));
    for(let f=0;f<nF;f++){
      const fx=M+fw*f, isF=fxI.includes(f);
      svg.appendChild(R(fx,M,fw,H-M*2,{fill:gl,stroke:bl,'stroke-width':'1.2'}));
      if(!isF){svg.appendChild(R(fx+fw*.2,M-1,fw*.22,4,{rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.7'}));svg.appendChild(R(fx+fw*.58,M-1,fw*.22,4,{rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.7'}));}
      if(f>0) svg.appendChild(L(fx,M,fx,H-M,{stroke:bl,'stroke-width':'2.5'}));
    }
    svg.appendChild(R(M-2,H-M-1,W-M*2+4,3,{rx:'1',fill:bl}));
    svg.appendChild(R(M,M,W-M*2,H-M*2,{fill:'none',stroke:bl,'stroke-width':'1.5'}));
  } else if (tipo==='janela') {
    const nFj=folhas||2, fw2=(W-M*2)/nFj, fxI2=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    for(let f=0;f<nFj;f++){
      const fx2=M+fw2*f;
      svg.appendChild(R(fx2,M,fw2,H-M*2,{fill:gl,stroke:bl,'stroke-width':'1.2'}));
      if(!fxI2.includes(f)){svg.appendChild(R(fx2+fw2*.2,M-1,fw2*.22,4,{rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.7'}));svg.appendChild(R(fx2+fw2*.58,M-1,fw2*.22,4,{rx:'1',fill:'#ccc',stroke:bl,'stroke-width':'0.7'}));}
      if(f>0) svg.appendChild(L(fx2,M,fx2,H-M,{stroke:bl,'stroke-width':'2'}));
    }
    svg.appendChild(R(M,M,W-M*2,H-M*2,{fill:'none',stroke:bl,'stroke-width':'1.5'}));
  }
}

// ── Mini kits ─────────────────────────────────────────────────
function _renderMiniKitCADs() { _drawKitSVG('mkitComum','comum'); _drawKitSVG('mkitJumbo','jumbo'); }
function _drawKitSVG(id, tipo) {
  const s=document.getElementById(id); if(!s) return;
  while(s.firstChild) s.removeChild(s.firstChild);
  const gn='#1a7a1a', gnl='#00aa00', gl='#2AC4D8', bl='#000';
  function e(tag,a,t){const el2=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>el2.setAttribute(k,v));if(t!==undefined)el2.textContent=t;return el2;}
  s.appendChild(e('rect',{x:0,y:0,width:50,height:50,fill:'#fff'}));
  s.appendChild(e('rect',{x:1,y:1,width:48,height:48,fill:'none',stroke:'#aac8d8','stroke-width':'2',rx:'1'}));
  s.appendChild(e('rect',{x:14,y:4,width:25,height:42,rx:1,fill:gl,stroke:bl,'stroke-width':'1.5'}));
  // Furos: comum=2+2, jumbo=2+2+2 (com central)
  const sets = tipo==='jumbo' ? [[10,17],[25,32],[34,41]] : [[10,17],[34,41]];
  sets.forEach(([y1,y2],i)=>{
    s.appendChild(e('circle',{cx:17,cy:y1,r:2.5,fill:'none',stroke:gn,'stroke-width':'1'}));
    s.appendChild(e('circle',{cx:17,cy:y1,r:1,fill:'none',stroke:gn,'stroke-width':'0.7'}));
    s.appendChild(e('circle',{cx:17,cy:y2,r:2.5,fill:'none',stroke:gn,'stroke-width':'1'}));
    s.appendChild(e('circle',{cx:17,cy:y2,r:1,fill:'none',stroke:gn,'stroke-width':'0.7'}));
    if(i===0){s.appendChild(e('line',{x1:17,y1:y1,x2:9,y2:y1-6,stroke:gnl,'stroke-width':'0.8'}));s.appendChild(e('text',{x:8,y:y1-7,'font-size':'5.5','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':'end',fill:gn},tipo==='jumbo'?'1101J':'1101'));}
    if(i===sets.length-1){s.appendChild(e('line',{x1:17,y1:y2,x2:9,y2:y2+6,stroke:gnl,'stroke-width':'0.8'}));s.appendChild(e('text',{x:8,y:y2+8,'font-size':'5.5','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':'end',fill:gn},tipo==='jumbo'?'1103J':'1103'));}
  });
  s.appendChild(e('rect',{x:38,y:21,width:8,height:8,fill:'#fff',stroke:bl,'stroke-width':'1'}));
  s.appendChild(e('rect',{x:45,y:19,width:3,height:12,fill:bl}));
  s.appendChild(e('circle',{cx:34,cy:22,r:2,fill:'none',stroke:gn,'stroke-width':'0.8'}));
  s.appendChild(e('circle',{cx:34,cy:28,r:2,fill:'none',stroke:gn,'stroke-width':'0.8'}));
}
