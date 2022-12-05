const adminHelper = require("../../helper/admin-helper");
const productHelper = require("../../helper/product-helper");

exports.offerManagement = (req,res)=>{
    productHelper.displayProduct().then((product)=>{
        console.log(product);
    res.render('admin/menu/productOffer',{admin:true , product })

    })
}

exports.addProductOffer = (req,res)=>{
    console.log(req.body);
    let productId = req.body.productId
    let productDiscount = req.body.productDiscount
    productHelper.addPorductOffer(productId,productDiscount).then((response)=>{
        res.send(response)
    })
}