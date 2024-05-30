describe('Login page tests', () => {
  it('redirects to login for unlogged in user', () => {
    cy.visit('/datasets');
    cy.url().should('include', '/login');
    cy.get('input[id="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    //verify we're showing default logo
    cy.get('img').should('have.attr', 'src', '/tenants/default/dr-logo.png');
  });

  it('should show hermes logo for hermes login page', () => {
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('img').should('have.attr', 'src', '/tenants/hermes/logo.png');
  });

  it('should allow the user to login', () => {
    cy.visit('/');
    cy.get('input[id="email"]').type('admin');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.contains('th', 'Name').should('exist');
  });

  it("should redirect a hermes group user to hermes dataset page", () => {
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').type('uploader1');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.get('div.p-menubar.p-component').should('exist');
  });

  it("should give 403 error for hermes user trying to access non-hermes page", () => {
    cy.visit('/hermes/login');
    cy.get('input[id="email"]').type('uploader1');
    cy.get('input[type="password"]').type('password');
    cy.contains('button', 'Sign In').click();
    cy.get('div.p-menubar.p-component').should('exist');
    cy.visit('/datasets');
    cy.contains('h1', '403');
  });

});
