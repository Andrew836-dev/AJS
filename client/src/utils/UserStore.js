import React, { useReducer, useContext, createContext } from "react"
import { LOGIN, LOGOUT, LOADING } from "./actions";
import { GUEST } from "./roles";

const UserContext = createContext();
const { Provider } = UserContext;

const reducer = (state, action) => {
  console.log(action.type);
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true
      }
    case LOGIN:
      return {
        ...state,
        loading: false,
        email: action.email,
        name: action.name,
        role: action.role
      }
    case LOGOUT:
      return {
        ...state,
        loading: false,
        email: "",
        name: "",
        role: GUEST
      }
    default:
      return state;
  }
}
const UserProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    email: "",
    name: "",
    role: GUEST,
    loading: false
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useUserContext = () => {
  return useContext(UserContext);
}

export { UserProvider, useUserContext };