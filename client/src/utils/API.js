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

const saveCode = (id, codeArray) => {
  return axios
    .post("/api/code/" + id, codeArray)
    .then(({ data }) => data)
    .catch(Promise.reject);
}

const userLogin = (email, password) => {
  if (email.trim() && password) {
    const loginData = {
      email,
      password
    }
    return axios
      .post("/api/login", loginData)
      .then(({ data }) => data)
      .catch(Promise.reject);
  }
}

const userSignUp = (name, email, password) => {
  if (name.trim() && email.trim() && password) {
    const signUpData = {
      email: email.trim(),
      name: name.trim(),
      password
    }
    return axios
      .post("/api/signup", signUpData)
      .then(({ data }) => data)
      .catch(Promise.reject);
  }
}

const API = {
  getCodebyId,
  getUserProfileData,
  getUserSessionData,
  saveCode,
  userLogin,
  userSignUp
}

export default API;