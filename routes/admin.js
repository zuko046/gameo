var express = require("express")
var router = express.Router()
var multer = require("multer")
// var multerUpload = require('../utils/multer')
const path = require("path")

//admin session
var session = require('../utils/session')

upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});



//file require
var adminAuthentication = require("../controller/admin/adminAuthentication")
var admindashboard = require("../controller/admin/dashboard")
var product = require("../controller/admin/adminproducts")
var category = require("../controller/admin/category")
var user = require("../controller/admin/userdata")
var orders = require("../controller/admin/order")
var salesReport = require("../controller/admin/salesreport")
var productOffer = require("../controller/admin/productOffer")
var coupon = require("../controller/admin/coupon")
var banner = require('../controller/admin/banner')

//admin login page
router.get("/",session.CkeckAdminLogin, adminAuthentication.adminloginpagerender);
router.get("/loginErr",session.CkeckAdminLogin, adminAuthentication.errorlogin);
router.post("/login", adminAuthentication.admincheck);

//admin menu
//dashboard
router.get("/dashboard",session.UNCkeckAdminLogin, admindashboard.dashboardrender)
router.get("/dashboard/chart",admindashboard.chart)

// router.get("/dashboard/:days", admindashboard.adminReport);

//view product
router.get("/product",session.UNCkeckAdminLogin, product.viewproducts);

//add product
router.get("/addproduct", product.addproductPage);


router.post("/addproduct", upload.fields([
            { name: 'image1', maxCount: 1 },
            { name: 'image2', maxCount: 1 },
            { name: 'image3', maxCount: 1 },
            { name: 'image4', maxCount: 1 }]) , product.addproduct)
            

//delete product
router.get("/product/delete/:id", product.deleteproduct);

//edit product
router.get("/product/edit/:id", product.editProductsPageRender);
router.post("/product/edit/:id", upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }]), product.EditProduct);
//category
router.get("/category", category.ViewCategory);
//add category
router.post("/category/addcategory", category.addCategory);
router.get('/category/delete/:id',category.deleteCategory)
//users list ans block
router.get("/users", user.UserData);
router.get("/users/:id", user.BlockUser);

//orders
router.get("/orders", orders.listOrder);
router.post("/orders/changeStatus/:id", orders.changeStatus);

// sales report
router.get("/salesreport?", salesReport.salesReportpage);

router.get("/categoryoffer", category.offersetting);
router.post("/categoryoffer", category.addCategoryOffer);


router.get("/productoffer", productOffer.offerManagement);
router.post("/productoffer", productOffer.addProductOffer);

router.get("/coupon", coupon.couponManagement);
router.post("/addcoupon", coupon.addcoupon);
router.post("/deletecoupon", coupon.deleteCoupon);

router.get('/banner',banner.bannerManagement)
router.post('/changebanner', upload.single('banner') ,banner.changeBanner)

//logout
router.get("/logout", adminAuthentication.logout);

// session creation
// router.post('/adminlog', (req, res) => {
//   adminHelper.adminlogin(req.body).then((respondCheck) => {
//     console.log(respondCheck.email)
//     if (respondCheck.status) {
//       // req.session.loggedIn = true
//       // req.session.user = respondCheck.user
//       res.render('admin/adminhome')
//     } else {
//       console.log('admin failed to log in')
//       res.send('oops admin have no aduthentication')
//     }
//   })
// })

module.exports = router;
