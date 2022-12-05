const { resolve } = require("path");
var userHelper = require("../../helper/user-helpers");

exports.viewWishList = (req,res)=>{
    userHelper.getwishlist(req.session.user._id).then((wishItem)=>{
        console.log(wishItem);
        res.render('user/wishlist',{user:true,wishItem })
    })
}

exports.addtowishlist= (req,res)=>{
    console.log('add to wish list');
    userHelper.addtowishlist(req.params.id, req.session.user._id).then((response)=>{
        res.json({status:true})
    }).catch((response)=>{
        res.json({status:false})
    })
}

exports.removeProduct = (req,res)=>{
    userHelper.removeWishListProduct(req.params.id,req.session.user._id).then((response)=>{
        console.log("last--success");
        res.json("success")
    })
}