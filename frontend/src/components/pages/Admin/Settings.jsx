import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";

import SLASettings from "./SLASettings";
import CategorySettings from "./CategorySettings";
import PrioritySettings from "./PrioritySettings";
import NotificationSettings from "./NotificationSettings";
import PasswordSettings from "./PasswordSettings";

export default function SettingsMain() {
 const [active, setActive] = useState("SLA");

 const tabs = ["SLA", "Categories", "Priority", "Notifications", "Password"];

 return (
 <AdminLayout>
 <div className="min-h-screen text-foreground transition-colors">
 {/* Navbar */}
 <div className="flex gap-6 border-b border-border pb-2 text-sm">
 {tabs.map((tab) => (
 <button
 key={tab}
 onClick={() => setActive(tab)}
 className={`transition-all duration-200 font-semibold px-2 ${
 active === tab
 ? "text-primary border-b-2 border-primary pb-1"
 : "text-muted-foreground hover:text-foreground"
 }`}
 >
 {tab}
 </button>
 ))}
 </div>

 {/* Content */}
 <div className="p-6 transition-colors">
 {active === "SLA" && <SLASettings />}
 {active === "Categories" && <CategorySettings />}
 {active === "Priority" && <PrioritySettings />}
 {active === "Notifications" && <NotificationSettings />}
 {active === "Password" && <PasswordSettings />}
 </div>
 </div>
 </AdminLayout>
 );
}

