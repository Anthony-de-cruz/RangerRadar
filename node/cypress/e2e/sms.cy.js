context("SMS System", () => {
    describe("Reporting via SMS", () => {
        beforeEach(() => {
            cy.clearDb();
            cy.seedDb();
        });
        it("build report from sms service request", () => {
            // Send an sms webhook request
            cy.request({
                url: "http://localhost:8080/webhooks/inbound-sms",
                qs: {
                    msisdn: "110000000000",
                    to: "110000000000",
                    messageId: "",
                    text: "logging\nlow\n12.58280\n106.94015",
                    type: "text",
                    keyword: "LOGGING\nLOW\n12.58280\n106.94015",
                    apiKey: "api-key",
                    messageTimestamp: "2024-06-05+13:53:25",
                },
            }).then((response) => {
                // Assert http status
                expect(response).property("status").to.equal(204);
            });

            //cy.visit("http://localhost:8080/map");
            cy.visit('http://localhost:8080/');

            // Assert that the report details are correct
            cy.get(".popup-content > :nth-child(1)").should(
                "have.text",
                "Lat: 12.58280",
            );
            cy.get(".popup-content > :nth-child(2)").should(
                "have.text",
                "Lng: 106.94015",
            );
        });
    });
});
