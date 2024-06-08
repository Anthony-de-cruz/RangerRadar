describe("logout functionality", () => {
    beforeEach(() => {});

    it("redirects to login when not logged in", () => {
        // Setup
        cy.clearCookie("authToken");

        // Logout
        cy.visit("http://localhost:8080/logout");

        // Assert
        cy.url().should("include", "/login");
    });

    it("can logout when logged in", () => {
        // Setup
        cy.login("staff1", "password");

        // Logout
        cy.visit("http://localhost:8080/logout");
        cy.get('[type="submit"]').click();

        // Assert
        cy.getCookie("authToken").should("not.exist");
        cy.url().should("include", "/map");
    });
});
