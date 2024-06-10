var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var database = require("../controllers/databaseController");
const LoginRegisterController = require("../controllers/loginRegisterController");

const { query } = database;

/* GET map page. */
router.get(
    "/",
    LoginRegisterController.collectAuthTokenData,
    async function (req, res, next) {
        const reportData = await getReports();
        res.render("map", {
            title: "Map",
            loggedIn: req.loggedIn,
            user: req.user,
            reports: reportData,
            selectedNav:"mapNav"
        });
    }
);

router.post(
    "/map-form",
    [
        check("lat")
            .custom((value, { req }) => {
                const min = 12;
                const max = 13.3;
                const lat = parseFloat(value);
                if (lat >= max || lat < min) {
                    throw new Error("Invalid lat coordinates");
                }
                return true;
            })
            .withMessage("Lat must be in or near the village"),
        check("lng")
            .custom((value, { req }) => {
                const min = 106;
                const max = 108;
                const lng = parseFloat(value);
                if (lng >= max || lng < min) {
                    throw new Error("Invalid long coordinates");
                }
                return true;
            })
            .withMessage("Long must be in or near the village"),
    ],
    async (req, res, next) => {
        const lat = req.body.lat;
        const lng = req.body.long;
        const type = req.body.popupType;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array();
            console.debug(alert);
            res.redirect("/");
        } else {
            addReport(type, lat, lng);
            res.redirect("/");
        }
    }
);

router.post("/resolve-form", async (req, res, next) => {
    const id = req.body.id;
    resolveReport(id);
    res.redirect("/");
});

async function addReport(type, lat, lng) {
    try {
        await query(
            `INSERT INTO report (report_type,severity,latitude,longitude)
      VALUES ($1, $2, $3, $4)`,
            [type, "low", lat, lng]
        );
        console.log(`Inserted new report:${type},low,${lat},${lng}`);
    } catch (error) {
        throw error;
    }
}

async function getReports() {
    try {
        const result = await query(
            "SELECT * FROM report WHERE resolved=false;"
        );
        return result.rows;
    } catch (error) {
        throw new Error("Failed to fetch reports: " + error.message);
    }
}

async function resolveReport(id) {
    try {
        await query("UPDATE report SET resolved=true WHERE id=$1;", [id]);
    } catch (error) {
        throw new Error("Failed to resolve report: " + error.message);
    }
}

module.exports = router;
