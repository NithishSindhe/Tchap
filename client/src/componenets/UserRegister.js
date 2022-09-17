import {useState} from "react";
import "./css/userRegister.css"

function UserRegister(attributes){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [Email,setEmail] = useState("");
    const handlePassword = (element)=>{
        setPassword(element.target.value);
    }
    const handleUsername = (element)=>{
        setUsername(element.target.value);
    }
    const handleConfirmPassword = (element) =>{
        if(element.target.value === password){
            setConfirmPassword(element.target.value);
        }
    }
    const createUser = ()=>{
        if(confirmPassword !== null){
            attributes.setPassword(confirmPassword);
            attributes.setUser(username);
            attributes.setEmail(Email);
        }
    }
    const handleMail = (element)=>{
        setEmail(element.target.value);
    }
    return (
        <div className="registerContainer">
            <input onChange={handleMail} className = "email" placeholder="Email"></input>
            <input onChange={handleUsername} className="userName" placeholder="Username"></input>
            <input onChange={handlePassword} type = "password" className="password" placeholder="Password"></input>
            <input onChange={handleConfirmPassword} type = "password" className="password" placeholder="Confirm Password"></input>
            <button onClick={createUser}>Submit</button>
        </div>
    );
}

export default UserRegister
