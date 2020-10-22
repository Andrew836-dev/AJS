import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/API";
import moment from "moment";

function UserProfile(props) {
  const username = props.profileName;
  const [profileData, setProfileData] = useState({
    role: "GUEST",
    username: username || "",
    signupDate: "",
    lastLogin: ""
  });
  const [snippetData, setSnippetData] = useState([]);

  useEffect(() => {
    if (username) {
      API
        .getUserProfileData(username)
        .then(userData => {
          if (userData) {
            API
              .getUserSnippets(userData.username)
              .then(userSnippets => {
                setSnippetData(userSnippets);
              })
              .catch(err => {
                console.log("Snippets error", err);
              });
            setProfileData(userData);
          } else {
            setProfileData(prevState => ({ ...prevState, username: "There was an error, please try refreshing" }));
          }
        })
        .catch(err => {
          console.log("Profile error", err);
        });
    }
  }, [username]);

  return (!username
    ? <p>Can't show a profile without a name. Please log in or view someone elses profile</p>
    : <>
      <div>
        <img src="https://placekitten.com/150/150" alt="" height="150px" />
        <p>{profileData.username}</p>
        <p>Last Login: {profileData.lastLogin}</p>
        <p>Signup date: {profileData.signupDate}</p>
      </div>
      <div>
        <p>Saved Code: 0</p>
        <p>Profiles Followed: 0</p>
        <p>Total Followers: 0</p>
      </div>
      {snippetData.length
        ? <div>
          {snippetData.map(snippet => <div key={snippet._id}>
            <Link to={"/code/" + snippet._id}>View</Link>
            <p>{snippet.mode}</p>
            <p>{snippet.title}</p>
            <p>{snippet.body[0]}</p>
            <p>{moment(snippet.lastEdited).local().toString()}</p>
          </div>)}
        </div>
        : null}
    </>)
}

export default UserProfile;