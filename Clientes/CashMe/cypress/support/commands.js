// ---------------- Soft Assert ---------------- //
let softErrors = [];

Cypress.Commands.add('softAssert', (condition, message) => {
  if (!condition) {
    cy.log(`❌ ${message}`);
    softErrors.push(message);
  }
});

Cypress.Commands.add('checkSoftAsserts', () => {
  if (softErrors.length > 0) {
    cy.wrap(null, { log: false }).then(() => {
      throw new Error(`Erro(s) encontrado(s):\n${softErrors.join('\n')}`);
    });
  }
});

beforeEach(() => {
  softErrors = [];
});

// ---------------- Testes de Navegação ----------------;
Cypress.Commands.add('loginSupervisor', () => {
  const usuario = 'supervisor';
  const senha = 'Tempo+2023';
  const ambienteOperacional = '/u11/cashme/dados'

  cy.visit('http://10.3.98.108/aejs/');
  cy.title().should('include', 'AEJS');

  cy.contains('Nome').type(usuario);
  cy.contains('Senha').type(senha, { delay: 50 });
  cy.contains('Ambiente').type(ambienteOperacional);
  cy.contains('Login').click();
});

Cypress.Commands.add('acessarContrato', (contrato) => {
  cy.contains('SCCI').click();
  cy.contains('Contratos e Mutuários').click();
  cy.contains('Pesquisar', { timeout: 10000 }).should('be.visible');
  cy.contains('Contrato').type(contrato);
  cy.contains('Pesquisar').click();
  cy.contains('Adquirente_', { timeout: 10000 }).last().should('be.visible').dblclick();
});

// ---------------- Testes de Planilhas ----------------;
const XLSX = require('xlsx');

Cypress.Commands.add('readExcel', (filePath) => {
  return cy.task('parseXlsx', filePath);
});

Cypress.Commands.add('readExcelCell', (filePath, cell) => {
  return cy.task('parseXlsxCell', { filePath, cell });
});