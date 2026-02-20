import ChatForm from "../chatroom/ChatForm";
import UserJoiningRoom from "../chatroom/UserJoiningRoom";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import RoomMessages from "../chatroom/RoomMessages";
import { API_BASE_URL } from "../api";

export default function RoomChatPage() {
  const params = useParams();
  const roomChatId = params?.roomChatId ?? null; 
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  
    //Basic socket connection
    useEffect(() => {
      // Basic validation
      if (!roomChatId) {
        navigate("/404");
        return;
      }

      if (socket) return;


      // Connect to the server using Socket.IO, sending the JWT in auth
      const newSocket = io(API_BASE_URL, {
          withCredentials: true, //Do this to send the cookie to the websocket
          transports: ["websocket"],
      });

      newSocket.on("connect", () => console.log("Socket connected!"));
      newSocket.on("connect_error", (err) => console.error("Connect error:", err));

      setSocket(newSocket)

      //Unmount everything on cleanup
      return () => {
        if (newSocket){
          newSocket.off();
          newSocket.disconnect();
          setSocket(null);
        }
      }
    },[]); //Rerun this code if socket or roomChatId changes



    return (
      <main>
        <h1>Room chat</h1>
          {/* Wait until socket is created */}
          {socket ? (
            <>
              <UserJoiningRoom socket={socket} roomChatId={roomChatId} />
              <RoomMessages socket={socket} />
              <ChatForm socket={socket} roomChatId={roomChatId} />
            </>
          ) : (
            //TODO animate this?
            <p>Connecting…</p>
          )}
      </main>
    )
}