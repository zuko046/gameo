var express = require("express");
var router = express.Router();
//session
var session =require('../utils/session')

var userAuthentication = require("../controller/user/userAuthentication");

router.get("/",session.CkeckUserLogin,session.CkeckAdminLogin, userAuthentication.Home);

//signup page
router.get("/signup",session.CkeckUserLogin, userAuthentication.singupGet);

//create a new user account
router.post("/signup", userAuthentication.signupPost);



router.get("/forgetpassword",userAuthentication.forgotPassword)

router.post('/finduser',userAuthentication.findPhonenumberWithEmail)

router.post('/changepassword',userAuthentication.changePasswordFromOTP)




router.get("/login",session.CkeckUserLogin, userAuthentication.userloginpage)
//user email and password check
router.post("/userlog", userAuthentication.usercheck)

//otp varification
// router.get("/twofactor/:id", userAuthentication.otpPage)
// otp checking
// router.post("/twofactor/:id", userAuthentication.otpcheck)

module.exports = router;
