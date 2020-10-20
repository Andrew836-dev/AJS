import React from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../utils/UserStore";
import UserProfile from "../../components/UserProfile";

function ProfileWrapper() {
  const { userName } = useParams();
  const [userContext] = useUserContext();

  return (!userName
    ? <UserProfile profileName={userContext.name} />
    : <UserProfile profileName={userName} />)
}

export default ProfileWrapper;
