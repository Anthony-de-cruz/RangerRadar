describe("logout functionality", () => {
    beforeEach(() => {});

    it("redirects to login when not logged in", () => {
        cy.clearCookie("authToken");
        cy.visit("http://localhost:8080/logout");
        cy.url().should("include", "/login");
    });

    it("can logout when logged in", () => {
        // Log in
        // cy.clearCookie("authToken");
        // cy.visit("http://localhost:8080/login");
        // cy.get("#username").type("staff1");
        // cy.get("#password").type("password");
        // cy.get('[type="submit"]').click();

        cy.login("staff1", "password");

        // Log out
        cy.visit("http://localhost:8080/logout");
        cy.get('[type="submit"]').click();

        // Assert
        cy.getCookie("authToken").should("not.exist");
        cy.url().should("include", "/map");
    });
});
