import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import API from "../../utils/API";
import { useUserContext } from "../../utils/UserStore";
import { LOGOUT } from "../../utils/actions";

function Logout() {
  const history = useHistory();
  const [userContext, userDispatch] = useUserContext();

  useEffect(() => {
    API
      .userLogout()
      .then(response => {
        userDispatch({ type: LOGOUT });
        history.push("/", response);
      })
  })
  return <></>
}

export default Logout;