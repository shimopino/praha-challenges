// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      getBySel(selector: string);
    }
  }
}

/**
 * Getting Element by name [data-e2e]
 */
Cypress.Commands.add('getBySel', (selector) => {
  return cy.get(`[data-e2e=${selector}]`);
});
