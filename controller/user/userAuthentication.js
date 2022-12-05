const userHelper = require("../../helper/user-helpers")
// var collection = require("../../bin/config/collection")
// var userHelper = require("../helper/user-helpers");
// const productHelper = require("../../helper/product-helper")

var dotenv = require('dotenv')
require('dotenv').config()

var client = require("twilio")(process.env.accountSID, process.env.authToken)




exports.Home = (req, res) => {
  req.session.userlogin = false
  req.session.adminlogin = false
  res.render("default/home", { user: false, admin: false });
}


exports.singupGet = (req, res) => {
  let err = req.session.alreadyUser;
  res.render("default/signup", { err });
  req.session.alreadyUser = false;
}



exports.signupPost = (req, res) => {
  let referals = req.body.referal;
  console.log(referals);
  console.log(req.body, "bodyyyyyyyyyyyyyyyyyyyy");
  userHelper.addUser(req.body)
    .then((returnUserdata) => {
      // let errr = false
      console.log(req.body);
      console.log(returnUserdata);
      userHelper.referal(referals, returnUserdata).then(() => {
        res.redirect("/users/login");
      });
    })
    .catch((errr) => {
      console.log("err = true reject is activated", errr);
      // let err = true
      req.session.alreadyUser = true;
      res.redirect("/signup");
    });
}

exports.userloginpage = (req, res) => {
 
    let err = req.session.loginerr
    res.render("default/userlogin",{err})
    req.session.userlogin = false
} 

exports.usercheck = (req, res) => {
  userHelper.userlogin(req.body).then((respondCheck) => {
    if (respondCheck.status == true) {
      userHelper.findoneuser(respondCheck).then((response) => {
        let userid = response.user._id
        req.session.user = respondCheck.user 
        req.session.loginerr = false
        req.session.userlogin = true
        res.redirect("/users/useraccount");
      })
    } else {
      console.log("user not founded");
      req.session.loginerr = true
      res.redirect("/users/login")
    }
  });
};


 //otp option
// exports.otpPage =  (req, res) => {
//     let id = req.params.id;
//     console.log("id is this on to factor ");
//     console.log(id)
//     userHelper.findphonenumber(id).then((number) => {
//       console.log(number)
//       let num = number.slice(-2)
//       res.render('otp', { id,num})
//       // sent otp to ph number
//       client.verify
//       .services(process.env.serviceID)
//       .verifications.create({
//         to: `+91${number}`,
//         channel: "sms",
//       })
//       .then(() => {
//         res.render("otp", { id, number });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     })
//   }



// // otp check
// exports.otpcheck=(req, res) => {
//   let id = req.params.id;
//   let otp = req.body.otpnumber;
//   let user = req.session.user;
//   userHelper.findphonenumber(id).then((phonenumber) => {
// console.log(phonenumber)
// let number=data.user.phonenumber
//     client.verify
//       .services(process.env.serviceID)
//       .verificationChecks.create({
//         to: `+91${phonenumber}`,
//         code: otp,
//       })
//       .then((data) => {
//         console.log(data);
//         if (data.valid) {
//           res.redirect("/users/useraccount");
//         } else {
//           res.redirect("/users/login");
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// }

exports.userLogout = (req,res)=>{
  req.session.userlogin = false
  res.redirect("/");
}

exports.forgotPassword = (req,res)=>{

  res.render("default/otp",{ user: false, admin: false })
}

exports.findPhonenumberWithEmail = (req,res)=>{
  console.log(req.body);
  let email = req.body.email
  console.log(email);
  userHelper.findphonenumber(email).then((phonenumber)=>{
    // if the address is correct
    console.log(phonenumber,"number printed");
    // // otp sending option
    // client.verify.services(process.env.serviceID).verificationChecks
    // .create({ to: `+91${phonenumber}`, code: otp,}).then((data) => {
    //           console.log(data);
    //           if (data.valid) {
                
    //           } else {
              
    //           }
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });






    req.session.userNumber = phonenumber
    console.log(phonenumber);
    let number = phonenumber.toString()
    console.log(number);
    let num = number.slice(-2)
  
    console.log("takkuuuuu",num);
     response = {
      number : num ,
      status: true ,
      email: email
    }
    console.log(response);
    res.json(response)

  }).catch(()=>{
    //if the email address is incorrect
    res.json({status:false})
  })
}

exports.changePasswordFromOTP = (req,res)=>{
  
}