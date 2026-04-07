  import React, { createContext, useContext, useState, useEffect } from "react";
  import axios from "axios";
  import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("[AuthContext] No token found in storage.");
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const adminData = localStorage.getItem("admin");
      const deptData = localStorage.getItem("department");
      const userData = localStorage.getItem("user");
      const opData = localStorage.getItem("operator");

      if (adminData && JSON.parse(adminData)) {
        setUser(JSON.parse(adminData));
        setRole("admin");
      } else if (deptData && JSON.parse(deptData)) {
        setUser(JSON.parse(deptData));
        setRole("department");
      } else if (userData && JSON.parse(userData)) {
        setUser(JSON.parse(userData));
        setRole("citizen");
      } else if (opData && JSON.parse(opData)) {
        setUser(JSON.parse(opData));
        setRole("operator");
      } else if (token) {
        // Just token present - likely Operator or just refreshing
        console.log("[AuthContext] Only token found, identifying restricted role.");
        setUser({ token });
        setRole(null); // Will trigger redirect if a role is required
      }
    } catch (err) {
      console.error("[AuthContext] Error reading storage:", err);
      // Clean up corrupt storage
      localStorage.clear();
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);

    // 🔥 GLOBAL AXIOS 401 INTERCEPTOR
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("[AuthContext] Global 401 detected. Invalidating logical link.");
          logout();
          toast.error("Tactical session expired. Authorization link dropped.");
          window.location.href = "/decide-role";
        }
        return Promise.reject(error);
      }
    );

    return () => {
      window.removeEventListener("storage", checkAuth);
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = (newRole, data, token) => {
    console.log(`[AuthContext] Setting session for ${newRole}`);
    localStorage.setItem("token", token);
    const storageKey = newRole === "citizen" ? "user" : newRole;
    localStorage.setItem(storageKey, JSON.stringify(data));
    setUser(data);
    setRole(newRole);
  };

  const logout = () => {
    console.log("[AuthContext] Clearing session.");
    localStorage.clear();
    setUser(null);
    setRole(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

