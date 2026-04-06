import React from "react";
import { LogOut, X, AlertTriangle } from "lucide-react";

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md" 
        onClick={onCancel}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl shadow-primary/10 overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Subtle Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-destructive/10 rounded-full blur-[80px]"></div>

        <div className="p-8 sm:p-10 relative z-10 text-center space-y-8">
          
          {/* Tactical Icon */}
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center border border-destructive/20 shadow-glow shadow-destructive/20 relative group">
             <div className="absolute inset-0 bg-destructive/20 rounded-[2rem] animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <AlertTriangle size={36} className="text-destructive relative z-10 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-foreground tracking-tight">Security Termination</h2>
            <p className="text-sm text-muted-foreground font-medium opacity-60 leading-relaxed uppercase tracking-widest text-[10px]">
              Are you sure you want to drop the authorization link and terminate the current session?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-8 py-5 rounded-2xl bg-muted border border-border text-xs font-black tracking-widest uppercase hover:bg-accent hover:text-foreground transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <X size={16} />
              Abort
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-8 py-5 rounded-2xl bg-destructive text-destructive-foreground text-xs font-black tracking-widest uppercase shadow-xl shadow-destructive/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Terminate
            </button>
          </div>

          <p className="text-[9px] font-bold text-muted-foreground/30 tracking-[0.3em] uppercase">
             Session Integrity: Locked
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
