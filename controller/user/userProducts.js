var productHelper = require("../../helper/product-helper");
var userHelper = require('../../helper/user-helpers')


exports.product = async (req, res) => {
  let cartCount = await userHelper.getCartCount(req.session.user._id)
  let id = req.params.id
  let IDlength = id.length
  console.log(IDlength)
  if (IDlength != 24) {
    res.redirect('/users/useraccount')
  } else {
    productHelper.findProduct(id).then((item) =>{
      console.log(".then is working now");
      let user = req.session.user;
      res.render("user/itemview", { user: true, item, cartCount, user });
    }).catch(()=>{
      console.log(".catch is working right now");
      res.redirect('/users/useraccount')
    })
  }
}


exports.search = (req,res)=>{
  let key = req.body.key
  console.log(key);
  productHelper.searchProduct(key).then((productdata)=>{
    console.log(productdata);
    res.render('user/search',{user:true,productdata})

  })
}