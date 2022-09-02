const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

const http = require('http');
const app = express();
const httpServer = http.createServer(app);

const {Server} = require("socket.io");
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
        if(data && data.replace(/\s/g,"").length){
        io.to(roomId).emit("bradcastSocketMessage",data,socket.id);
        }
    });
});


app.use(cors())
app.get("/api",(req,res)=>{
    // res.json({"users":["userOne","userTwo","userThree"]})
})

httpServer.listen(5000,()=>{
    console.log("server listning on port 5000");
})  
