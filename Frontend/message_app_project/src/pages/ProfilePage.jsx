import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import api, { API_BASE_URL } from "../api";

import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const params = useParams();
  const userIdParams = params?.userId || ""; 

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    image: "",
    description: "",
  });

  const handleRedirectToProfileEdit = () => {
    navigate("/profiles/edit")
  }

  useEffect(() => {
    api.get(`profiles/${userIdParams}`).then((response) => {
      console.log(response);
      if (response.data.error) {
          navigate("/404");
        } else {
          setProfile({
            username: response?.data?.username || "",
            email: response?.data?.email || "",
            image: response?.data?.image || "",
            description: response?.data?.description || "",
          });
        }

    })
  }, []);

            

  return (
    <main className="main-profile">
      <h1>User profile</h1>
      {
        profile?.image !== "" && <img src={`${API_BASE_URL}/uploads/${profile.image}`} />
      }
      <h2>Username: { profile?.username }</h2>
      <section className="user-description">
        <h3>Description</h3>
        <p>{ profile?.description }</p>
      </section>
        {/* button only visible for user owning profile */}
        {
          !userIdParams &&
          <button 
          onClick = {handleRedirectToProfileEdit}>Edit</button>
        }
    </main>
  )
}