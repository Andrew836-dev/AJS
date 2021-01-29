import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Box, Button } from "grommet";
import { useUserContext } from "../../utils/UserStore";

function Landing () {
  const [userState] = useUserContext();
  const history = useHistory();
  return <Box>
    <Box direction="column" justify="center" width={{ max: "350px" }}>
      <Box>
        Welcome to AJS! A tool for Web Development students to help smooth the learning process.
        <ul>
          <li>Use the <Link to="/editor/javascript">JavaScript editor</Link> to parse JavaScript and see what each line of code represents.</li>
          <li>Use the <Link to="/editor/markdown">Markdown editor</Link> to help write your README.md files.</li>
          <li>If you choose to Sign in, you will be able to save code and share it with others.</li>
        </ul>
      </Box>
      <Button label="JavaScript Editor" onClick={() => history.push("/editor/javascript")} />
      <Button label="Markdown Editor" onClick={() => history.push("/editor/markdown")} />
      <Button label="Readme Generator" onClick={() => history.push("/readme-generator")} />
      {!userState.username
        ? (<>
          <Button label="Login" onClick={() => history.push("/login")} />
          <Button label="Register" onClick={() => history.push("/register")} />
        </>)
        : (<>
          <Button label="Your profile" onClick={() => history.push("/profile/" + userState.username)} />
          <Button label="Log Out" onClick={() => history.push("/logout")} />
        </>)
      }
    </Box>
  </Box>
}

export default Landing;