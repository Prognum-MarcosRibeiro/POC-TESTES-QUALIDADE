describe('CashMe | Planilha de Saldo Projetado', () => {
  it('', () => {
    const filePath = 'cypress/e2e/pdf/planilha_saldo_projetado.xls';
    cy.readExcelCell(filePath, 'D6').then((valor) => {
      expect(valor).to.equal('Adquirente_00000000002801');
    });
    cy.readExcelCell(filePath, 'B18').then((valor) => {
      expect(valor).to.equal('VALOR DA INCORPORAÇÃO  :   5.226,66');
    });
  });
});