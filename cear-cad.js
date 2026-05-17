// ════════════════════════════════════════════════════════════
// CAD SVG — Desenhos técnicos das configurações
// ════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const e = document.createElementNS(ns, tag);
  Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, v));
  return e;
}
function svgRect(x,y,w,h,a)  { return svgEl('rect',  {x,y,width:w,height:h,...a}); }
function svgLine(x1,y1,x2,y2,a){ return svgEl('line', {x1,y1,x2,y2,...a}); }
function svgTxt(x,y,t,a)     { const e=svgEl('text',{x,y,...a}); e.textContent=t; return e; }
function svgPath(d,a)         { return svgEl('path', {d,...a}); }

const C = {
  glass: 'rgba(100,200,255,0.13)',
  glassDark: 'rgba(60,140,200,0.08)',
  frame: 'rgba(100,200,255,0.55)',
  frameFixed: 'rgba(100,200,255,0.28)',
  fixed: 'rgba(80,160,220,0.07)',
  hatch: 'rgba(100,200,255,0.2)',
  dim: 'rgba(100,180,255,0.4)',
  arrow: 'rgba(100,200,255,0.7)',
  label: 'rgba(150,220,255,0.9)',
  labelSm: 'rgba(120,190,240,0.65)',
  gold: 'rgba(212,175,55,0.75)',
  pivot: 'rgba(255,200,80,0.55)',
  arc: 'rgba(255,200,80,0.2)',
};

// ── Dimensionamento e cotas ───────────────────────────────────
function addDefs(svg, gId) {
  const defs = svgEl('defs', {});
  const mkArr = (id, d) => {
    const m = svgEl('marker', {id, markerWidth:6, markerHeight:6, refX:3, refY:3, orient:'auto'});
    m.appendChild(svgEl('path', {d, fill:C.arrow}));
    return m;
  };
  defs.appendChild(mkArr('arr',  'M0,1 L6,3 L0,5 Z'));
  defs.appendChild(mkArr('arrR', 'M6,1 L0,3 L6,5 Z'));
  // Hatch pattern para vidros fixos
  const pat = svgEl('pattern', {id:'hatch', width:'6', height:'6', patternUnits:'userSpaceOnUse', patternTransform:'rotate(45)'});
  pat.appendChild(svgEl('line', {x1:'0',y1:'0',x2:'0',y2:'6', stroke:'rgba(100,200,255,0.18)', 'stroke-width':'1.5'}));
  defs.appendChild(pat);
  // Gradient
  const lg = svgEl('linearGradient', {id:gId, x1:'0', y1:'0', x2:'1', y2:'1'});
  lg.appendChild(svgEl('stop', {offset:'0%',   'stop-color':'rgba(255,255,255,0.1)'}));
  lg.appendChild(svgEl('stop', {offset:'100%', 'stop-color':'rgba(100,200,255,0.04)'}));
  defs.appendChild(lg);
  svg.appendChild(defs);
}

function addDimH(svg, x1, x2, y, label) {
  svg.appendChild(svgLine(x1, y-4, x1, y+4, {stroke:C.dim,'stroke-width':'0.8'}));
  svg.appendChild(svgLine(x2, y-4, x2, y+4, {stroke:C.dim,'stroke-width':'0.8'}));
  svg.appendChild(svgLine(x1, y, x2, y, {stroke:C.arrow,'stroke-width':'1.2','marker-start':'url(#arrR)','marker-end':'url(#arr)'}));
  svg.appendChild(svgTxt((x1+x2)/2, y+9, label, {'text-anchor':'middle','font-size':'9','font-family':'Outfit,sans-serif','font-weight':'700', fill:C.label}));
}
function addDimV(svg, x, y1, y2, label) {
  svg.appendChild(svgLine(x-4, y1, x+4, y1, {stroke:C.dim,'stroke-width':'0.8'}));
  svg.appendChild(svgLine(x-4, y2, x+4, y2, {stroke:C.dim,'stroke-width':'0.8'}));
  svg.appendChild(svgLine(x, y1, x, y2, {stroke:C.arrow,'stroke-width':'1.2','marker-start':'url(#arrR)','marker-end':'url(#arr)'}));
  svg.appendChild(svgTxt(x+9, (y1+y2)/2, label, {'text-anchor':'middle','font-size':'9','font-family':'Outfit,sans-serif','font-weight':'700', fill:C.label, transform:`rotate(-90,${x+9},${(y1+y2)/2})`}));
}
function addCorners(svg, ox, oy, pw, ph) {
  const cm=8, s=C.frame, w='1.2';
  [[ox,oy,1,1],[ox+pw,oy,-1,1],[ox,oy+ph,1,-1],[ox+pw,oy+ph,-1,-1]].forEach(([x,y,dx,dy])=>{
    svg.appendChild(svgLine(x,y,x+cm*dx,y,{stroke:s,'stroke-width':w}));
    svg.appendChild(svgLine(x,y,x,y+cm*dy,{stroke:s,'stroke-width':w}));
  });
}

