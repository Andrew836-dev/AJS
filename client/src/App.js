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
import ReadmeGenerator from "./pages/ReadmeGenerator";
import Register from "./pages/Register";

const theme = {
  global: {
    colors: {
      brand: "#264653",
      active: "#2A9D8F"
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
      <Grommet theme={theme}>
        <ResponsiveContext.Consumer>
          {size => <Router>
            <Box fill>
              <NavBar />
              <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                <Box flex align='center' justify='center'>
                  <Box fill pad={{ horizontal: size, top: "small" }} gap="xsmall">
                    <Switch>
                      <Route exact path={["/editor/:language", "/editor/:language/:id"]}>
                        <Editor />
                      </Route>
                      <Route exact path="/readme-generator">
                        <ReadmeGenerator />
                      </Route>
                      <Route exact path="/register">
                        <Register />
                      </Route>
                      <Route exact path={["/profile", "/profile/:username"]}>
                        <ProfileWrapper />
                      </Route>
                      <Route path="/">
                        <Landing />
                      </Route>
                    </Switch>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Router>}
        </ResponsiveContext.Consumer>
      </Grommet>
    </UserProvider>
  );
}


export default App;
