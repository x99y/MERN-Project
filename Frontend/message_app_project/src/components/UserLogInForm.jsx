import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
// import "../styles/LogInPage.css"


export default function UserLogInForm({ setError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();

    try{
      
      // send to api for authentication verify, then give response, if status 200, display sucessfull message
      const response = await api.post("/users/login",{}, {
        headers: {
          Authorization: "Basic " + btoa(email + ":" + password),
        },
      });
      if (response.data.error){
        console.log(response.data.error)
        setError("Incorrect email or password, please try again!")
      } else{
        setError("");
        navigate("/home");
      }
    } catch (error){
      setError("An unknown error occured, please try again!")
      console.log(error);
    }
  }

  return (
    <div>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" onChange={onChangeEmail}/>
        </div>
        
        <div>
           <label htmlFor="password">Password:</label>
          <input type="text" id="password" name="password" onChange={onChangePassword} />
        </div>

        <button onClick={onSubmit}>Sign in</button>
      </form>
    </div>
  )
}