import React from "react";
import { NavLink } from "react-router-dom";

function Landing() {
  return <>
    <NavLink to="/login">Login</NavLink>
    <NavLink to="/code/javascript">Javascript</NavLink>
  </>
}

export default Landing;