var userHelper = require("../../helper/user-helpers");

exports.addToCart = (req, res) => {
  userHelper.addtocart(req.params.id, req.session.user._id).then((result) => {
    // res.redirect('/users/useraccount')
    res.json({ status: true });
  });
  // res.redirect('user/itemview')
};

exports.viewCart = async (req, res) => {
  let id = req.session.user._id;
  let cartProducts = await userHelper.getCartPorduct(id);
  let user = req.session.user;
  let total = await userHelper.getTotalAmount(id);
  console.log(cartProducts);
  res.render("user/cart", { user: true, cartProducts, total, user });
};

exports.chengeQuantity = (req, res, next) => {
  console.log(req.body);
  let id = req.session.user._id;
  userHelper.changeProductQuantity(req.body).then(async (response) => {
    response.total = await userHelper.getTotalAmount(id)
    if(response.removeProduct == false){
    response.data = await userHelper.subtotal(id,req.body.product)
    }else if (response.stock){
      res.json(response)
    }
    console.log(response);
    res.json(response);
  });
};









exports.removeCartItem = (req, res) => {
  let productId = req.params.id;
  let userId = req.session.user._id;
  // console.log(productId)
  // console.log(userId)
  userHelper.removeItem(productId, userId).then((data) => {
    // console.log(data)
    res.redirect("/users/cart");
    // res.send('deleted')
  });
};
