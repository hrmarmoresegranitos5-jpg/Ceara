// ════════════════════════════════════════════════════════════
// CAD SVG
// ════════════════════════════════════════════════════════════

function renderCAD(svgEl, { tipo, larg, alt, folhas }) {
  if (!svgEl || !larg || !alt || isNaN(larg) || isNaN(alt)) return;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
  const W=320,H=200,MARGIN=30,maxPW=W-MARGIN*2-40,maxPH=H-MARGIN*2-30;
  const scale=Math.min(maxPW/larg,maxPH/alt), pw=larg*scale, ph=alt*scale;
  const ox=(W-pw)/2-10, oy=(H-ph)/2-5;
  const C = { glass:'rgba(100,200,255,0.12)',frame:'rgba(100,200,255,0.55)',dim:'rgba(100,180,255,0.4)',dimArrow:'rgba(100,200,255,0.7)',label:'rgba(150,220,255,0.9)' };
  const ns = 'http://www.w3.org/2000/svg';
  function el(tag,attrs) { const e=document.createElementNS(ns,tag); Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v)); return e; }
  function rect(x,y,w,h,attrs) { return el('rect',{x,y,width:w,height:h,...attrs}); }
  function line(x1,y1,x2,y2,attrs) { return el('line',{x1,y1,x2,y2,...attrs}); }
  function txt(x,y,text,attrs) { const e=el('text',{x,y,...attrs}); e.textContent=text; return e; }
  function path(d,attrs) { return el('path',{d,...attrs}); }
  const defs=el('defs',{});
  const mkArr=(id,d)=>{ const m=el('marker',{id,markerWidth:6,markerHeight:6,refX:3,refY:3,orient:'auto'}); m.appendChild(el('path',{d,fill:C.dimArrow})); return m; };
  defs.appendChild(mkArr('arr','M0,1 L6,3 L0,5 Z')); defs.appendChild(mkArr('arrR','M6,1 L0,3 L6,5 Z'));
  const gId='gG'; const lg=el('linearGradient',{id:gId,x1:'0',y1:'0',x2:'1',y2:'1'});
  lg.appendChild(el('stop',{offset:'0%','stop-color':'rgba(255,255,255,0.12)'}));
  lg.appendChild(el('stop',{offset:'50%','stop-color':'rgba(255,255,255,0.03)'}));
  lg.appendChild(el('stop',{offset:'100%','stop-color':'rgba(100,200,255,0.06)'}));
  defs.appendChild(lg); svgEl.appendChild(defs);
  svgEl.appendChild(rect(ox,oy,pw,ph,{fill:C.glass,rx:'3'}));
  svgEl.appendChild(rect(ox,oy,pw,ph,{fill:`url(#${gId})`,rx:'3'}));
  svgEl.appendChild(rect(ox,oy,pw,ph,{fill:'none',stroke:C.frame,'stroke-width':'2',rx:'3'}));
  if (tipo==='pivotante') {
    const pvX=ox+pw*0.12;
    svgEl.appendChild(line(pvX,oy+4,pvX,oy+ph-4,{stroke:'rgba(255,200,80,0.5)','stroke-width':'2'}));
    svgEl.appendChild(line(pvX,oy+ph*0.5,ox+pw-8,oy+8,{stroke:'rgba(100,200,255,0.25)','stroke-width':'1','stroke-dasharray':'4,3'}));
    svgEl.appendChild(el('circle',{cx:pvX,cy:oy+ph*0.5,r:'4',fill:'none',stroke:'rgba(255,200,80,0.6)','stroke-width':'1.5'}));
  } else if (tipo==='correr') {
    const nFolhas = Number(folhas) || 2;
    const nMoveis = CORRER_MOVEIS[nFolhas] ?? 2;
    const nFixas  = nFolhas - nMoveis;
    const fw = pw / nFolhas; // largura de cada folha no SVG

    // Para 4 folhas: fixas ficam nas extremidades (posições 0 e 3), móveis no meio (1 e 2)
    // Para 1 folha: 1 móvel
    // Para 2 folhas: 2 móveis
    const fixaIdx = nFixas > 0 ? [0, nFolhas - 1] : [];

    for (let f = 0; f < nFolhas; f++) {
      const fx = ox + fw * f;
      const isFixa = fixaIdx.includes(f);
      const cx = fx + fw / 2;

      // Fundo da folha
      const folhaRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      folhaRect.setAttribute('x', fx + 1);
      folhaRect.setAttribute('y', oy + 1);
      folhaRect.setAttribute('width', fw - 2);
      folhaRect.setAttribute('height', ph - 2);
      folhaRect.setAttribute('fill', isFixa ? 'rgba(100,200,255,0.04)' : 'rgba(100,200,255,0.07)');
      folhaRect.setAttribute('stroke', isFixa ? 'rgba(100,200,255,0.3)' : 'rgba(100,200,255,0.55)');
      folhaRect.setAttribute('stroke-width', '1.2');
      svgEl.appendChild(folhaRect);

      // Linha de divisão entre folhas (exceto depois da última)
      if (f < nFolhas - 1) {
        svgEl.appendChild(line(fx + fw, oy + 2, fx + fw, oy + ph - 2, { stroke:'rgba(100,200,255,0.35)', 'stroke-width':'1', 'stroke-dasharray':'3,2' }));
      }

      if (isFixa) {
        // Folha fixa: ícone de cadeado ou X no centro
        svgEl.appendChild(txt(cx, oy + ph/2 - 6, '⊠', { 'text-anchor':'middle', 'font-size':'10', fill:'rgba(100,200,255,0.35)' }));
        svgEl.appendChild(txt(cx, oy + ph/2 + 10, 'FIXO', { 'text-anchor':'middle', 'font-size':'5.5', fill:'rgba(100,200,255,0.35)', 'font-weight':'700', 'letter-spacing':'0.04em' }));
      } else {
        // Folha móvel: seta de movimento
        const arrowDir = (nFixas > 0 && f >= nFolhas/2) ? 1 : -1; // fixa dir → móvel vai pra esq
        const ax = cx, ay = oy + ph/2;
        const al = Math.min(fw * 0.35, 10);
        svgEl.appendChild(line(ax - al, ay, ax + al, ay, { stroke:'rgba(100,200,255,0.7)', 'stroke-width':'1.5', 'stroke-linecap':'round' }));
        // seta esquerda
        svgEl.appendChild(path(`M${ax - al},${ay} L${ax - al + 4},${ay - 3} L${ax - al + 4},${ay + 3} Z`, { fill:'rgba(100,200,255,0.6)' }));
        // seta direita
        svgEl.appendChild(path(`M${ax + al},${ay} L${ax + al - 4},${ay - 3} L${ax + al - 4},${ay + 3} Z`, { fill:'rgba(100,200,255,0.6)' }));
        // puxador
        const phx = (nFixas > 0 && f < nFolhas/2) ? fx + fw - 4 : fx + 4;
        svgEl.appendChild(line(phx, oy + ph*0.35, phx, oy + ph*0.65, { stroke:'rgba(212,175,55,0.7)', 'stroke-width':'2.5', 'stroke-linecap':'round' }));
      }
    }

    // Trilho superior e inferior
    svgEl.appendChild(line(ox, oy - 3, ox + pw, oy - 3, { stroke:'rgba(100,200,255,0.5)', 'stroke-width':'2.5', 'stroke-linecap':'round' }));
    svgEl.appendChild(line(ox, oy + ph + 3, ox + pw, oy + ph + 3, { stroke:'rgba(100,200,255,0.3)', 'stroke-width':'1.5', 'stroke-linecap':'round' }));
  } else if (tipo==='janela') {
    svgEl.appendChild(line(ox+2,oy+ph/2,ox+pw-2,oy+ph/2,{stroke:'rgba(100,200,255,0.45)','stroke-width':'1.2','stroke-dasharray':'2,2'}));
    const fj=larg<=120?2:4; for(let f=1;f<fj;f++){const fjx=ox+pw*(f/fj);svgEl.appendChild(line(fjx,oy+2,fjx,oy+ph-2,{stroke:'rgba(100,200,255,0.45)','stroke-width':'1','stroke-dasharray':'2,2'}));}
  } else if (tipo==='espelho') {
    svgEl.appendChild(line(ox+pw*0.3,oy+4,ox+pw*0.15,oy+ph-4,{stroke:'rgba(255,255,255,0.14)','stroke-width':'2','stroke-linecap':'round'}));
  } else if (tipo==='guarda') {
    const mods=Math.ceil((larg/100)/1.2);
    for(let m=0;m<=mods;m++){let gx=Math.min(ox+(pw/mods)*m,ox+pw-2);svgEl.appendChild(line(gx,oy+2,gx,oy+ph-2,{stroke:'rgba(100,200,255,0.5)','stroke-width':'2'}));}
    svgEl.appendChild(line(ox+2,oy+8,ox+pw-2,oy+8,{stroke:'rgba(100,200,255,0.55)','stroke-width':'2'}));
  } else {
    svgEl.appendChild(line(ox+2,oy+2,ox+pw-2,oy+ph-2,{stroke:'rgba(100,200,255,0.12)','stroke-width':'1'}));
    svgEl.appendChild(line(ox+pw-2,oy+2,ox+2,oy+ph-2,{stroke:'rgba(100,200,255,0.12)','stroke-width':'1'}));
  }
  const cm=8,cmS='rgba(100,200,255,0.4)',cmW='1.2';
  [[ox,oy,1,1],[ox+pw,oy,-1,1],[ox,oy+ph,1,-1],[ox+pw,oy+ph,-1,-1]].forEach(([x,y,dx,dy])=>{
    svgEl.appendChild(line(x,y,x+cm*dx,y,{stroke:cmS,'stroke-width':cmW}));
    svgEl.appendChild(line(x,y,x,y+cm*dy,{stroke:cmS,'stroke-width':cmW}));
  });
  const DIMGAP=10,DIMOFF=6,dy=oy+ph+DIMGAP+DIMOFF;
  svgEl.appendChild(line(ox,oy+ph+DIMOFF,ox,dy+2,{stroke:C.dim,'stroke-width':'0.8'}));
  svgEl.appendChild(line(ox+pw,oy+ph+DIMOFF,ox+pw,dy+2,{stroke:C.dim,'stroke-width':'0.8'}));
  svgEl.appendChild(line(ox,dy,ox+pw,dy,{stroke:C.dimArrow,'stroke-width':'1.2','marker-start':'url(#arrR)','marker-end':'url(#arr)'}));
  svgEl.appendChild(txt(ox+pw/2,dy+8,`${larg} cm`,{'text-anchor':'middle','font-size':'9','font-family':'Outfit,sans-serif','font-weight':'700',fill:C.label}));
  const dx2=ox+pw+DIMGAP+DIMOFF;
  svgEl.appendChild(line(ox+pw+DIMOFF,oy,dx2+2,oy,{stroke:C.dim,'stroke-width':'0.8'}));
  svgEl.appendChild(line(ox+pw+DIMOFF,oy+ph,dx2+2,oy+ph,{stroke:C.dim,'stroke-width':'0.8'}));
  svgEl.appendChild(line(dx2,oy,dx2,oy+ph,{stroke:C.dimArrow,'stroke-width':'1.2','marker-start':'url(#arrR)','marker-end':'url(#arr)'}));
  svgEl.appendChild(txt(dx2+9,oy+ph/2,`${alt} cm`,{'text-anchor':'middle','font-size':'9','font-family':'Outfit,sans-serif','font-weight':'700',fill:C.label,transform:`rotate(-90,${dx2+9},${oy+ph/2})`}));
  if (pw>70&&ph>40) { const area=(larg/100)*(alt/100); svgEl.appendChild(txt(ox+pw/2,oy+ph/2+3,`${area.toFixed(2)} m²`,{'text-anchor':'middle','font-size':'8','font-family':'Outfit,sans-serif',fill:'rgba(150,220,255,0.6)'})); }
}

