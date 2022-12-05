var db = require("../config/connection");
var collection = require("../config/collection");
// const { response } = require("../app");
// const { ObjectID } = require("bson");
const bcrypt = require("bcrypt");
var objectid = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const { resolve } = require("path");
const { count } = require("console");
// const { resolve } = require("path");
// const { rmSync } = require("fs");
// const { address } = require("../controller/user/userProfile");
// const { password } = require("../controller/user/userProfile");
var instance = new Razorpay({
  key_id: "rzp_test_MatATSKGcwoaeB",
  key_secret: "x1PJlNb63uul3EjDXRjTKJYW",
});

module.exports = {
  //register user
  addUser: (userData) => {
    return new Promise(async (resolve, reject) => {
      console.log("email = " + userData.email);
      let already = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
      console.log(already)

      if(already == null){
        console.log("uniq user");
        userData.password = await bcrypt.hash(userData.password, 10);
        userData.status = true;
        userData.referal = parseInt(new Date().getTime())+userData.firstname
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userData)
          .then(async(data) => {
            let wallet = {
              user : userData._id,
              balance : 0 ,
              referal : userData.referal,
              transactions : []
            }
             await db.get().collection(collection.WALLET_COLLECTION).insertOne(wallet)
            resolve(userData);
          })
      }else{
        console.log("reject the signup option");
        reject({err:true})
      }

    })
  },
  //userlogin-
  userlogin: (userinfo) => {
    return new Promise(async (resolve, reject) => {
      let response = {};

      console.log("email for varification  = " + userinfo.email);
      // const { email, password } = userinfo.body
      const email = userinfo.email;
      const password = userinfo.password;
      let userGot = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: email });
      if (userGot) {
        await bcrypt.compare(password, userGot.password).then((status) => {
          if (status && userGot.status) {
            console.log("password matches");
            response.user = userGot;
            response.status = true;
            resolve(response);
          } else {
            console.log("ops password did't match");
            resolve({ status: false });
          }
        });
      } else {
        console.log("no such user");
        resolve({ status: false });
      }
    });
  },
  userdatas: () => {
    let status = false;
    return new Promise(async (resolve, reject) => {
      let userinfo = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find({})
        .toArray();
      if (userinfo) {
        console.log(userinfo);
        console.log("user data gotcha....!!!!!!!!!!!!!!!");
        resolve(userinfo);
      } else {
        console.log("user table could't find there is some issue");
        resolve(status);
      }
    });
  },
  findoneuser: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      // let userids=objectid(userdata)
      // console.log(userData);
      // console.log(userData.user.email)
      // console.log("ideeeeeeeeeeeeeeeeeeeeeeeeeeeee    ==   "+userids)
      let userdatas = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.user.email });
      // console.log(userdatas)
      if (userdatas) {
        // console.log(userdata)
        // console.log(userdatas)
        response.user = userdatas;
        resolve(response);
        reject("nothing found");
      }
    });
  },
  userProfile: (id) => {
    console.log(id);
    return new Promise(async (resolve, reject) => {
      let userdata = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectid(id) })
      console.log(userdata);
      resolve(userdata);
    });
  },saveUserData:(id,data) => {
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid()},{$set:{
        firstname     :  data.firstname ,
        lastname      :  data.lastname,
        email         :  data.email ,
        phonenumber   :  data.phonenumber
      }}).then(()=>{
        resolve()
      })
    })
  }
  ,findphonenumber: (mail) => {
    return new Promise((resolve, reject) => {
      // console.log(id)
      db.get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: mail})
        .then((userdata) => {
          let phonenumber = userdata.phonenumber;
          resolve(phonenumber);
        }).catch(()=>{
          reject()
        })
    });
  },
  // findphonenumber: (id) => {
  //   return new Promise((resolve, reject) => {
  //     // console.log(id)
  //     db.get()
  //       .collection(collection.USER_COLLECTION)
  //       .findOne({ _id: objectid(id) })
  //       .then((userdata) => {
  //         let phonenumber = userdata.phonenumber;
  //         resolve(phonenumber);
  //       });
  //   });
  // },
  addtocart: (productid, userId) => {
    console.log(productid, userId);
    let productObject = {
      item: objectid(productid),
      quantity: 1,
    };

    return new Promise(async (resolve, reject) => {
      console.log(productid, userId);
      let usercart = await db
        .get()
        .collection(collection.CART)
        .findOne({ user: objectid(userId) });
      // console.log(usercart);
      if (usercart) {
        // console.log(productid);
        let productExist = usercart.products.findIndex(
          (products) => products.item == productid
        );
        // console.log(productExist)
        // console.log(usercart)
        if (productExist != -1) {
          db.get()
            .collection(collection.CART)
            .updateOne(
              { user: objectid(userId), "products.item": objectid(productid) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collection.CART)
            .updateOne(
              { user: objectid(userId) },
              {
                $push: { products: productObject },
              }
            )
            .then((response) => {
              resolve("added to cart");
            });
        }
      } else {
        let cartobj = {
          user: objectid(userId),
          products: [productObject],
        };
        db.get()
          .collection(collection.CART)
          .insertOne(cartobj)
          .then(() => {
            resolve("create a cart to add product");
          });
      }
    });
  },
  getCartPorduct: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartProduct = await db
        .get()
        .collection(collection.CART)
        .aggregate([
          {
            $match: {
              user: new objectid(userId),
            },
          },
          {
            $unwind: {
              path: "$products",
            },
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "product",
              localField: "item",
              foreignField: "_id",
              as: "cartproduct",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: {
                $arrayElemAt: ["$cartproduct", 0],
              },
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: 1,
              total: { $multiply: ["$quantity", "$product.currentPrice"] },
            },
          },
        ])
        .toArray();
        
        console.log(cartProduct);

      for (i = 0; i < cartProduct.length; i++) {
        cartProduct[i].cartId = cartProduct[i]._id;
        cartProduct[i].productId = cartProduct[i].product._id;
        cartProduct[i].productName = cartProduct[i].product.Name;
        cartProduct[i].Category = cartProduct[i].product.category;
        cartProduct[i].Brand = cartProduct[i].product.Brand;
        cartProduct[i].ActualPrice = parseInt(cartProduct[i].product.ActualPrice)
        cartProduct[i].OfferPrice = parseInt(cartProduct[i].product?.OfferPrice)
        cartProduct[i].Stock = parseInt(cartProduct[i].product.Stock)
        cartProduct[i].Description = cartProduct[i].product.Description;
        cartProduct[i].Image = cartProduct[i].product.Image
        cartProduct[i].total = parseInt(cartProduct[i].total)
        cartProduct[i].quantity = parseInt(cartProduct[i].quantity)
        // cartProduct[i].Cancel = cartProduct[i].Cancel
        // cartProduct[i].Return = cartProduct[i].Return
        cartProduct[i].Cancel = false
        cartProduct[i].Return = false

        delete cartProduct[i].product;
      }
      console.log(cartProduct);
      resolve(cartProduct);
    });
  },
  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CART)
        .findOne({ user: objectid(userId) });
      if (cart) {
        count = cart.products.length;
      }
      resolve(count);
    });
  },
  changeProductQuantity: (details) => {
    details.count = parseInt(details.count);
    return new Promise((resolve, reject) => {
      if (details.count == -1 && details.quantity == 1) {

        db.get()
          .collection(collection.CART)
          .updateOne(
            { _id: objectid(details.cart) },
            {
              $pull: { products: { item: objectid(details.product) } },
            }
          )
          .then(async (response) => {
            
            // if (pro.) {  }
            
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collection.CART)
          .updateOne(
            {
              _id: objectid(details.cart),
              "products.item": objectid(details.product),
            },
            {
              $inc: { "products.$.quantity": details.count },
            }
          )
          .then(async (response) => {
            console.log(response);
            let data = {
              status :true ,
              removeProduct : false
            }


            console.log("ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp");
            let pro = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: objectid(details.product) })
            console.log(pro)
            if (pro.Stock == details.count ) {
              resolve({stock:true})
            }
            resolve(data);
          });
      }
    });
  },
  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
  
      let TotalAmount = await db
        .get()
        .collection(collection.CART)
        .aggregate([
          {
            $match: {
              user: new objectid(userId),
            },
          },
          {
            $unwind: {
              path: "$products",
            },
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "product",
              localField: "item",
              foreignField: "_id",
              as: "cartproduct",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: {
                $arrayElemAt: ["$cartproduct", 0],
              },
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: 1,
              total: { $multiply: ["$quantity", "$product.currentPrice"] },
            },
          },
          {
            $group: {
              _id: "",
              totalAmount: {
                $sum: "$total",
              },
            },
          },
        ])
        .toArray();
        console.log(TotalAmount);
      let amt = TotalAmount[0]?.totalAmount;
      console.log(TotalAmount[0]?.totalAmount);
      resolve(amt);
    });
  },subtotal:(userId,productId)=>{
      console.log(userId,productId)
      return new Promise(async (resolve,reject)=>{
       let subtotal = await db.get().collection(collection.CART).aggregate(
        [
          {
            '$match': {
              'user': objectid(userId)
            }
          }, {
            '$unwind': {
              'path': '$products'
            }
          }, {
            '$project': {
              'item': '$products.item', 
              'quantity': '$products.quantity'
            }
          }, {
            '$lookup': {
              'from': 'product', 
              'localField': 'item', 
              'foreignField': '_id', 
              'as': 'cartproduct'
            }
          }, {
            '$project': {
              'item': 1, 
              'quantity': 1, 
              'product': {
                '$arrayElemAt': [
                  '$cartproduct', 0
                ]
              }
            }
          }, {
            '$project': {
              'item': 1, 
              'quantity': 1, 
              'product': 1, 
              'total': {
                '$multiply': [
                  '$quantity', '$product.currentPrice'
                ]
              }
            }
          }, {
            '$match': {
              'item': objectid(productId)
            }
          }
        ]
        ).toArray()
        
        console.log(subtotal);

        let data = {
          subtotal : parseInt(subtotal[0].total),
          productname : subtotal[0].product.Name
        }
        console.log(data.subtotal);
        resolve(data)

      })
  },
  removeItem: (productId, userId) => {
    return new Promise((resolve, reject) => {
      console.log(productId);
      console.log(userId);

      db.get()
        .collection(collection.CART)
        .updateOne(
          { user: objectid(userId) },
          { $pull: { products: { item: objectid(productId) } } }
        )
        .then((data) => {
          console.log(data);
          resolve(data);
        });
    });
  },
  placeOrder: (productData, totalAmount, address, id, payment,coupon) => {
    return new Promise(async (resolve, reject) => {
      // console.log("placeorder.......",productData,address);  
      let count = productData.length;

      let oderObject = {
        userId: objectid(id),
        totalPrice: totalAmount,
        // quantity: productData[0].product,
        paymentMethod: payment,
        product: productData,
        // total: productData[0]?.total,
        date: new Date().toString(),
        oderDate : new Date(),
        status: "Pending",
        deliveryDetails: {
          // name: address.name,
          // phonenumber: address.number,
          // address: address.address,
          // state: address.state,
          // country: address.country,
          // pincode: address.pincode,
          address: address,
        },
      }
      if (coupon) {
        oderObject.couponDiscount = coupon.couponDiscount
        oderObject.totalWithCouponDiscount = coupon.totalAmount
        oderObject.couponCode = coupon.couponCode
        oderObject.couponApply = true 
      }
      // console.log("ODEROBJECT", oderObject);
      if (payment == "WALLET"){
        let transaction
        let lessBalance
        if (coupon) {
          transaction = { orderId: new objectid(),
            date: new Date().toDateString(),
            mode: "Debit",
            type: "Purchase",
            amount: coupon.totalAmount
          }
          lessBalance = coupon.totalAmount
        } else {
          transaction = { orderId:  objectid(),
            date: new Date().toDateString(),
            mode: "Debit",
            type: "Purchase",
            amount: totalAmount
          }
          lessBalance = totalAmount
        }
        // update wallet
        await db.get().collection(collection.WALLET_COLLECTION).updateOne(
          { user: objectid(id) }, { $inc: { balance: -(lessBalance) }, $push: { transactions: transaction } })

      }
      db.get()
        .collection(collection.ODER_COLLECTION)
        .insertOne(oderObject)
        .then(async (response) => {
          console.log(response);
      
          db.get().collection(collection.CART).deleteOne({ user: objectid(id) });

          console.log(productData,"product data is................................................................")
          let l = productData.length
          for( i =0 ; i < l ; i++ ){
            let proid =productData[i].productId
            let count = parseInt(productData[i].quantity)

            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectid(proid)},{$inc:{ Stock : -count  }})


          }
      
          let oderid = response.insertedId.toString();
          resolve(oderid);
        });
    });
  },applyCoupon:(couponCode,total)=>{
      return new Promise(async(resolve,reject)=>{
        console.log(couponCode,'11111111111111111111');
       let validcoupon = await db.get().collection(collection.COUPON_COLLECTION).findOne({ 'coupon' : couponCode})
        console.log(validcoupon,"validcoupon");
        if (validcoupon) {
          let couponOffer =   parseInt(validcoupon.couponOffer)
          // console.log(couponOffer);
          // console.log(total);
          let couponDiscountAmount = total * couponOffer / 100
          // console.log(couponDiscountAmount)
          if (validcoupon.maxPrice < couponDiscountAmount ) {
            couponDiscountAmount = parseInt(validcoupon.maxPrice)
          }          

          let response = {
            err : false ,
            discount : couponDiscountAmount
          }

            resolve(response)

        } else {
          let response = {}
          response.err = true
          resolve(response)
        }
        

      })
  },oderlist: (id) => {
    return new Promise(async (resolve, reject) => {
      let data = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ userId: objectid(id) }).sort({oderDate:-1})
        // .find({ userId: objectid(id) })
        .toArray();
      resolve(data);
    });
  },
  cancelOrder : (orderid , id )=>{
    return new Promise((resolve,reject)=>{
      console.log(orderid);
      db.get().collection(collection.ODER_COLLECTION).updateOne({_id:objectid(orderid)},{$set:{"status":"Cancel Order"}}).then(async ()=>{
        let order = await db.get().collection(collection.ODER_COLLECTION).findOne({ _id : objectid(orderid) }) 
        // console.log(order,"orderrrrrrrr");
        if (order. paymentMethod == 'COD') {
          resolve()
        } else {

          let transaction = { }
          if (order.couponDiscount) {
            transaction = {
              orderId : order._id ,
              mode : "credited" ,
              date : new Date() ,
              type : "Cancel Order" ,
              amount  : parseInt(order.totalWithCouponDiscount)
            }
          } else {
            transaction = {
              orderId : order._id ,
              mode : "credited" ,
              date : new Date() ,
              type : "Cancel Order" ,
              amount  : parseInt(order.totalPrice)
            }
          }
          
          await db.get().collection(collection.WALLET_COLLECTION).updateOne({user:objectid(id)},{$inc:{ balance : transaction.amount },$push:{ transactions : transaction }})
          resolve()
        }
      })
    })
  },
  returnOrder : (orderId,id)=>{
    return new Promise((resolve,reject)=>{
      console.log(orderId,id,"888888888888888888888888888888888888888888888888888888888888888888888888");
      db.get().collection(collection.ODER_COLLECTION).updateOne({_id:objectid(orderId)},{$set:{"status":"Return Order"}}).then(async()=>{
        let order = await db.get().collection(collection.ODER_COLLECTION).findOne({ _id : objectid(orderId) }) 
        console.log("orderrrrrrrrrrrrr",order)
        let transaction = { }

        if (order.couponDiscount) {
          transaction = {
            orderId : order._id ,
            mode : "credited" ,
            date : new Date() ,
            type : "Return Order" ,
            amount  : parseInt(order.totalWithCouponDiscount)
          }
        } else {
          transaction = {
            orderId : order._id ,
            mode : "credited" ,
            date : new Date() ,
            type : "Return Order" ,
            amount  : parseInt(order.totalPrice)
          }
        }
        console.log("pushing to the wallet !!!!!!!!!!!!!!!!!!!");
        await db.get().collection(collection.WALLET_COLLECTION).updateOne({user:objectid(id)},{$inc:{ balance : transaction.amount },$push:{ transactions : transaction }})
        resolve()


      })
    })
  },

  generatRazorpay: (orderId, total) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: total * 100,
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          console.log("new order : ", order);
          console.log(order.amount);
          // order.amount=order.amount+""
          console.log(order);
          resolve(order);
        }
      });
    });
  },


  // const crypto = require('crypto');
  // var hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)
  // hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
  // hmac = hmac.digest('hex')





  verifyPayment: (data) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      // console.log(data.payment.razorpay_order_id);
      // console.log(data.payment.razorpay_payment_id);
      var hmac = crypto.createHmac("sha256", "x1PJlNb63uul3EjDXRjTKJYW");
      //  hmac.update(data['payment[razorpay_order_id]'] + "|" + data['payment[razorpay_payment_id ]'] )

      hmac.update(data['payment[razorpay_order_id]'] + "|" + data['payment[razorpay_payment_id]'] );
      hmac = hmac.digest("hex");
      if (hmac === data['payment[razorpay_signature]']) {
      // if (hmac === data['payment[razorpay_signature]']) {
        resolve();
      } else {
        reject();
      }
    });
  },
  changePaymentStatus: () => {
    return new Promise((resolve, reject) => {
      
    });
  },
  addtowishlist: (productId, userId) => {
    console.log("wishlisttttt addingggg");
    return new Promise(async (resolve, reject) => {
      let userWISHlIST = await db
        .get()
        .collection(collection.WISHLIST)
        .findOne({ user: objectid(userId) });
      console.log(userWISHlIST);
      let productObject = {
        item: objectid(productId)};

      if (userWISHlIST) {
        let productExists = userWISHlIST.wishlist.findIndex(
          (wishlist) => wishlist.item == productId
        );
        console.log(productExists);
        if (productExists == -1) {
          db.get()
            .collection(collection.WISHLIST)
            .updateOne(
              { user: objectid(userId) },
              { $push: { wishlist: { item: objectid(productId) } } }
            )
            .then((response) => {
              resolve("add item to wish list");
            });
        } else {
          db.get()
            .collection(collection.WISHLIST)
            .updateOne(
              { user: objectid(userId) },
              { $pull: { wishlist: { item: objectid(productId) } } }
            )
            .then((response) => {
              reject("remove item from wish list");
            });
        }
      } else {
        let WishList = {
          user: objectid(userId),
          wishlist: [productObject],
        };
        db.get()
          .collection(collection.WISHLIST)
          .insertOne(WishList)
          .then((response) => {
            resolve("creat a wish list and producted added");
          });
      }
    });
  },
  getwishlist:  (userId) => {
   return new Promise (async (resolve,reject)=>{
    let wishItem = await db
    .get()
    .collection(collection.WISHLIST)
    .aggregate([
      {
        $match: {
          user: objectid(userId),
        },
      },
      {
        $unwind: {
          path: "$wishlist",
        },
      },
      {
        $project: {
          user: 1,
          product: "$wishlist.item",
        },
      },
      {
        $lookup: {
          from: "product",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          user: 1,
          product: {
            $arrayElemAt: ["$product", 0],
          },
        },
      },
    ])
    .toArray();
  console.log("hello world");
  console.log(wishItem);
  resolve(wishItem);
   })
  },removeWishListProduct: (productId,userId)=>{
    console.log("1success");
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.WISHLIST).updateOne( { user: objectid(userId) },{ $pull: { wishlist: { item: objectid(productId) } } }).then((response)=>{
        resolve("success")
      })
    })
  },addAddress: (address,userId)=>{
    return new Promise ((resolve,reject)=>{
      

      address._id = new objectid()
      console.log(address,userId);
      db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectid(userId)},{$push:{address:address}}).then(()=>{
        resolve()
      })
    })
  },viewAddress : (userId) =>{
    return new Promise ( async(resolve,reject)=>{
      let useradds = await db.get().collection(collection.USER_COLLECTION).aggregate(
        [
          {
            '$match': {
              '_id': objectid(userId)
            }
          }, {
            '$unwind': {
              'path': '$address'
            }
          }, {
            '$project': {
              'address': 1
            }
          }
        ]
      ).toArray()
      console.log(useradds);
      resolve(useradds)
    })
  },changePassword : (userId,password)=>{
    return new Promise((resolve,reject)=>{
      let user = db.get().collection(collection.USER_COLLECTION).findOne({_id:objectid(userId)})
      console.log(user);
      resolve()

    })
  },oneOrder : (orderId)=>{
    console.log(orderId,"onOrder helper in user helper");
    return new Promise(async (resolve,reject)=>{
      let order = await db.get().collection(collection.ODER_COLLECTION).findOne({ _id : objectid(orderId) })
      console.log("orderdetails",order)
      resolve(order)
    })
  }
  ,cancelSingleProduct :(orderid,productid)=>{
    return new Promise (async (resolve,reject)=>{
      let order = await db.get().collection(collection.ODER_COLLECTION).findOne({_id:objectid(orderid)})
      let length = order.product.length
      console.log(length);
      console.log(order)
      console.log(productid);
     
      for( i=0 ; i<length ; i++ ){

        if( (String)(new objectid(order.product[i].productId)) ==objectid(productid)){

          console.log("cancel single product matches and cancelled");
          order.product[i].Cancel = true 
          console.log("product canceled",order.product[i].productName);
          db.get().collection(collection.ODER_COLLECTION).updateOne({_id:objectid(orderid),"product.productId":objectid(productid)},
          { $set: {"product.$.Cancel" : true,"product.$.Return" : true} }).then(async (response)=>{
            console.log(response);
            let ordercheck = await db.get().collection(collection.ODER_COLLECTION).findOne({ _id : objectid(orderid)})
            console.log(ordercheck);
            let ordercheckLength = ordercheck.product.length
            console.log(ordercheckLength);
            let cancelorder =false
            for( j=0 ; j<ordercheckLength ; j++){
              if ( ordercheck.product[j].Cancel == true ) {
                  cancelorder = true
              } else {
                  cancelorder = false
              }
            }
            if(cancelorder == true){
              db.get().collection(collection.ODER_COLLECTION).updateOne({_id:objectid(orderid)},{$set:{"status":"Cancel Order"}}).then(()=>{
                resolve()
              })
            }else{
              resolve()
            }
          })
        break
        }
      }

    })
  }


  ,returnSingleProduct : (orderid,productid,id)=>{
    return new Promise ((resolve,reject)=>{
      
      db.get().collection(collection.ODER_COLLECTION).updateOne({_id:objectid(orderid),"product.productId":objectid(productid)},
      { $set: {"product.$.Return" : true} }).then(async (response)=>{
        console.log(response)

        let product = await db.get().collection(collection.ODER_COLLECTION).findOne({_id:objectid(productid)})
        console.log(product);
        let returnTransaction = {
          product:product.Name,

        }

        // db.get().collection(collection.WALLET_COLLECTION).updateOne({})





        resolve()
      })
    })















  }, referal : (referal,NewUser)=>{
    return new Promise(async (resolve,reject)=>{
      console.log(referal);
      let getusr = await db.get().collection(collection.WALLET_COLLECTION).findOne({ referal : referal })
      if (getusr == null) {
        resolve({ referal : false })
      } else {
      
        console.log(getusr,"hai terin")
        console.log(NewUser);
       



        let usrTransaction = {
          transactionID : new objectid(),
          date : new Date().toString(),
          mode : "credited",
          type : "Referal Offer",
          details : NewUser._id,
          amount : 100

        }

        let NewUsrTransaction = {
          transactionID : new objectid(),
          date : new Date().toString(),
          mode : "credited",
          type : "Referal Offer",
          details : getusr._id,
          amount : 100
        }
        console.log(getusr);
        console.log(NewUser);


        await db.get().collection(collection.WALLET_COLLECTION).updateOne({ user : objectid(getusr.user) },{$inc:{balance:100},$push:{transactions:usrTransaction}})
        await db.get().collection(collection.WALLET_COLLECTION).updateOne({ user : objectid(NewUser._id) },{$inc:{balance:100},$push:{transactions:NewUsrTransaction}})
        

        resolve({ referal : true })
      }
    })
  },walletdetails : (userid)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.WALLET_COLLECTION).findOne({user:objectid(userid)}).then((data)=>{
        resolve(data)
      })
    })
  }
}
