const userHelpers = require("../../helper/user-helpers");
const adminHelper = require("../../helper/admin-helper");

//view user details
exports.UserData = function (req, res, next) {
  console.log("users display tab");
  userHelpers.userdatas().then((userdata) => {
    let data = userdata;
    res.render("admin/menu/users", { admin: true, data });
  });
};


exports.BlockUser  =(req, res) => {
    console.log("block user function");
    let id = req.params.id;
    console.log(id);
    adminHelper.blockUser(id).then((usermessage) => {
      console.log(usermessage);
      res.redirect("/admin/users");
    });
  }