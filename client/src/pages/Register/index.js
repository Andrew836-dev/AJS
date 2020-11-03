import React, { useState } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  RadioButtonGroup,
  TextInput
} from "grommet";
import { useUserContext } from "../../utils/UserStore";
import API from "../../utils/API";
import { LOGIN, LOADING, LOGOUT } from "../../utils/actions";
import { useHistory } from "react-router-dom";

function Register() {
  const [formState, setFormState] = useState({ username: "", password: "", darkTheme: true })
  const [errorStatus, setErrorStatus] = useState({ color: "none", message: "" });
  const [userContext, userDispatch] = useUserContext();
  const history = useHistory();

  function handleSubmit(formValue) {
    const { username, password, darkTheme } = formValue;
    if (!username.trim()) return setErrorStatus({ color: "red", message: "Username cannot be blank" })
    if (password.length < 5) return setErrorStatus({ color: "red", message: "Password must be at least 5 characters" });
    if (typeof darkTheme !== "boolean") return setErrorStatus({ color: "red", message: "Dark and light are the only options, sorry!" });
    setErrorStatus({ color: "green", message: "Checking your details" });
    userDispatch({ type: LOADING });
    API
      .userSignUp({ username, password, darkTheme })
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
      onBlur={console.log}
      onChange={nextValue => setFormState(nextValue)}
      onSubmit={({ value }) => handleSubmit(value)}
    >
      <FormField name="username" htmlFor="username" label="Username">
        <TextInput
          id="username"
          name="username"
          required={true}
        />
      </FormField>
      <FormField name="password" htmlFor="password" label="Password">
        <TextInput
          type="password"
          id="password"
          name="password"
          required={true}
        />
      </FormField>
      <FormField name="darkTheme" htmlFor="darkTheme" label="Preferred colour theme">
        <RadioButtonGroup name="darkTheme" defaultValue="dark" options={[{ label: "Dark", value: true }, { label: "Light", value: false }]} />
      </FormField>
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Register" disabled={userContext.loading} />
      </Box>
    </Form>
    {errorStatus.message ? <p style={{ backgroundColor: errorStatus.color }}>{errorStatus.message}</p> : null}
  </>;
}

export default Register;