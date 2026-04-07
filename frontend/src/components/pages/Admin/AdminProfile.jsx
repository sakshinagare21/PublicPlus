import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { User, Mail, Shield, Phone, MapPin, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
            } else {
                toast.error(data.message || "Failed to load profile");
            }
        } catch (err) {
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!profile) {
        return (
            <AdminLayout>
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No profile data found.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="relative h-48 rounded-[2.5rem] bg-gradient-to-r from-primary/20 to-primary/5 overflow-hidden border border-border">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full -ml-20 -mb-20"></div>

                    <div className="absolute -bottom-12 left-12 flex items-end gap-6">
                        <div className="w-32 h-32 rounded-3xl bg-card border-4 border-background flex items-center justify-center text-4xl font-bold text-primary shadow-2xl relative overflow-hidden group">
                            {profile.profilePhoto ? (
                                <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile.fullName?.charAt(0) || "A"
                            )}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <User className="text-white" size={24} />
                            </div>
                        </div>
                        <div className="mb-14">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{profile.fullName}</h1>
                            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest w-fit">
                                <Shield size={12} /> Root Administrator
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm transition-colors">
                            <h3 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
                                <User className="text-primary" size={20} /> Personal Credentials
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/50">Full Identity Name</p>
                                    <p className="font-semibold text-foreground">{profile.fullName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/50">System Link Email</p>
                                    <p className="font-semibold text-foreground">{profile.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/50">Mobile Access</p>
                                    <p className="font-semibold text-foreground">{profile.phoneNumber || "Not bound"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/50">Jurisdiction Zone</p>
                                    <p className="font-semibold text-foreground">{profile.homeLocation?.address || "Global Management"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm transition-colors">
                            <h3 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
                                <Shield className="text-primary" size={20} /> Security & System Meta
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                            <Clock size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">Account Created</span>
                                    </div>
                                    <span className="text-sm font-bold text-foreground">
                                        {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                            <Calendar size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">Last Login Synchronization</span>
                                    </div>
                                    <span className="text-sm font-bold text-foreground">
                                        {profile.lastLogin
                                            ? new Date(profile.lastLogin).toLocaleString()
                                            : "First Session Access"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                            <Shield size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">Authentication Status</span>
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full">
                                        Active & Verified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <Shield className="text-primary" size={32} />
                            </div>
                            <h4 className="font-bold text-foreground">Administrative Status</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                You have unrestricted access to all municipal protocols and system recalibration units.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-[2rem] p-6">
                            <h4 className="font-bold text-foreground mb-4 text-sm">Active Sessions</h4>
                            <div className="space-y-3">
                                {profile.devices?.slice(0, 3).map((device, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-help group">
                                        <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                                            <MapPin size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">{device.platform || "Unknown Web"}</p>
                                            <p className="text-[9px] text-muted-foreground font-medium tracking-tighter  ">Last used {new Date(device.lastUsed).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


