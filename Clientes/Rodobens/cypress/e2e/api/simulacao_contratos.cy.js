describe('Simulação de Evolução de Contrato', () => {
  it('Valida retorno completo da API simulando contrato', () => {
    let erros = [];

    cy.request({
      method: 'POST',
      url: 'https://desenv.prognum.com.br/aejs/rest/w/wtela/SimulaEvolucaoContrato',
      qs: {
        sessionKey: '123456',
        contexto: 'CORP_WEB',
        userName: 'loginintegracao',
        ambienteOperacional: '/u11/cashme/dados/ambiente_integracao'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        "CADMUT_Financ_Plano": 111,
        "CADMUT_Financ_Prazo": 12,
        "CADMUT_Financ_DtAssin": "05/05/2025",
        "CADMUT_Financ_DiaVenc": 5,
        "CADMUT_Financ_TxJuros": 14.0000000000,
        "CADMUT_Financ_ValAval": 150000.00,
        "CADMUT_Financ_ValFinanc": 110000.00,
        "IN_CalculaIOF": "T",
        "IN_IOFnoFinanciamento": "T",
        "IN_IOFAliquotaMaxima": "T",
        "CADMUT_Financ_TTx": 16,
        "CADMUT_Financ_TxAdm": 25.00,
        "CADMUT_Financ_IndSegImv": 0.000065000,
        "CADMUT_Financ_IndSegFin": 0.000350000,
        "CADMUT_Cad2_CodApolice": 1,
        "CADMUT_Cad4_CodApoliceDFI": 1,
        "CADMUT_Financ3_SegReCalcSaldo": "T",
        "CADMUT_Cad_TipoCtr": 40,
        "CADMUT_Financ3_JuroEfetivo252": "F",
        "CADMUT_Financ3_AmortizaSaldoComNPC0": "F",
        "CADMUT_Financ3_JurProrata": "T",
        "CADMUT_CAD6_COBRJURCAPPRST1": "F",
        "CADMUT_CAD6_PRZCARAMORT": 0,
        "CADMUT_CAD6_INCJURCARAMORT": 1,
        "CADMUT_Cad_FisJur": "J",
        "CADMUT_Financ3_NaoCobraSegUltPrst": "F",
        "CADMUT_Financ2_SdRata": 128
      }
    }).then((response) => {
      if (response.status !== 200) {
        erros.push(`Status code esperado 200, mas veio ${response.status} | `);
      }

      if (!response.body.hasOwnProperty('GRIDEVOLUCAOTEORICA')) {
        erros.push("Propriedade 'GRIDEVOLUCAOTEORICA' ausente no body. | ");
      } else {
        if (!Array.isArray(response.body.GRIDEVOLUCAOTEORICA) || response.body.GRIDEVOLUCAOTEORICA.length !== 13) {
          erros.push(`GRIDEVOLUCAOTEORICA deve ser array de 13 elementos, veio ${response.body.GRIDEVOLUCAOTEORICA.length} | `);
        } else {
          const primeiraParcela = response.body.GRIDEVOLUCAOTEORICA[0];
          const ultimaParcela = response.body.GRIDEVOLUCAOTEORICA[12];

          if (primeiraParcela.PREPRZ !== "000/012") {
            erros.push(`PREPRZ da 1ª parcela esperado '012/012', veio '${primeiraParcela.PREPRZ}' | `);
          }

          if (primeiraParcela.PRESTACAO !== "73.99") {
            erros.push(`PRESTACAO da 1ª parcela esperado '73.99', veio '${primeiraParcela.PRESTACAO}' | `);
          }

          if (ultimaParcela.PREPRZ !== "012/012") {
            erros.push(`PREPRZ da última parcela esperado '012/012', veio '${ultimaParcela.PREPRZ}' | `);
          }

          if (ultimaParcela.SALDODEV !== "0") {
            erros.push(`SALDODEV da última parcela esperado '0', veio '${ultimaParcela.SALDODEV}' | `);
          }
        }
      }

      if (response.body.VA_IOF !== '2107.62') {
        erros.push(`Valor de VA_IOF esperado '2107.62', veio '${response.body.VA_IOF}' | `);
      }
    }).then(() => {
      if (erros.length > 0) {
        cy.log('Erros encontrados:');
        erros.forEach((erro) => cy.log(erro));
        throw new Error(erros.join('\n'));
      } else {
        cy.log('Todas as validações passaram.');
      }
    });
  });
});
