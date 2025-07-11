describe('Rodobens | Emissão de Recibo Consolidado', () => {
  const url = 'http://10.3.98.108/aejs/rest/w/wtela/ReciboConsolidado';

  const queryParams = {
    TipoExec: '3',
    GERA_DADOS_MERGE: 'T',
    GERA_SAIDA_PDF: 'T',
    ARROBA: 'T',
    IN_DEBITO_AUTOMATICO: '$IN_DEBITO_AUTOMATICO',
    LCobrForcado: '',
    sessionKey: '22472MPPJOKBCBONPMDMOMJPD',
    contexto: 'CORP_WEB',
    userName: 'supervisor',
    ambienteOperacional: '/u10/rodobens/dados'
  };

  const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/octet-stream',
    'X-Requested-With': 'XMLHttpRequest'
  };

  function validarDadosReciboConsolidado(dados) {
    const props = [
      'NossoNumComDv', 'NossoNumDv', 'NossoNum', 'BarraNum', 'BarraNum1',
      'BarraNumG', 'BarcodeTag', 'BarcodeTagG', 'QrCodePix', 'CopiaColaPix',
      'NumBanco', 'URLImagens', 'Barcode', 'BarcodeG', 'StrBarra',
      'StrBarraNum', 'StrBarraNumG', 'StrPadraoG'
    ];

    props.forEach(prop => {
      cy.softAssert(dados.hasOwnProperty(prop), `Faltando '${prop}' no dados`);
      if (prop === "StrBarra" && dados.hasOwnProperty(prop)) {
        cy.softAssert(dados.StrBarra.length === 111, `StrBarra deveria ter 111 caractéres, tem '${dados.StrBarra.length}'`);
      }
    });
  }

  it('', () => {
    cy.fixture('reciboConsolidadoBody.json').then((requestBody) => {
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
        const temDados = body.hasOwnProperty('dados');
        cy.softAssert(temDados, "Propriedade 'dados' ausente no body.");

        if (temDados) {
          validarDadosReciboConsolidado(body.dados);
        }
      }).then(() => {
        cy.checkSoftAsserts();
      });
    });
  });
});
