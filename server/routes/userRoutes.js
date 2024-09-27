const express = require("express");
const { login, signup,reset_password,feedback,Allfeedbacks,booking,Allrecords,send_recovery_email} = require("../controllers/usercontroller");
const router = express.Router();

router.route("/login").get(login);
router.route("/signup").post(signup);
router.route("/reset_password").post(reset_password);
router.route('/feedback').post(feedback);
router.route('/feedbacks').get(Allfeedbacks);
router.route('/booking').post(booking);
router.route('/Allrecords').get(Allrecords);
router.route('/send_recovery_email').post(send_recovery_email);

module.exports = router;