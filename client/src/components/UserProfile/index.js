import React, { useEffect, useState } from "react";
import API from "../../utils/API";

function UserProfile(props) {
  const name = props.profileName;
  const [profileData, setProfileData] = useState({
    role: "GUEST",
    name: name,
    signupDate: "",
    lastLogin: ""
  });

  useEffect(() => {
    if (name) {
      API
        .getUserProfileData(name)
        .then(userData => {
          console.log(userData);
          if (userData) {
            setProfileData(userData);
          } else {
            setProfileData(prevState => ({ ...prevState, name: "There was an error, please try refreshing" }));
          }
        })
        .catch(err => {
          console.log("catch", err);
        });
    }
  }, [name]);

  return (!name
    ? <p>Can't show a profile without a name. Please log in or view someone elses profile</p>
    : <>
      <div>
        <img src="https://placekitten.com/150/150" alt="" height="150px" />
        <p>{profileData.name}</p>
        {(profileData.email
          ? <p>Your Email Address: {profileData.email}</p>
          : <></>)}
        <p>Last Login: {profileData.lastLogin}</p>
        <p>Signup date: {profileData.signupDate}</p>
      </div>
      <div>
        <p>Saved Code: 0</p>
        <p>Profiles Followed: 0</p>
        <p>Total Followers: 0</p>
      </div>
      <div>
        <p>Your Code</p>
      </div>
    </>)
}

export default UserProfile;