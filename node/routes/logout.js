var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create logout page. */
router.get(
    "/",
    LoginRegisterController.checkAuthToken,
    LoginRegisterController.collectAuthTokenData,
    function (req, res, next) {
        res.render("logout", { loggedIn: req.loggedIn, user: req.user, selectedNav:"logoutNav",title:"Logout" });
    }
);

router.post("/", function (req, res, next) {
    return LoginRegisterController.revokeAuthToken(res).redirect("/");
});

module.exports = router;