// Preenche vidro móvel (azul claro)
function drawGlass(svg, x, y, w, h, gId) {
  svg.appendChild(svgRect(x, y, w, h, {fill:C.glass, rx:'2'}));
  svg.appendChild(svgRect(x, y, w, h, {fill:`url(#${gId})`, rx:'2'}));
}
// Preenche vidro fixo (hachura)
function drawFixed(svg, x, y, w, h) {
  svg.appendChild(svgRect(x, y, w, h, {fill:C.fixed, rx:'2'}));
  svg.appendChild(svgRect(x, y, w, h, {fill:'url(#hatch)', rx:'2'}));
  svg.appendChild(svgRect(x, y, w, h, {fill:'none', stroke:C.frameFixed, 'stroke-width':'1.5', rx:'2', 'stroke-dasharray':'4,2'}));
  // Label FIXO
  svg.appendChild(svgTxt(x+w/2, y+h/2+3, 'FIXO', {'text-anchor':'middle','font-size':'6','font-family':'Outfit,sans-serif','font-weight':'700', fill:'rgba(100,200,255,0.4)', 'letter-spacing':'0.08em'}));
}
// Puxador
function drawPuxador(svg, px, y1, y2) {
  svg.appendChild(svgLine(px, y1, px, y2, {stroke:C.gold,'stroke-width':'3','stroke-linecap':'round'}));
}
// Arco de abertura pivotante
function drawArc(svg, pvX, oy, pw, ph, side) {
  const r = pw * (side === 'right' ? 0.88 : 0.88);
  const x0 = side === 'right' ? pvX : pvX + pw;
  const sweep = side === 'right' ? 1 : 0;
  const ex = side === 'right' ? pvX + pw : pvX;
  const ey = oy + ph * 0.6;
  svg.appendChild(svgPath(`M${x0},${oy+ph} A${r},${r} 0 0,${sweep} ${ex},${ey}`, {fill:'none', stroke:C.arc, 'stroke-width':'1.5', 'stroke-dasharray':'4,3'}));
  svg.appendChild(svgLine(pvX, oy+ph-2, pvX, oy+2, {stroke:C.pivot,'stroke-width':'2.5'}));
}

