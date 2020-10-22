import React from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../utils/UserStore";
import UserProfile from "../../components/UserProfile";

function ProfileWrapper() {
  const { username } = useParams();
  const [userContext] = useUserContext();

  return (!username
    ? <UserProfile profileName={userContext.username} />
    : <UserProfile profileName={username} />)
}

export default ProfileWrapper;
