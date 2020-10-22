/**
 * TODO: express-acl, EsPrima
 * 
 * https://uiwjs.github.io/react-codemirror/
 * https://esprima.readthedocs.io/en/4.0/syntactic-analysis.html#distinguishing-a-script-and-a-module
 */


import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Box, Grommet, ResponsiveContext } from "grommet";
import { UserProvider } from "./utils/UserStore";
import NavBar from "./components/NavBar";
import Landing from "./pages/Landing";
import ProfileWrapper from "./pages/ProfileWrapper";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Register from "./pages/Register";

const theme = {
  global: {
    colors: {
      brand: "#333333"
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {
  return (
    <UserProvider>
      <Grommet theme={theme} full>
          <Router>
            <Box fill>
              <NavBar />
              <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                <Box flex align='center' justify='center'>
                  <Switch>
                    <Route exact path="/">
                      <Landing />
                    </Route>
                    <Route exact path={["/code", "/code/:id"]}>
                      <Editor />
                    </Route>
                    <Route exact path="/login">
                      <Login />
                    </Route>
                    <Route exact path="/register">
                      <Register />
                    </Route>
                    <Route exact path={["/profile", "/profile/:username"]}>
                      <ProfileWrapper />
                    </Route>
                  </Switch>
                </Box>
              </Box>
            </Box>
          </Router>
      </Grommet>
    </UserProvider>
  );
}


export default App;
