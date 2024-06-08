const { Report } = require("../models/report");

describe("Report", () => {
    it.todo("is constructed correctly");
    it("is built from string correctly", () => {
        var report = Report.buildFromString(`logging
            moderate
            1.23
            3.21
        `);

        expect(report.type).toBe("logging");
        expect(report.severity).toBe("moderate");
        expect(report.latitude).toBe(1.23);
        expect(report.longitude).toBe(3.21);
    });
});
