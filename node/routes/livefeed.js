var express = require("express");
var router = express.Router();

var database = require("../controllers/databaseController");
const LoginRegisterController = require("../controllers/loginRegisterController");

const { query } = database;

router.get("/", LoginRegisterController.collectAuthTokenData,
async function (req, res, next) {
    try {
        const reports = await LoginRegisterController.showLivefeed();
        res.render("livefeed", { reports,loggedIn:req.loggedIn,selectedNav:"livefeedNav"});
    } catch (error) {
        console.error("Failed to fetch reports:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
