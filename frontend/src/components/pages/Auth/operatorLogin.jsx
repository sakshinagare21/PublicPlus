import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Truck,
  Mail,
  Lock,
  Loader2,
  ChevronRight,
  UserCheck,
  Building2,
  ShieldAlert,
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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/operator/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/operator/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login("operator", data.operator || { email: form.email }, token);
      toast.success("Terminal Access Granted");
      navigate("/operator/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans transition-colors duration-500 selection:bg-primary/30">
      {/* Background Glows (Matching Project Theme) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 transition-colors duration-700" />

      <LandingNavbar />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative z-10 transition-colors">
        <div className="w-full max-w-2xl bg-card border border-border rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 animate-in fade-in zoom-in-95 group">

          <div className="p-10 sm:p-16 relative">
            {/* Header Content */}
            <div className="flex flex-col items-center mb-10">
              <h1 className="text-5xl font-bold tracking-tight text-foreground mb-3 text-center leading-tight">
                Operator <span className="text-primary  shadow-glow">Login</span>
              </h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Input Group: Email */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-muted-foreground ml-2 transition-colors">
                  Email
                </label>
                <div className="relative group/field">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within/field:text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="operator@logistics-hq.net"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
                  />
                </div>
              </div>

              {/* Input Group: Password */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-muted-foreground ml-2 transition-colors">
                  Password
                </label>
                <div className="relative group/field">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within/field:text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-16 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black tracking-widest text-muted-foreground hover:text-primary transition-all bg-background/50 border border-border px-3 py-1.5 rounded-lg opacity-40 hover:opacity-100"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="flex justify-end pr-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-black tracking-widest text-primary hover:text-foreground transition-all  opacity-60 hover:opacity-100 uppercase"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/20 mt-4 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>VERIFYING OPERATOR...</span>
                  </>
                ) : (
                  <>
                    <span> Login</span>
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Tactical Footer */}
            <div className="mt-12 pt-10 border-t border-border space-y-8">
              <div className="flex flex-col gap-4 text-center">
                <span className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/50 uppercase">
                  Operator Registration
                </span>
                <Link
                  to="/operator-register"
                  className="group flex items-center justify-center gap-3 py-4 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-black tracking-[0.2em] text-primary hover:bg-primary/10 transition-all uppercase"
                >
                  Register Here
                  <Truck className="w-4 h-4 transition-transform group-hover:rotate-12" />
                </Link>
              </div>

              {/* Role Matrix */}
              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] transition-colors">
                    <span className="bg-card px-4 text-muted-foreground/40">Switch Role</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 font-black text-[9px] tracking-widest">
                  <Link
                    to="/login-citizen"
                    className="flex flex-col items-center gap-2 py-4 bg-muted/20 border border-border rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/40 transition-all group/role"
                  >
                    <UserCheck className="w-4 h-4 group-hover/role:text-primary transition-colors" />
                    CITIZEN
                  </Link>
                  <Link
                    to="/department-login"
                    className="flex flex-col items-center gap-2 py-4 bg-muted/20 border border-border rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-muted/40 transition-all group/role"
                  >
                    <Building2 className="w-4 h-4 group-hover/role:text-emerald-500 transition-colors" />
                    DEPT
                  </Link>
                  <Link
                    to="/admin-login"
                    className="flex flex-col items-center gap-2 py-4 bg-muted/20 border border-border rounded-xl text-muted-foreground hover:text-purple-500 hover:bg-muted/40 transition-all group/role"
                  >
                    <ShieldAlert className="w-4 h-4 group-hover/role:text-purple-500 transition-colors" />
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

