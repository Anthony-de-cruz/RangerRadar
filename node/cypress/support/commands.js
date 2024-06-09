// ***********************************************
// This example commands.js shows you how to
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

Cypress.Commands.add("login", (username, password) => {
    cy.request({
        method: "POST",
        url: "http://localhost:8080/login",
        body: {
            username: username,
            password: password,
        },
    }).then((resp) => {
        cy.window().then((win) => {
            win.sessionStorage.setItem("authToken", resp.body.authToken);
        });
    });
});

Cypress.Commands.add("clearDb", () => {
    cy.exec("npm run clear-db").then((result) => {
        console.log("stdout:", result.stdout);
        console.log("stderr:", result.stderr);
        expect(result.code).to.eq(0); // Assert that the script exits with code 0
    });
});

Cypress.Commands.add("seedDb", () => {
    cy.exec("npm run seed-db").then((result) => {
        console.log("stdout:", result.stdout);
        console.log("stderr:", result.stderr);
        expect(result.code).to.eq(0); // Assert that the script exits with code 0
    });
});

Cypress.Commands.add("randomInboundSms", () => {
    cy.exec("npm run random-inbound-sms").then((result) => {
        console.log("stdout:", result.stdout);
        console.log("stderr:", result.stderr);
        expect(result.code).to.eq(0); // Assert that the script exits with code 0
    });
});
