const { defineConfig } = require('cypress');
const fs = require('fs');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');
const { gravarResultadoTeste } = require('./cypress/util/db');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        lerPdf(caminhoPdf) {
          const pdfBuffer = fs.readFileSync(caminhoPdf);
          return pdf(pdfBuffer).then(data => {
            return data.text;
          });
        },

        salvarArquivo({ caminho, conteudo }) {
          fs.writeFileSync(caminho, conteudo, 'binary');
          return null;
        },

        parseXlsx({ filePath }) {
          const workbook = XLSX.readFile(filePath);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        },

        parseXlsxCell({ filePath, cell }) {
          const workbook = XLSX.readFile(filePath);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const cellValue = worksheet[cell] ? worksheet[cell].v : null;
          return cellValue;
        },

        salvarResultado({ nomeTeste, status, mensagem, dataInicio, dataFim }) {
          return gravarResultadoTeste(nomeTeste, status, mensagem, dataInicio, dataFim)
            .then(result => {
              console.log('Resultado gravado com ID:', result.id);
              return null;
            })
            .catch(err => {
              console.error('Erro ao gravar resultado no PostgreSQL:', err);
              return null;
            });
        }
      });

      return config;
    },

    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: "cypress/reports/json",
      overwrite: false,
      html: false,
      json: true,
      inlineAssets: true
    },
    viewportWidth: 1500,
    viewportHeight: 700
  },
});