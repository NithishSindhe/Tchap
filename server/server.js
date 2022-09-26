const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const passport = require("passport");
const users = require("./routes/users");
const jwt = require('jsonwebtoken');
const keys = require("./secret/keys");
const {Server} = require("socket.io");
const user = require("./db/user");
const io = new Server(httpServer,{

    path: "/socket.io/",
    cors:{
        origin:"http://localhost:3000",
    }
})


io.on("connect",(socket)=>{
    var roomId;
    socket.on("leaveRoom",(room)=>{
        socket.leave(roomId,(err)=>{
            if(err) console.log(err);
        });
    });
    socket.on("joinRoom",(room)=>{
        roomId = room;
        socket.join(room);
    });
    socket.on("userSentMessage",(data)=>{
        jwt.verify(data["token"], keys.secretOrKey, (err,decoded)=>{
            if(decoded){
                io.to(roomId).emit("broadcastSocketMessage",data["message"],data["user"]);
            }
            if(err){
                console.log("messaage sent with wrong token",err,data["token"])
            }
        })
        
    });
});


app.use(cors())

app.use(bodyParser.urlencoded({
    extended: false
  })
  )
app.use(bodyParser.json());

const db = require("./secret/keys").mongoURI ;

mongoose.connect(
    db,
    {useNewUrlParser:true}
)
.then(()=>{
    console.log("connected to db successfully");
})
.catch(err => console.log(err));

app.use(passport.initialize());
require("./db/passport")(passport);
app.use("/api/users",users)

httpServer.listen(5000,()=>{
    console.log("server listning on port 5000");
})  
