var DatabaseController = require("../controllers/databaseController");

const ReportType = Object.freeze({
    ERW: "erw",
    POACHING: "poaching",
    MINING: "mining",
    LOGGING: "logging",
});

const ReportSeverity = Object.freeze({
    LOW: "low",
    MODERATE: "moderate",
    HIGH: "high",
});

class Report {
    /**
     *
     *
     *
     */
    constructor(type, severity, time, latitude, longitude, resolved) {
        if (!Object.values(ReportType).includes(type)) {
            throw new Error(`Invalid report type: ${type}`);
        }
        if (!Object.values(ReportSeverity).includes(severity)) {
            throw new Error(`Invalid report severity: ${severity}`);
        }
        this.id = null; // id will be set later when fetched from the database
        this.type = type;
        this.severity = severity;
        this.time = time;
        this.latitude = latitude;
        this.longitude = longitude;
        this.resolved = resolved;
    }

    /**
     *
     *
     */
    static buildFromString(string) {
        var tokens = string.split("\n");
        tokens.forEach((element) => {
            console.log(element);
            element = element.trim().toLowerCase();
            console.log(element);
        });
        var type = tokens[0];
        var severity = tokens[1];
        var latitude = tokens[2];
        var longitude = tokens[3];

        try {
            return new Report(
                type,
                severity,
                new Date(),
                latitude,
                longitude,
                false,
            );
        } catch (exception) {
            throw exception;
        }
    }

    /**
     *
     *
     *
     *
     */
    async insertIntoDb() {
        const result = await DatabaseController.query(
            `INSERT
            INTO 
            report (report_type, severity, time_of_report, latitude, longitude) 
            VALUES($1, $2, $3, $4, $5)`,
            [
                this.type,
                this.severity,
                this.time,
                this.latitude,
                this.longitude,
            ],
        );
    }
}

module.exports = { ReportType, ReportSeverity, Report };
