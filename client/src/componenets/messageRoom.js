import React,{useState} from 'react';

import "./css/messageRoom.css";



function MessageRoom(elements){
    const socket = elements.socket;
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
    const handleEnter = (e)=>{
        if(e.key === "Enter"){
            handleSubmit();
        }
    }

    return (
        <div className='container'>
            <div className='topBar'>
                <h2>Room:{elements.roomId}</h2>
                <h3>User ID: "{socket.id}"</h3>
            </div>
            <div className="chatbox">
                <span className="allMessages">
                    {messages.map( (object,key) =>{
                        return (object.userName)?(
                            <>
                            <p className='username'>{object.userName}</p>
                            <p key = {key} className="theMessage">{object.theMessage}</p>
                            </>
                        ):
                        (<></>)
                    })}
                </span>
            </div>
            <div className='controls'>
                <div className='bottom0'>
                <input id = "userMessage" type = "text" onKeyDown={handleEnter} placeholder='enter your message' onChange={handelChange}></input>

                <button className='sendMessage' onClick={handleSubmit}>Send</button>

                <button className = "leaveRoom" onClick={leaveRoom}>Leave room</button>
                </div>
            </div>
        </div>
    )
}
export default MessageRoom;