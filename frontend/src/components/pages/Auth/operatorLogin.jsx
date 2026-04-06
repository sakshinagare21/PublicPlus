import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  LayoutDashboard,
  Truck,
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../firebase";

import { useAuth } from "../../../context/AuthContext";

const OperatorLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!form.email) {
      toast.error("Enter operator credential first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      toast.success("Passkey recovery link sent to terminal.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/operator/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/operator/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Standardize storage using AuthContext
      login("operator", data.operator || { email: form.email }, token);

      toast.success("Login successful");
      navigate("/operator/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

      <LandingNavbar />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative z-10">
        <div className="w-full max-w-2xl bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]"></div>

          {/* MAIN CONTENT */}
          <div className="p-6 lg:p-8">
            {/* HEADER */}
            <div className="flex flex-col items-center mb-5 text-center">
              <h1 className="text-4xl font-black text-foreground tracking-tighter mb-1">
                Operator <span className="text-primary">Login</span>
              </h1>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* EMAIL */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground ml-2">
                  Operator Official Email Address
                </label>

                <div className="relative group/field">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 opacity-40" />

                  <input
                    type="email"
                    name="email"
                    placeholder="operator@command.logistics"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-14 pr-4 py-2 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground ml-2">
                  Password
                </label>

                <div className="relative group/field">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 opacity-40" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-14 pr-14 py-2 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
                  />
                </div>
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between px-2 text-[10px] font-black tracking-widest">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border bg-muted/50 checked:bg-primary"
                  />
                  <span className="opacity-60">Accept term and conditions</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-primary hover:text-foreground underline underline-offset-4 decoration-border"
                >
                  Forgot Password
                </button>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-black text-[11px] tracking-[0.3em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-5 pt-5 border-t border-border text-center space-y-3">
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground opacity-50">
                  NEW OPERATOR?{" "}
                  <Link
                    to="/operator-register"
                    className="text-amber-500 italic"
                  >
                    Register
                  </Link>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black tracking-[0.4em] text-muted-foreground">
                  Switch ROLE
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to="/login-citizen"
                    className="text-center py-2 bg-muted/30 border border-border rounded-xl text-[10px] font-black text-muted-foreground hover:text-primary"
                  >
                    CITIZEN
                  </Link>
                  <Link
                    to="/department-login"
                    className="text-center py-2 bg-muted/30 border border-border rounded-xl text-[10px] font-black text-muted-foreground hover:text-emerald-500"
                  >
                    DEPT
                  </Link>
                  <Link
                    to="/admin-login"
                    className="text-center py-2 bg-muted/30 border border-border rounded-xl text-[10px] font-black text-muted-foreground hover:text-purple-500"
                  >
                    ADMIN
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorLogin;
