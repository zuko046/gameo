const adminHelper = require("../../helper/admin-helper");

exports.adminloginpagerender = function (req, res, next) {
  res.render("admin/adminlogin");
}

exports.errorlogin = function (req, res, next) {
  res.render("admin/adminlogin", { err: true });
}

exports.admincheck = function (req, res,next) {
  adminHelper.adminlogin(req.body).then((respondCheck) => {
    if (respondCheck.status) {
      req.session.adminlogin = true
      res.redirect("/admin/dashboard")

    } else {
      res.redirect("/admin/loginErr")
    }
  })
}

exports.logout = (req, res) => {
  req.session.adminlogin = false
  res.redirect("/admin");
}