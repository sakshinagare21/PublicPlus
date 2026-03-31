import { useState } from "react";

export default function NotificationSettings() {

 const [settings, setSettings] = useState({
 admin: true,
 department: true,
 operator: true
 });

 return (
 <div className="bg-card border border-border p-8 rounded-2xl shadow-sm transition-colors relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
 
 <div className="mb-8">
 <h2 className="text-xl font-bold text-foreground tracking-tight">Notification Settings</h2>
 <p className="text-muted-foreground text-sm mt-1">Configure who gets notified for new issues</p>
 </div>

 <div className="space-y-3">
 {Object.keys(settings).map((key) => (
 <div key={key} className="flex justify-between items-center bg-muted/20 border border-border/50 px-6 py-4 rounded-xl hover:bg-muted/30 transition-all group">
 <div className="flex flex-col">
 <span className="capitalize text-sm font-bold text-foreground/90 group-hover:text-primary transition-colors">{key} Alerts</span>
 <span className="text-[10px] font-black tracking-widest text-muted-foreground/40 italic">System Notification</span>
 </div>

 <label className="relative inline-flex items-center cursor-pointer">
 <input
 type="checkbox"
 className="sr-only peer"
 checked={settings[key]}
 onChange={() =>
 setSettings({
 ...settings,
 [key]: !settings[key]
 })
 }
 />
 <div className="w-12 h-6 bg-muted border border-border rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
 </label>
 </div>
 ))}
 </div>

 <div className="mt-8 pt-6 border-t border-border/50">
 <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/30 text-center italic">
 Changes are saved automatically and applied system-wide.
 </p>
 </div>
 </div>
 );
}

