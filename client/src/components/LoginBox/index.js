import React from "react"
import { Box, Layer } from "grommet";
import { Close } from "grommet-icons";
import Login from "../Login";

function LoginBox({ hideLogin }) {
  return (<Layer onClickOutside={hideLogin}>
    <Box pad="small">
      {!!hideLogin && <Box direction="row" justify="end">
        <Box onClick={hideLogin}>
          <Close />
        </Box>
      </Box>}
      <Box width="medium" height="medium" pad="medium" align="center">
        <Login hideLogin={hideLogin} />
      </Box>
    </Box>
  </Layer>);
}

export default LoginBox;