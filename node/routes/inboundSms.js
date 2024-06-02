var express = require("express");
var router = express.Router();

const SmsController = require("../controllers/smsController");

router.get("/", SmsController.handleInboundSms);

router.post("/", SmsController.handleInboundSms);

module.exports = router;
