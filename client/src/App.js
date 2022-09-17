import React,{useEffect, useState} from 'react'
import "./App.css"
import MessageRoom from "./componenets/messageRoom"
import UserRegister from "./componenets/UserRegister"
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000",{'forceNew':true})
function App(){
  const [renderRoom,setRenderRoom] = useState(false);
  const [roomId,setRoomID] = useState();
  const [user,setUser ]= useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")
  const handleRoomId = (element) =>{
    setRoomID(element.target.value);
  }
  
  useEffect(()=>{
    if(user && password){
      socket.emit("createNewUser",{"username":user,"password":password,"email":email})

    }
  },[email,user,password])
  const joinRoom = ()=>{
    if(roomId){ 
      setRenderRoom(true)
    }else{
      document.getElementById("roomId").placeholder = "Please enter valid room ID"
    };
  }
  return (
    <div className='wrapper'>
      {(true)?(<UserRegister setEmail = {setEmail} setPassword = {setPassword} setUser = {setUser}></UserRegister>):(
        renderRoom?(<MessageRoom socket = {socket} renderRoom={setRenderRoom}roomId = {roomId}></MessageRoom>):(
      <span className='login'>
        <input required id = "roomId" type = "text" placeholder='Enter Room Id to join' onChange={handleRoomId}></input>
        <br/>
        <button  onClick={joinRoom}>Join or create Room</button>
      </span>
      ))}
    </div>
  );
}

export default App;