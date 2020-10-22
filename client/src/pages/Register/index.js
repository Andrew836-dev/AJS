import React, { useState, useRef } from "react";
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
    const { username, password, confirmPassword } = formValue;
    if (!username) return setErrorStatus({ color: "red", message: "Username cannot be blank" })
    if (!password) return setErrorStatus({ color: "red", message: "Password cannot be blank" });
    setErrorStatus({ color: "green", message: "Checking your details" });
    userDispatch({ type: LOADING });
    API
      .userSignUp(username, password)
      .then(dbResponse => {
        setErrorStatus({ color: "green", message: "Successfully registered, logging you in." });
        history.push("/profile/" + dbResponse.username);
      })
      .catch(err => {
        console.log(err);
        userDispatch({ type: LOGOUT });
        setErrorStatus({ color: "red", message: username + " is already in use" });
      });
  }

  const buttonDisabled = { disabled: userContext.loading }

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
          required="true"
        />
      </FormField>
      <FormField name="password" htmlfor="text-input-id" label="Password">
        <TextInput
          type="password"
          id="text-input-id"
          name="password"
          required="true"
        />
      </FormField>
      {/* <FormField name="confirmPassword" htmlfor="text-input-id" label="Password">
        <TextInput
          type="password"
          id="text-input-id"
          name="confirmPassword"
          required="true"
        />
      </FormField> */}
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Register" disabled={userContext.loading} />
      </Box>
    </Form>
    {errorStatus.message ? <p style={{ backgroundColor: errorStatus.color }}>{errorStatus.message}</p> : null}
  </>;
}

export default Register;