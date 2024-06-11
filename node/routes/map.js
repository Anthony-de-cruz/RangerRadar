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
        const poiData = await getPois();
        res.render("map", {
            title: "Map",
            loggedIn: req.loggedIn,
            user: req.user,
            reports: reportData,
            pois:poiData,
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
            try{
              await addReport(type, lat, lng);
            } catch(error){
              console.debug(error.message); 
            }
            res.redirect("/");   
        }
    }
);

router.post("/resolve-form", async (req, res, next) => {
    const id = req.body.id;
    try{
      await resolveReport(id);
    } catch (error){
      console.debug(error.message);
    }
    res.redirect("/");   
});

router.post(
  "/poi-form",
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
      const type = req.body.poiName;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const alert = errors.array();
          console.debug(alert);
          res.redirect("/");
      } else {
          try{
            await addPoi(type, lat, lng);
            res.redirect("/");
          } catch(error){
            console.debug(error.message);
          }
          res.redirect("/");   
      }
  }
);

router.post("/remove-poi", async (req, res, next) => {
  const name = req.body.poiName;
  try{
    await removePoi(name);
  } catch(error){
    console.debug(error.message);
  }
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

async function addPoi(name, lat, lng) {
  try {
      await query(
          `INSERT INTO poi (name,latitude,longitude)
    VALUES ($1, $2, $3)`,
          [name, lat, lng]
      );
      console.log(`Inserted new poi:${name},${lat},${lng}`);
  } catch (error) {
      throw error;
  }
}

async function getPois() {
  try {
      const result = await query(
          "SELECT * FROM poi;"
      );
      return result.rows;
  } catch (error) {
      throw new Error("Failed to fetch pois: " + error.message);
  }
}

async function removePoi(name) {
  try {
      await query("DELETE FROM poi WHERE name=$1;", [name]);
  } catch (error) {
      throw new Error("Failed to remove poi: " + error.message);
  }
}

module.exports = router;
