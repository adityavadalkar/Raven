import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const AuthenticationGuard = ({ component }) => {
  const { isAuthenticated } = useAuth0();
  // console.log("AuthenticationGuard", isAuthenticated);
  const Component = withAuthenticationRequired(component); 
  return <Component />;
};