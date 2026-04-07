import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";

import SLASettings from "./SLASettings";
import CategorySettings from "./CategorySettings";
import PasswordSettings from "./PasswordSettings";

export default function SettingsMain() {
  const [active, setActive] = useState("SLA");

  const tabs = ["SLA", "Categories", "Security"];

  return (
    <AdminLayout>
      <div className="min-h-screen text-foreground transition-colors overflow-hidden">
        {/* Navbar */}
        <div className="flex gap-8 border-b border-border/50 pb-4 text-xs font-black tracking-widest uppercase">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`transition-all duration-300 px-1 relative ${
                active === tab
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-40 hover:opacity-100"
              }`}
            >
              {tab}
              {active === tab && (
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-full animate-in zoom-in duration-500 shadow-glow" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pt-12 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
          {active === "SLA" && <SLASettings />}
          {active === "Categories" && <CategorySettings />}
          {active === "Security" && <PasswordSettings />}
        </div>
      </div>
    </AdminLayout>
  );
}

