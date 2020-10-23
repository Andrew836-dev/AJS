import axios from "axios";

const getCodebyId = codeId => {
  return axios
    .get("/api/code/" + codeId)
    .then(({ data }) => data)
    .catch(Promise.reject);
}

const getUserProfileData = name => {
  return axios
    .get("/api/profile/" + name)
    .then(({ data }) => data)
    .catch(Promise.reject);
}

const getUserSessionData = () => {
  return axios
    .get("/api/user_data")
    .then(({ data }) => data)
    .catch(Promise.reject);
}

const getUserSnippets = name => {
  return axios
    .get("/api/author/" + name)
    .then(({ data }) => data)
    .catch(Promise.reject);
}

const saveCode = (id, codeArray) => {
  return axios
    .post("/api/code/" + id, codeArray)
    .then(({ data }) => data)
    .catch(Promise.reject);
}

const userLogin = (username, password) => {
  if (username.trim() && password) {
    const loginData = {
      username,
      password
    }
    return axios
      .post("/api/login", loginData)
      .then(({ data }) => data)
      .catch(Promise.reject);
  }
}

const userLogout = () => {
  return axios
    .get("/logout")
    .then(() => ({ message: "Successfully logged out." }))
    .catch(Promise.reject);
}

const userSignUp = (username, password) => {
  if (username.trim() && password) {
    const signUpData = {
      username: username.trim(),
      password
    }
    return axios
      .post("/api/signup", signUpData)
      .then(({ data }) => data)
      .catch(err => {
        console.log(err);
        Promise.reject({ error: "Couldn't sign up" })
      });
  }
}

const API = {
  getCodebyId,
  getUserProfileData,
  getUserSessionData,
  getUserSnippets,
  saveCode,
  userLogin,
  userLogout,
  userSignUp
}

export default API;