import React,{useEffect, useState} from 'react'
import "./App.css"
import MessageRoom from "./componenets/messageRoom"
import Virtualizedlist from "./componenets/Virtualizedlist"
import io from "socket.io-client";
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';


const socket = io.connect("http://localhost:5000",{'forceNew':true})
const Cookie = new Cookies();



function App(){
    const [renderRoom,setRenderRoom] = useState(false);
    const [roomId,setRoomID] = useState();
    const [userData,setUserData] = useState();

    //return <Virtualizedlist/>
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
    },[])
    if(userData !== undefined){
    if(userData["loggedIn"] === false || userData["loggedIn"] === undefined){
      return (<Navigate to="/login"></Navigate>);
    }}
    return (
    <div className='wrapper'>
       {(renderRoom)?
       (<MessageRoom userData = {userData} socket = {socket} renderRoom={setRenderRoom} roomId = {roomId}></MessageRoom>):
       (<span className='enterRoom'>
        <input className='roomIdInput' id = "roomId" type = "text" placeholder='Enter Room Id to join' onChange={handleRoomId}></input>
        <br/>
        <button className='joinRoom'  onClick={joinRoom}>Join or create Room</button>
       <iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="150"  className='appleMusic' sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/album/show-stop/1533867305?i=1533867503"></iframe>
      </span>
      )}
    </div>
    );
}

export default App;
