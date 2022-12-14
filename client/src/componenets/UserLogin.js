import { useState } from "react";
import "./css/UserLogin.css";
import Cookies from "universal-cookie"
import { Navigate } from "react-router-dom";
const Cookie = new Cookies();

function UserLogin(){
    const [mail,setMail] = useState();
    const [UserPassword,setPassword] = useState();
    const handelChange = (element,stateModify) => {
        stateModify(element.target.value);
    }
    const [jsonAuth,setJsonAuth] = useState();
    const login = async () => {
        const authToken = await fetch("http://localhost:5000/api/users/login",{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                email:mail,
                password:UserPassword
            })
        });
        let temp = await authToken.json();
        setJsonAuth(temp);
    }
    const Wrong = () => {
        if(jsonAuth){
            if(jsonAuth.success === false){
                return <p className="wrongInput">User Mail or Password is incorrect</p>   
            }
            if(jsonAuth.token !== undefined){
                Cookie.set("token",jsonAuth.token,{path:'/'});
                Cookie.set("userName",jsonAuth.userName,{path:'/'});
                Cookie.set("loggedIn",true,{path:'/'});
                return (<Navigate to='/'/>)
            }
            console.log("logging from cookie",Cookie.get("token",{doNotParse :false}));
        }
        return <></>
    }
    return (
        <div className="login">
            <Wrong></Wrong>
            <input type="string" placeholder="Enter your Email" onChange={(element)=>{handelChange(element,setMail)}}></input>
            <input type="password" placeholder="Enter password"  onChange={(element)=>{handelChange(element,setPassword)}}></input>
            <button onClick={login}>Login</button>
        </div>
    );
}

export default UserLogin