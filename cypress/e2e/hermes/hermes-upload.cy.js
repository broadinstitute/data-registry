describe('Hermes Upload', () => {
  it('uploads a dataset', () => {
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').type('uploader1');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.wait('@loginRequest');
    cy.wait(500);
    cy.visit('/hermes/upload');
    cy.get('#dataSetName').type('Cypress dataset');
    cy.get('.p-autocomplete-input').type('type 1 diab').blur();
    cy.get('#phenotype_0').click();
    cy.get("#cases").type("1000{enter}");
    cy.get("#controls").type("100{enter}");
    cy.get("#subjects").type("100{enter}");
    cy.get('input[type="file"]').attachFile('sample-gwas.csv');
    cy.get('.p-dropdown-label.p-inputtext').eq(1).type('chromosome').type('{enter}');
    cy.get('.p-dropdown-label.p-inputtext').eq(2).type('position').type('{enter}');
    cy.get('.p-dropdown-label.p-inputtext').eq(3).type('alt').type('{enter}');
    cy.get('.p-dropdown-label.p-inputtext').eq(4).type('reference').type('{enter}');
    cy.get('.p-dropdown-label.p-inputtext').eq(5).type('eaf').type('{enter}');
    cy.get('.p-dropdown-label.p-inputtext').eq(6).type('beta').type('{enter}');
    cy.get('.p-dropdown-label.p-inputtext').eq(7).type('stdErr').type('{enter}');
    cy.get('.p-dropdown-label.p-inputtext').eq(8).type('pVale').type('{enter}');
    cy.get('button[aria-label="Upload"]').click();
    cy.location('pathname').should('eq', '/hermes');
  });
});
