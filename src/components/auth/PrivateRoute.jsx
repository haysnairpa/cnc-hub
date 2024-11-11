import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function PrivateRoute({ children, allowedRoles }) {
	const { userData, loadingFromAuth, isLoading } = useAuth();

	if (loadingFromAuth || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-5 w-5 animate-spin" />
			</div>
		);
	}

	if (!userData) {
		return <Navigate to="/" />;
	}

	return children;
}
