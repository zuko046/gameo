const adminHelper = require("../../helper/admin-helper");
const productHelper = require("../../helper/product-helper");
const userHelpers = require("../../helper/user-helpers");


 exports.couponManagement=(req,res)=>{
   adminHelper.viewCoupon().then((coupon)=>{
      console.log(coupon)

      res.render('admin/menu/coupon',{admin:true , coupon })

   })
 }

 exports.addcoupon=(req,res)=>{
   adminHelper.addCoupon(req.body).then((response)=>{
    console.log(response);
      res.json(response)
   })
 }

 exports.deleteCoupon = (req,res)=>{
   adminHelper.deleteCoupon(req.body.couponId).then((response)=>{
      res.json({status:true})
   })
 }

 