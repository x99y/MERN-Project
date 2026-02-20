import { redirect, useNavigate } from "react-router";
import "../styles/WelcomePage.css"
import logo from './assets/Logo.App.png'


export function WelcomePage() {
    const navigate = useNavigate();


    const handleRedirect = (path) => {
        navigate(path);     
    };


  return (
    <main className="welcome-container">
        
       <div className="welcome-image-section">
        <img src={logo} alt="Logo by IA" />
       </div>
       
        
       <div className="welcome-section">
        <h1>Welcome to BlahBlah!</h1>
        <p>Already have an account?</p>
        <button onClick={() => handleRedirect("users/login")}>Sign In</button>
        <p>New to the app? Create an Account!</p>
        <button onClick={() => handleRedirect("users/register")}>Register</button>
        </div>  
    </main>
  )
}