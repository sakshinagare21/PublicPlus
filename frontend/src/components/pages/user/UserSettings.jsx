import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    Bell, 
    Moon, 
    Sun, 
    Shield, 
    Globe, 
    Trash2, 
    Check,
    Smartphone,
    Mail
} from "lucide-react";

const UserSettings = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [settings, setSettings] = useState({
        pushEnabled: true,
        emailEnabled: true,
        language: "english"
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (user?.notificationSettings) {
            setSettings({
                pushEnabled: user.notificationSettings.pushEnabled,
                emailEnabled: user.notificationSettings.emailEnabled,
                language: user.language || "english"
            });
        }
    }, [user]);

    const handleToggle = async (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        
        try {
            await axios.put("http://localhost:5000/api/users/notifications", {
                pushEnabled: newSettings.pushEnabled,
                emailEnabled: newSettings.emailEnabled
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Settings Updated");
        } catch (err) {
            toast.error("Failed to sync settings");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure? This will deactivate your identity node permanently.")) {
            setLoading(true);
            try {
                // Soft delete in backend (updates accountStatus to 'deleted')
                await axios.delete(`http://localhost:5000/api/users/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Account Deactivated");
                logout();
                window.location.href = "/";
            } catch (err) {
                toast.error("Deactivation Failed");
            } finally {
                setLoading(false);
            }
        }
    };

    const sectionStyle = "bg-card border border-border rounded-[2.5rem] p-8 shadow-xl transition-all hover:border-primary/20";
    const labelStyle = "text-[15px] font-black text-foreground";
    const subLabelStyle = "text-[12px] text-muted-foreground opacity-60";

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700" style={{ fontFamily: "Calibri, Candara, sans-serif" }}>
                
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-foreground tracking-tight">User Settings</h1>
                    <p className="text-sm text-muted-foreground mt-2">Configure your local identity and notification nodes</p>
                </header>

                <div className="grid gap-8">
                    
                    {/* Theme & Display */}
                    <div className={sectionStyle}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
                                <Globe size={20} />
                            </div>
                            <h2 className={labelStyle}>Display & Aesthetic</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-border transition-all">
                                <div className="flex items-center gap-4">
                                    {theme === 'dark' ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
                                    <div>
                                        <p className={labelStyle}>Dark Mode</p>
                                        <p className={subLabelStyle}>Toggle interface luminance levels</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`w-14 h-8 rounded-full transition-all relative ${theme === 'dark' ? 'bg-primary' : 'bg-muted'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-border transition-all">
                                <div className="flex items-center gap-4">
                                    <Globe size={20} className="text-primary" />
                                    <div>
                                        <p className={labelStyle}>Interface Language</p>
                                        <p className={subLabelStyle}>Select regional communication protocol</p>
                                    </div>
                                </div>
                                <select 
                                    value={settings.language}
                                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                                    className="bg-background border border-border rounded-xl px-4 py-2 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="english">English</option>
                                    <option value="hindi">Hindi</option>
                                    <option value="marathi">Marathi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className={sectionStyle}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-glow">
                                <Bell size={20} />
                            </div>
                            <h2 className={labelStyle}>Notification Nodes</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleToggle('pushEnabled')}
                                className={`flex items-center gap-4 p-6 rounded-[2rem] border transition-all text-left ${settings.pushEnabled ? 'border-primary/50 bg-primary/5 shadow-glow shadow-primary/5' : 'border-border bg-muted/10 opacity-60'}`}
                            >
                                <div className={`p-3 rounded-xl ${settings.pushEnabled ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className={labelStyle}>Push Alerts</p>
                                    <p className={subLabelStyle}>{settings.pushEnabled ? 'Active' : 'Idle'}</p>
                                </div>
                                {settings.pushEnabled && <Check size={16} className="ml-auto text-primary" />}
                            </button>

                            <button 
                                onClick={() => handleToggle('emailEnabled')}
                                className={`flex items-center gap-4 p-6 rounded-[2rem] border transition-all text-left ${settings.emailEnabled ? 'border-primary/50 bg-primary/5 shadow-glow shadow-primary/5' : 'border-border bg-muted/10 opacity-60'}`}
                            >
                                <div className={`p-3 rounded-xl ${settings.emailEnabled ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className={labelStyle}>Email Logs</p>
                                    <p className={subLabelStyle}>{settings.emailEnabled ? 'Active' : 'Idle'}</p>
                                </div>
                                {settings.emailEnabled && <Check size={16} className="ml-auto text-primary" />}
                            </button>
                        </div>
                    </div>

                    {/* Security & Danger Zone */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-[2.5rem] p-8 transition-all hover:bg-destructive/10 group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-destructive/10 rounded-2xl text-destructive shadow-glow shadow-destructive/20">
                                <Shield size={20} />
                            </div>
                            <h2 className="text-[15px] font-black text-destructive">Danger Zone</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-background/50 border border-destructive/20 rounded-[2rem]">
                            <div>
                                <p className="text-[14px] font-black text-foreground">Deactivate Identity</p>
                                <p className="text-[11px] text-muted-foreground mt-1">Permanently remove your account and all associated report metadata.</p>
                            </div>
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 bg-destructive text-destructive-foreground rounded-xl font-black text-[12px] shadow-xl shadow-destructive/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Deactivating...' : <><Trash2 size={16} /> Delete Account</>}
                            </button>
                        </div>
                    </div>

                </div>

                <footer className="pt-12 text-center">
                    <p className="text-[10px] font-black text-muted-foreground tracking-widest opacity-30 text-center">Civic Intel Settings Protocol V2.4.0</p>
                </footer>
            </div>
        </DashboardLayout>
    );
};

export default UserSettings;
