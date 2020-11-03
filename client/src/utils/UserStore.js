import React, { useReducer, useContext, createContext } from "react"
import { LOGIN, LOGOUT, LOADING } from "./actions";
import { GUEST } from "./roles";

const UserContext = createContext();
const { Provider } = UserContext;

const reducer = (state, action) => {
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
        username: action.username,
        role: action.role,
        id: action.id,
        darkTheme: action.darkTheme
      }
    case LOGOUT:
      return {
        ...state,
        loading: false,
        username: "",
        role: GUEST,
        id: "",
        darkTheme: true
      }
    default:
      return state;
  }
}
const UserProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    username: "",
    role: GUEST,
    loading: false,
    id: "",
    darkTheme: true
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useUserContext = () => {
  return useContext(UserContext);
}

export { UserProvider, useUserContext };