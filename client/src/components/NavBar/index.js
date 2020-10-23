import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUserContext } from "../../utils/UserStore";

import {
  Box,
  Button,
  Collapsible,
  Heading,
  Layer,
  ResponsiveContext
} from "grommet";
import { Menu, FormClose } from "grommet-icons";

import API from "../../utils/API";
import { LOGIN } from "../../utils/actions";

function NavBar() {
  const [userContext, userDispatch] = useUserContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const hideMenu = () => setMenuVisible(false);
  const toggleMenuVisibility = () => setMenuVisible(!menuVisible);
  useEffect(() => {
    API
      .getUserSessionData()
      .then(userData => {
        const keys = Object.keys(userData);
        if (keys.some(key => userData[key] !== userContext[key])) {
          userDispatch({
            type: LOGIN,
            ...userData
          });
        };
      })
      .catch(console.log);
  }, [userContext, userDispatch]);
  return (
    <Box
      tag="header"
      direction="row"
      align="center"
      justify="between"
      background="brand"
      pad={{ left: "medium", right: "small" }}
      elevation="medium"
      style={{ zIndex: "1" }}
    >
      <Heading level="3" margin="none">
        <NavLink to="/" onClick={hideMenu}>AJS</NavLink>
      </Heading>
      <ResponsiveContext.Consumer>
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
                <NavLink to="/code" onClick={hideMenu}>Javascript Editor</NavLink>
                {userContext.username
                  ? <>
                    <NavLink to={"/profile/" + userContext.username} onClick={hideMenu}>{userContext.username}</NavLink>
                    <Link to="/logout" onClick={hideMenu}>Log Out</Link>
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
                  <NavLink to="/code" onClick={hideMenu}>Javascript Editor</NavLink>
                  {userContext.username
                    ? <>
                      <NavLink to={"/profile/" + userContext.username} onClick={hideMenu}>{userContext.username}</NavLink>
                      <NavLink to="/logout" onClick={hideMenu}>Log Out</NavLink>
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
      </ResponsiveContext.Consumer>
      <Button icon={<Menu />} onClick={toggleMenuVisibility} />
    </Box>)
}

export default NavBar;