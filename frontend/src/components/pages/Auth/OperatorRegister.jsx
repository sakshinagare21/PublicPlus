import { useState, useEffect } from "react";
import { User, Briefcase, Mail, Lock, Phone, ShieldCheck, Activity, ArrowRight, Loader2 } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

const OperatorRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        employeeId: "",
        email: "",
        contact: "",
        department: "",
        password: "",
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/departments/list`);
                const data = await res.json();
                setDepartments(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
            toast.success("OTP sent to personnel email");
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

    const registerOperator = async () => {
        setLoading(true);
        let firebaseUser = null;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            firebaseUser = userCredential.user;
            const token = await firebaseUser.getIdToken(true);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/operator/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName: form.fullName,
                    email: form.email,
                    phoneNumber: form.contact,
                    departmentId: form.department,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Registration request submitted for approval");
            setTimeout(() => navigate("/operator-login"), 2000);
        } catch (err) {
            if (firebaseUser) await firebaseUser.delete().catch(() => { });
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.department) {
            toast.error("Please select department");
            return;
        }

        if (!isOtpSent) {
            await handleSendOtp();
            return;
        }

        if (!otpVerified) {
            const verified = await handleVerifyOtp();
            if (verified) {
                await registerOperator();
            }
            return;
        }

        await registerOperator();
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-[Calibri] selection:bg-primary/30 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] translate-x-1/3 translate-y-1/3 transition-colors duration-700"></div>

            <LandingNavbar />

            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 transition-colors">

                <div className="w-full max-w-4xl bg-card border border-border rounded-[2.5rem] p-10 lg:p-16 shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 transition-colors"></div>

                    <div className="text-center mb-10 relative z-10">
                        <h2 className="text-4xl font-bold text-foreground mb-2 transition-colors">Operator Registration</h2>
                        <p className="text-muted-foreground text-sm">Create your official operator account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Full Name</label>
                                <div className="relative group/field">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="fullName"
                                        placeholder="John Doe"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Employee ID</label>
                                <div className="relative group/field">
                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="employeeId"
                                        placeholder="EMP-12345"
                                        value={form.employeeId}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Email Address</label>
                                <div className="relative group/field">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="operator@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Password</label>
                                <div className="relative group/field">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Contact Number</label>
                                <div className="relative group/field">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="contact"
                                        placeholder="+91-1234567890"
                                        value={form.contact}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Select Department</label>
                                <div className="relative">
                                    <select
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-xl px-6 py-4 text-sm font-medium text-muted-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner focus:bg-background cursor-pointer appearance-none"
                                    >
                                        <option value="">Choose Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept._id} value={dept._id} className="bg-background">
                                                {dept.departmentName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isOtpSent && !otpVerified && (
                            <div className="space-y-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-500 max-w-sm mx-auto text-center">
                                <label className="text-sm font-semibold text-muted-foreground block">Verification Code</label>
                                <div className="relative group/field">
                                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="otp"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        className="w-full bg-primary/5 border border-primary/20 rounded-xl pl-16 pr-6 py-4 text-xl font-bold text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner text-center"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otpLoading}
                            className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 shadow-glow mt-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading || otpLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {otpLoading ? "Verifying..." : "Registering..."}
                                </>
                            ) : (
                                <>
                                    {isOtpSent && !otpVerified ? "Verify & Create Account" : "Create Operator Account"}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div className="mt-8 pt-8 border-t border-border text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                                Already have an account? <Link to="/operator-login" className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border">Login here</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OperatorRegister;

