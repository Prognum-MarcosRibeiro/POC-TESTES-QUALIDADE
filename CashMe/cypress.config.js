const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    supportFile: 'CashMe/cypress/support/e2e.js',
    specPattern: 'CashMe/cypress/e2e/**/*.cy.js',
    screenshotsFolder: 'CashMe/cypress/screenshots',
    videosFolder: 'CashMe/cypress/videos',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'CashMe/cypress/reports/html',
      overwrite: false,
      html: true,
      json: true
    }
  },
})
