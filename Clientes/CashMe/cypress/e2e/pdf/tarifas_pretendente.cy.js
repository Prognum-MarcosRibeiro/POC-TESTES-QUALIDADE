describe('Leitura de PDF - Tarifas Pretendente', () => {
  it('', () => {
    const caminhoPdf = 'cypress/e2e/pdf/boleto.pdf';

    cy.task('lerPdf', caminhoPdf).then((textoPdf) => {
      cy.log(textoPdf);
      expect(textoPdf).to.include('Recibo do Pagador');
      expect(textoPdf).to.include('BRB BANCO DE BRASILIA SA CPF/CNPJ: 00.000.208/0001-00');
      expect(textoPdf).to.include('SBS QD 01 BL E ASA SUL BRASÍLIA-DF - 700729-000');
      expect(textoPdf).to.include('(=) Valor do Documento');
      expect(textoPdf).to.include('20,00');
    });
  });
});