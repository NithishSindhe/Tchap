import React,{useState} from 'react';
import io from "socket.io-client";
import Chatbox from './chatbox';
import "./css/messageRoom.css";
const socket = io.connect("http://localhost:5000",{'forceNew':true})

function MessageRoom(elements){
    const [messages,setMessages] = useState([{}]);
    const [userMessage,setUserMessage] = useState();

    socket.emit("joinRoom",elements.roomId);

    socket.on("bradcastSocketMessage",(data,fromUser)=>{
        
        setMessages([...messages,{userName:fromUser,theMessage:data}]);
    })
    const handelChange = (element) => {
        setUserMessage(element.target.value);
    }
    const handleSubmit = (element) =>{
        document.getElementById("userMessage").value = "";
        socket.emit("userSentMessage",userMessage);
        setUserMessage("");
    }
    
    const leaveRoom = ()=>{
        socket.emit("leaveRoom",elements.roomId);
        elements.renderRoom(false);
    }

    return (
        <div className='container'>
            <span className='topBar'>
            <h2>You are in room {elements.roomId}</h2>
            <h3>your user id is {socket.id}</h3>
            </span>
            <Chatbox messages = {messages}></Chatbox>
            <div className='controls'>
                <input id = "userMessage" type = "text" placeholder='enter your message' onChange={handelChange}></input>

                <button className='sendMessage' onClick={handleSubmit}>send</button>

                <button onClick={leaveRoom}> Leave room</button>
            </div>
        </div>
    )
}
export default MessageRoom;