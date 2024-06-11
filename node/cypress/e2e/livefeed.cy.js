describe("Livefeed", () => {
    beforeEach(() => {
        cy.clearDb();
        cy.seedDb();
        cy.visit("http://localhost:8080/livefeed");
    });
    it("displays existing reports", () => {
        for (var x = 1; x < 7; x++) {
            cy.get(`:nth-child(1) > :nth-child(1)`).should("exist");
        }
        cy.get(`:nth-child(7) > :nth-child(1)`).should("not.exist");
    });
});
