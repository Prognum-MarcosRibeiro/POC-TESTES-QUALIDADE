describe('Simulação de Evolução de Contrato', () => {
  it('', () => {
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
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('GRIDEVOLUCAOTEORICA')
      expect(response.body.GRIDEVOLUCAOTEORICA).to.be.an('array').and.have.length(13)

      const primeiraParcela = response.body.GRIDEVOLUCAOTEORICA[0]
      expect(primeiraParcela.PREPRZ).to.eq("000/012")
      expect(primeiraParcela.PRESTACAO).to.eq("73.99")

      const ultimaParcela = response.body.GRIDEVOLUCAOTEORICA[12]
      expect(ultimaParcela.PREPRZ).to.eq("012/012")
      expect(ultimaParcela.SALDODEV).to.eq("0")

      expect(response.body).to.have.property('VA_IOF', '2107.62')
    })
  })
})
