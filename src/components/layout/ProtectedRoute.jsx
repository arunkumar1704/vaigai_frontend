import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckAdminApi } from "../../api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!token) {
          localStorage.removeItem("auth_token");
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data } = await CheckAdminApi();

        if (data?.success) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          localStorage.removeItem("auth_token");
        }
      } catch (error) {
        setIsAdmin(false);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}
