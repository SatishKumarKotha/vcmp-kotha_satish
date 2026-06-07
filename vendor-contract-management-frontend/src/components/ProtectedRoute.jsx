import { Navigate } from "react-router-dom";
//--------------this check if no token in local storage then move to login ------------------\\
const ProtectedRoute = ({
  children
}) => {

  const token =
    localStorage.getItem(
      "accessToken"
    );

  return token
    ? children
    : <Navigate to="/" />;
};

export default ProtectedRoute;