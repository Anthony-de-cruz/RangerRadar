var express = require("express");
var router = express.Router();
const {check, validationResult} = require("express-validator");
var database = require("../controllers/databaseController");
const { query } = database;

/* GET home page. */
router.get("/", function (req, res, next) {
    console.debug("Hello there");
    res.render("map", { title: "Map" });
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
    console.debug("Hello!!!");
    const lat = req.body.lat;
    const lng = req.body.lng;
    const type = req.body.formType;

    const errors = validationResult(req);
    if (!errors.isEmpty()){
      const alert = errors.array();
      console.debug(alert);
      res.render("map",{title:"Map"});
    }
    else{
      addMarkerToDatabase(type,lat,lng);
      console.debug(lat);
      console.debug(lng);
      console.debug(type);
      res.render("map",{title:"Map"});
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
    console.debug("Hello map!!!");
    const lat = req.body.lat;
    const lng = req.body.lng;
    console.debug(`experiment 1 ${lat[0]}`);
    console.debug(`experiment 2 ${lat[1]}`);
    const type = req.body.popupType;
    console.debug(`lat is ${lat}`);
    console.debug(`lng is ${lng}`);


    const errors = validationResult(req);
    if (!errors.isEmpty()){
      const alert = errors.array();
      console.debug(alert);
      res.render("map",{title:"Map"});
    }
    else{
      addMarkerToDatabase(type,lat,lng);
      console.debug(lat);
      console.debug(lng);
      console.debug(type);
      res.render("map",{title:"Map"});
    }
  }
)

async function addMarkerToDatabase(type, lat, lng) {
  try {
    await query(
      `INSERT INTO report (report_type,severity,latitude,longitude)
      VALUES ($1, $2, $3, $4)`,
      ["erw","low",lat,lng]
    );
    console.log(`Inserted new marker:${type},low,${lat},${lng}`);
  } catch (error) {
    throw error;
  }
}

module.exports = router;
