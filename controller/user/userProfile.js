const { ObjectId, Db } = require("mongodb");
const collection = require("../../bin/config/collection");
var userHelper = require("../../helper/user-helpers");

exports.profile = (req,res)=>{
  let userid = req.session.user._id
  console.log("yo profiele");
  console.log(userid);
  userHelper.userProfile(userid).then((user)=>{
    console.log(user);
    res.render('user/account/profile',{user:true , user })
  })
}
exports.profileEdit = (req,res)=>{
  let userid = req.session.user._id
  userHelper.userProfile(userid).then((user)=>{
    console.log(user);
    res.render('user/account/edituser/edituserprofile',{ user:true , user })
  })
}
exports.saveUser = (req,res)=>{
  console.log(req.body);
  let id = req.session.user._id
  userHelper.saveUserData(id,req.body).then(()=>{
    res.redirect("/users/profile")
  })
}

//render order list
exports.userHistory = async (req, res) => {
  let userid = req.session.user._id
  // let usr = await userHelper.userProfile(userid)
  userHelper.oderlist(userid).then((data) => {
    console.log(data);
    res.render("user/account/history", {user:true , data  })
  })
};
//render single order
exports.singleOrder = (req,res)=>{
  let orderId = req.params.id
  console.log("hai single order",orderId)
  userHelper.oneOrder(orderId).then((orderdata)=>{
    console.log(orderdata);
    res.render('user/account/order/userOrder',{user:true,orderdata})
  })
}
//cancel the order
exports.cancelorder = (req,res)=>{
  let orderid = req.params.id
  console.log(orderid);
  let id = req.session.user._id
  userHelper.cancelOrder(orderid,id).then(()=>{
    res.json({status:true})
  })
}
//return the order
exports.returnOrder = (req,res)=>{
  let orderid = req.params.id
  console.log(orderid)
  let id = req.session.user._id
  userHelper.returnOrder(orderid,id).then(()=>{
    res.json({status:true})
  })
}

exports.invoice = (req,res)=>{
  let orderid = req.params.id
  console.log(orderid)
  // let id = req.session.user._id
  userHelper.oneOrder(orderid).then((data)=>{
    res.render("user/account/order/invoice",{user:true,data})
  })
}





exports.address = (req, res) => {
  userHelper.viewAddress(req.session.user._id).then((useradds)=>{
    console.log(useradds);
  res.render("user/account/address", {user:true , useradds})
  })
}
exports.addaddress = (req,res)=>{
  res.render("user/account/edituser/addaddress",{user:true})
}
exports.addaddressone =(req,res)=>{
  console.log(req.body);
  userHelper.addAddress(req.body,req.session.user._id)
  res.redirect('/users/address')
}

//user password
exports.password=(req, res) => {
  res.render("user/account/edituser/edituserpassword", {user:true})
}
exports.changepassword = (req,res)=>{
  console.log(req.body);
  userHelper.changePassword(req.session.user._id,req.body).then(()=>{

  })
}



// cancel single product
exports.cancelSingleProduct =(req,res)=>{

  console.log(req.body);
  let orderid = req.body.orderid
  let productid = req.body.productid
  console.log("cancel single product");
  userHelper.cancelSingleProduct(orderid,productid).then(()=>{
    res.json({status:true})
  })
}
// return single product
exports.returnSingleProduct = (req,res)=>{
  let orderid = req.body.orderid
  let productid = req.body.productid
  let id = req.body.user._id
  console.log("return single product")
  userHelper.returnSingleProduct(orderid,productid,id).then(()=>{
    res.json({status:true})
  })
}