function baixarPdfDoPretendente(params, caminhoDestino) {
  const urlBase = 'http://10.3.98.108/aejs/';

  return cy.request({
    method: 'GET',
    url: `${urlBase}rest/w/wtela/tela`,
    qs: params
  }).then((response) => {
    const body = response.body;

    const src = body.tela.frame.iframe.src;

    if (!src) throw new Error('PDF não encontrado em tela.frame.iframe.src');

    const pdfUrl = `${urlBase}${src}`;

    return cy.request({
      url: pdfUrl,
      encoding: 'binary'
    }).then((resPdf) => {
      return cy.task('salvarArquivo', { caminho: caminhoDestino, conteudo: resPdf.body });
    });
  });
}

describe('Download e validação de PDF via JSON iframe src', () => {
  it('Deve baixar e validar conteúdo do PDF', () => {
    const caminhoPdf = 'cypress/e2e/pdf/boleto.pdf';

    const params = {
      _dc: 1751463390001,
      NU_PRETENDENTE: '000015782',
      CO_TAXA: '11945',
      tela: 'imprimeboletotaxaspretendente',
      sessionKey: '15652MPPJOKBCBONPMDMOMJPD',
      contexto: 'CORP_WEB',
      userName: 'supervisor',
      ambienteOperacional: '/u11/banpara/dados'
    };

    baixarPdfDoPretendente(params, caminhoPdf).then(() => {
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
});