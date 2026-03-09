import 'cypress-file-upload';
/// <reference types="cypress" />

/**
 * Programmatic SGC login — bypasses the UI login form by calling the user
 * service directly via cy.request(), then storing the JWT in localStorage.
 * This avoids Electron rate-limiting / CORS quirks that affect the UI form.
 */
Cypress.Commands.add('loginSGC', (username?: string, password?: string) => {
    const user = username || Cypress.env('SGC_USER') || 'sgc-uploader';
    const pass = password || Cypress.env('SGC_PASS') || 'password';
    cy.request({
        method: 'POST',
        url: 'https://users.kpndataregistry.org/api/auth/login/',
        body: { username: user, password: pass, group: 'sgc' },
        headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.access).to.exist;
        localStorage.setItem('sgcAuthToken', response.body.access);
    });
});

/**
 * Programmatic CALR login.
 */
Cypress.Commands.add('loginCALR', (username?: string, password?: string) => {
    const user = username || Cypress.env('CALR_USER') || 'calr-test';
    const pass = password || Cypress.env('CALR_PASS') || 'password';
    cy.request({
        method: 'POST',
        url: 'https://users.kpndataregistry.org/api/auth/login/',
        body: { username: user, password: pass, group: 'calr' },
        headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.access).to.exist;
        localStorage.setItem('calrAuthToken', response.body.access);
    });
});
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
