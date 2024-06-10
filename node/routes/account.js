const accountController = require("../controllers/accountController.js");
var express = require("express");
const LoginRegisterController = require("../controllers/loginRegisterController.js");
var router = express.Router();

router.get("/", LoginRegisterController.checkAuthToken, LoginRegisterController.collectAuthTokenData, function(req, res, next) {
    res.render("account", {});


});


router.post("/", LoginRegisterController.checkAuthToken, LoginRegisterController.collectAuthTokenData, async (req, res, next) => {
    const username = req.user.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const newPasswordConfirm = req.body.newPasswordConfirm;

    if (newPassword.localeCompare(newPasswordConfirm) != 0) {
        console.log("not equal passwords");

        return res.render("account", {
            registerResult: "PASSWORDS DON'T MATCH",
        });
    }

    console.log(
        "Attempted change password: " +
        username +
        "," +
        oldPassword +
        "," +
        newPassword
    );

    try {
        await accountController.updatePassword(
            username,
            newPassword
        );
        res.redirect("/");
    } catch (error) {
        console.log("ERR: password change failed", error);
        return res.render("account", {
            registerResult: "ERR: password update failed",
        });
    }
});


module.exports = router;
