var userHelper = require('../../helper/user-helpers')

exports.viewWallet = (req,res)=>{
    let userid = req.session.user._id
    userHelper.walletdetails(userid).then((data)=>{
        console.log(data);
        res.render('user/account/wallet', { user : true , data } )
    })
}