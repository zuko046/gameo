const { Db } = require("mongodb");
const collection = require("../../bin/config/collection");
const adminHelper = require("../../helper/admin-helper");

exports.salesReportpage = async (req, res) => {
  let report;
  if (req.query?.month) {
    let month = req.query?.month.split("-");
    let [yy, mm] = month;
    console.log("monthly");
    report = await adminHelper.salesReportMonthWise(mm, yy);
  } else if (req.query?.daterange) {
    console.log("particular range");
    let date = req.query?.daterange;
    let arr1 = date.split("-");
    let startDate = arr1[0].split("/");
    let endDate = arr1[1].split("/");
    console.log(startDate, "", endDate);
    report = await adminHelper.salesReportRangeWise(startDate, endDate);
  } else {
    report = await adminHelper.deliveredOrderList();
    console.log("complete sale");
  }
  res.render("admin/menu/salesReport", { admin: true, report });
};
