Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-e2e=${selector}]`, ...args);
});
