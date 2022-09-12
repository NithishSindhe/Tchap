const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const { ExtractJwt } = require("passport-jwt");
const user = mongoose.model("users")
const keys = require("../secret/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
    passport.use(
        new JwtStrategy(opts, (jwt_payload,done)=>{
        user.findById(jwt_payload.id)
        .then(user=>{ 
            if(user){
               return done(null,user);
            }
            return done(null,false);
        }).catch(err => console.log(err));
    }))
}
