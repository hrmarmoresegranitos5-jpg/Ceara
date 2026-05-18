// ════════════════════════════════════════════════════════════
// CAD SVG — Estilo Bahia Vidros (fiel ao original)
// ════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';
function el(tag, attrs, txt) {
  const e = document.createElementNS(ns, tag);
  Object.entries(attrs||{}).forEach(([k,v]) => e.setAttribute(k,v));
  if (txt !== undefined) e.textContent = txt;
  return e;
}

// Paleta Bahia Vidros
const PAL = {
  bg:      '#ffffff',
  border1: '#b8ccd8',   // borda externa azul-claro
  border2: '#1a1a1a',   // borda interna preta
  glass:   '#2AC4D8',   // azul ciano vivo
  line:    '#000000',   // linhas pretas
  hw:      '#1a7a1a',   // cor dos furos/hardware (verde)
  hwLine:  '#00aa00',   // linha indicadora verde
  trilho:  '#000000',   // trilho/pivô preto
  lock:    '#ffffff',   // fechadura branca
  lockBd:  '#000000',   // borda fechadura preta
  dim:     '#0044cc',   // cotas azul
  num:     '#000000',   // números dos painéis
};

// ── Utilitários SVG ───────────────────────────────────────────
function addDefs(svg) {
  const defs = el('defs');
  const mk = (id,d) => {
    const m = el('marker',{id,markerWidth:'8',markerHeight:'8',refX:'4',refY:'4',orient:'auto'});
    m.appendChild(el('path',{d,fill:PAL.dim})); return m;
  };
  defs.appendChild(mk('aE','M8,2 L0,4 L8,6 Z'));
  defs.appendChild(mk('aD','M0,2 L8,4 L0,6 Z'));
  svg.appendChild(defs);
}

// Fundo branco + borda dupla estilo Bahia Vidros
function drawBackground(svg, W, H) {
  svg.appendChild(el('rect',{x:0,y:0,width:W,height:H,fill:PAL.bg}));
  svg.appendChild(el('rect',{x:2,y:2,width:W-4,height:H-4,fill:'none',stroke:PAL.border1,'stroke-width':'6',rx:'2'}));
  svg.appendChild(el('rect',{x:8,y:8,width:W-16,height:H-16,fill:'none',stroke:PAL.border2,'stroke-width':'1.5',rx:'1'}));
}

// Painel de vidro (azul ciano sólido)
function panel(svg, x, y, w, h) {
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:PAL.glass}));
  svg.appendChild(el('rect',{x,y,width:w,height:h,fill:'none',stroke:PAL.line,'stroke-width':'2'}));
}

// Número do painel
function panelNum(svg, x, y, w, h, n) {
  svg.appendChild(el('text',{
    x:x+w/2, y:y+h/2+6,
    'text-anchor':'middle','font-size':'16',
    'font-family':'Arial,sans-serif','font-weight':'bold',
    fill:'rgba(0,0,0,0.5)'
  }, String(n)));
}

