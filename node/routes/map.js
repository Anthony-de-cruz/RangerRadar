var express = require("express");
var router = express.Router();
const {check, validationResult} = require("express-validator");
var database = require("../controllers/databaseController");
const { query } = database;

/* GET map page. */
router.get("/", async function (req, res, next) {
    const reportData = await getReports();
    res.render("map", { title:"Map",reports:reportData});
});

router.post('/manual-form',
  [
  check('lat').notEmpty().isFloat().withMessage('Lat must be a number'),
  check('lat').custom((value,{req}) => {
    const min = 12;
    const max = 13;
    const lat = parseFloat(value);
    if (lat >= max || lat < min){
      throw new Error ('Invalid lat coordinates')
    }
    return true;
  }).withMessage("Lat must be in or near the village"),
  check('lng').notEmpty().isFloat().withMessage('Lng must be a number'),
  check('lng').custom((value,{req}) => {
    const min = 106;
    const max = 108;
    const lng = parseFloat(value);
    if (lng >= max || lng < min){
      throw new Error ('Invalid lng coordinates');
    }
    return true;
  }).withMessage('Lng must be in or near the village'),
  ],
  async (req,res,next)=>{
    const lat = req.body.lat;
    const lng = req.body.lng;
    const type = req.body.formType;

    const errors = validationResult(req);
    if (!errors.isEmpty()){
      const alert = errors.array();
      console.debug(alert);
      res.redirect("/map");
    }
    else{
      addReport(type,lat,lng);
      res.redirect("/map");
    }
  }
)

router.post('/map-form',
  [
  check('lat').custom((value,{req}) => {
    const min = 12;
    const max = 13;
    const lat = parseFloat(value);
    if (lat >= max || lat < min){
      throw new Error ('Invalid lat coordinates')
    }
    return true;
  }).withMessage("Lat must be in or near the village"),
  check('lng').custom((value,{req}) => {
    const min = 106;
    const max = 108;
    const lng = parseFloat(value);
    if (lng >= max || lng < min){
      throw new Error ('Invalid lng coordinates');
    }
    return true;
  }).withMessage('Lng must be in or near the village'),
  ],
  async (req,res,next)=>{
    const lat = req.body.lat;
    const lng = req.body.lng;
    const type = req.body.popupType;


    const errors = validationResult(req);
    if (!errors.isEmpty()){
      const alert = errors.array();
      console.debug(alert);
      res.redirect("/map");
    }
    else{
      addReport(type,lat,lng);
      res.redirect("/map");
    }
  }
)

router.post('/resolve-form',
  async (req,res,next)=>{
    const id = req.body.id;
    resolveReport(id);
    res.redirect("/map");
  }
)

async function addReport(type, lat, lng) {
  try {
    await query(
      `INSERT INTO report (report_type,severity,latitude,longitude)
      VALUES ($1, $2, $3, $4)`,
      [type,"low",lat,lng]
    );
    console.log(`Inserted new report:${type},low,${lat},${lng}`);
  } catch (error) {
    throw error;
  }
}

async function getReports() {
  try {
    const result = await query("SELECT * FROM report WHERE resolved=false;");
    return result.rows;
  } catch (error) {
    throw new Error("Failed to fetch reports: " + error.message);
  }
}

async function resolveReport(id){
  try {
    await query("UPDATE report SET resolved=true WHERE id=$1;",[id]);
  } catch (error) {
    throw new Error("Failed to resolve report: " + error.message);
  }
}

module.exports = router;
