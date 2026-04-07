import React, { useState } from "react";
import { X, User, Phone, Camera, Loader2, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileModal = ({ isOpen, onClose, currentData, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: currentData?.fullName || "",
        phoneNumber: currentData?.phoneNumber || "",
        profilePhoto: currentData?.profilePhoto || ""
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data) {
                toast.success("Profile status Updated.");
                // Update localStorage
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const newUser = { ...storedUser, fullName: formData.fullName, phoneNumber: formData.phoneNumber, profilePhoto: formData.profilePhoto };
                localStorage.setItem("user", JSON.stringify(newUser));

                onUpdate(newUser);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Tactical uplink failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-card border border-border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>

                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-glow">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-foreground tracking-tight">Update  <span className="text-primary not-italic">Profile</span></h3>
                            {/* <p className="text-[9px] font-black tracking-widest text-muted-foreground opacity-40">PROTOCOL: CITIZEN_METADATA_UPDATE</p> */}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-muted/40 border border-border rounded-2xl hover:text-destructive hover:border-destructive transition-all active:scale-90"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-3">
                        <label className="text-[15px] font-black text-muted-foreground/60 ml-2">FULL NAME</label>
                        <div className="relative group/field">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                            <input
                                placeholder="e.g. John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[15px] font-black text-muted-foreground/60 ml-2">PHONE NUMBER</label>
                        <div className="relative group/field">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                            <input
                                placeholder="+91-00000-00000"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[15px] font-black text-muted-foreground/60 ml-2">PROFILE PHOTO (URL)</label>
                        <div className="relative group/field">
                            <Camera className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
                            <input
                                placeholder="https://..."
                                value={formData.profilePhoto}
                                onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-6 rounded-[2rem] font-black text-[11px] tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                SAVE CHANGES
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;

