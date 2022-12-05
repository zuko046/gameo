
//for user
exports.CkeckUserLogin = (req,res,next)=>{
    if (req.session.userlogin) {
        res.redirect('/users/useraccount')
    }else{
        next()  
    }
}
exports.UNCkeckUserLogin = (req,res,next)=>{
    if (req.session.userlogin == false) {
        res.redirect('/users/login')
    }else{
        next()
    }
}

//for admin
exports.CkeckAdminLogin = (req,res,next)=>{
    if (req.session.adminlogin) {
        res.redirect('/admin/dashboard')
    }else{
        next()  
    }
}



exports.UNCkeckAdminLogin = (req,res,next)=>{
    if (req.session.adminlogin == false) {
        res.redirect('/admin')
    }else{
        next()
    }
}
