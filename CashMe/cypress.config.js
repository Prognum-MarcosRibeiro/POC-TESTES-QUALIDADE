const { defineConfig } = require('cypress');
const fs = require('fs');
const pdf = require('pdf-parse');

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
        }
      });
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