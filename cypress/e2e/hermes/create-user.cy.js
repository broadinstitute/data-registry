describe('Tests for creating a new user', () => {
  it('reviewer should be able to create new user and that user should be able to login',
    () => {
      cy.intercept('POST', '**/api/login').as('loginRequest');
      cy.visit('/hermes/login');
      cy.get('input[id="email"]').type('reviewer');
      cy.get('input[type="password"]').type('password');
      cy.contains('button', 'Sign In').click();
      cy.wait('@loginRequest');
      cy.get('i.bi-person', {timeout: 10000}).click();
      cy.contains('span.p-menuitem-text', 'Add User').click();
      cy.get('input[placeholder="Email"]').type('testuser5@foo.com');
      cy.get('input[placeholder="Enter password"]').type('test_pass').blur();
      cy.get('input[placeholder="Confirm password"]').type('test_pass').blur();
      cy.get('span[aria-haspopup="listbox"]').type('uploader').type('{enter}');
      cy.contains('span.p-button-label', 'Create User').click();
      cy.contains('.p-toast-detail', 'User testuser5@foo.com created successfully').should('exist');
      cy.get('i.bi-person').click();
      cy.contains('span.p-menuitem-text', 'Sign out').click();
      cy.get('input[id="email"]').type('testuser5@foo.com');
      cy.get('input[type="password"]').type('test_pass');
      cy.contains('button', 'Sign In').click();
      cy.contains('.p-button-label', 'Upload').should('exist');
    });
});
