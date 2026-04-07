import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Building2, Mail, Phone, MapPin, Lock, User, BadgeCheck, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

const DepartmentRegister = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        departmentName: "",
        departmentId: "",
        headName: "",
        officialEmail: "",
        phone: "",
        location: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        setOtpLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/otp/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.officialEmail }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setIsOtpSent(true);
            toast.success("OTP sent to official email");
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
                body: JSON.stringify({ email: form.officialEmail, otp }),
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

    const registerDepartment = async () => {
        setLoading(true);
        let firebaseUser = null;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.officialEmail, form.password);
            firebaseUser = userCredential.user;
            const token = await firebaseUser.getIdToken(true);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/departments/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    departmentName: form.departmentName,
                    departmentCode: form.departmentId,
                    description: form.headName,
                    contactPhone: form.phone,
                    officeAddress: form.location,
                    city: "Metropolis",
                    role: "department_admin"
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            toast.success("Registration initiated. Pending system verification.");
            setTimeout(() => navigate("/department-login"), 2000);
        } catch (error) {
            if (firebaseUser) await firebaseUser.delete().catch(() => { });
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!isOtpSent) {
            await handleSendOtp();
            return;
        }

        if (!otpVerified) {
            const verified = await handleVerifyOtp();
            if (verified) {
                await registerDepartment();
            }
            return;
        }

        await registerDepartment();
    };

    return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-[Calibri] selection:bg-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -translate-x-1/2 translate-y-1/2 transition-colors duration-700"></div>

        <LandingNavbar />

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 transition-colors">
            <div className="w-full max-w-5xl bg-card border border-border rounded-[2.5rem] p-10 lg:p-16 shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-colors"></div>

                <div className="text-center mb-10 relative z-10">
                    <h2 className="text-4xl font-bold text-foreground mb-2 transition-colors">Department Registration</h2>
                    <p className="text-muted-foreground text-sm">Register a new department onto the platform</p>
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Department Name</label>
                            <div className="relative group/field">
                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                <input
                                    name="departmentName"
                                    placeholder="e.g. Public Works"
                                    value={form.departmentName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Department Code</label>
                            <div className="relative group/field">
                                <BadgeCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                <input
                                    name="departmentId"
                                    placeholder="PWD-101"
                                    value={form.departmentId}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Head of Department</label>
                            <div className="relative group/field">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                <input
                                    name="headName"
                                    placeholder="Director Name"
                                    value={form.headName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Official Email</label>
                            <div className="relative group/field">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                <input
                                    type="email"
                                    name="officialEmail"
                                    placeholder="contact@dept.gov"
                                    value={form.officialEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Contact Number</label>
                            <div className="relative group/field">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                <input
                                    name="phone"
                                    placeholder="+91-1234567890"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Location</label>
                            <div className="relative group/field">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                <input
                                    name="location"
                                    placeholder="Office Address"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner focus:bg-background"
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
                            <label className="text-sm font-semibold text-muted-foreground ml-2 transition-colors">Confirm Password</label>
                            <div className="relative group/field">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner focus:bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    {isOtpSent && !otpVerified && (
                        <div className="md:col-span-2 space-y-4 mb-2 animate-in fade-in slide-in-from-top-4 duration-500 max-w-sm mx-auto text-center">
                            <label className="text-sm font-semibold text-muted-foreground">Verification OTP</label>
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

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading || otpLoading}
                            className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading || otpLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {otpLoading ? "Verifying..." : "Registering..."}
                                </>
                            ) : (
                                <>
                                    {isOtpSent && !otpVerified ? "Verify & Register" : "Register Department"}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="md:col-span-2 text-center mt-6">
                        <p className="text-sm font-medium text-muted-foreground">
                            Already registered? <Link to="/department-login" className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border">Login here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default DepartmentRegister;

