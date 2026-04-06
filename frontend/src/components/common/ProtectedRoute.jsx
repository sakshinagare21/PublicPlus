import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !localStorage.getItem("token")) {
        console.log("[AuthGuard] Tactical exit detected. Redirecting to mission login.");
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        console.warn(`[AuthGuard] Role mismatch. Required: ${allowedRoles}, Current: ${role}. Redirecting.`);
      }
    }
  }, [loading, isAuthenticated, role, allowedRoles]);

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

  // If not authenticated, or token is physically missing from storage
  if (!isAuthenticated || !localStorage.getItem("token")) {
    console.warn(`[AuthGuard] Blocked unauthorized access to ${location.pathname}. Redirecting to login.`);
    
    // Determine the best login page for this path
    const path = location.pathname;
    let loginRoot = "/login-citizen";

    if (path.includes("admin")) loginRoot = "/admin-login";
    else if (path.includes("department")) loginRoot = "/department-login";
    else if (path.includes("operator")) loginRoot = "/operator-login";

    return <Navigate to={loginRoot} state={{ from: location }} replace />;
  }

  // If role is required but doesn't match
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.error(`[AuthGuard] Role mismatch at ${location.pathname}. Required: ${allowedRoles}, Current: ${role}. Redirecting to dashboard.`);
    
    const rolePaths = {
      admin: "/admin",
      department: "/department/dashboard",
      citizen: "/dashboard",
      operator: "/operator/dashboard",
    };

    return <Navigate to={rolePaths[role] || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
