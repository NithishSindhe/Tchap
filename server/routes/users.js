//const validateRegisterInput = require("../db/register");
//const validateLoginInput = require("../db/login");
const bcrypt = require("bcryptjs");
const express = require("express");
const {check_email_existence, create_mysql_user, get_user_info} = require("../db/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../secret/keys");
const validator = require("validator");
const isEmpty = require("is-empty");


function validateLoginInput(data) {
    let errors = {};// Convert empty fields to an empty string so we can use validator functions
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";// Email checks
    if (validator.isEmpty(data.email)) {
      errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
      errors.email = "Email is invalid";
    }// Password checks
    if (validator.isEmpty(data.password)) {
      errors.password = "Password field is required";
    }
    return {errors,isValid: isEmpty(errors)};
};

function validateRegisterInput(data) {
    // accumilate all errors to throw at form 
    let errors = {};
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
    }
    if (validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    return {
        errors,
        isValid: isEmpty(errors)
  };
};

router.post("/register",(req,res)=>{
    console.log('/register called:',req.body)
    if(req.body.username == null) return res.status(400).json({error:"user name is required"})
    if(req.body.password == null) return res.status(400).json({error:"password is required"})
    if(req.body.email == null) return res.status(400).json({error:"email is required"})
    const {errors,isValid} = validateRegisterInput(req.body);
    if(!isValid){
        console.log('not a valid register info')
        console.log(errors)
        return res.status(400).json(errors);
    }
    if(check_email_existence(req.body.email) == true){
        return res.status(400).json({email:"email already exists"})
    }
    else{
        const newUser = {
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,
            //phone:req.body.phone
        };
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) return console.log('error generating salt for password.', err)
            bcrypt.hash(newUser.password,salt,(err1,hash)=>{
                if(err1) return console.log('error encrypting password.', err)
                newUser.password = hash;
                try{ 
                    create_mysql_user(newUser.name,newUser.password,newUser.email, null);
                }catch(err) {
                    console.log('user registration failed due to following error:', err);
                    console.log('user registration failed for user:',newUser);
                    res.status(500).send('Something went wrong. Please try again');
                }
            });
        });
    }
})

router.post("/login",(req,res)=>{
    const {errors,isValid} = validateLoginInput(req.body);
    if(!isValid){
        errors.success = false;
        return res.status(404).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    check_email_existence(email).then(response => {
        if(!response) return res.status(400).json({ error: 'Email does not exist. Please register as a new user' });
        const payload = {
            id: email,
            name:'testing'
        };
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn:86400//1 day
            },
            (err,token)=>{
                if(err) return res.status(500).json({ error: 'Internal server error' })
                console.log(token)
                res.status(200).json({
                    success:true,
                    userName:'testing',
                    token:token
                    // token:"bearer" + token
                });
            }
        );
        //return res.status(200).json({ message : 'success' });
    })
    .catch(error => {
        return res.status(500).json({error:'Internal server error'})
    })
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
})


module.exports = router;
