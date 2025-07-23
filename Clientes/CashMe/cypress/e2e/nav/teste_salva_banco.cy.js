describe('Teste com registro de resultado e tempo', () => {
  let nomeDoTeste = 'Verificação do título';
  let inicioExecucao;

  beforeEach(() => {
    inicioExecucao = new Date().toISOString();
  });

  it(nomeDoTeste, () => {
    cy.visit('https://example.com');
    cy.get('h1').should('contain', 'Título Errado');
  });

  afterEach(function () {
    const fimExecucao = new Date().toISOString();
    const status = this.currentTest.state === 'passed' ? 'SUCESSO' : 'FALHA';
    const mensagem = this.currentTest.err ? this.currentTest.err.message : 'Teste passou';

    cy.task('salvarResultado', {
      nomeTeste: nomeDoTeste,
      status,
      mensagem,
      dataInicio: inicioExecucao,
      dataFim: fimExecucao,
    });
  });
});
