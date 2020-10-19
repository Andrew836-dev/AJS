/**
 * TODO: express-acl, EsPrima
 * 
 * https://uiwjs.github.io/react-codemirror/
 * https://esprima.readthedocs.io/en/4.0/syntactic-analysis.html#distinguishing-a-script-and-a-module
 */


import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Grommet } from "grommet";
import { UserProvider } from "./utils/UserStore";
import NavBar from "./components/NavBar";
import Landing from "./pages/Landing";
import ProfileWrapper from "./pages/ProfileWrapper";
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

function App() {
  return (
    <UserProvider>
      <Grommet theme={theme}>
        <Router>
          <NavBar />
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
            <Route exact path={["/profile", "/profile/:userName"]}>
              <ProfileWrapper />
            </Route>
          </Switch>
        </Router>
      </Grommet>
    </UserProvider>
  );
}


export default App;
