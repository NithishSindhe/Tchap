import React,{useState} from 'react'
import "./App.css"
import MessageRoom from "./componenets/messageRoom"
function App(){
  const [renderRoom,setRenderRoom] = useState(false);
  const [roomId,setRoomID] = useState();
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
  return (
    <div className='wrapper'>
      {renderRoom?(<MessageRoom renderRoom = {setRenderRoom}roomId = {roomId}></MessageRoom>):(
      <span className='login'>
        <input required id = "roomId" type = "text" placeholder='Enter Room Id to join' onChange={handleRoomId}></input>
        <br/>
        <button onClick={joinRoom}>Join or create Room</button>
      </span>
      )}
    </div>
  );
}

export default App;