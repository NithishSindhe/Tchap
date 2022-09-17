const { MongoClient } = require("mongodb");
const keys = require("../secret/keys");
const URI = keys.mongoURI;
// const URI = "mongodb+srv://NithishSindhe:U8kT6fE4wjZgQBp@registerandlogin.4dtd3vy.mongodb.net/RegisterAndLogin?retryWrites=true&w=majority";
const client = new MongoClient(URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var _db;
module.exports = {
    connectToServer: function(callback){
        client.connect((err,db)=>{
            if(db){
                _db = db.db("Users");
                console.log("connected to database");
            }
            return callback(err);
        });
    } 
}