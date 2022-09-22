import React,{useEffect, useState} from 'react'
import "./App.css"
import MessageRoom from "./componenets/messageRoom"
import io from "socket.io-client";
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';


const socket = io.connect("http://localhost:5000",{'forceNew':true})
const Cookie = new Cookies();



function App(){
  
  const [renderRoom,setRenderRoom] = useState(false);
  const [roomId,setRoomID] = useState();
  const [userData,setUserData] = useState();
  

  const handleRoomId = (element) =>{
    setRoomID(element.target.value);
  }

  const joinRoom = ()=>{
    if(roomId){ 
      setRenderRoom(true)
    }else{
      document.getElementById("roomId").placeholder = "Please enter valid room ID"
    };
  }

  useEffect(()=>{
    let temp = Cookie.getAll();
    setUserData(temp);
    
    if(temp["loggedIn"] === false || temp["loggedIn"] === undefined){
      return <Navigate to="/login"></Navigate>
    }
  },[])
  return (
    <div className='wrapper'>
       {(renderRoom)?
       (<MessageRoom userData = {userData} socket = {socket} renderRoom={setRenderRoom} roomId = {roomId}></MessageRoom>):
       (<span className='enterRoom'>
        <input id = "roomId" type = "text" placeholder='Enter Room Id to join' onChange={handleRoomId}></input>
        <br/>
        <button  onClick={joinRoom}>Join or create Room</button>
      </span>
      )}
    </div>
  );
}

export default App;