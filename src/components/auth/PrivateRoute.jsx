import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function PrivateRoute({ children, allowedRoles }) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"> 
        <Loader2 className="h-5 w-5 animate-spin" />
    </div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userData?.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
