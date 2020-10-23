import React from "react";
import { useHistory } from "react-router-dom";
import { Box, Button } from "grommet";
import { useUserContext } from "../../utils/UserStore";

function Landing() {
  const [userState] = useUserContext();
  const history = useHistory();
  return <Box>
    <Box direction="column" justify="center">
      {!userState.username && (
        <>
          <Button label="Login" onClick={() => history.push("/login")} />
          <Button label="Register" onClick={() => history.push("/register")} />
        </>
      )}
      <Button label="Javascript Editor" onClick={() => history.push("/code")} />
      <Button label="Markdown Editor" onClick={() => history.push("/markdown")} />
      {!!userState.username && (
        <>
          <Button label="Your profile" onClick={() => history.push("/profile/" + userState.username)} />
          <Button label="Log Out" onClick={() => history.push("/logout")} />
        </>
      )}
    </Box>
  </Box>
}

export default Landing;