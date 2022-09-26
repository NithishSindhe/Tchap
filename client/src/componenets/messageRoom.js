import React,{useState} from 'react';

import "./css/messageRoom.css";



function MessageRoom(elements){
    const socket = elements.socket;
    
    const [messages,setMessages] = useState([]);
    const [userMessage,setUserMessage] = useState();
    socket.emit("joinRoom",elements.roomId);
    
    socket.on("broadcastSocketMessage",(data,fromUser)=>{
        
        setMessages([...messages,{userName:fromUser,theMessage:data}]);
    })
    const handelChange = (element) => {
        setUserMessage(element.target.value);
    }
    const handleSubmit = (element) =>{        
        let temp = {"message":userMessage,"user":elements.userData["userName"],"token":elements.userData["token"]};
        
        socket.emit("userSentMessage",temp);
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
    const AllMessages = ()=>{   
        return <div className='allMessages'>
            {
                messages.map((element)=>{
                    return <pre>
                    <p className='userName'>{element.userName}</p>
                    <p className='message'>{element.theMessage}</p>
                    </pre> 
                })
            }
        </div>
    }
    return (
    //   <div className="container">
    <>
        <div className="topBar">
          <h2>Room : {elements.roomId}</h2>
          <h3>User Name : {elements.userData["userName"]}</h3>
        </div>
        <div className="chatbox">
          <AllMessages></AllMessages>
          <div className="controls">
          <div className="bottom0">
            <input
              id="userMessage"
              type="text"
              value={userMessage}
              onKeyDown={handleEnter}
              placeholder="enter your message"
              onChange={handelChange}
            ></input>

            <button className="sendMessage" onClick={handleSubmit}>
              Send
            </button>

            <button className="leaveRoom" onClick={leaveRoom}>
              Leave room
            </button>
          </div>
        </div>
        </div>
        
        </>
    //   </div>
    );
}
export default MessageRoom;