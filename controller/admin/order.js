const { router } = require("../../app");
const collection = require("../../bin/config/collection");
const adminHelper = require("../../helper/admin-helper");


exports.listOrder = async function (req, res, next) {
  let limit = 6
  console.log(req.query?.page)
  let pageCount = await adminHelper.pagination(collection.ODER_COLLECTION,limit)
  let pageNumber = 0
  if(req.query?.page){
    pageNumber = req.query.page-1
  }
    let data = await adminHelper.oderList(pageNumber,limit) 
    let count = parseInt(data.length)
    let i =(pageNumber*limit)
    for( let j=1 ; j <= count ; j++ ){
      data[j-1].number = i+j
    }
    res.render("admin/menu/orders", { admin: true , pageCount,data});
}



exports.changeStatus = (req, res) => {
  let orderid = req.params
  let status = req.body.status;
  // console.log(req.body,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  console.log(orderid,status);
  adminHelper.changeStatus(orderid,status).then(()=>{
  res.redirect("/admin/orders");

  })
};
