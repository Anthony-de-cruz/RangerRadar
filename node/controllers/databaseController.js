var pg = require("pg");
const { Pool } = pg;

// To be replaced with environment variables
const pool = new Pool({
  host: "rr-postgres",
  user: "postgres",
  password: "password",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

class DatabaseController {
  /**
   * Query the database, and log it to console
   */
  static async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", {
      text,
      params,
      duration,
      rows: res.rowCount,
    });
    return res;
  }

  /**
   * Perform an empty query to test the database connection
   */
  static async testConnection() {
    console.log("EXECUTING TEST QUERY");
    const result = await DatabaseController.query("SELECT 1 AS res;");
    if (result.rowCount == 1 && result.rows[0].res == 1) {
      console.log("TEST QUERY SUCCESSFUL");
    } else {
      console.error("Unexpected database response: ", result);
    }
  }
}

module.exports = DatabaseController;
