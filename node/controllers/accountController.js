const DatabaseController = require("./databaseController")

const { query } = DatabaseController;

class AccountController {
    static async updatePassword(username, newPassword) {
        try {
            await query(
                `UPDATE staff set password  = $1 WHERE username = $2;`,
                [newPassword, username]
            );
        }
        catch (error) {
            throw error
        }
    }
}

module.exports = AccountController;
