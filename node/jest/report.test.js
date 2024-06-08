const { Report } = require("../models/report");

describe("Report", () => {
    it("is built from string correctly", () => {
        var report = Report.buildFromString(`logging
            moderate
            1.23
            3.21
        `);

        expect(report.type).toEqual("logging");
        expect(report.severity).toEqual("moderate");
        expect(report.latitude).toBe(1.23);
        expect(report.longitude).toBe(3.21);
    });
});
