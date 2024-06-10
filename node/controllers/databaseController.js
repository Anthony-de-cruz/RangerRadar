var pg = require("pg");
const { Pool } = pg;

class DatabaseController {
    // To be configured with environment variables in the future
    static pool = new Pool({
        host: "rr-postgres",
        user: "postgres",
        password: "password",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    /**
     * Query the database, and log it to console
     *
     * @returns The database query result as a pg.QueryArrayResult<any[]>
     * @throws When an invalid query is passed
     */
    static async query(text, params) {
        try {
            const start = Date.now();
            var res = await this.pool.query(text, params);

            const duration = Date.now() - start;
            console.log("executed query", {
                text,
                params,
                duration,
                rows: res.rowCount,
            });
            return res;
        } catch (err) {
            // Duplicate error code
            if (err.code === "23505") {
                console.error("Duplicate key error:", err.detail);
                throw new Error("Duplicate entry detected");
            } else {
                console.error("Database query error:", err);
                throw err;
            }
        }
    }

    /**
     * Perform an empty query to test the database connection
     * @returns Test success boolean
     */
    static async testConnection() {
        console.log("EXECUTING TEST QUERY");
        const result = await DatabaseController.query("SELECT 1 AS res;");
        if (result.rowCount == 1 && result.rows[0].res == 1) {
            console.log("TEST QUERY SUCCESSFUL");
            return true;
        } else {
            console.error("Unexpected database response: ", result);
            return false;
        }
    }
}

module.exports = DatabaseController;
