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
                const res = await fetch("http://localhost:5000/api/departments/list");
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
            const response = await fetch("http://localhost:5000/api/otp/send-otp", {
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
            const response = await fetch("http://localhost:5000/api/otp/verify-otp", {
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

            const res = await fetch("http://localhost:5000/api/operator/register", {
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
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] translate-x-1/3 translate-y-1/3 transition-colors duration-700"></div>

            <LandingNavbar />

            <div className="flex-1 flex items-center justify-center p-12 lg:p-24 relative z-10 transition-colors">

                <div className="w-full max-w-6xl bg-card border border-border rounded-[3.5rem] p-16 lg:p-24 shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 transition-colors"></div>

                    <div className="text-center mb-16 relative z-10">
                        <div className="mx-auto mb-10 w-28 h-28 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10 transition-all hover:scale-110 duration-500 group/icon cursor-pointer">
                            <Activity className="w-14 h-14 text-primary shadow-glow group-hover/icon:animate-pulse transition-all duration-500" />
                        </div>
                        <h2 className="text-5xl font-black text-foreground mb-4 tracking-tighter transition-colors">Operator Registeration</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">FULL LEGAL IDENTITY</label>
                                <div className="relative group/field">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="fullName"
                                        placeholder="OPERATOR_NAME"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">OFFICIAL SERVICE ID</label>
                                <div className="relative group/field">
                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="employeeId"
                                        placeholder="EMP-ID-TACTICAL"
                                        value={form.employeeId}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">SECURE PERSONNEL MAIL</label>
                                <div className="relative group/field">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="OPERATOR@MUNICIPAL.SYNC"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">LOGISTICS PASSKEY</label>
                                <div className="relative group/field">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">TACTICAL CONTACT TERMINAL</label>
                                <div className="relative group/field">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="contact"
                                        placeholder="+91-OPERATIONAL-LINK"
                                        value={form.contact}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">ASSIGNED LOGISTICAL NODE</label>
                                <div className="relative">
                                    <select
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-[11px] font-black tracking-widest text-muted-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner focus:bg-background cursor-pointer appearance-none"
                                    >
                                        <option value="">CHOOSE NODE</option>
                                        {departments.map((dept) => (
                                            <option key={dept._id} value={dept._id} className="bg-background">
                                                {dept.departmentName.toUpperCase()}
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
                            <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">Enter OTP Sent to Email</label>
                                <div className="relative group/field">
                                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                    <input
                                        name="otp"
                                        placeholder="6-DIGIT CODE"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        className="w-full bg-primary/5 border border-primary/20 rounded-2xl pl-16 pr-6 py-5 text-lg font-black tracking-[1em] text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otpLoading}
                            className="w-full bg-primary text-primary-foreground py-8 rounded-[2rem] font-black text-[11px] tracking-[0.4em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/30 mt-6 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading || otpLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    {otpLoading ? "Verifying..." : "Loading..."}
                                </>
                            ) : (
                                <>
                                    {isOtpSent && !otpVerified ? "Verify & Register" : "Register"}
                                    <ArrowRight size={24} className="animate-pulse" />
                                </>
                            )}
                        </button>

                        <div className="mt-12 pt-12 border-t border-border flex flex-col items-center gap-8 transition-colors">
                            <p className="text-[10px] font-black tracking-widest text-muted-foreground opacity-40 transition-colors">
                                Already a registered officer? <Link to="/operator-login" className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border">Return Gateway</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OperatorRegister;