// Furo no vidro — círculo verde com linha indicadora e label
// (estilo exato da Bahia Vidros: dois círculos, linha diagonal, código)
function furo(svg, cx, cy, label, lx, ly) {
  // Dois círculos concêntricos
  svg.appendChild(el('circle',{cx,cy,r:'5',fill:'none',stroke:PAL.hw,'stroke-width':'1.2'}));
  svg.appendChild(el('circle',{cx,cy,r:'2',fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
  // Linha indicadora + label (como em Bahia Vidros)
  if (label && lx !== undefined) {
    svg.appendChild(el('line',{x1:cx,y1:cy,x2:lx,y2:ly,stroke:PAL.hwLine,'stroke-width':'1'}));
    svg.appendChild(el('text',{x:lx,y:ly-2,'font-size':'6.5','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.hw},label));
  }
}

// Dobradiça (1101/1103) — dois furos empilhados na borda do vidro
// Estilo Bahia Vidros: dois círculos na borda com label e linha diagonal
function dobradica(svg, cx, cy, label, side) {
  const dx = side==='esq' ? -18 : 18;
  const lx = cx + dx, ly = cy - 12;
  // Furo 1 (superior)
  svg.appendChild(el('circle',{cx,cy:cy-5,r:'4',fill:'none',stroke:PAL.hw,'stroke-width':'1.2'}));
  svg.appendChild(el('circle',{cx,cy:cy-5,r:'1.5',fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
  // Furo 2 (inferior)
  svg.appendChild(el('circle',{cx,cy:cy+5,r:'4',fill:'none',stroke:PAL.hw,'stroke-width':'1.2'}));
  svg.appendChild(el('circle',{cx,cy:cy+5,r:'1.5',fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
  // Linha indicadora + código
  svg.appendChild(el('line',{x1:cx,y1:cy,x2:lx,y2:ly,stroke:PAL.hwLine,'stroke-width':'1'}));
  svg.appendChild(el('text',{x:lx+(side==='esq'?-2:2),y:ly-2,'font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':side==='esq'?'end':'start',fill:PAL.hw},label));
}

// Pivô no trilho — barra preta fina (1201/1013)
function pivo(svg, cx, y, len, vert) {
  if (vert) {
    svg.appendChild(el('rect',{x:cx-3,y:y,width:6,height:len,rx:'1',fill:PAL.trilho}));
    svg.appendChild(el('circle',{cx,cy:y+len*0.3,r:'2',fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
    svg.appendChild(el('circle',{cx,cy:y+len*0.7,r:'2',fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
  } else {
    svg.appendChild(el('rect',{x:cx-len/2,y:y-3,width:len,height:6,rx:'1',fill:PAL.trilho}));
  }
}

// Puxador (PX300/12) — dois furos com linha diagonal
// Bahia Vidros mostra como um furo no vidro com linha e código "PX300/12"
function puxador(svg, x, y, h) {
  const py1 = y + h*0.42;
  const py2 = y + h*0.58;
  const lx = x - 22, ly = (py1+py2)/2;
  // Furo 1
  svg.appendChild(el('circle',{cx:x,cy:py1,r:'4',fill:'none',stroke:PAL.hw,'stroke-width':'1.2'}));
  svg.appendChild(el('circle',{cx:x,cy:py1,r:'1.5',fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
  // Furo 2
  svg.appendChild(el('circle',{cx:x,cy:py2,r:'4',fill:'none',stroke:PAL.hw,'stroke-width':'1.2'}));
  svg.appendChild(el('circle',{cx:x,cy:py2,r:'1.5',fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
  // Linha indicadora
  svg.appendChild(el('line',{x1:x,y1:(py1+py2)/2,x2:lx,y2:ly-8,stroke:PAL.hwLine,'stroke-width':'1'}));
  svg.appendChild(el('text',{x:lx-2,y:ly-10,'font-size':'6.5','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':'end',fill:PAL.hw},'PX300'));
}

// Fechadura pivotante (1504A+1520) — retângulo branco na borda
// Bahia Vidros: retângulo branco SAINDO da borda direita do vidro
function fechaduraPiv(svg, x, cy) {
  // Corpo branco da fechadura saindo para fora
  svg.appendChild(el('rect',{x:x,y:cy-8,width:10,height:16,fill:PAL.lock,stroke:PAL.lockBd,'stroke-width':'1.5'}));
  svg.appendChild(el('rect',{x:x+2,y:cy-6,width:6,height:4,fill:'#ccc'}));
  svg.appendChild(el('rect',{x:x+2,y:cy+2,width:6,height:4,fill:'#ccc'}));
  // Furo 1520 no vidro
  svg.appendChild(el('circle',{cx:x-4,cy:cy-6,r:'3',fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
  svg.appendChild(el('circle',{cx:x-4,cy:cy-6,r:'1.2',fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
  // Label
  svg.appendChild(el('text',{x:x+12,y:cy-8,'font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.hw},'1504A'));
  svg.appendChild(el('text',{x:x-10,y:cy+5,'font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold','text-anchor':'end',fill:PAL.hw},'1520'));
}

// Contra-fechadura VV — dois retângulos brancos se encontrando
function contraFechadura(svg, x, cy) {
  svg.appendChild(el('rect',{x:x-10,y:cy-7,width:9,height:14,fill:PAL.lock,stroke:PAL.lockBd,'stroke-width':'1.5'}));
  svg.appendChild(el('rect',{x:x+1,y:cy-7,width:9,height:14,fill:PAL.lock,stroke:PAL.lockBd,'stroke-width':'1.5'}));
}

// Fixador/Batedor (1335) — furo no vidro perto da borda inferior
function fixador(svg, cx, cy) {
  svg.appendChild(el('circle',{cx,cy,r:'5',fill:'none',stroke:PAL.hw,'stroke-width':'1.2'}));
  svg.appendChild(el('circle',{cx,cy,r:'2',fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
  svg.appendChild(el('line',{x1:cx,y1:cy,x2:cx+10,y2:cy-10,stroke:PAL.hwLine,'stroke-width':'1'}));
  svg.appendChild(el('text',{x:cx+12,y:cy-12,'font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.hw},'1335'));
}

// Roldana (1125) — carrinho de correr
function roldana(svg, cx, cy) {
  svg.appendChild(el('rect',{x:cx-5,y:cy-5,width:10,height:7,rx:'1',fill:'#ccc',stroke:PAL.line,'stroke-width':'1'}));
  svg.appendChild(el('circle',{cx,cy:cy-2,r:'2.5',fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
  svg.appendChild(el('text',{x:cx,y:cy+9,'text-anchor':'middle','font-size':'5','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.hw},'1125'));
}

// Trilho superior/inferior
function trilhoH(svg, x, y, w) {
  svg.appendChild(el('rect',{x:x-4,y:y-4,width:w+8,height:5,rx:'1',fill:PAL.trilho}));
}

// Divisória vertical
function divLine(svg, x, y, h) {
  svg.appendChild(el('line',{x1:x,y1:y,x2:x,y2:y+h,stroke:PAL.line,'stroke-width':'3','stroke-linecap':'butt'}));
}

// Cotas
function dimH(svg, x1, x2, y, label) {
  svg.appendChild(el('line',{x1,y1:y-4,x2:x1,y2:y+4,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x2,y1:y-4,x2,y2:y+4,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1,y1:y,x2,y2:y,stroke:PAL.dim,'stroke-width':'1','marker-start':'url(#aE)','marker-end':'url(#aD)'}));
  svg.appendChild(el('text',{x:(+x1+ +x2)/2,y:y+10,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dim},label));
}
function dimV(svg, x, y1, y2, label) {
  svg.appendChild(el('line',{x1:x-4,y1,x2:x+4,y2:y1,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x-4,y1:y2,x2:x+4,y2,stroke:PAL.dim,'stroke-width':'1'}));
  svg.appendChild(el('line',{x1:x,y1,x2:x,y2,stroke:PAL.dim,'stroke-width':'1','marker-start':'url(#aE)','marker-end':'url(#aD)'}));
  const t=el('text',{x:x+10,y:(+y1+ +y2)/2,'text-anchor':'middle','font-size':'9','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dim,transform:`rotate(-90,${x+10},${(+y1+ +y2)/2})`},label);
  svg.appendChild(t);
}

// ── RENDERIZADOR PRINCIPAL ────────────────────────────────────
function renderCAD(svgEl, state) {
  const { tipo, larg, alt, folhas, fixoLarg, bandH, temFixo, temBandeirola,
          pivFolhas, kitPivotante, temMola, accs, janelaFolhas } = state;
  if (!svgEl || !larg || !alt) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const W=320, H=220;
  addDefs(svgEl);
  drawBackground(svgEl, W, H);

  // Margem considerando a borda dupla
  const MARGIN = 24;
  const hasFixo = temFixo && (fixoLarg>0) && tipo==='pivotante';
  const hasBand = temBandeirola && (bandH>0) && tipo==='pivotante';
  const totalW  = hasFixo ? larg+(Number(fixoLarg)||0) : larg;
  const totalH  = hasBand ? alt+(Number(bandH)||0) : alt;

  const maxW = W - MARGIN*2 - 40, maxH = H - MARGIN*2 - 36;
  const scale = Math.min(maxW/totalW, maxH/totalH);
  const pw=Math.round(larg*scale), ph=Math.round(alt*scale);
  const fxW=hasFixo?Math.round((Number(fixoLarg)||0)*scale):0;
  const bdH=hasBand?Math.round((Number(bandH)||0)*scale):0;

  const ox = Math.round((W - (pw+fxW))/2 - 8);
  const oy = Math.round((H - (ph+bdH))/2 - 6);

  const portaX=ox, portaY=oy+bdH, fxX=ox+pw, bandY=oy;
  const isJumbo = kitPivotante==='jumbo';

  // ── PIVOTANTE ──────────────────────────────────────────────
  if (tipo==='pivotante') {
    const nFolhas=Number(pivFolhas)||1;

    // Bandeirola
    if (hasBand) {
      panel(svgEl, portaX, bandY, pw+fxW, bdH);
      panelNum(svgEl, portaX, bandY, pw+fxW, bdH, nFolhas+(hasFixo?1:0)+1);
      svgEl.appendChild(el('line',{x1:portaX,y1:portaY,x2:portaX+pw+fxW,y2:portaY,stroke:PAL.line,'stroke-width':'3'}));
    }

    // Fixo lateral
    if (hasFixo) {
      panel(svgEl, fxX, portaY, fxW, ph);
      panelNum(svgEl, fxX, portaY, fxW, ph, nFolhas+1);
      divLine(svgEl, fxX, portaY, ph);
    }

    // Pivô superior (1201) — barra preta no topo
    pivo(svgEl, portaX+pw*0.15, portaY-8, 12, false);
    svgEl.appendChild(el('text',{x:portaX+pw*0.15,y:portaY-10,'text-anchor':'middle','font-size':'6','font-family':'Arial,sans-serif',fill:'#555'},'1201'));
    // Pivô inferior (1013)
    pivo(svgEl, portaX+pw*0.15, portaY+ph+2, 12, false);
    svgEl.appendChild(el('text',{x:portaX+pw*0.15,y:portaY+ph+16,'text-anchor':'middle','font-size':'6','font-family':'Arial,sans-serif',fill:'#555'},'1013'));

    if (nFolhas===2) {
      const hw=Math.round(pw/2);
      // Folha 1
      panel(svgEl, portaX, portaY, hw, ph);
      panelNum(svgEl, portaX, portaY, hw, ph, 1);
      // Dobradiça esq folha 1 (1101)
      dobradica(svgEl, portaX+8, portaY+ph*0.18, isJumbo?'1101J':'1101', 'dir');
      dobradica(svgEl, portaX+8, portaY+ph*0.82, isJumbo?'1103J':'1103', 'dir');
      if (isJumbo) dobradica(svgEl, portaX+8, portaY+ph*0.5, '1101J', 'dir');
      // Puxador folha 1
      if (accs&&accs.puxador) puxador(svgEl, portaX+hw-8, portaY, ph);
      // Folha 2
      panel(svgEl, portaX+hw, portaY, hw, ph);
      panelNum(svgEl, portaX+hw, portaY, hw, ph, 2);
      dobradica(svgEl, portaX+pw-8, portaY+ph*0.18, isJumbo?'1101J':'1101', 'esq');
      dobradica(svgEl, portaX+pw-8, portaY+ph*0.82, isJumbo?'1103J':'1103', 'esq');
      if (isJumbo) dobradica(svgEl, portaX+pw-8, portaY+ph*0.5, '1101J', 'esq');
      if (accs&&accs.puxador) puxador(svgEl, portaX+hw+8, portaY, ph);
      // Contra-fechadura centro
      contraFechadura(svgEl, portaX+hw, portaY+ph*0.5);
      divLine(svgEl, portaX+hw, portaY, ph);
    } else {
      panel(svgEl, portaX, portaY, pw, ph);
      panelNum(svgEl, portaX, portaY, pw, ph, 1);
      // Dobradiças esquerda
      dobradica(svgEl, portaX+8, portaY+ph*0.15, isJumbo?'1101J':'1101', 'dir');
      dobradica(svgEl, portaX+8, portaY+ph*0.85, isJumbo?'1103J':'1103', 'dir');
      if (isJumbo) dobradica(svgEl, portaX+8, portaY+ph*0.5, '1101J', 'dir');
      // Puxador
      if (accs&&accs.puxador) puxador(svgEl, portaX+pw-8, portaY, ph);
      // Fechadura direita
      fechaduraPiv(svgEl, portaX+pw, portaY+ph*0.5);
    }

    // Fixador
    if (accs&&accs.fixador) fixador(svgEl, portaX+pw-16, portaY+ph-12);

    // Mola
    if (temMola) {
      svgEl.appendChild(el('rect',{x:portaX+pw*.2,y:portaY+ph+3,width:pw*0.6,height:4,rx:'2',fill:'#cc6600',opacity:'0.9'}));
      svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY+ph+14,'text-anchor':'middle','font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold',fill:'#cc6600'},'MOLA'));
    }

    dimH(svgEl, portaX, portaX+pw, portaY+ph+22, larg+' cm');
    if (hasFixo) dimH(svgEl, fxX, fxX+fxW, portaY+ph+22, (fixoLarg||0)+' cm');
    dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, portaY, portaY+ph, alt+' cm');
    if (hasBand) dimV(svgEl, portaX+pw+(hasFixo?fxW:0)+18, bandY, portaY, (bandH||0)+' cm');

  // ── CORRER ─────────────────────────────────────────────────
  } else if (tipo==='correr') {
    const nF=Number(folhas)||2;
    const nM={1:1,2:2,3:2,4:2}[nF]||2, nFx=nF-nM;
    const fixaIdx=nFx===2?[0,nF-1]:nFx===1?[0]:[];
    const fw=Math.round(pw/nF);
    const vpvv=nM<=1?'VP':'VV';
    trilhoH(svgEl, portaX, portaY, pw);
    for (let i=0; i<nF; i++) {
      const fx=portaX+fw*i, isF=fixaIdx.includes(i);
      panel(svgEl, fx, portaY, fw, ph);
      panelNum(svgEl, fx, portaY, fw, ph, i+1);
      if (!isF) {
        roldana(svgEl, fx+fw*0.3, portaY+1);
        roldana(svgEl, fx+fw*0.7, portaY+1);
        if (accs&&accs.puxador) {
          const pxPos = i < nF/2 ? fx+fw-10 : fx+10;
          furo(svgEl, pxPos, portaY+ph*0.5, 'PX', pxPos+(i<nF/2?-14:14), portaY+ph*0.5-10);
        }
      }
      if (i>0) divLine(svgEl, fx, portaY, ph);
    }
    // Fechadura VV
    const mI=nFx===2?nF/2:nFx===1?1:nF/2;
    contraFechadura(svgEl, portaX+fw*mI, portaY+ph*0.5);
    trilhoH(svgEl, portaX, portaY+ph, pw);
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dim},vpvv));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── JANELA ─────────────────────────────────────────────────
  } else if (tipo==='janela') {
    const nFj=janelaFolhas||(larg<=120?2:4);
    const fixaJ=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    const fw2=Math.round(pw/nFj);
    const vpvv2=nFj===2?'VP':'VV';
    for (let i=0; i<nFj; i++) {
      const fx=portaX+fw2*i, isF=fixaJ.includes(i);
      panel(svgEl, fx, portaY, fw2, ph);
      panelNum(svgEl, fx, portaY, fw2, ph, i+1);
      if (!isF) { roldana(svgEl, fx+fw2*0.3, portaY+1); roldana(svgEl, fx+fw2*0.7, portaY+1); }
      if (i>0) divLine(svgEl, fx, portaY, ph);
    }
    const mJi=nFj===4?1:nFj-1;
    contraFechadura(svgEl, portaX+fw2*mJi, portaY+ph*0.5);
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY-10,'text-anchor':'middle','font-size':'8','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.dim},nFj+' folhas · '+vpvv2));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── BOX ────────────────────────────────────────────────────
  } else if (tipo==='box') {
    const hw3=Math.round(pw/2);
    panel(svgEl, portaX, portaY, hw3, ph); panelNum(svgEl, portaX, portaY, hw3, ph, 1);
    roldana(svgEl, portaX+hw3*0.3, portaY+1); roldana(svgEl, portaX+hw3*0.7, portaY+1);
    panel(svgEl, portaX+hw3, portaY, hw3, ph); panelNum(svgEl, portaX+hw3, portaY, hw3, ph, 2);
    roldana(svgEl, portaX+hw3+hw3*0.3, portaY+1); roldana(svgEl, portaX+hw3+hw3*0.7, portaY+1);
    contraFechadura(svgEl, portaX+hw3, portaY+ph*0.5);
    divLine(svgEl, portaX+hw3, portaY, ph);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── ESPELHO ────────────────────────────────────────────────
  } else if (tipo==='espelho') {
    svgEl.appendChild(el('rect',{x:portaX,y:portaY,width:pw,height:ph,fill:'#c8e8f0'}));
    svgEl.appendChild(el('rect',{x:portaX,y:portaY,width:pw,height:ph,fill:'none',stroke:PAL.line,'stroke-width':'2'}));
    svgEl.appendChild(el('line',{x1:portaX+pw*.15,y1:portaY+8,x2:portaX+pw*.05,y2:portaY+ph-8,stroke:'rgba(255,255,255,0.6)','stroke-width':'5','stroke-linecap':'round'}));
    panelNum(svgEl, portaX, portaY, pw, ph, 1);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── BASCULANTE ─────────────────────────────────────────────
  } else if (tipo==='basculante') {
    panel(svgEl, portaX, portaY, pw, ph);
    panelNum(svgEl, portaX, portaY, pw, ph, 1);
    const pcx=portaX+pw/2;
    svgEl.appendChild(el('path',{d:`M${pcx-8},${portaY} Q${pcx},${portaY-12} ${pcx+8},${portaY}`,fill:PAL.trilho}));
    furo(svgEl, portaX+pw*.8, portaY+ph*.75, '1335', portaX+pw*.8+14, portaY+ph*.75-8);
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── GUARDA CORPO ───────────────────────────────────────────
  } else if (tipo==='guarda') {
    panel(svgEl, portaX, portaY, pw, ph);
    const mods=Math.max(1,Math.ceil(larg/120));
    for (let m=1; m<mods; m++) divLine(svgEl, portaX+Math.round((pw/mods)*m), portaY, ph);
    svgEl.appendChild(el('rect',{x:portaX+2,y:portaY+2,width:pw-4,height:8,rx:'2',fill:PAL.line,opacity:'0.7'}));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');

  // ── VIDRO COMUM ────────────────────────────────────────────
  } else {
    panel(svgEl, portaX, portaY, pw, ph);
    const area=(larg/100)*(alt/100);
    svgEl.appendChild(el('text',{x:portaX+pw/2,y:portaY+ph/2+5,'text-anchor':'middle','font-size':'11','font-family':'Arial,sans-serif','font-weight':'bold',fill:'rgba(0,0,0,0.5)'},area.toFixed(2)+' m²'));
    dimH(svgEl, portaX, portaX+pw, portaY+ph+18, larg+' cm');
    dimV(svgEl, portaX+pw+18, portaY, portaY+ph, alt+' cm');
  }
}

// ── Mini-CADs do seletor ──────────────────────────────────────
function renderMiniCAD(svgId, config) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const W=60, H=44, M=5;
  const G=PAL.glass, FR=PAL.line, GD='#b8860b';
  const { tipo, fixo, band, folhas } = config;
  function r(x,y,w,h,a){const e=document.createElementNS(ns,'rect');Object.entries({x,y,width:w,height:h,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function l(x1,y1,x2,y2,a){const e=document.createElementNS(ns,'line');Object.entries({x1,y1,x2,y2,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function c(cx,cy,rv,a){const e=document.createElementNS(ns,'circle');Object.entries({cx,cy,r:rv,...a}).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  // Fundo branco
  svg.appendChild(r(0,0,W,H,{fill:'#fff'}));
  svg.appendChild(r(1,1,W-2,H-2,{fill:'none',stroke:'#b8ccd8','stroke-width':'2',rx:'1'}));
  if (tipo==='pivotante') {
    const fxW=fixo?W*0.27:0, bdH=band?H*0.2:0;
    const nFl=folhas||1, px=M, py=M+bdH, pw=W-M*2-fxW, ph=H-M*2-bdH;
    if (band){svg.appendChild(r(px,M,pw,bdH,{fill:G,'stroke':FR,'stroke-width':'1.2'}));svg.appendChild(l(px,py,px+pw,py,{stroke:FR,'stroke-width':'2'}));}
    if (fixo){svg.appendChild(r(px+pw,py,fxW,ph,{fill:G,'stroke':FR,'stroke-width':'1.2'}));l(px+pw,py,px+pw,py+ph,{stroke:FR,'stroke-width':'2.5'});}
    if (nFl===2){
      const hw=pw/2;
      svg.appendChild(r(px,py,hw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(r(px+hw,py,hw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(l(px+hw,py,px+hw,py+ph,{stroke:FR,'stroke-width':'2.5'}));
      // furos dobradiça
      svg.appendChild(c(px+4,py+ph*.22,2.5,{fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+4,py+ph*.78,2.5,{fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+pw-4,py+ph*.22,2.5,{fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+pw-4,py+ph*.78,2.5,{fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
      svg.appendChild(r(px+hw-5,py+ph/2-5,10,10,{fill:'#fff','stroke':FR,'stroke-width':'1'}));
    } else {
      svg.appendChild(r(px,py,pw,ph,{fill:G,'stroke':FR,'stroke-width':'1.5'}));
      svg.appendChild(c(px+4,py+ph*.2,2.5,{fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
      svg.appendChild(c(px+4,py+ph*.8,2.5,{fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
      svg.appendChild(r(px+pw,py+ph*.44,7,ph*.12,{fill:'#fff','stroke':FR,'stroke-width':'1'}));
    }
  } else if (tipo==='correr') {
    const nF=folhas||2, fw=(W-M*2)/nF;
    const fixaIdx=nF===4?[0,nF-1]:nF===3?[0]:[];
    svg.appendChild(r(M-2,M-2,W-M*2+4,3,{rx:'1',fill:FR}));
    for(let f=0;f<nF;f++){
      const fx=M+fw*f, isF=fixaIdx.includes(f);
      svg.appendChild(r(fx,M,fw,H-M*2,{fill:G,'stroke':FR,'stroke-width':'1.2'}));
      if(!isF){
        svg.appendChild(r(fx+fw*.18,M-1,fw*.25,4,{rx:'1',fill:'#ccc','stroke':FR,'stroke-width':'0.8'}));
        svg.appendChild(r(fx+fw*.57,M-1,fw*.25,4,{rx:'1',fill:'#ccc','stroke':FR,'stroke-width':'0.8'}));
      }
      if(f>0) svg.appendChild(l(fx,M,fx,H-M,{stroke:FR,'stroke-width':'2.5'}));
    }
    svg.appendChild(r(M-2,H-M-1,W-M*2+4,3,{rx:'1',fill:FR}));
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none','stroke':FR,'stroke-width':'1.5'}));
  } else if (tipo==='janela') {
    const nFj=folhas||2, fw2=(W-M*2)/nFj, fixI=nFj===4?[0,nFj-1]:nFj===3?[0]:[0];
    for(let f=0;f<nFj;f++){
      const fx2=M+fw2*f;
      svg.appendChild(r(fx2,M,fw2,H-M*2,{fill:G,'stroke':FR,'stroke-width':'1.2'}));
      if(!fixI.includes(f)){
        svg.appendChild(r(fx2+fw2*.18,M-1,fw2*.25,4,{rx:'1',fill:'#ccc','stroke':FR,'stroke-width':'0.8'}));
        svg.appendChild(r(fx2+fw2*.57,M-1,fw2*.25,4,{rx:'1',fill:'#ccc','stroke':FR,'stroke-width':'0.8'}));
      }
      if(f>0) svg.appendChild(l(fx2,M,fx2,H-M,{stroke:FR,'stroke-width':'2'}));
    }
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none','stroke':FR,'stroke-width':'1.5'}));
  }
}

// ── Mini-desenhos dos kits ────────────────────────────────────
function _renderMiniKitCADs() {
  _drawKitSVG('mkitComum','comum');
  _drawKitSVG('mkitJumbo','jumbo');
}
function _drawKitSVG(svgId, tipo) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const G=PAL.glass, K=PAL.line;
  function e2(tag,a,t){const el2=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>el2.setAttribute(k,v));if(t!==undefined)el2.textContent=t;return el2;}
  // Fundo branco
  svg.appendChild(e2('rect',{x:0,y:0,width:50,height:50,fill:'#fff'}));
  svg.appendChild(e2('rect',{x:1,y:1,width:48,height:48,fill:'none',stroke:'#b8ccd8','stroke-width':'2',rx:'1'}));
  // Vidro
  svg.appendChild(e2('rect',{x:15,y:4,width:26,height:42,rx:1,fill:G,stroke:K,'stroke-width':'1.5'}));
  // Furos de dobradiça (círculos verdes na borda esq)
  const furos = tipo==='jumbo' ? [10,20,30,40] : [13,37];
  furos.forEach(function(fy) {
    svg.appendChild(e2('circle',{cx:17,cy:fy,r:3,fill:'none',stroke:PAL.hw,'stroke-width':'1.2'}));
    svg.appendChild(e2('circle',{cx:17,cy:fy,r:1.2,fill:'none',stroke:PAL.hw,'stroke-width':'0.8'}));
    svg.appendChild(e2('line',{x1:17,y1:fy,x2:10,y2:fy-5,stroke:PAL.hwLine,'stroke-width':'0.8'}));
  });
  // Label
  svg.appendChild(e2('text',{x:25,y:48,'text-anchor':'middle','font-size':'6','font-family':'Arial,sans-serif','font-weight':'bold',fill:PAL.hw},tipo==='jumbo'?'JUMBO':'COMUM'));
  // Puxador: dois furos no vidro lado direito
  svg.appendChild(e2('circle',{cx:37,cy:19,r:2.5,fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
  svg.appendChild(e2('circle',{cx:37,cy:31,r:2.5,fill:'none',stroke:PAL.hw,'stroke-width':'1'}));
  // Fechadura: retângulo branco saindo do lado direito
  svg.appendChild(e2('rect',{x:40,y:22,width:8,height:6,fill:'#fff',stroke:K,'stroke-width':'1'}));
}
