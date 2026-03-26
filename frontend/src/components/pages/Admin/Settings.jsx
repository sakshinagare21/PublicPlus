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
      <div className="min-h-screen text-gray-200">
        {/* 🔥 NAVBAR */}
        <div className="flex gap-6 border-b border-gray-800 pb-2 text-sm">
          {["SLA", "Categories", "Priority", "Notifications", "Password"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`transition-all duration-200 ${
                  active === tab
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* 🔥 CONTENT */}
        <div className="p-6">
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
