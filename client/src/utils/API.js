import axios from "axios";

const getUserSessionData = () => {
  return axios
    .get("/api/user_data")
    .then(response => response.data)
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
      .then(response => response.data)
      .catch(Promise.reject);
  }
}

const userSignUp = (name, email, password) => {
  if (name.trim() && email.trim() && password) {
    const signUpData = {
      email,
      name,
      password
    }
    return axios
      .post("/api/signup", signUpData)
      .then(response => console.log(response.data))
      .catch(Promise.reject);
  }
}

const API = {
  getUserSessionData,
  userLogin,
  userSignUp
}

export default API;