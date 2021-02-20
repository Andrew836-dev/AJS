import React, { useEffect, useState, useContext } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
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
  const [userContext, userDispatch] = useUserContext();
  // const [menuVisible, setMenuVisible] = useState(false);
  const [locationNames, setLocationNames] = useState([]);
  const maxNameQuantity = 2;
  // const hideMenu = () => setMenuVisible(false);
  // const toggleMenuVisibility = () => setMenuVisible(!menuVisible);
  const logout = (e) => {
    // e.preventDefault();
    userDispatch({ type: LOADING });
    API
      .userLogout()
      .then(() => {
        userDispatch({ type: LOGOUT })
        // history.push("/", { message: "You have logged out" })
      });
  }

  useEffect(() => {
    setLocationNames(location.pathname.split("/").filter(section => section));
  }, [location.pathname]);

  useEffect(() => {
    let isLoaded = true;
    API
      .getUserSessionData()
      .then(userData => {
        if (isLoaded) {
          const keys = Object.keys(userData);
          if (keys.some(key => userData[key] !== userContext[key])) {
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
      {/*
      <Heading level="3" margin="none">
        <NavLink to="/" style={{ textDecoration: "none", color: "white" }} onClick={hideMenu}>AJS</NavLink>
      </Heading> */}

      {/* <ResponsiveContext.Consumer>
        {size => (<>
          {(!menuVisible || size !== "small") ? (
            <Collapsible direction="vertical" open={menuVisible}>
              <Box
                width='small'
                background='light-2'
                elevation='small'
                align='center'
                justify='center'
              >
                <NavLink to="/editor/javascript" onClick={hideMenu}>Javascript Editor</NavLink>
                <NavLink to="/editor/markdown" onClick={hideMenu}>Markdown Editor</NavLink>
                <NavLink to="/readme-generator" onClick={hideMenu}>Readme Generator</NavLink>
                {userContext.username
                  ? <>
                    <NavLink to={"/profile/" + userContext.username} onClick={hideMenu}>{userContext.username}</NavLink>
                    <NavLink to="/" onClick={logout}>Log Out</NavLink>
                  </>
                  : <>
                    <NavLink to="/register" onClick={hideMenu}>Register</NavLink>
                    <NavLink to="/login" onClick={hideMenu}>Log In</NavLink>
                  </>}
              </Box>
            </Collapsible>
          ) : (
              <Layer>
                <Box
                  background='light-2'
                  tag='header'
                  justify='end'
                  align='center'
                  direction='row'
                >
                  <Button
                    icon={<FormClose />}
                    onClick={hideMenu}
                  />
                </Box>
                <Box
                  fill
                  background="light-2"
                  align="center"
                  justify="center"
                >
                  <NavLink to="/editor/javascript" onClick={hideMenu}>Javascript Editor</NavLink>
                  <NavLink to="/editor/markdown" onClick={hideMenu}>Markdown Editor</NavLink>
                  <NavLink to="/readme-generator" onClick={hideMenu}>Readme Generator</NavLink>
                  {userContext.username
                    ? <>
                      <NavLink to={"/profile/" + userContext.username} onClick={hideMenu}>{userContext.username}</NavLink>
                      <NavLink to="/" onClick={logout}>Log Out</NavLink>
                    </>
                    : <>
                      <NavLink to="/register" onClick={hideMenu}>Register</NavLink>
                      <NavLink to="/login" onClick={hideMenu}>Log In</NavLink>
                    </>}
                </Box>
              </Layer>
            )}
        </>
        )}
      </ResponsiveContext.Consumer> */}
      {/* <Button icon={<Menu />} onClick={toggleMenuVisibility} />
    </Box> */}
      {/* <Collapsible direction="vertical" open={menuVisible}>
      <Layer position="left">
      <Sidebar>
      <Anchor color="white" to="/editor/javascript">Javascript Editor</Anchor>
        {/* <DropMenu> */}
      <Menu
        plain
        label={<Heading level="3" margin="none" color="white">AJS</Heading>}
        // dropAlign={{ top: "bottom" }}
        items={[
          { label: "Javascript Editor", onClick: () => history.push("/editor/javascript") },
          { label: "Markdown Editor", onClick: () => history.push("/editor/markdown") },
          { label: "Readme Generator", onClick: () => history.push("/readme-generator") },
          { label: userContext.username ? 'Logout' : 'Register', onClick: () => userContext.username ? logout() : history.push("/register") },
        ]}>
      </Menu>
      <Box direction="row">
        {locationNames.slice(0, maxNameQuantity).map(locationName => <Box key={locationName} direction="row">/<Text>{locationName}</Text></Box>)}
      </Box>
      {userContext.username
        ? (<Box onClick={() => history.push(`/profile/${userContext.username}`)}><Text size="large" weight="bold">
          {userContext.username}
        </Text></Box>)
        :
        <LoginBox />}
    </Header>
  </>)
}

export default NavBar;