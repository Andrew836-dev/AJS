import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "grommet";
import SnippetList from "../SnippetList";
import API from "../../utils/API";
import { useUserContext } from "../../utils/UserStore";
import { LOADING, LOGIN, LOGOUT } from "../../utils/actions";
import moment from "moment";

function UserProfile(props) {
  const { profileName: username } = props;
  const [userContext, userDispatch] = useUserContext();
  const [viewerIsOwner, setViewerIsOwner] = useState(false);
  const [snippetData, setSnippetData] = useState([]);
  const [profileData, setProfileData] = useState({
    role: "GUEST",
    username: username || "",
    signupDate: "",
    lastLogin: "",
    darkTheme: true
  });

  useEffect(() => {
    if (username) {
      setViewerIsOwner(username === userContext.username);
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
  }, [username, userContext.username]);

  function sendProfileData(newData) {
    userDispatch({ type: LOADING })
    API
      .updateProfileData(newData)
      .then(dbUser => userDispatch({ type: LOGIN, ...dbUser }))
      .catch(err => {
        console.log("Error updating profile", err);
        userDispatch({ type: LOGOUT })
      });
  }

  return (!username
    ? <Text>Can't show a profile without a name. Please log in or view someone elses profile</Text>
    : <Box fill overflow={{ vertical: "scroll" }}>
      <Box height={{ min: "auto" }} direction="row" justify="center" pad="small">
        <Box>
          <Text>{viewerIsOwner && "Hello "}{profileData.username}</Text>
          <Text>Last Login: {moment(profileData.lastLogin).local().fromNow().toString()}</Text>
          <Text>Signup date: {moment(profileData.signupDate).local().format("ddd MMM Do YYYY").toString()}</Text>
          {viewerIsOwner && (<>
            <Text>Preferred Theme: {userContext.darkTheme ? "Dark" : "Light"}</Text>
            <Button
              label={`Switch to ${userContext.darkTheme ? "Light" : "Dark"} theme.`}
              onClick={() => sendProfileData({ darkTheme: !userContext.darkTheme })}
            />
          </>)}
        </Box>
      </Box>
      <Box height={{ min: "auto" }} direction="row" justify="center">
        <Box>
          <Text style={{ marginBottom: "1rem" }}>Saved Code: {snippetData.length}</Text>
        </Box>
      </Box>
      <Box height={{ min: "auto" }} direction="row" justify="center">
        {snippetData.length > 0 && <SnippetList data={snippetData} viewerIsOwner={viewerIsOwner} />}
      </Box>
    </Box>)
}

export default UserProfile;