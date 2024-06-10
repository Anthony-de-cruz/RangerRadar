var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var database = require("../controllers/databaseController");
const LoginRegisterController = require("../controllers/loginRegisterController");

const { query } = database;

/* GET report page. */
router.get(
    "/",
    LoginRegisterController.collectAuthTokenData,
    async function (req, res, next) {
        res.render("report", {
            title: "Report",
            loggedIn: req.loggedIn,
            user: req.user,
            selectedNav:"reportNav"
        });
    }
);

router.post(
    "/manual-form",
    [
        check("lat").notEmpty().isFloat().withMessage("Lat must be a number"),
        check("lat")
            .custom((value, { req }) => {
                const min = 12;
                const max = 13;
                const lat = parseFloat(value);
                if (lat >= max || lat < min) {
                    throw new Error("Invalid lat coordinates");
                }
                return true;
            })
            .withMessage("Lat must be in or near the village"),
        check("long").notEmpty().isFloat().withMessage("Long must be a number"),
        check("long")
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
        const type = req.body.formType;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array();
            console.debug(alert);
            res.render("report",{alert})
        } else {
            addReport(type, lat, lng);
            res.redirect("/");
        }
    }
);

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

module.exports = router;
