var databaseController = require("../controllers/databaseController");
const { query } = databaseController;
const jwt = require("jsonwebtoken");

var User = require("../models/user");

class LoginRegisterController {
    static async registerUser(username, password, phone_number) {
        try {
            await query(
                `INSERT INTO staff (username, password, phone_number)
            VALUES ($1, $2, $3)`,
                [username, password, phone_number]
            );
            console.log(
                `Inserted new user: ${username}, ${password}, ${phone_number}`
            );
        } catch (error) {
            throw error;
        }
    }

    static generateAuthToken(res, username) {
        const token = jwt.sign({ username: username }, "super-secret", {
            expiresIn: "1h",
        });
        console.log(`Assigning user: ${username} the token: ${token}`);
        res.cookie("authToken", token, {
            path: "/", // Cookie is accessible from all paths
            expires: new Date(Date.now() + 3600000), // Cookie expires in 1 hour
            secure: false, // Cookie will only be sent over HTTPS
            httpOnly: false, // Cookie cannot be accessed via client-side scripts
        });
    }
    /**
     * Revoke current auth token
     */
    static revokeAuthToken(res) {
        return res.clearCookie("authToken");
    }

    /**
     * Put this middleware in front of any GET requests for protected web pages
     * that you must be logged in to see
     */
    static checkAuthToken(req, res, next) {
        const token = req.cookies.authToken;

        console.log("Checking auth token");

        if (!token) {
            console.log("No token found, redirecting to login");
            req.loggedIn = false;
            return res.redirect("/login");
        }

        try {
            const decoded = jwt.verify(token, "super-secret");
            console.log("Checking auth: " + decoded);
            req.loggedIn = true;
            return next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" + error });
        }
    }

    static async showLivefeed() {
        try {
            const result = await query(
                `SELECT * FROM report WHERE resolved=false;`
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Put this middleware in front of any GET requests for pages
     * that require user data
     */
    static async collectAuthTokenData(req, res, next) {
        const token = req.cookies.authToken;

        console.log("Checking auth token");

        if (!token) {
            console.log("No token found");
            req.loggedIn = false;
            req.user = null;
            return next();
        }

        try {
            const decoded = jwt.verify(token, "super-secret");
            console.log("Fetching user data for: " + decoded);
            req.loggedIn = true;
            req.user = await User.buildFromDB(decoded.username);
            return next();
        } catch (error) {
            console.error("Error in collectAuthTokenData: " + error);
            req.loggedIn = false;
            req.user = null;
            return next();
        }
    }
}
module.exports = LoginRegisterController;
