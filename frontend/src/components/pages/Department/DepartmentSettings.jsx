import { useState } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import { updatePassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

const DepartmentSettings = () => {
 const [activeTab, setActiveTab] = useState("General");
 const [passwords, setPasswords] = useState({
     new: "",
     confirm: ""
 });
 const [loading, setLoading] = useState(false);

 const handleChangePassword = async () => {
     if (!passwords.new || passwords.new.length < 6) {
         toast.error("Password must be at least 6 characters.");
         return;
     }
     if (passwords.new !== passwords.confirm) {
         toast.error("Passwords do not match.");
         return;
     }

     setLoading(true);
     try {
         const user = auth.currentUser;
         if (user) {
             await updatePassword(user, passwords.new);
             toast.success("Department security passkey updated.");
             setPasswords({ new: "", confirm: "" });
         } else {
             toast.error("Session not found.");
         }
     } catch (error) {
         if (error.code === 'auth/requires-recent-login') {
             toast.error("Please re-login to perform this security action.");
         } else {
             toast.error(error.message);
         }
     } finally {
         setLoading(false);
     }
 };

 return (
 <DepartmentLayout>
 <div className="space-y-8">

 {/* HEADER */}
 <div>
 <h1 className="text-3xl font-bold">
 Department Settings
 </h1>
 <p className="text-gray-400 text-sm">
 Configure department-level preferences and security
 </p>
 </div>

 {/* TABS */}
 <div className="flex gap-6 border-b border-gray-800 pb-2 text-sm">
 {["General", "SLA", "Notifications", "Security"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`${
 activeTab === tab
 ? "text-blue-400 border-b-2 border-blue-400 pb-1"
 : "text-gray-400"
 }`}
 >
 {tab}
 </button>
 ))}
 </div>

 {/* CONTENT AREA */}
 <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">

 {/* GENERAL */}
 {activeTab === "General" && (
 <div className="space-y-4">
 <h3 className="font-semibold mb-4">
 General Information
 </h3>

 <input
 placeholder="Department Name"
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
 />

 <input
 placeholder="Head of Department"
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
 />

 <input
 placeholder="Official Email"
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
 />

 <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg mt-4">
 Save Changes
 </button>
 </div>
 )}

 {/* SLA RULES */}
 {activeTab === "SLA" && (
 <div className="space-y-4">
 <h3 className="font-semibold mb-4">
 Internal SLA Rules
 </h3>

 <input
 type="number"
 placeholder="Critical Issue SLA (hours)"
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
 />

 <input
 type="number"
 placeholder="High Priority SLA (hours)"
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
 />

 <input
 type="number"
 placeholder="Medium Priority SLA (hours)"
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
 />

 <label className="flex items-center gap-3 text-sm">
 <input type="checkbox" />
 Enable Auto Escalation
 </label>

 <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg mt-4">
 Save SLA Rules
 </button>
 </div>
 )}

 {/* NOTIFICATIONS */}
 {activeTab === "Notifications" && (
 <div className="space-y-4">
 <h3 className="font-semibold mb-4">
 Notification Preferences
 </h3>

 <label className="flex items-center gap-3">
 <input type="checkbox" />
 Email Alerts
 </label>

 <label className="flex items-center gap-3">
 <input type="checkbox" />
 SMS Alerts
 </label>

 <label className="flex items-center gap-3">
 <input type="checkbox" />
 SLA Breach Alerts
 </label>

 <label className="flex items-center gap-3">
 <input type="checkbox" />
 Escalation Alerts
 </label>

 <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg mt-4">
 Save Preferences
 </button>
 </div>
 )}

 {/* SECURITY */}
 {activeTab === "Security" && (
 <div className="space-y-4 font-sans tracking-tight">
 <h3 className="font-semibold mb-4">
 Security Settings
 </h3>

 <input
 type="password"
 placeholder="New Secure Password"
 value={passwords.new}
 onChange={(e) => setPasswords({...passwords, new: e.target.value})}
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-all font-medium"
 />

 <input
 type="password"
 placeholder="Confirm Secure Password"
 value={passwords.confirm}
 onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
 className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-all font-medium"
 />

 <label className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-gray-500 py-2">
 <input type="checkbox" className="w-5 h-5" />
 Enable Advanced Multi-Factor Grid
 </label>

 <button 
   onClick={handleChangePassword}
   disabled={loading}
   className="bg-blue-600 hover:bg-blue-700 text-sm font-bold px-8 py-4 rounded-xl mt-4 transition-all active:scale-95 disabled:opacity-50"
 >
   {loading ? "Updating Security..." : "Commit Passkey Update"}
 </button>
 </div>
 )}

 </div>

 </div>
 </DepartmentLayout>
 );
};

export default DepartmentSettings;


