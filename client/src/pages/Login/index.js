import React, { useState, useRef } from "react";
import { useUserContext } from "../../utils/UserStore";
import API from "../../utils/API";
import { LOGIN, LOADING, LOGOUT } from "../../utils/actions";
import { useHistory } from "react-router-dom";

function Login() {
  const [errorStatus, setErrorStatus] = useState({ color: "none", message: "" });
  const [userContext, userDispatch] = useUserContext();
  const formRef = useRef();
  const history = useHistory();

  function handleSubmit(event) {
    event.preventDefault();
    const username = formRef.current.elements.username.value.trim();
    const password = formRef.current.elements.password.value;
    if (!username) return setErrorStatus({ color: "red", message: "Username cannot be blank" })
    if (!password) return setErrorStatus({ color: "red", message: "Password cannot be blank" });
    setErrorStatus({ color: "green", message: "Checking your details" });
    userDispatch({ type: LOADING });
    API
      .userLogin(username, password)
      .then(dbResponse => {
        userDispatch({ ...dbResponse, type: LOGIN });
        setErrorStatus({ color: "green", message: "Successfully logged in" });
        history.push("/profile/" + dbResponse.username);
      })
      .catch(err => {
        console.log(err);
        userDispatch({ type: LOGOUT });
        setErrorStatus({ color: "red", message: "Your name and/or password is incorrect" });
      });
  }

  const buttonDisabled = { disabled: userContext.loading }

  return <>
    Login
    <form ref={formRef} onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input name="username" type="name" />
      <label htmlFor="password">Password</label>
      <input name="password" type="password" />
      <input type="submit" value="Login" {...buttonDisabled} />
    </form>
    {errorStatus.message ? <p style={{ backgroundColor: errorStatus.color }}>{errorStatus.message}</p> : null}
  </>;
}

export default Login;