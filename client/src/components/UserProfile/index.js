import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paragraph, Text } from "grommet";
import { View } from "grommet-icons";
import API from "../../utils/API";
import { useUserContext } from "../../utils/UserStore";
import { LOADING, LOGIN, LOGOUT } from "../../utils/actions";
import moment from "moment";

function UserProfile(props) {
  const { profileName: username } = props;
  const [userContext, userDispatch] = useUserContext();
  const [viewerIsOwner, setViewerIsOwner] = useState(false);
  const [profileData, setProfileData] = useState({
    role: "GUEST",
    username: username || "",
    signupDate: "",
    lastLogin: "",
    darkTheme: true
  });
  const [snippetData, setSnippetData] = useState([]);

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
    ? <p>Can't show a profile without a name. Please log in or view someone elses profile</p>
    : <Box fill overflow={{ vertical: "scroll" }}>
      <Box direction="row" justify="center" margin={{ bottom: "1rem" }} pad="small">
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
      <Box direction="row" justify="center">
        <Box direction="column">
          <p style={{ marginBottom: "1rem" }}>Saved Code: {snippetData.length}</p>
        </Box>
      </Box>
      <Box direction="row" justify="center">
        {!!snippetData.length && (
          <Box>
            {snippetData.map(snippet => <Grid key={snippet._id}
              rows={['xsmall', 'small']}
              columns={['small', 'medium']}
              gap="small"
              areas={[
                { name: 'header', start: [0, 0], end: [1, 0] },
                { name: 'nav', start: [0, 1], end: [0, 1] },
                { name: 'main', start: [1, 1], end: [1, 1] },
              ]}
            >
              <Box gridArea="header" background="brand" pad={{ left: "1rem" }} margin={{ top: "1rem" }}>
                <Paragraph>Language: {snippet.mode}</Paragraph>
                <Paragraph margin={{ top: "0px" }}>Title: {snippet.title || "Untitled"}</Paragraph>
              </Box>
              <Box gridArea="nav" direction="column" justify="center">
                <Button
                  icon={<View />}
                  label={`${viewerIsOwner ? "Edit" : "View"} Snippet`}
                  href={`/editor/${snippet.mode}/${snippet._id}`}
                />
              </Box>
              <Box gridArea="main" direction="column" pad="small">
                <Paragraph>First Line: {snippet.body[0]}</Paragraph>
                <Paragraph>Last Edited: {moment(snippet.lastEdited).local().fromNow().toString()}</Paragraph>
              </Box>
            </Grid>)}
          </Box>)}
      </Box>
    </Box>)
}

export default UserProfile;