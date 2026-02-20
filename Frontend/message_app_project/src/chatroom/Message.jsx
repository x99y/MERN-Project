import "../styles/Message.css";
import { API_BASE_URL } from "../api";

export default function Message({ message }) {
    
       
    return(
        <div className="message-box">
            <div className="user-box">
                <div className="small-circle">
                    {
                    message?.profilePic !== "" && <img src={`${API_BASE_URL}/uploads/${message.profilePic}`} />
                    }
                </div>
                <div className="username">
                    {message.username}
                </div>
            </div>
            <div className="message">
                {message.content}
            </div>
        </div>
    )
}