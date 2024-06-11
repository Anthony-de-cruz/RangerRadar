var express = require("express");
var router = express.Router();

var database = require("../controllers/databaseController");
const LoginRegisterController = require("../controllers/loginRegisterController");

const { query } = database;

router.get("/", LoginRegisterController.collectAuthTokenData,
async function (req, res, next) {
    try {
        const reports = await LoginRegisterController.showLivefeed();
        res.render("livefeed", { reports,loggedIn:req.loggedIn,selectedNav:"livefeedNav",title:"Livefeed"});
    } catch (error) {
        console.error("Failed to fetch reports:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/resolve-report", async (req, res, next) => {
    const id = req.body.id;
    try{
      await resolveReport(id);
    } catch (error){
      console.debug(error.message);
    }
    res.redirect("/livefeed");   
});

async function resolveReport(id) {
    try {
        await query("UPDATE report SET resolved=true WHERE id=$1;", [id]);
    } catch (error) {
        throw new Error("Failed to resolve report: " + error.message);
    }
}

module.exports = router;
