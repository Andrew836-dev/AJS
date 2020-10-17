/**
 * TODO: express-acl, EsPrima
 * 
 * https://uiwjs.github.io/react-codemirror/
 * https://esprima.readthedocs.io/en/4.0/syntactic-analysis.html#distinguishing-a-script-and-a-module
 */


import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Box, Button, Heading, Grommet } from "grommet";
import { Notification } from "grommet-icons";
import { UserProvider } from "./utils/UserStore";
import API from "./utils/API";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Editor from "./pages/Editor";
import Login from "./pages/Login";

const theme = {
  global: {
    colors: {
      brand: "#228BE6"
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const AppBar = props => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    style={{ zIndex: "1" }}
    {...props}
  />
)

function App() {
  return (
    <UserProvider>
      <Grommet theme={theme}>
        <AppBar>
          <Heading level="3" margin="none" onClick={() => API.userSignUp("Teddy", "Teddy@example.com", "teddypass")}>My App</Heading>
          <Button icon={<Notification />} onClick={() => { API.userLogin("Teddy@example.com", "teddypass") }} />
        </AppBar>
        <Router>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route exact path={["/code", "/code/:language"]}>
              <Editor />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
          </Switch>
        </Router>
      </Grommet>
    </UserProvider>
  );
}


export default App;
