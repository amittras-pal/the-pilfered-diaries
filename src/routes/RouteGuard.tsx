import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RouteGuardProps } from "../types/app.types";

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

export default RouteGuard;
