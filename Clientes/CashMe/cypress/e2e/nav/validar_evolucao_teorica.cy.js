describe('CashMe | Validar Grid da Evolução Teórica', () => {
  it('', function () {
    
    function validarGridEvolucao() {
        cy.contains('div', '15/Jul/2025')
            .closest('table')
            .within(() => {
                cy.get('td').eq(1).should('contain', '15/Jul/2025')
                cy.get('td').eq(11).should('contain', '2.991,74')
            })
    }

    const numeroContrato='00001-9'
    cy.loginSupervisor();
    cy.acessarContrato(numeroContrato, "Evolução Teórica");
    validarGridEvolucao();
  });
});