import React, { useState } from "react";
import { Box, Button, Form, FormField, TextInput } from "grommet";
import { useUserContext } from "../../utils/UserStore";
import API from "../../utils/API";
import { LOGIN, LOADING, LOGOUT } from "../../utils/actions";
import { useHistory } from "react-router-dom";

function Login() {
  const [errorStatus, setErrorStatus] = useState({ color: "none", message: "" });
  const [value, setValue] = useState({ username: "", password: "" });
  const [userContext, userDispatch] = useUserContext();
  const history = useHistory();

  function handleSubmit(formValue) {
    const { username, password } = formValue;
    if (!username.trim()) return setErrorStatus({ color: "red", message: "Username cannot be blank" })
    if (!password) return setErrorStatus({ color: "red", message: "Password cannot be blank" });
    setErrorStatus({ color: "green", message: "Checking your details" });
    userDispatch({ type: LOADING });
    API
      .userLogin(username.trim(), password)
      .then(dbResponse => {
        userDispatch({ ...dbResponse, type: LOGIN });
        setErrorStatus({ color: "green", message: "Successfully logged in" });
        history.push("/profile/" + dbResponse.username, { message: `Welcome back ${dbResponse.username}.` });
      })
      .catch(err => {
        console.log(err);
        userDispatch({ type: LOGOUT });
        setErrorStatus({ color: "red", message: "Your name and/or password is incorrect" });
      });
  }


  return <>
    <Form
      value={value}
      onChange={nextValue => setValue(nextValue)}
      onSubmit={({ value }) => handleSubmit(value)}
      validate="blur"
      onValidate={console.log}
    >
      <FormField name="username" htmlfor="text-input-id" label="Username">
        <TextInput
          id="text-input-id"
          name="username"
          required={true}
          validate={{ regexp: /(\s)/g, status: "info", message: "message" }}
        />
      </FormField>
      <FormField name="password" htmlfor="text-input-id" label="Password">
        <TextInput type="password" id="text-input-id" name="password" required={true} />
      </FormField>
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Log in" disabled={userContext.loading} />
      </Box>
    </Form>
    {errorStatus.message && (<p style={{ backgroundColor: errorStatus.color }}>{errorStatus.message}</p>)}
  </>;
}

export default Login;