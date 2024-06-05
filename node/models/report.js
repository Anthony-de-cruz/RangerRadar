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
     * Constructs a report object. The id is set to null as it is the
     * responsibility of the database to allocate.
     *
     * @throws When an invalid report type or severity are entered
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
     * Build a new report from a string. Tokenized by newlines (\n) in the order
     * of type, severity, latitude and longitude. The timestamp is set to the
     * current system time and the resolved bool is set to false.
     *
     * @param {string} string The input string to be parsed
     * @throws Exceptions that the constructor can throw
     * @returns The new report
     *
     * @example
     * var new_report = Report.buildFromString('logging\nlow\n1.1\n1.2');
     */
    static buildFromString(string) {
        var tokens = string.split("\n");
        tokens.forEach((element) => {
            element = element.trim().toLowerCase();
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
     * Insert this report instance into the database.
     *
     * @throws Will bubble up any errors from DatabaseController.query()
     */
    async insertIntoDb() {
        await DatabaseController.query(
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
