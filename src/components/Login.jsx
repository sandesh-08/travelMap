import "./login.css";
import { useState } from "react";
import { useRef } from "react";
import { Room, Cancel } from "@material-ui/icons";
import axios from "axios";

export default function Login({setShowLogin, myStorage, setCurrentUser}) {

    const [error, setError]= useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        };

        try{
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/users/login`,user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser(res.data.username); 
            setShowLogin(false);
            setError(false);
        }catch(e) {
            setError(true);
        }

    }

    return (
      <div className="loginContainer">
        <div className="logo"> 
            <Room />
            Travel Map
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="loginbutton">Login</button>
            {error &&
                <span className="failure"> Something went wrong </span>
            }
        </form>
        <Cancel className="registerCancel" onClick={()=>setShowLogin(false)}/>
      </div>  
    );
}