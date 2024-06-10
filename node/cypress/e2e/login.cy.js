describe("login functionality", () => {
    beforeEach(() => {
        cy.clearCookie("authToken");
        cy.visit("http://localhost:8080/login");
    });

    afterEach(() => {
        cy.clearCookie("authToken");
    });

    it("can login and generate auth token", () => {
        // Login
        cy.get("#username").type("staff1");
        cy.get("#password").type("password");
        cy.get('[type="submit"]').click();

        // Assert
        cy.getCookie("authToken")
            .should("exist")
            .then((cookie) => {
                // Since JWT decoding doesn't behave well in the browser, I have
                // omitted the the token verification step
                //
                //const decodedToken = jwt.verify(token, "super-secret");
                //expect(decodedToken).to.have.property("username", "staff1");
            });
        //cy.url().should("include", "/map");
        cy.url().should('eq', 'http://localhost:8080/')
    });

    it("reject invalid username", () => {
        cy.get("#username").type("abcde");
        cy.get("#password").type("password");
        cy.get('[type="submit"]').click();

        cy.url().should("include", "/login");
    });

    it("reject invalid password", () => {
        cy.get("#username").type("staff1");
        cy.get("#password").type("incorrect password");
        cy.get('[type="submit"]').click();

        cy.url().should("include", "/login");
    });
});
