import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen message="Verifying your session…" variant="page" />;
  }

  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" replace />;
}
