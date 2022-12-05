const { Db } = require("mongodb");
var userHelper = require("../../helper/user-helpers");

exports.placeOrder = (req, res) => {
  let id = req.session.user._id;
  userHelper.oderlist(id).then((data) => {
    let user = req.session.user;
    res.render("user/orderlist", { data, user: true, user });
  });
};

exports.payment = async (req, res) => {
  console.log(req.body);
  let payment = req.body.payment;
  let id = req.session.user._id;
  let productData = await userHelper.getCartPorduct(id);
  let totalAmount = await userHelper.getTotalAmount(id);
  let address = req.body.address;
  console.log(productData);
  let coupon = null
  if (req.body.couponDiscount) {
    coupon = {
      couponDiscount: req.body.couponDiscount,
      totalAmount: req.body.totalAmount ,
      couponCode : req.body.coupon
    }
  }
  
if (payment == "WALLET") {
 
 let wallet = await userHelper.walletdetails(id)
 if(wallet.balance < totalAmount){
    res.json({wallet : true})
 }
} 
  
  console.log(coupon,"orrrrrrrrrrrrrrrrrrrrddddddddddddddeeeeeeeeerrrrrrrrrrrrr");
  userHelper.placeOrder(productData, totalAmount, address, id, payment,coupon)
    .then((oderid) => {

      if (payment == "COD") {
        res.json({ codsucces: true })
      } else if(payment == "WALLET" ){
        res.json({walletpayment:true})
      }else{

        if (req.body.couponDiscount) {
          totalAmount = req.body.totalAmount
          userHelper.generatRazorpay(oderid, totalAmount).then((response) => {
            res.json(response)
          })
        } else {
          userHelper.generatRazorpay(oderid, totalAmount).then((response) => {
            res.json(response)
          })
        }
      }
    });

};

exports.varifyPayment = (req, res) => {
  console.log(req.body);
  console.log("verify payment 000000o0o0o0oo0o0o0o0o0oo0o0o0ooo0o0oo0oo0o0");
  
  userHelper
    .verifyPayment(req.body)
    .then(() => {
      console.log("verify payment 000000o0o0o0oo0o0o0o0o0oo0o0o0ooo0o0oo0oo0o0");
     
      // userHelper.changePaymentStatus(req.body.order.receipt).then(() => {
      //   console.log("payment succes");
        res.json({ status: true });
      // });

    })
    .catch((err) => {
      console.log(err);
      res.json({ status: false});
    });
};
