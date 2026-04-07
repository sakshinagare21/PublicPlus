import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  CheckSquare,
  ShieldCheck,
  Globe,
  Loader2,
} from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getCurrentLocation } from "../../../api/locationApi";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";

const CitizenRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    address: "",
    location: "",
    latitude: "",
    longitude: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGetLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      setForm((prev) => ({
        ...prev,
        location: `${coords.latitude}, ${coords.longitude}`,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
      toast.success("Location synchronized");
    } catch (error) {
      toast.error("Location access denied");
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setIsOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setOtpVerified(true);
      toast.success("Email verified successfully");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/create-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            mobile: form.mobile,
            dob: form.dob,
            gender: form.gender,
            address: form.address,
            latitude: form.latitude,
            longitude: form.longitude,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        await firebaseUser.delete();
        throw new Error(data.message || "Registration failed");
      }

      login("citizen", data.user, token);
      toast.success("Account created! Welcome to the network.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!form.agree) {
      setError("Please accept Terms & Privacy Policy");
      return;
    }
    setError("");

    if (!isOtpSent) {
      await handleSendOtp();
      return;
    }

    if (!otpVerified) {
      const verified = await handleVerifyOtp();
      if (verified) {
        await registerUser();
      }
      return;
    }

    await registerUser();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 transition-colors duration-700"></div>

      <LandingNavbar />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-12 lg:p-24 relative z-10 transition-colors">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full -mr-48 -mt-48"></div>

        {/* Left Side — Info (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-16 relative z-10 transition-all">
          <h2 className="text-6xl font-bold mb-8 leading-[1.05] text-foreground tracking-tight transition-colors">
            Join the <br />
            <span className="text-primary  shadow-glow">Citizen Portal</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-12 max-w-sm opacity-60 leading-relaxed transition-colors">
            Join your city's digital platform to report local issues and track
            their resolution in real-time.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-card/40 border border-border p-5 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                <ShieldCheck className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-foreground font-bold">Secure Account</h4>
                <p className="text-xs text-muted-foreground">
                  Your data is kept private and secure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Register Form */}
        <div className="w-full max-w-3xl bg-card border border-border rounded-[3.5rem] p-12 lg:p-20 shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] transition-colors"></div>

          <div className="mb-12 relative z-10 transition-colors">
            <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight transition-colors">
              Create <span className="text-primary">Account</span>
            </h1>
            <p className="text-sm text-muted-foreground opacity-60 transition-colors">
              Sign up to get started
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8 transition-colors">
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                  Full Name
                </label>
                <div className="relative group/field">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                  Email Address
                </label>
                <div className="relative group/field">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Mobile + DOB */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mobile */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground ml-2">
                  Mobile Number
                </label>
                <div className="relative group/field">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 opacity-40" />
                  <input
                    name="mobile"
                    placeholder="+1 234 567 890"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 shadow-inner"
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 shadow-inner pr-10"
                />
              </div>
            </div>

            {/* Gender FULL WIDTH */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-2">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-5 text-sm font-medium text-muted-foreground outline-none focus:ring-4 focus:ring-primary/10 shadow-inner cursor-pointer appearance-none"
              >
                <option value="">Choose</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-Binary</option>
              </select>
            </div>
            <div className="space-y-4 transition-colors">
              <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                Location
              </label>
              <div className="relative group/field">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                <input
                  name="location"
                  placeholder="Click below to detect location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                />
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-xs font-semibold text-primary hover:text-foreground transition-all flex items-center gap-3 ml-2 group/sat shadow-glow w-fit"
              >
                <Globe
                  size={16}
                  className="group-hover/sat:animate-spin transition-all"
                />{" "}
                Get My Location
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 transition-colors">
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                  Password
                </label>
                <div className="relative group/field">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                  Confirm Password
                </label>
                <div className="relative group/field">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                  />
                </div>
              </div>
            </div>
            {error && (
              <p className="text-destructive text-xs font-semibold bg-destructive/5 p-5 rounded-2xl border border-destructive/20 animate-in slide-in-from-left-4 duration-500 shadow-glow-destructive/10">
                Error: {error}
              </p>
            )}

            <label className="flex items-center gap-4 text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none py-4 transition-colors group/check">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="w-6 h-6 rounded-lg border-border bg-muted/50 checked:bg-primary transition-all cursor-pointer shadow-inner"
              />
              <span className="opacity-70 group-hover/check:opacity-100 transition-opacity leading-relaxed">
                Accept{" "}
                <Link
                  to="/"
                  className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border"
                >
                  Terms
                </Link>{" "}
                &{" "}
                <Link
                  to="/"
                  className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {isOtpSent && !otpVerified && (
              <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                  Enter OTP Sent to Email
                </label>
                <div className="relative group/field">
                  <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                  <input
                    name="otp"
                    placeholder="6-Digit Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full bg-primary/5 border border-primary/20 rounded-2xl pl-16 pr-6 py-5 text-lg font-bold tracking-[1em] text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otpLoading}
              className="w-full bg-primary text-primary-foreground py-8 rounded-[2rem] font-bold text-sm tracking-wide transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/30 mt-6 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || otpLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {otpLoading
                    ? "VERIFYING PROTOCOL..."
                    : "ESTABLISHING PASSKEY..."}
                </>
              ) : isOtpSent && !otpVerified ? (
                "VERIFY OTP & REGISTER"
              ) : (
                "REGISTER ACCOUNT"
              )}
            </button>

            <p className="text-center text-[10px] font-black tracking-widest text-muted-foreground  transition-colors pt-12 border-t border-border mt-8">
              Already Registered?{" "}
              <Link
                to="/login-citizen"
                className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border"
              >
                Go to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CitizenRegister;

