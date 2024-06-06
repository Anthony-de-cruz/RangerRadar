var databaseController = require("../controllers/databaseController");
const { query } = databaseController;

class LoginRegisterController {
    static async registerUser(username, password, phone_number) {
        try {
          await query(
            `INSERT INTO staff (username, password, phone_number)
            VALUES ($1, $2, $3)`,
            [username, password, phone_number],
          );
          console.log(`Inserted new user: ${username}, ${password}, ${phone_number}`);
        } catch (error) {
          throw error;
        }
      }
}
module.exports = LoginRegisterController;
