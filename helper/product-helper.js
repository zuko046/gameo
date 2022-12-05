var db = require("../config/connection");
var objectid = require("mongodb").ObjectId;
var collection = require("../bin/config/collection");
const { resolve } = require("path");
const { removeProduct } = require("../controller/user/wishlist");
const { Collection } = require("mongo");
const { url } = require("inspector");
module.exports = {
  addProduct: (product, urls, callback) => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ categoryname: product.category });

      // category offer percentage checking
      if (category.categorydiscount) {
        // checking offer is greater than zero
        if (category.categorydiscount > 0) {
          category.categorydiscount = parseInt(category.categorydiscount);
          console.log(
            category.categorydiscount,
            "checking offer is greater than zero"
          );

          product.ActualPrice = parseInt(product.ActualPrice);

          product.CategoryOfferPercentage = category.categorydiscount;
          product.CategoryOffer =
            (product.ActualPrice * product.CategoryOfferPercentage) / 100;
          product.OfferPrice = product.ActualPrice - product.CategoryOffer;
          product.currentPrice = parseInt(product.OfferPrice);
          product.Stock = parseInt(product.Stock);
          product.Image = urls;
          product.Return = false;
          product.Cancel = false;

          console.log(product);
          db.get()
            .collection(collection.PRODUCT_COLLECTION)
            .insertOne(product)
            .then((data) => {
              console.log("return data" + data.insertedId);
              // resolve(id);
              callback(data.insertedId.toString());
              // reject(Error);
            });
        }
        // wether the offer may less than zero
        else {
          product.ActualPrice = parseInt(product.ActualPrice);
          product.currentPrice = parseInt(product.ActualPrice);
          product.Stock = parseInt(product.Stock);

          product.Image = urls;
          product.Return = false;
          product.Cancel = false;

          console.log(product.category);
          db.get()
            .collection(collection.PRODUCT_COLLECTION)
            .insertOne(product)
            .then((data) => {
              console.log("return data" + data.insertedId);
              // resolve(id);
              callback(data.insertedId.toString());
              // reject(Error);
            });
        }
      }
      // wether the category have no offer provided
      else {
        product.ActualPrice = parseInt(product.ActualPrice);
        product.currentPrice = parseInt(product.ActualPrice);
        product.Stock = parseInt(product.Stock);
        product.Image = urls;

        console.log(product.category);
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .insertOne(product)
          .then((data) => {
            console.log("return data" + data.insertedId);
            // resolve(id);
            callback(data.insertedId.toString());
            // reject(Error);
          });
      }
    });
  },

  //   addProduct = (productData, urls, callback) => {
  //     productData.stock = parseInt(productData.stock)
  //     productData.offerPrice = parseInt(productData.price)
  //     productData.categoryOffer = 0
  //     productData.productOffer = 0
  //     productData.images = urls
  //     return new Promise((resolve, reject) => {
  //         productData.price = Number(productData.price)
  //         db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productData).then((data) => {
  //             callback(data.insertedId.toString());
  //         })
  //     })
  // },

  displayProduct: () => {
    return new Promise(async (resolve, reject) => {
      let productdata = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      console.log(productdata);
      resolve(productdata);
      reject(Error);
    });
  },


  findProduct: (id) => {
    return new Promise(async (resolve, reject) => {
     let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: objectid(id)})
      if (product) {
        resolve(product)
      } else {
        reject()
      }
      
      
      
    })
  },


  editproduct: (id, product, urls,img) => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ categoryname: product.category });

      if (category.categorydiscount && category.categorydiscount > 0) {
        
        product.Stock = parseInt(product.Stock);
        product.ActualPrice = parseInt(product.ActualPrice);
        product.CategoryOfferPercentage = parseInt(category.categorydiscount);
        product.CategoryOffer =(product.ActualPrice * product.CategoryOfferPercentage) / 100;
        console.log(product.CategoryOffer);
        product.OfferPrice =
          parseInt(product.ActualPrice) - parseInt(product.CategoryOffer);
        product.currentPrice = parseInt(product.OfferPrice);

        let pro =await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id : objectid(id)})
        let image1 = pro.Image[0]
        let image2 = pro.Image[1]
        let image3 = pro.Image[2]
        let image4 = pro.Image[3]
        console.log("dashhhh", product.categoryOffer);
        console.log(product);
        console.log(urls)
        console.log(img)
        let uplodimg = []
        console.log(urls)
        console.log(img)
        let length = urls.length
        
        if (img.img1) {

            uplodimg[0] = urls[0]
            if (urls == null) {
              
            } else {
            urls.shift()
            }

        }else{
          uplodimg[0] = image1
        }


        if (img.img2) {

          uplodimg[1] = urls[0]
          if (urls == null) {
              
          } else {
          urls.shift()
          }
        
        }else{
          uplodimg[1] = image2
        }


        if (img.img3) {

          uplodimg[2] = urls[0]
          if (urls == null) {
              
          } else {
          urls.shift()
          }
        
        }else{
          uplodimg[2] = image3
        }


        if (img.img4) {
          
          uplodimg[3] = urls[0]

        }else{
          uplodimg[3] = image4
        }

        console.log(urls)
          console.log(uplodimg);









        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne(
            { _id: objectid(id) },
            {
              $set: {
                Name: product.Name,
                category: product.category,
                Brand: product.Brand,
                ActualPrice: product.ActualPrice,
                CategoryOfferPercentage: product.CategoryOfferPercentage,
                currentPrice: product.currentPrice,
                OfferPrice: product.OfferPrice,
                CategoryOffer: product.CategoryOffer,
                Stock: product.Stock,
                Description: product.Description,
                Image: uplodimg,
              },
            }
          )
          .then(() => {
            resolve();
          });
      } else {
        product.Stock = parseInt(product.Stock);
        product.ActualPrice = parseInt(product.ActualPrice);


        let pro =await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id : objectid(id)})
        let image1 = pro.Image[0]
        let image2 = pro.Image[1]
        let image3 = pro.Image[2]
        let image4 = pro.Image[3]
        console.log("product category offer", product.categoryOffer);
        console.log(product);
        console.log(urls)
        console.log(img)
        let uplodimg = []
        console.log(urls)
        console.log(img)
        let length = urls.length
        
        if (img.img1) {

            uplodimg[0] = urls[0]
            if (urls == null) {
              
            } else {
            urls.shift()
            }

        }else{
          uplodimg[0] = image1
        }


        if (img.img2) {

          uplodimg[1] = urls[0]
          if (urls == null) {
              
          } else {
          urls.shift()
          }
        
        }else{
          uplodimg[1] = image2
        }


        if (img.img3) {

          uplodimg[2] = urls[0]
          if (urls == null) {
              
          } else {
          urls.shift()
          }
        
        }else{
          uplodimg[2] = image3
        }


        if (img.img4) {
          
          uplodimg[3] = urls[0]

        }else{
          uplodimg[3] = image4
        }

        console.log(urls)
          console.log(uplodimg);

        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne(
            { _id: objectid(id) },
            {
              $set: {
                Name: product.Name,
                category: product.category,
                Brand: product.Brand,
                ActualPrice: product.ActualPrice,
                currentPrice: product.ActualPrice,
                OfferPrice: product.OfferPrice,
                Stock: product.Stock,
                Description: product.Description,
                Image: uplodimg,
              },
            }
          )
          .then(() => {
            resolve();
          });
      }
    });
  },
  deleteproduct: (id) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: objectid(id) })
        .then((data) => {
          resolve(data);
          reject("not deleted");
        });
    });
  },
  viewcategory: () => {
    return new Promise(async (resolve, reject) => {
      let categorydata = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .find()
        .toArray();
      console.log(categorydata);
      resolve(categorydata);
    });
  },
  addcategory: (categoryname) => {
    return new Promise(async (resolve, reject) => {
      let cat = categoryname.categoryname;
      let name = capitalizeFirstLetter(cat);
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      console.log(name);

      let check = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ categoryname: name });
      if (check == null) {
        let catObj = {
          categoryname: name,
        };
        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .insertOne(catObj)
          .then((data) => {
            console.log(data);
            resolve(data);
          });
      } else {
        reject();
      }
    });
  },
  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .deleteOne({ _id: objectid(id) })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  productConsole: () => {
    return new Promise(async (resolve, reject) => {
      let productConsole = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Console" })
        .toArray();
      //  console.log(productConsole);
      resolve(productConsole);
    });
  },
  productAccessories: () => {
    return new Promise(async (resolve, reject) => {
      let productAccessories = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Accessories" })
        .toArray();
      resolve(productAccessories);
    });
    resolve;
  },
  productGames: () => {
    return new Promise(async (resolve, reject) => {
      let productGames = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Games" })
        .toArray();
      console.log(productGames);
      resolve(productGames);
    });
  },
  addCategoryOffers: (categoryname, discountvalue) => {
    return new Promise(async (resolve, reject) => {
      discountvalue = parseInt(discountvalue);
      console.log(categoryname);
      console.log(discountvalue);
      if (discountvalue == 0 || discountvalue == NaN || discountvalue == null) {
        console.log("remove category offer");
        let removePercenteageFromCategory = await db.get().collection(collection.CATEGORY_COLLECTION).updateOne({categoryname:categoryname},{$set:{categorydiscount:0}})

        let pro = await db.get().collection(collection.PRODUCT_COLLECTION).find({category : categoryname}).toArray()
        console.log(pro)
        
        let length = pro.length
        console.log(length)

        for( i = 0 ; i < length ; i++ ){

          if (pro[i].ProductOffer) {
          pro[i].OfferPrice = parseInt(pro[i].ActualPrice)-parseInt(pro[i].ProductOffer)
          pro[i].currentPrice = pro[i].OfferPrice
          } else {
            pro[i].OfferPrice = null
            pro[i].currentPrice = pro[i].ActualPrice
          }
        
        console.log(pro)

        let productUpdate = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
            { _id: objectid(pro[i]._id) },
            {
              $set: {
                currentPrice : pro[i].currentPrice,
                OfferPrice: pro[i].OfferPrice,
                CategoryOffer: null,
                CategoryOfferPercentage: null,
              },
            })
        }

        resolve()
      } else {
        // add percentage to category db
        let addPercentageToCategory = await db.get().collection(collection.CATEGORY_COLLECTION).updateOne(
            { categoryname: categoryname },
            { $set: { categorydiscount: discountvalue } }
          );

        console.log(addPercentageToCategory);

        // collecting categorized product to manupulate
        let categoryProduct = await db.get().collection(collection.PRODUCT_COLLECTION).find({ category: categoryname }).toArray();
        console.log(categoryProduct);

        // manupulate product data and pushing to db
        for (i = 0; i < categoryProduct.length; i++) {

          let CategoryOffer = (parseInt(categoryProduct[i].ActualPrice) * discountvalue) / 100;
          let CategoryOfferPercentage = parseInt(discountvalue);
          let OfferPrice

          if (categoryProduct[i].ProductOffer) {
            OfferPrice =categoryProduct[i].ActualPrice -(CategoryOffer + categoryProduct[i].ProductOffer)
          } else {
            OfferPrice = categoryProduct[i].ActualPrice - CategoryOffer
          }

          let productUpdate = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
              { _id: objectid(categoryProduct[i]._id) },
              {
                $set: {
                  currentPrice : OfferPrice,
                  OfferPrice: OfferPrice,
                  CategoryOffer: CategoryOffer,
                  CategoryOfferPercentage: CategoryOfferPercentage,
                },
              }
            );
          console.log(productUpdate);
        }

        let response = {
          status: true,
          discountvalue: discountvalue,
        };

        console.log(response);
        resolve(response);
      }
    });
  },

  addPorductOffer: (productId, productDiscount) => {
    return new Promise(async (resolve, reject) => {
      let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectid(productId) });
      console.log("product evde", product);

      if (productDiscount == 0 || productDiscount == NaN  || productDiscount == null ) {
        // if the product offer is null
        console.log("its on the if case --------------------------------------------------------------------------");
        let productOffer = null
        let OfferPrice,currentPrice

        if (product.CategoryOffer) {

          OfferPrice = product.ActualPrice - product.CategoryOffer 
          currentPrice = OfferPrice
        } else {
          OfferPrice = null
          currentPrice = product.ActualPrice
          
        }
        //updateing
        let productUpdate = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
          { _id: objectid(productId) },
          {
            $set: {
              currentPrice : currentPrice , 
              OfferPrice  : OfferPrice,
              ProductOffer  : productOffer,
              ProductOfferPercentage  : parseInt(productDiscount),
            },
          }
        );


  } else {
        console.log("its on the else case -----------------------------------------------------------------------");
        let productOffer = (product.ActualPrice * productDiscount) / 100;
        let OfferPrice,currentPrice
  
        if (product.CategoryOffer) {
          OfferPrice = product.ActualPrice - (product.CategoryOffer + productOffer)
          currentPrice = OfferPrice
        } else {
          OfferPrice = product.ActualPrice - productOffer
          currentPrice = OfferPrice
        }

        // update
        let productUpdate = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
          { _id: objectid(productId) },
          {
            $set: {
              currentPrice : currentPrice , 
              OfferPrice  : OfferPrice,
              ProductOffer  : productOffer,
              ProductOfferPercentage  : parseInt(productDiscount),
            },
          }
        ); 
      }
      let response = {
        status: true,
        discountvalue: productDiscount,
      };

      console.log(response);

      resolve(response);
    });
  },

  
  searchProduct: (key) => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({
          $or: [
            { Name: { $regex: key, $options: "i" } },
            { Brand: { $regex: key, $options: "i" } },
            { category: { $regex: key, $options: "i" } },
          ],
        })
        .toArray();
      console.log(product);
      resolve(product);
    });
  },
};
