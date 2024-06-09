context("Interactive Map", () => {
    describe("Navigation", () => {
        beforeEach(() => {
            cy.visit("http://localhost:8080/map");
        });

        it("can zoom in", () => {
            // Zoom in
            for (var x = 0; x < 5; x++) {
                cy.get(".leaflet-control-zoom-in").click();
            }
            // Assert that the map is zoomed in
        });

        it("can zoom out", () => {
            // Zoom out
            // Assert that the map is zoomed out
        });

        it("can only pan around within confines", () => {
            // Move around
            // Assert that the map is within the confines
        });

        it("can go to the town centre", () => {
            // Move around then centre
            // Assert that the map is at the town centre
            cy.get("#showVillageButton").click();
        });
    });
    describe("Reports", () => {
        beforeEach(() => {
            cy.visit("http://localhost:8080/map");
        });

        it("can generate new report", () => {
            // Select position on the map and create report
            cy.get("#map").click("center");
            cy.get("#poaching").click();
            cy.get("#mapFormSubmitButton").click();

            // Assert that the report has been generated
            cy.url().should("include", "/map");
        });
    });
});
