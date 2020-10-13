import axios from "axios";

const API = {
  userLogin: (email, password) => {
    if (email.trim() && password) {
      const loginData = {
        email,
        password
      }
      axios
        .post("/api/login", loginData)
        .then(console.log)
        .catch(console.log);
    }
  },
  userSignUp: (name, email, password) => {
    if (name.trim() && email.trim() && password) {
      const signUpData = {
        email,
        name,
        password
      }
      axios
        .post("/api/signup", signUpData)
        .then(console.log)
        .catch(console.log);
    }
  },
  userLogout: () => {
    axios
      .get("/logout")
      .then(console.log)
      .catch(console.log);
  }
}

export default API;