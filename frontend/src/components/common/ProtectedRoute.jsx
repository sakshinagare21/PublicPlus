import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">
            Verifying Credentials
          </p>
        </div>
      </div>
    );
  }

  // 1. Check Authentication (Must have token AND role)
  // If either is missing, the session is invalid/incomplete.
  if (!isAuthenticated || !token || !role) {
    console.warn(`[AuthGuard] Unauthorized access to ${location.pathname}. Redirecting to login.`);
    
    const path = location.pathname;
    let loginRoot = "/login-citizen";
    if (path.includes("admin")) loginRoot = "/admin-login";
    else if (path.includes("department")) loginRoot = "/department-login";
    else if (path.includes("operator")) loginRoot = "/operator-login";

    return <Navigate to={loginRoot} state={{ from: location }} replace />;
  }

  // 2. Check Authorization (Role must match)
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.error(`[AuthGuard] Role mismatch at ${location.pathname}. Required: ${allowedRoles}, Current: ${role}.`);
    toast.error("Unauthorized Access");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

