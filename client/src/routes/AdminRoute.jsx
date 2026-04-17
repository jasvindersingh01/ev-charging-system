import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const role = localStorage.getItem("userRole");

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;