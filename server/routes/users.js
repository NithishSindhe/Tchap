const validateRegisterInput = require("../db/register");
const validateLoginInput = require("../db/login");
const bcrypt = require("bcryptjs");
const express = require("express");
const users = require("../db/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../secret/keys");

router.post("/register",(req,res)=>{
    const {errors,isValid} = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    //mongodb function findone to check if the email exists
    users.findOne({email:req.body.email})
    .then(element => {
        if(element){
            return res.status(400).json({email:"email already exists"})
        }
        else{
            const newUser = new users({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            });
            
            //encrypt password before saving to db here
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
    }
    });
});

router.post("/login",(req,res)=>{


    const {errors,isValid} = validateLoginInput(req.body);
    
    if(!isValid){
        errors.success = false;
        return res.status(404).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    users.findOne({email})
    .then(userExists => {
        if(!userExists){  
            return res.status(404).json({success:false,emailNotFound:"email not found"});
        }
        
        bcrypt.compare(password,userExists.password)
        .then(isMatch => {
            if(isMatch){
                const payload = {
                    id: users.id,
                    name:users.name
                };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn:31556926
                    },
                    (err,token)=>{
                        res.json({
                            success:true,
                            userName:userExists.name,
                            token:"bearer" + token
                        });
                    }
                );
            }
            else{
                return res.status(400).json({passwordIncorrect:"incorrect password"})
            }
        })
        });
    
    
    
})

module.exports = router;