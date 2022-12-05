const adminHelper = require("../../helper/admin-helper");
const productHelper = require("../../helper/product-helper");
// category
exports.ViewCategory = function (req, res, next) {
    productHelper.viewcategory().then((categorydata) => {
      console.log(categorydata);
      res.render("admin/menu/category", { admin: true, categorydata });
    });
  };
  // edit category
exports.addCategory = (req, res) => {
    console.log("add category === " + req.body.categoryname);
    console.log(req.body);
    let categoryname = req.body
    
    productHelper.addcategory(categoryname).then((data) => {
      console.log(data);
      res.redirect("/admin/category")
    }).catch(()=>{
      swal("The Category is already Exist !!")    
      res.redirect("/admin/category")
    })
  };

exports.deleteCategory = (req,res)=>{
    let id = req.params
    console.log(id);
    productHelper.deleteCategory(id).then(()=>{
      res.redirect('/admin/category')
    })

  }

exports.offersetting = (req,res)=>{
    productHelper.viewcategory().then((category)=>{
      console.log(category);
      res.render('admin/menu/categoryoffer',{category,admin:true})
    })
  }

exports.addCategoryOffer = (req,res)=>{
    console.log(req.body,"cateegory offer");
    let discountvalue = req.body.discountvalue
    let categoryname =  req.body.categoryname
    productHelper.addCategoryOffers(categoryname,discountvalue).then((response)=>{
      res.send(response)

    })
  }
