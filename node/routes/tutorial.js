var express = require("express");
var router = express.Router();
const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET users listing. */
router.get(
    "/",LoginRegisterController.collectAuthTokenData,
 function (req, res, next) {
    res.render("tutorial",{selectedNav:"tutorialNav",title:"Tutorial",loggedIn:req.loggedIn});
});

module.exports = router;
