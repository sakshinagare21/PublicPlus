import React, { useState } from "react";
import { X, Lock, ShieldCheck, Activity } from "lucide-react";
import { updatePassword } from "firebase/auth";
import { auth } from "../../firebase";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.new || passwords.new.length < 6) {
      toast.error("New passkey must be at least 6 characters.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Confirmation matching failed.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, passwords.new);
        toast.success("Security node synchronized. Identity passkey updated.");
        setPasswords({ new: "", confirm: "" });
        onClose();
      } else {
        toast.error("Access token expired. Please re-login.");
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Critical security sensitive area. Please re-login to proceed.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-card border border-border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>
        
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-glow">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight italic">Security <span className="text-primary not-italic">Update</span></h3>
              <p className="text-[9px] font-black tracking-widest text-muted-foreground opacity-40 italic">PROTOCOL: IDENTITY_PASSKEY_RESET</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-muted/40 border border-border rounded-2xl hover:text-destructive hover:border-destructive transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-4 transition-colors">
            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/60 ml-2">NEW SECURE PASSKEY</label>
            <div className="relative group/field">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                required
              />
            </div>
          </div>

          <div className="space-y-4 transition-colors">
            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/60 ml-2">CONFIRM PASSKEY GRID</label>
            <div className="relative group/field">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-6 rounded-[2rem] font-black text-[11px] tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/20 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? "INITIALIZING..." : <><Activity size={18} className="animate-pulse" /> COMMIT IDENTITY LOG</>}
          </button>

          <p className="text-[10px] text-center font-black tracking-widest text-muted-foreground opacity-30 italic">
            Secure encryption is active on this session.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
