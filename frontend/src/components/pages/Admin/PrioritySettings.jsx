import { useState } from "react";

export default function PrioritySettings() {

 const [rules, setRules] = useState({
 fire: 80,
 pothole: 40
 });

 return (
 <div className="bg-card border border-border p-6 rounded-2xl shadow-sm transition-colors relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
 
 <h2 className="text-xl font-bold mb-6 text-foreground tracking-tight">Priority Settings</h2>

 <div className="space-y-4">
 {Object.keys(rules).map((key) => (
 <div key={key} className="flex items-center gap-6 bg-muted/20 p-4 rounded-xl border border-border/50 group hover:bg-muted/30 transition-all">
 <span className="w-32 capitalize text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">{key}</span>

 <div className="flex-1 flex items-center gap-3">
 <input
 type="number"
 value={rules[key]}
 onChange={(e) =>
 setRules({
 ...rules,
 [key]: Number(e.target.value)
 })
 }
 className="w-24 bg-background border border-border px-4 py-2 rounded-lg text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
 />
 <span className="text-[10px] font-black tracking-widest text-muted-foreground/40">Weight</span>
 </div>
 </div>
 ))}
 </div>

 <div className="mt-8 pt-6 border-t border-border/50">
 <button className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-glow shadow-primary/20 hover:opacity-90 transition-all">
 Update Priorities
 </button>
 </div>
 </div>
 );
}

