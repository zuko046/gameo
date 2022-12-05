var userHelper = require("../../helper/user-helpers");


// exports.applyCoupon = (req,res)=>{
//     console.log(req.body,'33333333333333333333333');
//     userHelper.applyCoupon(req.body.coupon).then(()=>{

//     })
// }

exports.applyCoupon = async (req,res)=>{
    let userId = req.session.user._id
    console.log(userId);
    console.log(req.session.user);
    let total = await userHelper.getTotalAmount(userId)
    console.log(total);
    console.log(req.body,total)
    userHelper.applyCoupon(req.body.coupon,total).then((resp)=>{

        let response = {}

        if (resp.err){

            console.log(resp,"not found");
            response = resp 
            console.log(response);
            res.json(response)

        } else {
            console.log(resp,"founded");
            response.discount = resp
            response.coupon = req.body.coupon
            console.log(response,"myre")
            
            res.json(response)

        }
    })
   }
