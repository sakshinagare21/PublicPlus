import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import FAQChatbot from "../common/FAQChatbot";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    FileText,
    Camera,
    User,
    LogOut,
    Search,
    Bell
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import LogoutConfirmModal from "../common/LogoutConfirmModal";

const OperatorLayout = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [operator, setOperator] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    /* ================= FETCH OPERATOR ================= */
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const [opRes, countRes] = await Promise.all([
                 axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/operator/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/unread-count`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setOperator(opRes.data);
            setUnreadCount(countRes.data.count);
        } catch (err) {
            console.error("Operator fetch error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= LOGOUT ================= */
    const handleLogout = () => {
        logout();
        navigate("/operator-login");
    };

    return (
        <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
            <LogoutConfirmModal 
                isOpen={showLogoutConfirm}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />

            {/* ===== SIDEBAR ===== */}
            <aside className="w-80 bg-card border-r border-border flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

                {/* Logo */}
                <div className="p-10 border-b border-border relative z-10">
                    <h1 className="text-3xl font-bold text-foreground">
                        Public<span className="text-primary">Plus</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Operator Dashboard
                    </p>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-6 space-y-3 relative z-10">

                    <NavLink
                        to="/operator/dashboard"
                        className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
                            ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/operator/tasks"
                        className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
                            ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <ClipboardList size={20} />
                        <span>Issues</span>
                    </NavLink>

                    <NavLink
                        to="/operator/history"
                        className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
                            ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <FileText size={20} />
                        <span>Issue History</span>
                    </NavLink>

                    <NavLink
                        to="/operator/profile"
                        className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
                            ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </NavLink>

                    <NavLink
                        to="/operator/notifications"
                        className={({ isActive }) => `flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
                            ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <Bell size={20} />
                            <span>Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-500/20 animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </NavLink>
                </nav>

                {/* Logout */}
                <div className="p-8 border-t border-border relative z-10">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center gap-4 w-full px-6 py-5 rounded-2xl transition-all duration-300 font-medium text-sm text-destructive hover:bg-destructive hover:text-white"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Navbar */}
                <header className="h-24 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-10">
                    <h2 className="text-xl font-semibold text-foreground">
                        Overview
                    </h2>

                    <div className="flex items-center gap-8">
                        <ThemeToggle />

                        {/* Profile */}
                        <div className="flex items-center gap-4 pl-4 border-l border-border">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-foreground">
                                    {operator?.fullName || "Operator"}
                                </p>
                                <p className="text-xs text-success">
                                    Connected
                                </p>
                            </div>

                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-primary-foreground text-lg">
                                {operator?.fullName?.charAt(0) || "O"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-12 bg-background/50">
                    {children}
                </main>
            </div>
            <FAQChatbot role="operator" />
        </div>
    );
};

export default OperatorLayout;

