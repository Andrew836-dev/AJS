import React, { useRef, useState } from "react"
import { Box, Drop, Text } from "grommet";
import Login from "../Login";

function LoginBox() {
  const [loginVisible, setLoginVisible] = useState(false);
  const baseRef = useRef();
  return (<Box ref={baseRef} width="xxsmall" alignSelf={loginVisible ? "end" : "center"}>
    {(loginVisible
      ? (<Drop target={baseRef.current} onClickOutside={() => setLoginVisible(false)} align={{ top: "bottom", right: "right" }}>
        <Box width="medium" pad="medium" background="transparent" align="center">
          {/* {size === "small" && <Box alignSelf="end" direction="row-reverse" pad={{ right: "medium", top: "medium" }}><Box onClick={() => setLoginVisible(false)}>X</Box></Box>} */}
          <Login />
        </Box>
      </Drop>)
      : (<Box onClick={() => setLoginVisible(true)}>
        <Text alignSelf="center" weight="bold">Login</Text>
      </Box>))}
  </Box>);
}

export default LoginBox;