// ── RENDERIZADOR PRINCIPAL ────────────────────────────────────
function renderCAD(svgEl, state) {
  const { tipo, larg, alt, folhas, fixoLarg, fixoLado, bandH, temFixo, temBandeirola, pivFolhas, kitPivotante, accs } = state;
  const _accs = accs || {};
  if (!svgEl || !larg || !alt || isNaN(larg) || isNaN(alt)) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const W=320, H=220, gId='cadGrad';
  addDefs(svgEl, gId);

  const MARGIN=28;
  const hasFixo = temFixo && fixoLarg > 0 && (tipo === 'pivotante' || tipo === 'basculante' || tipo === 'guarda');
  const hasBand = temBandeirola && bandH > 0 && (tipo === 'pivotante');
  const totalW  = hasFixo ? (larg + (Number(fixoLarg)||0)) : larg;
  const totalH  = hasBand ? (alt  + (Number(bandH)||0))   : alt;

  const maxW = W - MARGIN*2 - 36, maxH = H - MARGIN*2 - 32;
  const scale = Math.min(maxW/totalW, maxH/totalH);
  const totalPW = totalW * scale, totalPH = totalH * scale;
  const ox0 = (W - totalPW) / 2 - 12, oy = (H - totalPH) / 2 - 8;

  // Largura/posição da porta
  const pw = larg * scale;
  const ph = alt * scale;
  const fxW = hasFixo ? (Number(fixoLarg)||0)*scale : 0;
  const bdH = hasBand ? (Number(bandH)||0)*scale    : 0;

  // Fixo lateral fica à ESQUERDA ou DIREITA
  const fxSide = fixoLado || 'direita';
  const ox = (fxSide === 'esquerda' && hasFixo) ? ox0 + fxW : ox0;
  const fxX = (fxSide === 'esquerda') ? ox0 : ox + pw;

  // Bandeirola fica em CIMA
  const bandY = oy;           // topo da bandeirola
  const portaY = oy + bdH;    // topo da porta (abaixo da bandeirola)

  // ── Desenhar de acordo com o tipo ──────────────────────────
  if (tipo === 'pivotante') {
    // Bandeirola
    if (hasBand) {
      drawFixed(svgEl, ox, bandY, pw, bdH);
      svgEl.appendChild(svgRect(ox, bandY, pw, bdH, {fill:'none', stroke:C.frame, 'stroke-width':'2', rx:'2'}));
    }
    // Fixo lateral
    if (hasFixo) {
      drawFixed(svgEl, fxX, portaY, fxW, ph);
      svgEl.appendChild(svgRect(fxX, portaY, fxW, ph, {fill:'none', stroke:C.frame, 'stroke-width':'2', rx:'2'}));
    }
    // Porta
    const nPiv = Number(pivFolhas)||1;
    if (nPiv === 2) {
      const hw = pw/2;
      // Folha esquerda
      drawGlass(svgEl, ox, portaY, hw, ph, gId);
      svgEl.appendChild(svgRect(ox, portaY, hw, ph, {fill:'none',stroke:C.frame,'stroke-width':'2',rx:'2'}));
      drawArc(svgEl, ox, portaY, hw, ph, 'right');
      if (_accs.puxador) drawPuxador(svgEl, ox+hw-5, portaY+ph*0.3, portaY+ph*0.7);
      // Folha direita
      drawGlass(svgEl, ox+hw, portaY, hw, ph, gId);
      svgEl.appendChild(svgRect(ox+hw, portaY, hw, ph, {fill:'none',stroke:C.frame,'stroke-width':'2',rx:'2'}));
      drawArc(svgEl, ox+hw, portaY, hw, ph, 'left');
      if (_accs.puxador) drawPuxador(svgEl, ox+hw+5, portaY+ph*0.3, portaY+ph*0.7);
    } else {
      drawGlass(svgEl, ox, portaY, pw, ph, gId);
      svgEl.appendChild(svgRect(ox, portaY, pw, ph, {fill:'none',stroke:C.frame,'stroke-width':'2',rx:'2'}));
      drawArc(svgEl, ox, portaY, pw, ph, 'right');
      // Puxador — só se selecionado
      if (_accs.puxador) {
        drawPuxador(svgEl, ox+pw-8, portaY+ph*0.35, portaY+ph*0.65);
      }
      // Fixador — ponto no chão do lado oposto ao pivô
      if (_accs.fixador) {
        svgEl.appendChild(svgEl2('circle',{cx:ox+pw-5,cy:portaY+ph-5,r:'4',fill:'rgba(255,200,80,0.35)',stroke:'rgba(255,200,80,0.7)','stroke-width':'1.5'}));
        svgEl.appendChild(svgTxt(ox+pw-5, portaY+ph-14, 'FIX', {'text-anchor':'middle','font-size':'5','font-family':'Outfit,sans-serif','font-weight':'700',fill:'rgba(255,200,80,0.7)'}));
      }
      // Mola hidráulica — barra dourada no piso
      if (state.temMola) {
        svgEl.appendChild(svgEl2('rect',{x:ox+pw/2-12,y:portaY+ph-5,width:24,height:4,rx:'2',fill:'rgba(255,200,80,0.4)',stroke:'rgba(255,200,80,0.6)','stroke-width':'1.2'}));
        svgEl.appendChild(svgTxt(ox+pw/2, portaY+ph-8, 'MOLA', {'text-anchor':'middle','font-size':'5','font-family':'Outfit,sans-serif','font-weight':'700',fill:'rgba(255,200,80,0.8)'}));
      }
    }
    // Cota largura porta
    addDimH(svgEl, ox, ox+pw, portaY+ph+16, `${larg} cm`);
    if (hasFixo) addDimH(svgEl, fxX, fxX+fxW, portaY+ph+16, `${fixoLarg} cm`);
    if (hasBand) addDimV(svgEl, ox+pw+20, bandY, bandY+bdH, `${bandH} cm`);
    addDimV(svgEl, ox+pw+20, portaY, portaY+ph, `${alt} cm`);

  } else if (tipo === 'correr') {
    const nF = Number(folhas)||2;
    const nM = CORRER_MOVEIS[nF]??2;
    const nFx2 = nF - nM;
    const fw = pw/nF;
    const fixaIdx2 = nFx2>0 ? [0, nF-1] : [];
    // Trilho
    svgEl.appendChild(svgLine(ox, oy-3, ox+pw, oy-3, {stroke:C.frame,'stroke-width':'3','stroke-linecap':'round'}));
    svgEl.appendChild(svgLine(ox, oy+ph+3, ox+pw, oy+ph+3, {stroke:'rgba(100,200,255,0.3)','stroke-width':'2','stroke-linecap':'round'}));
    for (let f=0; f<nF; f++) {
      const fx2=ox+fw*f, cx=fx2+fw/2;
      const isF = fixaIdx2.includes(f);
      if (isF) {
        drawFixed(svgEl, fx2+1, oy+1, fw-2, ph-2);
      } else {
        drawGlass(svgEl, fx2+1, oy+1, fw-2, ph-2, gId);
        svgEl.appendChild(svgLine(cx-6,oy+ph/2,cx+6,oy+ph/2,{stroke:C.arrow,'stroke-width':'1.5','stroke-linecap':'round'}));
        svgEl.appendChild(svgPath(`M${cx-6},${oy+ph/2} L${cx-2},${oy+ph/2-3} L${cx-2},${oy+ph/2+3} Z`,{fill:C.arrow}));
        svgEl.appendChild(svgPath(`M${cx+6},${oy+ph/2} L${cx+2},${oy+ph/2-3} L${cx+2},${oy+ph/2+3} Z`,{fill:C.arrow}));
        const phx = fixaIdx2.includes(f+1)?fx2+4:fx2+fw-4;
        drawPuxador(svgEl, phx, oy+ph*0.32, oy+ph*0.68);
      }
      if (f>0) svgEl.appendChild(svgLine(fx2,oy+2,fx2,oy+ph-2,{stroke:'rgba(100,200,255,0.35)','stroke-width':'1','stroke-dasharray':'3,2'}));
    }
    // Tipo VP/VV
    const vpvv = nM<=1?'VP':'VV';
    svgEl.appendChild(svgTxt(ox+pw/2,oy-8,vpvv,{'text-anchor':'middle','font-size':'8','font-family':'Outfit,sans-serif','font-weight':'800',fill:'rgba(255,200,80,0.8)'}));
    addDimH(svgEl, ox, ox+pw, oy+ph+16, `${larg} cm`);
    addDimV(svgEl, ox+pw+20, oy, oy+ph, `${alt} cm`);

  } else if (tipo === 'janela') {
    const nFj = larg<=120?2:4;
    const vjvv = nFj===2?'VP':'VV';
    // Moldura
    svgEl.appendChild(svgRect(ox, oy, pw, ph, {fill:C.glass,rx:'3'}));
    svgEl.appendChild(svgRect(ox, oy, pw, ph, {fill:`url(#${gId})`,rx:'3'}));
    svgEl.appendChild(svgRect(ox, oy, pw, ph, {fill:'none',stroke:C.frame,'stroke-width':'2',rx:'3'}));
    // Folhas
    const fw2=pw/nFj; const fixIdx3=nFj===4?[0,3]:[];
    for(let f=0;f<nFj;f++){
      const fx3=ox+fw2*f, cx3=fx3+fw2/2;
      const isF3=fixIdx3.includes(f);
      if(f>0) svgEl.appendChild(svgLine(fx3,oy+2,fx3,oy+ph-2,{stroke:'rgba(100,200,255,0.4)','stroke-width':'1.2','stroke-dasharray':'3,2'}));
      if(isF3){
        svgEl.appendChild(svgRect(fx3+2,oy+2,fw2-4,ph-4,{fill:'url(#hatch)',rx:'1'}));
        svgEl.appendChild(svgTxt(cx3,oy+ph/2+3,'FIXO',{'text-anchor':'middle','font-size':'5.5','font-family':'Outfit,sans-serif','font-weight':'700',fill:'rgba(100,200,255,0.35)'}));
      } else {
        svgEl.appendChild(svgLine(cx3-5,oy+ph/2,cx3+5,oy+ph/2,{stroke:C.arrow,'stroke-width':'1.5','stroke-linecap':'round'}));
        svgEl.appendChild(svgPath(`M${cx3-5},${oy+ph/2} L${cx3-1},${oy+ph/2-2.5} L${cx3-1},${oy+ph/2+2.5} Z`,{fill:C.arrow}));
        svgEl.appendChild(svgPath(`M${cx3+5},${oy+ph/2} L${cx3+1},${oy+ph/2-2.5} L${cx3+1},${oy+ph/2+2.5} Z`,{fill:C.arrow}));
      }
    }
    svgEl.appendChild(svgTxt(ox+pw/2,oy-8,`${nFj} folhas · ${vjvv}`,{'text-anchor':'middle','font-size':'8','font-family':'Outfit,sans-serif','font-weight':'800',fill:'rgba(255,200,80,0.8)'}));
    addDimH(svgEl, ox, ox+pw, oy+ph+16, `${larg} cm`);
    addDimV(svgEl, ox+pw+20, oy, oy+ph, `${alt} cm`);

  } else if (tipo === 'espelho') {
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:'rgba(200,220,255,0.1)',rx:'3'}));
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:'none',stroke:C.frame,'stroke-width':'2',rx:'3'}));
    svgEl.appendChild(svgLine(ox+pw*0.3,oy+4,ox+pw*0.15,oy+ph-4,{stroke:'rgba(255,255,255,0.18)','stroke-width':'2.5','stroke-linecap':'round'}));
    svgEl.appendChild(svgLine(ox+pw*0.45,oy+4,ox+pw*0.30,oy+ph-4,{stroke:'rgba(255,255,255,0.1)','stroke-width':'1.5','stroke-linecap':'round'}));
    addDimH(svgEl, ox, ox+pw, oy+ph+16, `${larg} cm`);
    addDimV(svgEl, ox+pw+20, oy, oy+ph, `${alt} cm`);

  } else if (tipo === 'box') {
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:C.glass,rx:'3'}));
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:'none',stroke:C.frame,'stroke-width':'2',rx:'3'}));
    svgEl.appendChild(svgLine(ox+pw*0.5,oy+2,ox+pw*0.5,oy+ph-2,{stroke:'rgba(100,200,255,0.45)','stroke-width':'1.2','stroke-dasharray':'3,2'}));
    drawPuxador(svgEl, ox+pw*0.5-4, oy+ph*0.35, oy+ph*0.65);
    drawPuxador(svgEl, ox+pw*0.5+4, oy+ph*0.35, oy+ph*0.65);
    addDimH(svgEl, ox, ox+pw, oy+ph+16, `${larg} cm`);
    addDimV(svgEl, ox+pw+20, oy, oy+ph, `${alt} cm`);

  } else if (tipo === 'guarda') {
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:C.glass,rx:'3'}));
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:'none',stroke:C.frame,'stroke-width':'2',rx:'3'}));
    const mods=Math.max(1,Math.ceil(larg/120));
    for(let m=0;m<=mods;m++){const gx=Math.min(ox+(pw/mods)*m,ox+pw-1);svgEl.appendChild(svgLine(gx,oy+2,gx,oy+ph-2,{stroke:'rgba(100,200,255,0.45)','stroke-width':'1.8'}));}
    svgEl.appendChild(svgLine(ox+2,oy+10,ox+pw-2,oy+10,{stroke:'rgba(100,200,255,0.55)','stroke-width':'2.5','stroke-linecap':'round'}));
    addDimH(svgEl, ox, ox+pw, oy+ph+16, `${larg} cm`);
    addDimV(svgEl, ox+pw+20, oy, oy+ph, `${alt} cm`);

  } else if (tipo === 'basculante') {
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:C.glass,rx:'3'}));
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:'none',stroke:C.frame,'stroke-width':'2',rx:'3'}));
    svgEl.appendChild(svgLine(ox+2,oy+ph-4,ox+pw-2,oy+ph-4,{stroke:C.pivot,'stroke-width':'2.5','stroke-linecap':'round'}));
    svgEl.appendChild(svgLine(ox+pw/2,oy+ph-4,ox+pw*0.15,oy+4,{stroke:C.arc,'stroke-width':'1.5','stroke-dasharray':'4,3'}));
    addDimH(svgEl, ox, ox+pw, oy+ph+16, `${larg} cm`);
    addDimV(svgEl, ox+pw+20, oy, oy+ph, `${alt} cm`);

  } else {
    // Vidro comum genérico
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:C.glass,rx:'3'}));
    svgEl.appendChild(svgRect(ox,oy,pw,ph,{fill:'none',stroke:C.frame,'stroke-width':'2',rx:'3'}));
    const area=(larg/100)*(alt/100);
    svgEl.appendChild(svgTxt(ox+pw/2,oy+ph/2+3,`${area.toFixed(2)} m²`,{'text-anchor':'middle','font-size':'9','font-family':'Outfit,sans-serif',fill:C.labelSm}));
    addDimH(svgEl, ox, ox+pw, oy+ph+16, `${larg} cm`);
    addDimV(svgEl, ox+pw+20, oy, oy+ph, `${alt} cm`);
  }
}

