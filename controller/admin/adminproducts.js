const productHelper = require("../../helper/product-helper");

const path = require("path");
var multer = require('multer')
const cloudinary = require("../../utils/cloudinary");
require('dotenv').config()


// view products
exports.viewproducts = function (req, res, next) {
  productHelper.displayProduct().then((productdata) => {
    res.render("admin/menu/products", { admin: true, productdata });
  });
};
//add products
exports.addproductPage = (req, res) => {
  productHelper.viewcategory().then((categorydata) => {
    console.log(categorydata);
    res.render("admin/menu/menufunctions/addproduct", {
      admin: true,
      categorydata,
    });
  });
};




// exports.addproduct = (req, res) => {
//   let theproduct = req.body;
//   let image = req.files.productImage;
//   productHelper.addProduct(theproduct).then((id) => {
//     console.log(theproduct.category);
//     console.log("id of the image want to set " + id);
//     image.mv("../../public/images/productimage/" + id + ".jpg");
//     res.redirect("/admin/product");
//   });
// };

// upload images
exports.addproduct = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const cloudinaryImageUploadMethod = (file) => {
      return new Promise((resolve) => {
          cloudinary.uploader.upload(file, (err, res) => {
              if (err){
                return res.status(500).send("upload image error");
              }else{
              resolve(res.secure_url);
              }
          });
      });
  };

  const files = req.files;
  let arr1 = Object.values(files);
  let arr2 = arr1.flat();

  const urls = await Promise.all(
      arr2.map(async (file) => {
          const { path } = file;
          const result = await cloudinaryImageUploadMethod(path);
          return result;
      })
    )
    console.log(urls);

    productHelper.addProduct(req.body,urls , (insertedId) => {
      console.log(insertedId);
      res.redirect('/admin/product')
  })
}
      
      
  //     ).then((id) => {
  //   res.redirect("/admin/product");
  //   });
  // };



//delete products
exports.deleteproduct = (req, res) => {
  let id = req.params.id;
  console.log(id);
  productHelper.deleteproduct(id).then((info) => {
    console.log(info);
    res.redirect("/admin/product");
  });
};
// edit products
exports.editProductsPageRender = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let product = await productHelper.findProduct(id);
  productHelper.viewcategory().then((categorydata) => {
    res.render("admin/menu/menufunctions/editproduct", {
      admin: true,
      product,
      categorydata,
    });
  });
};
exports.EditProduct = async (req, res) => {
  let img = {}
console.log(req.files.image1);
console.log(req.files.image2);
console.log(req.files.image3);
console.log(req.files.image4);

if (req.files.image1) {
  img.img1=true
}else{
  img.img1=false
}
if (req.files.image2) {
  img.img2=true
}else{
  img.img2=false
}
if (req.files.image3) {
  img.img3=true
}else{
  img.img3=false
}
if (req.files.image4) {
  img.img4=true
}else{
  img.img4=false
}


console.log("multer upload image");
  const cloudinaryImageUploadMethod = (file) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err, res) => {
            if (err){
              return res.status(500).send("upload image error");
            }else{
            resolve(res.secure_url);
            }
        });
    });
};

const files = req.files;
let arr1 = Object.values(files);
let arr2 = arr1.flat();

const urls = await Promise.all(
    arr2.map(async (file) => {
        const { path } = file;
        const result = await cloudinaryImageUploadMethod(path);
        return result;
    })
  )
  let id = req.params.id;
  let product = req.body;

  productHelper.editproduct(id, product,urls,img).then(() => {
    res.redirect("/admin/product");
  });
};
