import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../../layout/LandingNavbar";
import { Globe, Loader2 } from "lucide-react";


import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

const CitizenLogin = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        if (!form.email) {
            toast.error("Please enter your email address first.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, form.email);
            toast.success("Password reset link sent to your email.");
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    // 🔹 Send Firebase token to backend
    // 🔹 Send Firebase token to backend
    const sendTokenToBackend = async (token) => {

        const response = await fetch(
            "http://localhost:5000/api/users/login", // ✅ correct route
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ important
                },
            }
        );

        if (!response.ok) {
            throw new Error("Backend login failed");
        }

        return response.json();
    };



    // 🔹 Email Login
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1️⃣ Login with Firebase
            const userCredential = await signInWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            // 2️⃣ Get Firebase ID token
            const token = await userCredential.user.getIdToken();

            // 3️⃣ Send token to backend
            const data = await sendTokenToBackend(token);

            // 4️⃣ Use AuthContext to login
            login("citizen", data, token);

            toast.success("Login successful");
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 transition-colors duration-700"></div>

            <LandingNavbar />

            <div className="flex-1 flex items-center justify-center px-10 py-20 relative z-10 transition-colors">
                <div className="w-full max-w-xl bg-card border border-border rounded-[3rem] p-16 shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-700 transition-colors relative overflow-hidden group">
                    <h2 className="text-6xl font-bold mb-8 leading-[1.05] text-foreground tracking-tight transition-colors">
                        <span className="text-primary shadow-glow">Citizen Portal</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-10">
                        Report and track issues in your city
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 transition-colors">
                            <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                                Enter Your Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="user@example.com"
                                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                            />
                        </div>

                        <div className="space-y-4 transition-colors">
                            <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
                                Enter Password
                            </label>

                            <div className="relative group/field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner pr-20 focus:bg-background"
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
                                    className="text-[10px] font-black tracking-widest text-primary hover:text-foreground transition-all   opacity-60 hover:opacity-100"
                                >
                                    Forget Password
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/20 mt-4 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Logging In...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <p className="text-center text-xs font-semibold text-muted-foreground opacity-50 transition-colors pt-6 border-t border-border mt-4">
                            New here?{" "}
                            <Link to="/register-citizen" className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border">
                                Register Account
                            </Link>
                        </p>

                    </form>
                </div>
            </div >
        </div >
    );
};

export default CitizenLogin;

