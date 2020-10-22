import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../utils/UserStore";

import { Box, Button, Heading } from "grommet";
import { Menu } from "grommet-icons";

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
    <>
      <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        background="brand"
        pad={{ left: "medium", right: "small", vertical: "small" }}
        elevation="medium"
        style={{ zIndex: "1" }}
      >
        <Heading level="3" margin="none">
          <NavLink to="/" onClick={hideMenu}>AJS</NavLink>
        </Heading>
        <Button icon={<Menu />} onClick={toggleMenuVisibility} />
      </Box>
      {menuVisible
        ? (<>
          <NavLink to="/code" onClick={hideMenu}>Javascript Editor</NavLink>
          {userContext.name
            ? <>
              <NavLink to={"/profile/" + userContext.name} onClick={hideMenu}>Profile</NavLink>
              <NavLink to="/logout" onClick={hideMenu}>Log Out</NavLink>
            </>
            : <>
              <NavLink to="/register" onClick={hideMenu}>Register</NavLink>
              <NavLink to="/login" onClick={hideMenu}>Log In</NavLink>
            </>}
        </>)
        : null}
    </>
  )
}

export default NavBar;