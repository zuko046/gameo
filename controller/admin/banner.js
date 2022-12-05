const adminHelper = require("../../helper/admin-helper");
const cloudinary = require('../../utils/cloudinary')

exports.bannerManagement = (req,res)=>{
    console.log("banner Management");
    adminHelper.getBanner().then((banner)=>{
        console.log(banner);
        let URL = banner.bannerURL
        console.log(URL);
        res.render('admin/menu/banner',{admin:true , URL})
    })    
}

exports.changeBanner = async (req,res)=>{
    const result = await cloudinary.uploader.upload(req.file.path);
    let image = result.secure_url

    console.log(image);
    adminHelper.changeBanner(image).then(()=>{
        res.redirect('/admin/banner')
    })
}