describe('Tests that Verify Permissions', () => {
  it('uploader should not be able to review a dataset', () => {
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').type('uploader1');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.wait('@loginRequest');
    cy.wait(500);
    cy.get('.p-button.p-component.p-button-outlined.p-button-sm').eq(0).click();
    cy.contains('span.p-button-label', 'Pass').should('not.exist');
  });

  it('reviewer should be able to review a dataset', () => {
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').type('reviewer');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.wait('@loginRequest');
    cy.wait(500);
    cy.get('.p-button.p-component.p-button-outlined.p-button-sm').eq(0).click();
    cy.contains('span.p-button-label', 'Pass').click();
    cy.visit('/hermes');
    cy.wait(500);
    cy.contains('span.p-tag-value', 'REVIEW APPROVED').should('exist');
  });

  it('uploader should not be able to create a new user', () => {
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').type('uploader1');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.wait('@loginRequest');
    cy.wait(500);
    cy.get('i.bi-person').click();
    cy.contains('span.p-menuitem-text', 'Add User').should('not.exist');
  });

  it('reviewer should be able to create a new user', () => {
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').type('reviewer');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.wait('@loginRequest');
    cy.wait(500);
    cy.get('i.bi-person').click();
    cy.contains('span.p-menuitem-text', 'Add User').should('exist');
  });

});
