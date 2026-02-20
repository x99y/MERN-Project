import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function UserRegisterForm({ setError }) {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();

    try{
      // send to api for authentication verify, then give response, if status 200, display sucessfull message
      const response = await api.post("/users/register",
        {
          username : username,
          email : email,
          password : password,
        }
        , null);
      


      if (response.data.error){

        let error_results = response.data.error

        if (typeof error_results === "string") {
          error_results = error_results
          .replace("ValidationError:", "")
          .replace("password:", "")
          .replace("MongooseError:", "")
          .split(",");

          console.log(error_results);
          setError(error_results[0]);
        } else {
          throw new Error("Website response is not a string");
        }
      } else{
        console.log("sending home");
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
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" onChange={onChangeUsername}/>
        </div>

        <div>
           <label htmlFor="password">Password:</label>
          <input type="text" id="password" name="password" onChange={onChangePassword} />
        </div>

        <button onClick={onSubmit}>Register</button>
      </form>
    </div>
  )
}