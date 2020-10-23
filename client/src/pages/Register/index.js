import React, { useState } from "react";
import { Box, Button, Form, FormField, TextInput } from "grommet";
import { useUserContext } from "../../utils/UserStore";
import API from "../../utils/API";
import { LOGIN, LOADING, LOGOUT } from "../../utils/actions";
import { useHistory } from "react-router-dom";

function Register() {
  const [formState, setFormState] = useState({ username: "", password: "", confirmPassword: "" })
  const [errorStatus, setErrorStatus] = useState({ color: "none", message: "" });
  const [userContext, userDispatch] = useUserContext();
  const history = useHistory();

  function handleSubmit(formValue) {
    const { username, password } = formValue;
    if (!username.trim()) return setErrorStatus({ color: "red", message: "Username cannot be blank" })
    if (password.length < 5) return setErrorStatus({ color: "red", message: "Password must be at lesat 5 characters" });
    setErrorStatus({ color: "green", message: "Checking your details" });
    userDispatch({ type: LOADING });
    API
      .userSignUp(username, password)
      .then(dbResponse => {
        userDispatch({ ...dbResponse, type: LOGIN })
        setErrorStatus({ color: "green", message: "Successfully registered, logging you in." });
        history.push("/profile/" + dbResponse.username, { message: `Hi ${dbResponse.username}! Welcome to AJS.` });
      })
      .catch(err => {
        console.log(err);
        userDispatch({ type: LOGOUT });
        setErrorStatus({ color: "red", message: username + " is already in use" });
      });
  }

  return <>
    <Form
      value={formState}
      onChange={nextValue => setFormState(nextValue)}
      onSubmit={({ value }) => handleSubmit(value)}
    >
      <FormField name="username" htmlfor="text-input-id" label="Username">
        <TextInput
          id="text-input-id"
          name="username"
          required={true}
        />
      </FormField>
      <FormField name="password" htmlfor="text-input-id" label="Password">
        <TextInput
          type="password"
          id="text-input-id"
          name="password"
          required={true}
        />
      </FormField>
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Register" disabled={userContext.loading} />
      </Box>
    </Form>
    {errorStatus.message ? <p style={{ backgroundColor: errorStatus.color }}>{errorStatus.message}</p> : null}
  </>;
}

export default Register;