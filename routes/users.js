var express = require("express");
var router = express.Router();

const productHelper = require("../helper/product-helper");
var userHelper = require("../helper/user-helpers");
const collection = require("../bin/config/collection");


// twilio add the datas
// var client = require("twilio")(collection.accountSID, collection.authToken);


const verifyLogin = (req, res, next) => {
  if (req.session.userlogin) {
    next();
  } else {
    res.redirect('/')
  }
}

const verifyLogout = (req, res, next) => {
  if (req.session.userlogin) {
    res.redirect('/');
  } else {
    next()
  }
}
//session
var session =require('../utils/session')

//file require
var userAuthentication = require("../controller/user/userAuthentication");
var userHome = require("../controller/user/userhome");
var userProducts = require("../controller/user/userProducts");
var userCart = require("../controller/user/userCart");
var userCheckout = require("../controller/user/checkout");
var userOrder = require("../controller/user/order");
var userAccount = require("../controller/user/userProfile");
var wishList = require("../controller/user/wishlist");
var coupon = require("../controller/user/coupon")
var wallet = require("../controller/user/wallet");
const { route } = require("./default");

//userloginpage
router.get("/login",session.CkeckUserLogin, userAuthentication.userloginpage)
//user email and password check
router.post("/userlog", userAuthentication.usercheck)




//otp varification
// router.get("/twofactor/:id", userAuthentication.otpPage)
// otp checking
// router.post("/twofactor/:id", userAuthentication.otpcheck)

//user home page
router.get("/useraccount",session.UNCkeckUserLogin, userHome.landingPage);

//Category page
router.get('/console', userHome.console)
router.get('/games', userHome.games)
router.get('/accessories', userHome.accessories)
// contact page
router.get('/contact', userHome.contact)


// product view
router.get("/useraccount/itemview/:id", userProducts.product)
//ajax add to cart
router.get("/addcart/:id", userCart.addToCart)
//cartttt
router.get("/cart", userCart.viewCart)

//wishlist
router.get('/wishlist', wishList.viewWishList)
router.get('/addwishlist/:id',wishList.addtowishlist)
router.get('/removeProductWIshList/:id',wishList.removeProduct )

router.get("/logout", userAuthentication.userLogout)
//ajax change by + and -
router.post("/changeProductQuantity", userCart.chengeQuantity)

//remove prodct from cart by ajax
router.get("/removeCartItem/:id", userCart.removeCartItem)

//checkout
router.get("/cart/checkout", userCheckout.checkout)
router.post('/applycoupon',coupon.applyCoupon)
//place order render
router.get("/placeorder", userOrder.placeOrder)
//place order
router.post("/placeorder", userOrder.payment)

router.post("/verify-payment", userOrder.varifyPayment)

//user profile 
router.get("/profile", userAccount.profile)
router.get("/profile/edit",userAccount.profileEdit)
router.post('/profile/edit',userAccount.saveUser)

router.get("/wallet",wallet.viewWallet)

router.get("/history", userAccount.userHistory)
router.get('/history/order/:id',userAccount.singleOrder)
router.get("/cancelorder/:id",userAccount.cancelorder)
router.get("/returnorder/:id",userAccount.returnOrder)

router.get("/order/invoice/:id",userAccount.invoice)

// return as single products in case witout coupon applied
router.post('/history/order/cancelproduct',userAccount.cancelSingleProduct)
router.post('/history/order/returnproduct',userAccount.returnSingleProduct)

router.get("/address", userAccount.address)
router.get("/address/add", userAccount.addaddress)
router.post("/address/add", userAccount.addaddressone)

router.get("/password", userAccount.password)
router.post('/changepassword',userAccount.changepassword)

router.post("/search", userProducts.search)

module.exports = router;

//session

// function userCheck(req,res,next){
//   if (req.session.userlogin) {
//     next()
//   }
//   res.redirect('/users/login')
// }

// function userUnCheck(req,res,next){
//   if (req.session.userlogin == false) {
//     res.redirect('/users/useraccount')
//   }
//   next()
// }