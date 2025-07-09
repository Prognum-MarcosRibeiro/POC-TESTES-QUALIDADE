describe('CashMe | Validar informações da Super Tela', () => {
  it('', function () {
    
    function validarCamposHeaderContrato() {
      cy.get('[name="CTRDISP"]', { timeout: 10000 }).should('have.value', '00000009162')
      cy.get('[name="CADMUT_FINANC_DTASSIN"]').should('have.value', '10/Jun/2025')
      cy.get('[name="CADMUT_FINANC_VALFINANC"]').should('have.value', '101.169,53')
      cy.get('[name="CALCULO_DIV$TXJUROS_EFETIVA_ANUAL"]').should('have.value', '21,27000000 %')
      cy.get('[name="CALCULO_DIV$PLANO_ATUAL"]').should('have.value', '111 - GEN/TP   ')
      cy.get('[name="CALCULO_DIV$DONOCRED"]').should('have.value', '001-NOME_1')
      cy.get('[name="CALCULO_DIV$PRAZO_REMANESCENTE_MESES"]').should('have.value', '240')
      cy.get('[name="CALCULO_DIV$NU_PRESTACOES_PAGAS"]').should('have.value', '0')
      cy.get('[name="CALCULO_DIV$NU_PRESTACOES_DISPONIVEIS"]').should('have.value', '0')
      cy.get('[name="CALCULO_QUIT$NU_PRAZO_REM"]').should('have.value', '240')
      cy.get('[name="CALCULO_DIV$VALORPAGOAMAISJ"]').should('have.value', '0,00')
      cy.get('[name="CALCULO_DIV$CONTAPRIMARIA"]').should('have.value', 'CONTA CASHME')
    }

    const numeroContrato='000054-0'
    cy.loginSupervisor();
    cy.acessarContrato(numeroContrato);
    validarCamposHeaderContrato();
  });
});