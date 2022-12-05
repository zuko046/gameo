const { rmSync } = require("fs");
const adminHelper = require("../../helper/admin-helper");


exports.dashboardrender =  async function (req, res, next) {
  let count = { }
  count.totalRevenue = await adminHelper.dashboardTotalAmount()
  count.totalOrder = await adminHelper.dashboardTotalOrder()
  count.totalUser = await adminHelper.dashboardTotalUsers()
  
  res.render("admin/menu/dashboard", { admin: true , count });
};

exports.chart = async (req,res)=>{

  let barChart = await adminHelper.dashboardChartData()
  // console.log(barChart);

  let pieChart = await adminHelper.dashboardPieChart()
  // console.log(pieChart);

  let response = {}
  response.barChart = barChart
  response.pieChart = pieChart
  console.log(response);
  res.json(response)

}




// exports.adminReport = (req, res) => {
//   console.log(req.params.days)
//   adminHelper.dashboardCount(req.params.days).then((data) => {
//     console.log( data);
//     res.json(data);
//   });
// };
