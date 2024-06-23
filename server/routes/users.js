//const validateRegisterInput = require("../db/register");
//const validateLoginInput = require("../db/login");
const bcrypt = require("bcryptjs");
const express = require("express");
const {check_mysql_user} = require("../db/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../secret/keys");
const validator = require("validator");
const isEmpty = require("is-empty");


//function validateLoginInput(data) {
//    let errors = {};// Convert empty fields to an empty string so we can use validator functions
//    data.email = !isEmpty(data.email) ? data.email : "";
//    data.password = !isEmpty(data.password) ? data.password : "";// Email checks
//    if (validator.isEmpty(data.email)) {
//      errors.email = "Email field is required";
//    } else if (!validator.isEmail(data.email)) {
//      errors.email = "Email is invalid";
//    }// Password checks
//    if (validator.isEmpty(data.password)) {
//      errors.password = "Password field is required";
//    }
//    return {errors,isValid: isEmpty(errors)};
//};

function validateRegisterInput(data) {
    // accumilate all errors to throw at form 
    let errors = {};
    console.log('validating user register info')
    // functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";// Name checks
    if (validator.isEmpty(data.username)) {
        errors.username = "Name field is required";
    }// Email checks
    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }// Password checks
    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }if (validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }return {
        errors,
        isValid: isEmpty(errors)
  };
};

router.post("/register",(req,res)=>{
    console.log(req.body)
    const {errors,isValid} = validateRegisterInput(req.body);
    if(!isValid){
        console.log('not a valid register info')
        console.log(errors)
        return res.status(400).json(errors);
    }
    if(check_mysql_user(req.body.email) == true){
        return res.status(400).json({email:"email already exists"})
    }
    else{
        const newUser = {
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,
            //phone:req.body.phone
        };
        console.log(newUser);
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                newUser.password = hash;
                console.log(newUser.password);
                //newUser
                //.save()
                //.then(user => res.json(user))
                //.catch(err => console.log(err));
            });
        });
    }
})

//router.post("/register_old",(req,res)=>{
//    const {errors,isValid} = validateRegisterInput(req.body);
//    if(!isValid){
//        return res.status(400).json(errors);
//    }
//    //mongodb function findone to check if the email exists
//    users.findOne({email:req.body.email})
//    .then(element => {
//        if(element){
//            return res.status(400).json({email:"email already exists"})
//        }
//        else{
//            const newUser = new users({
//                name:req.body.name,
//                email:req.body.email,
//                password:req.body.password
//            });
//            console.log(newUser)
//            //encrypt password before saving to db 
//            bcrypt.genSalt(10,(err,salt)=>{
//                bcrypt.hash(newUser.password,salt,(err,hash)=>{
//                    newUser.password = hash;
//                    console.log(newUser)
//                });
//            });
//    }
//    });
//});

//router.post("/login",(req,res)=>{
//    const {errors,isValid} = validateLoginInput(req.body);
//    if(!isValid){
//        errors.success = false;
//        return res.status(404).json(errors);
//    }
//    const email = req.body.email;
//    const password = req.body.password;
//    users.findOne({email})
//    .then(userExists => {
//        if(!userExists){  
//            return res.status(404).json({success:false,emailNotFound:"email not found"});
//        }
//        bcrypt.compare(password,userExists.password)
//        .then(isMatch => {
//            if(isMatch){
//                const payload = {
//                    id: users.id,
//                    name:users.name
//                };
//                console.log()
//                jwt.sign(
//                    payload,
//                    keys.secretOrKey,
//                    {
//                        expiresIn:31556926
//                    },
//                    (err,token)=>{
//                        res.json({
//                            success:true,
//                            userName:userExists.name,
//                            token:token
//                            // token:"bearer" + token
//                        });
//                    }
//                );
//            }
//            else{
//                return res.status(400).json({passwordIncorrect:"incorrect password"})
//            }
//        })
//        });
//})

module.exports = router;
