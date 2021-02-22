import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useUserContext } from "../../utils/UserStore";
import {
  Box,
  Heading,
  ResponsiveContext,
  Text,
  Menu,
  Header
} from "grommet";
import LoginBox from "../LoginBox";
import API from "../../utils/API";
import { LOGIN, LOGOUT, LOADING } from "../../utils/actions";

function NavBar() {
  const history = useHistory();
  const location = useLocation();
  const [userContext, importedUserDispatch] = useUserContext();
  const userDispatch = useCallback(importedUserDispatch, []);

  const logout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    userDispatch({ type: LOADING });
    API
      .userLogout()
      .then(() => {
        userDispatch({ type: LOGOUT })
        // history.push("/", { message: "You have logged out" })
      });
  }

  function generateMenuItemArray(username) {
    const output = []
    output.push({ label: "Javascript Editor", onClick: () => history.push("/editor/javascript") });
    output.push({ label: "Markdown Editor", onClick: () => history.push("/editor/markdown") });
    output.push({ label: "Readme Generator", onClick: () => history.push("/readme-generator") });
    if (username) {
      output.push({ label: 'Profile', onClick: () => history.push("/profile/" + username) });
      output.push({ label: 'Log out', onClick: logout });
    } else {
      output.push({ label: 'Register', onClick: () => history.push("/register") });
    }
    return output;
  }

  const [locationNames, setLocationNames] = useState([]);
  const maxNameQuantity = 2;
  useEffect(() => {
    setLocationNames(location.pathname.split("/").filter(section => section));
  }, [location.pathname]);

  useEffect(() => {
    let isLoaded = true;
    API
      .getUserSessionData()
      .then(userData => {
        if (isLoaded) {
          const userDataKeys = Object.keys(userData);
          // if any data in state doesn't match data from the server, replace state with server data
          if (userDataKeys.some(key => userData[key] !== userContext[key])) {
            userDispatch({
              type: LOGIN,
              ...userData
            });
          };
        }
      })
      .catch(console.log);
    return () => isLoaded = false;
  }, [userContext, userDispatch]);

  const size = useContext(ResponsiveContext);
  return (<>
    <Header
      direction="row"
      background="brand"
      pad={{ horizontal: size, vertical: "xsmall" }}
      elevation="medium"
      style={{ zIndex: "1" }}
    >
      <Menu
        plain
        label={<Heading level="3" margin="none" color="white">AJS</Heading>}
        items={generateMenuItemArray(userContext.username)}>
      </Menu>
      <Box direction="row">
        {locationNames.slice(0, maxNameQuantity).map(locationName => <Box key={locationName} direction="row">/<Text>{locationName}</Text></Box>)}
      </Box>
      {userContext.username
        ? (<Box onClick={() => history.push(`/profile/${userContext.username}`)}>
          <Text size="large" weight="bold">{userContext.username}</Text>
        </Box>)
        :
        <LoginBox />}
    </Header>
  </>)
}

export default NavBar;