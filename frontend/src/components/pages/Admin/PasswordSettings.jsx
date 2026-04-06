import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

export default function PasswordSettings() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, password);
        toast.success("Identity passkey updated successfully.");
        setPassword("");
      } else {
        toast.error("No active session found.");
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("For security, please logout and login again before changing password.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm transition-colors relative overflow-hidden max-w-lg mx-auto">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full -mr-24 -mt-24"></div>
      
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Change Password</h2>
        <p className="text-muted-foreground text-sm mt-2 font-medium opacity-60">Enter a new secure password</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/60 ml-2">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••"
            className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
          />
        </div>

        <button 
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-5 rounded-2xl shadow-glow shadow-primary/30 hover:scale-[1.01] active:scale-[0.98] transition-all mt-4 border border-primary/20 disabled:opacity-50"
        >
          {loading ? "Synchronizing..." : "Update Password"}
        </button>

        <p className="text-[9px] font-black text-center tracking-widest text-muted-foreground/30 italic">
          Passkey encryption must meet Root-Level 5 strength parameters.
        </p>
      </div>
    </div>
  );
}
