// ════════════════════════════════════════════════════════════
// FINANCEIRO / PREÇOS
// ════════════════════════════════════════════════════════════

const SECOES_PRECOS = [
  { titulo:'🔥 Vidros Temperados — 8mm', sub:'Alta resistência · 10% desconto à vista', linhas:[['Transparente','R$ 420,00'],['Fumê','R$ 455,00'],['Serigrafado','R$ 650,00'],['Jateado','R$ 440,00'],['Espelhado','R$ 620,00']] },
  { titulo:'🔲 Vidros Comuns', sub:'Uso residencial · Recorte +R$10/m²', linhas:[['Incolor 4mm','R$ 220,00'],['Incolor 6mm','R$ 240,00'],['Fumê 3mm','R$ 210,00'],['Fumê 4mm','R$ 245,00'],['Espelho 3mm','R$ 260,00'],['Espelho 4mm','R$ 280,00']] },
  { titulo:'🔧 Kits e Ferragens', sub:'Inclusos conforme o produto selecionado', linhas:[['Kit pivotante comum','R$ 150,00'],['Kit pivotante jumbo','R$ 350,00'],['Kit porta de correr','R$ 100/m²'],['Kit janela 2 folhas','R$ 100/m'],['Kit janela 4 folhas','R$ 110/m'],['Kit basculante','R$ 150,00']] },
  { titulo:'🪝 Acessórios Avulsos', sub:'Adicionados automaticamente por produto', linhas:[['Fechadura VP','R$ 150,00'],['Fechadura VV','R$ 180,00'],['Puxador','R$ 100,00'],['Fixador','R$ 60,00'],['Bate-fecha VP','R$ 50,00'],['Bate-fecha VV','R$ 80,00'],['Cantoneira alumínio','R$ 10/m'],['PU (poliuretano)','R$ 70/m']] },
];

function renderFinanceiro(wrap) {
  wrap.innerHTML = `
    <div>
      <div class="hero"><div class="hero-ttl">💎 Tabela de Preços</div><div class="hero-sub">Valores por m² — Vidraçaria Ceará Planejados</div></div>
      <div class="section">
        ${SECOES_PRECOS.map(s=>`
          <div class="price-section">
            <div class="price-section-header"><h3>${s.titulo}</h3><p>${s.sub}</p></div>
            <div class="card" style="padding:4px 12px">
              <table class="tbl"><tbody>
                <tr><th>Tipo</th><th style="text-align:right">Valor</th></tr>
                ${s.linhas.map(([nome,val])=>`<tr><td>${nome}</td><td>${val}</td></tr>`).join('')}
              </tbody></table>
            </div>
          </div>
        `).join('')}
        <div class="card" style="background:linear-gradient(135deg,rgba(58,158,106,.08),rgba(201,168,76,.05));border-color:rgba(58,158,106,.2)">
          <div style="font-size:.72rem;font-weight:700;color:var(--grn);margin-bottom:10px">💚 Condições de Pagamento</div>
          <div style="font-size:.74rem;color:var(--t3);line-height:1.8">
            • <b style="color:var(--t2)">Desconto à vista:</b> 10% nos vidros temperados<br>
            • <b style="color:var(--t2)">Parcelamento:</b> até 6x sem juros<br>
            • <b style="color:var(--t2)">Cartão:</b> pode acrescentar 10% sobre total<br>
            • <b style="color:var(--t2)">Padrão:</b> 50% entrada + 50% na entrega
          </div>
        </div>
      </div>
      <div style="height:80px"></div>
    </div>
  `;
}

