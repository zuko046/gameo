const { Console } = require("console");
var productHelper = require("../../helper/product-helper");
var userHelper = require("../../helper/user-helpers");
// var banner = require("../../controller/admin/banner")
var adminHelper = require("../../helper/admin-helper");


exports.landingPage = async function (req, res, next) {
  let cartCount = await userHelper.getCartCount(req.session.user._id);
  let banner = await adminHelper.getBanner()
  let user = req.session.user;
  productHelper.displayProduct().then((productdata) => {
    res.render("user/userhome", { user: true, productdata, cartCount, user ,banner });
  });
};

exports.console = (req,res)=>{
  productHelper.productConsole().then((products)=>{
  console.log(products);
  let category = "Console"

  res.render('user/productslist',{user:true,products,category})
  })
}

exports.accessories = (req,res)=>{
  productHelper.productAccessories().then((products)=>{
    console.log(products);
    let category = "Accessories"
  res.render('user/productslist',{user:true,products,category})
  })
}

exports.games = (req,res)=>{
  productHelper.productGames().then((products)=>{
    console.log(products);
    let category = "Games"
    console.log(products);
  res.render('user/productslist',{user:true,products,category})
  })
}

exports.contact = (req,res)=>{
  console.log("contact page");
  res.render('user/contact',{user:true})
}