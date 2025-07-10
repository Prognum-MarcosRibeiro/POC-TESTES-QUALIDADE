describe('Leitura de PDF - Tarifas Pretendente', () => {
  it('', () => {
    const caminhoPdf = 'cypress/e2e/pdf/boleto_recibo_consolidado.pdf';

    cy.task('lerPdf', caminhoPdf).then((textoPdf) => {
      cy.log(textoPdf);
      expect(textoPdf).to.include('BANCO RODOBENS S/A');
      expect(textoPdf).to.include('Cidade de São Paulo, Estado de São Paulo, à Rua Estado de Israel, nº 975, Cep 04022-002');
      expect(textoPdf).to.include('PRESTAÇÃO');
      expect(textoPdf).to.include('620,59');
      expect(textoPdf).to.include('10/07/2025');
      expect(textoPdf).to.include('    34191.75017 00996.091245 81070.110002 7 11680000062059');
    });
  });
});