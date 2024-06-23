import {useState} from "react";
import "./css/userRegister.css"

function UserRegister(attributes){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [Email,setEmail] = useState("");
    const [registerStatus,setRegisterStatus] = useState(false)
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
    const register = async () => {
        const authToken = await fetch("http://localhost:5000/api/users/register",{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                email:Email,
                password:password,
                password2:confirmPassword,
                username:username
            })
        });
        let response = await authToken.json();
        console.log(response)
        setRegisterStatus(response)
    }
    const handleMail = (element)=>{
        setEmail(element.target.value);
    }
    
    return (
        <div className="registerContainer">
            <h1 style={{color:"white"}}>Enter registration Details</h1>
            <input onChange={handleMail} className = "email" placeholder="Email"></input>
            <input onChange={handleUsername} className="userName" placeholder="Username"></input>
            <input onChange={e => setPassword(e.target.value)} type = "password" className="password" placeholder="Password"></input>
            <input onChange={e => setConfirmPassword(e.target.value)} type = "password" className="password" placeholder="Confirm Password"></input>
            <button onClick={register}>Register</button>
        </div>
    );
}

export default UserRegister
