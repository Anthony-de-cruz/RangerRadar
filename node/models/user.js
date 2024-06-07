var databaseController = require("../controllers/databaseController");
const { query } = databaseController;

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    /**
     * Build an instance from a prexisting DB record
     */
    static async buildFromDB(username) {
        const result = await query("SELECT * FROM staff WHERE username = $1;", [
            username,
        ]);
        if (result.rowCount != 1) {
            throw new Error("Username not found in DB");
        }
        const userData = result.rows[0];

        return new User(userData.username, userData.password);
    }
}
module.exports = User;
