describe('CashMe | Simulação de Evolução de Contrato', () => {
  const url = 'https://10.3.98.108/aejs/rest/w/wtela/SimulaEvolucaoContrato';

  const queryParams = {
    sessionKey: '123456',
    contexto: 'CORP_WEB',
    userName: 'loginintegracao',
    ambienteOperacional: '/u11/cashme/dados/ambiente_integracao'
  };

  const headers = { 'Content-Type': 'application/json' };

  const requestBody = {
    CADMUT_Financ_Plano: 111,
    CADMUT_Financ_Prazo: 12,
    CADMUT_Financ_DtAssin: "05/05/2025",
    CADMUT_Financ_DiaVenc: 5,
    CADMUT_Financ_TxJuros: 14.0,
    CADMUT_Financ_ValAval: 150000.00,
    CADMUT_Financ_ValFinanc: 110000.00,
    IN_CalculaIOF: "T",
    IN_IOFnoFinanciamento: "T",
    IN_IOFAliquotaMaxima: "T",
    CADMUT_Financ_TTx: 16,
    CADMUT_Financ_TxAdm: 25.00,
    CADMUT_Financ_IndSegImv: 0.000065,
    CADMUT_Financ_IndSegFin: 0.00035,
    CADMUT_Cad2_CodApolice: 1,
    CADMUT_Cad4_CodApoliceDFI: 1,
    CADMUT_Financ3_SegReCalcSaldo: "T",
    CADMUT_Cad_TipoCtr: 40,
    CADMUT_Financ3_JuroEfetivo252: "F",
    CADMUT_Financ3_AmortizaSaldoComNPC0: "F",
    CADMUT_Financ3_JurProrata: "T",
    CADMUT_CAD6_COBRJURCAPPRST1: "F",
    CADMUT_CAD6_PRZCARAMORT: 0,
    CADMUT_CAD6_INCJURCARAMORT: 1,
    CADMUT_Cad_FisJur: "J",
    CADMUT_Financ3_NaoCobraSegUltPrst: "F",
    CADMUT_Financ2_SdRata: 128
  };

  function validarGridEvolucaoTeorica(grid) {
    cy.softAssert(Array.isArray(grid), `GRIDEVOLUCAOTEORICA deve ser um array, veio tipo ${typeof grid}`);
    cy.softAssert(grid.length === 13, `GRIDEVOLUCAOTEORICA deve ter 13 itens, veio ${grid.length}`);

    if (Array.isArray(grid) && grid.length === 13) {
      const primeira = grid[0];
      const ultima = grid[12];

      cy.softAssert(primeira.PREPRZ === "000/012", `PREPRZ da 1ª parcela esperado '000/012', veio '${primeira.PREPRZ}'`);
      cy.softAssert(primeira.PRESTACAO === "73.99", `PRESTACAO da 1ª parcela esperado '73.99', veio '${primeira.PRESTACAO}'`);
      cy.softAssert(ultima.PREPRZ === "012/012", `PREPRZ da última parcela esperado '012/012', veio '${ultima.PREPRZ}'`);
      cy.softAssert(ultima.SALDODEV === "0", `SALDODEV da última parcela esperado '0', veio '${ultima.SALDODEV}'`);
    }
  }

  it('', () => {
    cy.request({
      method: 'POST',
      url,
      qs: queryParams,
      headers,
      body: requestBody,
      failOnStatusCode: false
    }).then((response) => {
      cy.softAssert(response.status === 200, `Status esperado 200, veio ${response.status}`);
      const body = response.body;
      const temGrid = body.hasOwnProperty('GRIDEVOLUCAOTEORICA');
      cy.softAssert(temGrid, `Propriedade 'GRIDEVOLUCAOTEORICA' ausente no body.`);
      if (temGrid) {
        validarGridEvolucaoTeorica(body.GRIDEVOLUCAOTEORICA);
      }
      cy.softAssert(body.VA_IOF === '2107.62', `Valor de VA_IOF esperado '2107.62', veio '${body.VA_IOF}'`);
    }).then(() => {
      cy.checkSoftAsserts();
    });
  });
});
