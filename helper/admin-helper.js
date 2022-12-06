var db = require("../config/connection");
var collection = require("../bin/config/collection");
const { resolve } = require("path");
var objectid = require("mongodb").ObjectId;
// const { ObjectID } = require('bson')
const bcrypt = require("bcrypt");
const { response } = require("../app");
const { Collection } = require("mongo");
module.exports = {
  //
  adminlogin: (admininfo) => {
    return new Promise(async (resolve, reject) => {
      let response = {};

      console.log("email for varification  = " + admininfo.email);
      // const { email, password } = userinfo.body
      const email = admininfo.email;
      const password = admininfo.password;
      let adminGot = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email: email });
      if (adminGot) {
        await bcrypt.compare(password, adminGot.password).then((status) => {
          if (status) {
            console.log("password matches");
            response.admin = admininfo;
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
  blockUser: (userid) => {
    return new Promise(async (resolve, reject) => {
      console.log(userid) /
        // updateOne({ _id: objectId(userId) }, [{ "$set": { status: { "$not": "$status" } } }])
        (await db
          .get()
          .collection(collection.USER_COLLECTION)
          .updateOne({ _id: objectid(userid) }, [
            { $set: { status: { $not: "$status" } } },
          ])
          .then((data) => {
            // console.log("data on promise = " + data.email)
            resolve("user blocked");
            reject("error");
          }));
    });
  },
  
  
  
  oderList: (pageNo,limit) => {
    console.log(pageNo,limit);
    return new Promise(async (resolve, reject) => {
                                                                                         
      let data = await db.get().collection(collection.ODER_COLLECTION).find().skip(pageNo * limit).limit(limit).toArray()
      
      console.log(data);
      resolve(data);
    });
  },


  changeStatus: (orderId, status) => {
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", orderId, status);

    return new Promise((resolve, reject) => {
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", orderId, status);
      db.get()
        .collection(collection.ODER_COLLECTION)
        .updateOne({ _id: objectid(orderId) }, { $set: { status: status } })
        .then((response) => {
          console.log(response);
          resolve();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },

  dashboardTotalAmount: () => {
    return new Promise(async (resolve, reject) => {
      let totalRevenue = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .aggregate([
          {
            $match: {
              status: "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              totalPrice: {
                $sum: "$totalPrice",
              },
            },
          },
          {
            $project: {
              totalPrice: 1,
            },
          },
        ])
        .toArray();
        console.log(totalRevenue);
      totalRevenue = totalRevenue[0].totalPrice;
      console.log(totalRevenue);
      resolve(totalRevenue);
    });
  },
  dashboardTotalOrder: () => {
    return new Promise(async (resolve, reject) => {
      let totalOrder = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .countDocuments();
      resolve(totalOrder);
    });
  },
  dashboardTotalUsers: async () => {
    return new Promise(async (resolve, reject) => {
      let totalUsers = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .countDocuments();
      resolve(totalUsers);
    });
  },
  dashboardChartData: () => {
    return new Promise(async (resolve, reject) => {
      let chartData = {};

      chartData.delivered = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ status: "Delivered" })
        .count();
      chartData.shipped = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ status: "Shipped" })
        .count();
      chartData.placed = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ status: "Placed" })
        .count();
      chartData.pending = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ status: "Pending" })
        .count();
      chartData.canceled = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ status: "Cancel Order" })
        .count();
      console.log(chartData);
      resolve(chartData);
    });
  },
  dashboardPieChart: () => {
    return new Promise(async (resolve, reject) => {
      let pieChart = {};

      pieChart.cod = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ paymentMethod: "COD" })
        .count();
      pieChart.online = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .find({ paymentMethod: "ONLINE" })
        .count();

      console.log(pieChart);
      resolve(pieChart);
    });
  },

  //sales report complete
  deliveredOrderList: () => {
    return new Promise(async (resolve, reject) => {
      let deliveredOrders = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .aggregate([
          {
            $match: {
              status: "Delivered",
            },
          },
        ])
        .toArray();

      resolve(deliveredOrders);
    });
  },
  // coupen view
  viewCoupon: () => {
    return new Promise(async (resolve, reject) => {
      let coupon = await db
        .get()
        .collection(collection.COUPON_COLLECTION)
        .find()
        .toArray();
      resolve(coupon);
    });
  },
  // add coupon
  addCoupon: (coupon) => {
    return new Promise(async (resolve, reject) => {
      console.log(coupon)
      let check = await db.get().collection(collection.COUPON_COLLECTION).findOne({coupon :coupon.coupon})
      if(check == null){
        db.get().collection(collection.COUPON_COLLECTION).insertOne(coupon).then((response) => {
          console.log(response);
          response.status=false
          resolve(response);
        });
      }else{
        resolve({status:true})
      }

    });
  },
  // delete coupon
  deleteCoupon: (couponId) => {
    return new Promise((resolve, reject) => {
      console.log(couponId);
      db.get()
        .collection(collection.COUPON_COLLECTION)
        .deleteOne({ _id: objectid(couponId) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  // sales report month wise
  salesReportMonthWise: (mm, yy) => {
    return new Promise(async (resolve, reject) => {
      let start = "1";
      let end = "30";
      let fromDate = mm.concat("/" + start + "/" + yy);
      let fromD = new Date(new Date(fromDate).getTime() + 3600 * 24 * 1000);
      let endDate = mm.concat("/" + end + "/" + yy);
      let endD = new Date(new Date(endDate).getTime() + 3600 * 24 * 1000);
      console.log(fromD, endD);
      let data = await db
        .get()
        .collection(collection.ODER_COLLECTION)
        .aggregate([
          {
            $match: {
              status: "Delivered",
            },
          },
          {
            $match: {
              oderDate: {
                $gte: fromD,
                $lte: endD,
              },
            },
          },
        ])
        .toArray();
      console.log(data);
      resolve(data);
    });
  },
  // salesreport range wise
  salesReportRangeWise: (startDate, endDate) => {
    return new Promise(async (resolve, reject) => {

      let fromDate = new Date(new Date(startDate).getTime() + 3600 * 24 * 1000);
      let endD = new Date(new Date(endDate).getTime() + 3600 * 24 * 1000);

      let data = await db.get().collection(collection.ODER_COLLECTION).aggregate(
        [
          {
            $match: {
              status: "Delivered",
            },
          },
          {
            $match: {
              oderDate: {
                $gte: fromDate,
                $lte: endD,
              },
            },
          },
        ]
      ).toArray()
      console.log(data);
      resolve(data)
    });
  },
  getBanner: ()=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.BANNER_COLLECTION).findOne().then((banner)=>{
        resolve(banner)
      })
    })
  },
  changeBanner: (img)=>{
    return new Promise(async (resolve,reject)=>{
      let bannerDoc =  await db.get().collection(collection.BANNER_COLLECTION).findOne()
      console.log(bannerDoc);
      let id = bannerDoc._id
      db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:objectid(id)},{ $set: { bannerURL : img }}).then((data)=>{
        resolve()
      })
    })
  },
                //product   2
  pagination : (Collection,limit) => {
    
    return new Promise(async (resolve,reject)=>{
                                               
      let totalItem = await db.get().collection(Collection).find().toArray()
                              
      let numberOfItem = totalItem.length
                      
      let pageCount = numberOfItem / limit
    
      pageCount = Math.ceil(pageCount)
    
      let page = []
    
      for (i = 1 ; i<=pageCount;i++){
    
        page.push(i)
    
      }
    
      resolve(page)
    
    })
  }
}
