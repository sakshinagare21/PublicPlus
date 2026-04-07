import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Shield, Mail, Lock, Activity, Globe } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!form.email) {
      toast.error("Enter administrative email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      toast.success("Identity recovery link dispatched.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const token = await userCredential.user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("You are not authorized as admin");
      const data = await response.json();

      login("admin", data, token);

      toast.success("Admin login successful");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30">
  <LandingNavbar />

  <div className="flex flex-1 items-center justify-center p-6 lg:p-10 bg-background transition-colors relative overflow-hidden">

    {/* Background Shapes */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>

    {/* MAIN CONTAINER */}
    <div className="flex w-full max-w-xl mx-auto rounded-[3rem] overflow-hidden border border-border shadow-[0_0_80px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10 bg-card">

      {/* FORM */}
      <div className="flex-1 bg-card p-8 lg:p-12 flex items-center relative overflow-hidden">

        <div className="w-full max-w-md mx-auto">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center shadow-xl">
              <Shield className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
              Admin <span className="text-primary">Access</span>
            </h2>

            <p className="text-sm text-muted-foreground opacity-60">
              Login to your admin account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground ml-2">
                Email Address
              </label>

              <div className="relative group/field">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 opacity-40" />

                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-muted/30 border border-border rounded-2xl pl-14 pr-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground ml-2">
                Password
              </label>

              <div className="relative group/field">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 opacity-40" />

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-muted/30 border border-border rounded-2xl pl-14 pr-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
                />
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-[10px] font-black tracking-widest">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-primary hover:text-foreground"
              >
                Forget Password
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm transition-all shadow-lg mt-2 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* SWITCH */}
            <div className="pt-6 border-t border-border">
              <p className="text-center text-[9px] font-black tracking-[0.3em] text-muted-foreground mb-4">
                Switch Portal
              </p>

              <div className="grid grid-cols-3 gap-3">
                <Link to="/login-citizen" className="text-center py-3 bg-muted/30 border border-border rounded-xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary">
                  CITIZEN
                </Link>

                <Link to="/operator-login" className="text-center py-3 bg-muted/30 border border-border rounded-xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-amber-500">
                  OPERATOR
                </Link>

                <Link to="/department-login" className="text-center py-3 bg-muted/30 border border-border rounded-xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-emerald-500">
                  DEPT
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default AdminLogin;


