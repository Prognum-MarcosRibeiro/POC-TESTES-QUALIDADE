function executaLoginSupervisor(ambienteOperacional) {
  let usuario = 'supervisor'
  let senha = 'Tempo+2023'
  
  cy.visit('http://10.3.98.108/aejs/')
  cy.title().should('include', 'AEJS')
  cy.get('#loginview-1012_header-title-textEl').should('have.text', 'Identificação do Usuário')
  
  cy.contains('Nome').type(usuario)
  cy.contains('Senha').type(senha, { delay: 50 })
  cy.contains('Ambiente').type(ambienteOperacional)
  cy.contains('Login').click()
}

function acessaContrato() {
    cy.contains('SCCI').click()
    cy.contains('Contratos e Mutuários').click()
    cy.contains('Pesquisar', { timeout: 10000 }).should('be.visible')
    cy.contains('Contrato').type('000054-0')
    cy.contains('Pesquisar').click()
    cy.contains('Adquirente_00000000002801', { timeout: 10000 }).should('be.visible').dblclick();
}

function validaCamposHeader() {
    cy.get('[name="CTRDISP"]', { timeout: 10000 }).should('have.value', '00000009162')
    cy.get('[name="CADMUT_FINANC_DTASSIN"]').should('have.value', '10/Jun/2025')
    cy.get('[name="CADMUT_FINANC_VALFINANC"]').should('have.value', '101.169,53')
    cy.get('[name="CALCULO_DIV$TXJUROS_EFETIVA_ANUAL"]').should('have.value', '21,27000000 %')
    cy.get('[name="CALCULO_DIV$PLANO_ATUAL"]').should('have.value', '111 - GEN/TP   ')
    cy.get('[name="CALCULO_DIV$DONOCRED"]').should('have.value', '001-CASHME SOLUCOES FINANCEIRAS S.A.')
    cy.get('[name="CALCULO_DIV$PRAZO_REMANESCENTE_MESES"]').should('have.value', '240')
    cy.get('[name="CALCULO_DIV$NU_PRESTACOES_PAGAS"]').should('have.value', '0')
    cy.get('[name="CALCULO_DIV$NU_PRESTACOES_DISPONIVEIS"]').should('have.value', '0')
    cy.get('[name="CALCULO_QUIT$NU_PRAZO_REM"]').should('have.value', '240')
    cy.get('[name="CALCULO_DIV$VALORPAGOAMAISJ"]').should('have.value', '0,00')
    cy.get('[name="CALCULO_DIV$CONTAPRIMARIA"]').should('have.value', 'CONTA CASHME')
}

describe('Validar Campos da Super Tela [CashMe]', () => {
  it('', () => {
    executaLoginSupervisor('/u11/cashme/dados')
    acessaContrato()
    validaCamposHeader()
  })
})