// Workaround para a função svgEl ser usada no addDefs mas não conflitar com o parâmetro svgEl
function svgEl2(tag, attrs) { return svgEl(tag, attrs); }

// ── Mini-desenhos para o seletor de configuração ──────────────
function renderMiniCAD(svgId, config) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const W=60, H=44;
  const C2 = { g:'rgba(100,200,255,0.2)', fr:'rgba(100,200,255,0.55)', fx:'rgba(100,200,255,0.15)', ln:'rgba(100,200,255,0.4)', go:'rgba(255,200,80,0.7)', ax:'rgba(100,200,255,0.65)' };
  const M=5;
  function r(x,y,w,h,a){ const e=document.createElementNS(ns,'rect'); Object.assign(e,{}); Object.entries({x,y,width:w,height:h,...a}).forEach(([k,v])=>e.setAttribute(k,v)); return e; }
  function l(x1,y1,x2,y2,a){ const e=document.createElementNS(ns,'line'); Object.entries({x1,y1,x2,y2,...a}).forEach(([k,v])=>e.setAttribute(k,v)); return e; }

  // Adiciona pattern de hachura
  const defs=document.createElementNS(ns,'defs');
  const pat=document.createElementNS(ns,'pattern');
  pat.setAttribute('id',svgId+'h'); pat.setAttribute('width','4'); pat.setAttribute('height','4');
  pat.setAttribute('patternUnits','userSpaceOnUse'); pat.setAttribute('patternTransform','rotate(45)');
  const pl=document.createElementNS(ns,'line');
  ['x1','y1','x2','y2'].forEach((k,i)=>pl.setAttribute(k,['0','0','0','4'][i]));
  pl.setAttribute('stroke','rgba(100,200,255,0.22)'); pl.setAttribute('stroke-width','1.5');
  pat.appendChild(pl); defs.appendChild(pat); svg.appendChild(defs);

  const { tipo, fixo, band, folhas: nFolhas } = config;
  if (tipo==='pivotante') {
    const fixoW = fixo ? W*0.32 : 0;
    const bandH = band ? H*0.25 : 0;
    const px=M+(fixo&&fixo==='esq'?fixoW:0), py=M+bandH, pw=W-M*2-fixoW, ph=H-M*2-bandH;
    // Bandeirola
    if(band){ svg.appendChild(r(px,M,pw,bandH,{fill:`url(#${svgId}h)`,'stroke':C2.fr,'stroke-width':'1',rx:'1'})); }
    // Fixo lateral
    if(fixo){ const fx=fixo==='esq'?M:px+pw; svg.appendChild(r(fx,py,fixoW,ph,{fill:`url(#${svgId}h)`,'stroke':C2.fr,'stroke-width':'1',rx:'1'})); }
    // Porta
    svg.appendChild(r(px,py,pw,ph,{fill:C2.g,'stroke':C2.fr,'stroke-width':'1.5',rx:'1'}));
    // Pivô
    svg.appendChild(l(px+3,py+3,px+3,py+ph-3,{stroke:C2.go,'stroke-width':'2'}));
    // Arco
    svg.appendChild(document.createElementNS(ns,'path') );
    const arc=document.createElementNS(ns,'path');
    arc.setAttribute('d',`M${px+3},${py+ph} A${pw*0.85},${ph*0.85} 0 0,1 ${px+pw-4},${py+ph*0.4}`);
    arc.setAttribute('fill','none'); arc.setAttribute('stroke','rgba(255,200,80,0.25)'); arc.setAttribute('stroke-width','1.2'); arc.setAttribute('stroke-dasharray','3,2');
    svg.appendChild(arc);
    // Puxador
    svg.appendChild(l(px+pw-4,py+ph*0.35,px+pw-4,py+ph*0.65,{stroke:C2.go,'stroke-width':'2','stroke-linecap':'round'}));
  } else if (tipo==='correr') {
    const nF=nFolhas||2, fw=(W-M*2)/nF;
    const fixaIdx=nF===4?[0,nF-1]:[];
    svg.appendChild(l(M,M-2,W-M,M-2,{stroke:C2.fr,'stroke-width':'2.5','stroke-linecap':'round'}));
    svg.appendChild(l(M,H-M+2,W-M,H-M+2,{stroke:C2.ln,'stroke-width':'1.5','stroke-linecap':'round'}));
    for(let f=0;f<nF;f++){
      const fx=M+fw*f;
      const isF=fixaIdx.includes(f);
      if(isF){ svg.appendChild(r(fx+1,M,fw-2,H-M*2,{fill:`url(#${svgId}h)`,'stroke':C2.ln,'stroke-width':'1',rx:'1','stroke-dasharray':'3,2'})); }
      else { svg.appendChild(r(fx+1,M,fw-2,H-M*2,{fill:C2.g,'stroke':C2.fr,'stroke-width':'1',rx:'1'})); const cx=fx+fw/2; svg.appendChild(l(cx-5,(H-M*2)/2+M,cx+5,(H-M*2)/2+M,{stroke:C2.ax,'stroke-width':'1.5','stroke-linecap':'round'})); }
      if(f>0) svg.appendChild(l(fx,M+1,fx,H-M-1,{stroke:C2.ln,'stroke-width':'0.8','stroke-dasharray':'2,2'}));
    }
  } else if (tipo==='janela') {
    const nFj=nFolhas||2, fw2=(W-M*2)/nFj, fixI=nFj===4?[0,nFj-1]:[];
    svg.appendChild(r(M,M,W-M*2,H-M*2,{fill:'none','stroke':C2.fr,'stroke-width':'1.5',rx:'2'}));
    for(let f=0;f<nFj;f++){
      const fx2=M+fw2*f;
      if(fixI.includes(f)){ svg.appendChild(r(fx2+1,M+1,fw2-2,H-M*2-2,{fill:`url(#${svgId}h)`})); }
      else{ const cx2=fx2+fw2/2,my=(H)/2; svg.appendChild(l(cx2-4,my,cx2+4,my,{stroke:C2.ax,'stroke-width':'1.5','stroke-linecap':'round'})); }
      if(f>0) svg.appendChild(l(fx2,M+1,fx2,H-M-1,{stroke:C2.ln,'stroke-width':'0.8','stroke-dasharray':'2,2'}));
    }
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
  const W = 50, H = 50;
  const ns2 = 'http://www.w3.org/2000/svg';
  function e(tag, a) { const el = document.createElementNS(ns2, tag); Object.entries(a).forEach(([k,v])=>el.setAttribute(k,v)); return el; }

  const gold = '#C9A84C', blue = 'rgba(100,200,255,0.65)', faded = 'rgba(201,168,76,0.35)';

  if (tipo === 'comum') {
    // Porta simples com eixo pivô fino
    svg.appendChild(e('rect', {x:10,y:4,width:24,height:42,rx:2,fill:'rgba(100,200,255,0.15)',stroke:blue,'stroke-width':'1.5'}));
    // Eixo pivô
    svg.appendChild(e('rect', {x:11,y:4,width:4,height:42,rx:1,fill:gold,opacity:'0.85'}));
    // Pivot superior e inferior
    svg.appendChild(e('circle', {cx:13,cy:6,r:3.5,fill:gold}));
    svg.appendChild(e('circle', {cx:13,cy:44,r:3.5,fill:gold}));
    // Puxador
    svg.appendChild(e('rect', {x:30,y:18,width:3,height:14,rx:1.5,fill:gold,opacity:'0.7'}));
  } else if (tipo === 'jumbo') {
    // Porta com eixo pivô mais largo e robusto
    svg.appendChild(e('rect', {x:10,y:4,width:24,height:42,rx:2,fill:'rgba(100,200,255,0.15)',stroke:blue,'stroke-width':'1.5'}));
    // Eixo pivô largo
    svg.appendChild(e('rect', {x:10,y:4,width:7,height:42,rx:2,fill:gold,opacity:'0.85'}));
    // Bracket central de reforço
    svg.appendChild(e('rect', {x:9,y:19,width:10,height:12,rx:2,fill:faded,stroke:gold,'stroke-width':'1.2'}));
    // Pivots
    svg.appendChild(e('circle', {cx:13.5,cy:6,r:4.5,fill:gold}));
    svg.appendChild(e('circle', {cx:13.5,cy:44,r:4.5,fill:gold}));
    // Puxador
    svg.appendChild(e('rect', {x:30,y:16,width:4,height:18,rx:2,fill:gold,opacity:'0.7'}));
  } else if (tipo === 'mola') {
    // Porta com mola no piso
    svg.appendChild(e('rect', {x:12,y:4,width:22,height:38,rx:2,fill:'rgba(100,200,255,0.15)',stroke:blue,'stroke-width':'1.5'}));
    // Espiral da mola no rodapé
    const path = document.createElementNS(ns2, 'path');
    path.setAttribute('d', 'M16,45 Q22,42 28,45 Q34,48 40,45');
    path.setAttribute('fill','none'); path.setAttribute('stroke',gold);
    path.setAttribute('stroke-width','2.5'); path.setAttribute('stroke-linecap','round');
    svg.appendChild(path);
    // Linha da mola
    svg.appendChild(e('line', {x1:'23',y1:'42',x2:'23',y2:'46',stroke:gold,'stroke-width':'2'}));
    // Puxador
    svg.appendChild(e('rect', {x:30,y:16,width:3,height:14,rx:1.5,fill:gold,opacity:'0.7'}));
    // Label
    const t = document.createElementNS(ns2,'text');
    t.setAttribute('x','28'); t.setAttribute('y','11');
    t.setAttribute('font-size','7'); t.setAttribute('font-family','Outfit,sans-serif');
    t.setAttribute('font-weight','700'); t.setAttribute('fill',gold);
    t.setAttribute('text-anchor','middle'); t.textContent = '∿';
    svg.appendChild(t);
  }
}
