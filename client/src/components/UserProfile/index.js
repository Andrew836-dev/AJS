import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Paragraph } from "grommet";
import { View } from "grommet-icons";
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
    : <Box fill overflow={{ vertical: "scroll" }}>
      <Box direction="row" justify="center" margin="small" pad="small" height={{ min: "150px" }}>
        <Box>
          <img src="https://placekitten.com/150/150" alt="" height="150px" />
        </Box>
        <Box>
          <p>UserName: {profileData.username}</p>
          <p>Last Login: {moment(profileData.lastLogin).local().toString()}</p>
          <p>Signup date: {moment(profileData.signupDate).local().toString()}</p>
        </Box>
      </Box>
      <Box direction="row" justify="center" height={{min: "200px"}}>
        <Box direction="column">
          <p>Saved Code: {snippetData.length}</p>
          <p>Profiles Followed: 0</p>
          <p>Total Followers: 0</p>
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
              <Box gridArea="header" background="brand">
                <Paragraph>Language: {snippet.mode}</Paragraph>
                <Paragraph>Title: {snippet.title || "Untitled"}</Paragraph>
              </Box>
              <Box gridArea="nav" direction="column" justify="center">
                <Link to={`/${snippet.mode}/${snippet._id}`}><View />View Snippet</Link>
              </Box>
              <Box gridArea="main" direction="column" pad="small">
                <Paragraph>First Line: {snippet.body[0]}</Paragraph>
                <Paragraph>Last Edited: {moment(snippet.lastEdited).local().toString()}</Paragraph>
              </Box>
            </Grid>)}
          </Box>)}
      </Box>
    </Box>)
}

export default UserProfile;