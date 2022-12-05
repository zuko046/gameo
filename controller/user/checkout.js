var userHelper = require("../../helper/user-helpers");


exports.checkout = async (req, res) => {
  let id = req.session.user._id;
  let user = req.session.user;
  let data = await userHelper.getCartPorduct(id);
  let total = await userHelper.getTotalAmount(id);
  let address = await userHelper.viewAddress(id);
  console.log(address);
  res.render("user/checkout", { user: true, data, total, user ,address });
}