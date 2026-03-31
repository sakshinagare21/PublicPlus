import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DepartmentLayout from "../../layout/DepartmentLayout";

const OperatorRequests = () => {
 const [operators, setOperators] = useState([]);
 const [zones, setZones] = useState([]);
 const [selectedZone, setSelectedZone] = useState({});
 const [notifications, setNotifications] = useState([]);

 const token = localStorage.getItem("token");

 useEffect(() => {
 fetchOperators();
 fetchZones();
 fetchNotifications();
 }, []);

 /* ================= FETCH OPERATORS ================= */
 const fetchOperators = async () => {
 try {
 const res = await fetch(
 "http://127.0.0.1:5000/api/departments/pending-operators",
 {
 headers: { Authorization: `Bearer ${token}` },
 },
 );

 const data = await res.json();
 setOperators(data);
 } catch (err) {
 console.log(err);
 }
 };

 /* ================= FETCH ZONES ================= */
 const fetchZones = async () => {
 try {
 const res = await fetch(
 "http://127.0.0.1:5000/api/departments/my-zones",
 {
 headers: { Authorization: `Bearer ${token}` },
 },
 );

 const data = await res.json();
 setZones(data);
 } catch (err) {
 console.log(err);
 }
 };

 /* ================= FETCH NOTIFICATIONS ================= */
 const fetchNotifications = async () => {
 try {
 const res = await fetch(
 "http://127.0.0.1:5000/api/notification/department",
 {
 headers: { Authorization: `Bearer ${token}` },
 },
 );

 const data = await res.json();
 setNotifications(data);
 } catch (err) {
 console.log(err);
 }
 };

 /* ================= APPROVE ================= */
 const approveOperator = async (operatorId) => {
 const zone = selectedZone[operatorId];

 if (!zone) {
 toast.error("Select zone first");
 return;
 }

 const res = await fetch(
 `http://127.0.0.1:5000/api/departments/approve-operator/${operatorId}`,
 {
 method: "PUT",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify(zone),
 },
 );

 const data = await res.json();

 if (!res.ok) return toast.error(data.message);

 toast.success("Operator approved");

 fetchOperators();
 fetchNotifications(); // 🔥 refresh notifications
 };

 /* ================= REJECT ================= */
 const rejectOperator = async (operatorId) => {
 const res = await fetch(
 `http://127.0.0.1:5000/api/departments/reject-operator/${operatorId}`,
 {
 method: "PUT",
 headers: { Authorization: `Bearer ${token}` },
 },
 );

 const data = await res.json();

 if (!res.ok) return toast.error(data.message);

 toast.success("Operator rejected");

 fetchOperators();
 fetchNotifications(); // 🔥 refresh notifications
 };

 /* ================= MARK ALL READ ================= */
 const markAllAsRead = async () => {
 const unread = notifications.filter((n) => n.status === "Unread");

 if (unread.length === 0) {
 toast("No unread notifications");
 return;
 }

 try {
 await fetch(
 "http://127.0.0.1:5000/api/notification/department/read-all",
 {
 method: "PUT",
 headers: { Authorization: `Bearer ${token}` },
 },
 );

 toast.success("All marked as read");
 fetchNotifications();
 } catch {
 toast.error("Failed");
 }
 };

 /* ================= DELETE ================= */
 const deleteNotification = async (id) => {
 try {
 await fetch(`http://127.0.0.1:5000/api/notification/${id}`, {
 method: "DELETE",
 headers: { Authorization: `Bearer ${token}` },
 });

 toast.success("Deleted");
 fetchNotifications();
 } catch {
 toast.error("Delete failed");
 }
 };

 return (
 <>
 <DepartmentLayout>
 <div className="p-8 bg-background min-h-screen text-foreground transition-colors duration-300">
 {/* ================= OPERATORS ================= */}
 <h2 className="text-2xl font-bold mb-6 text-foreground">Pending Operator Requests</h2>

 {operators.length === 0 ? (
 <p className="text-muted-foreground italic">No pending operators</p>
 ) : (
 <div className="overflow-x-auto mb-10 bg-card border border-border rounded-xl shadow-sm transition-colors overflow-hidden">
 <table className="w-full text-sm">
 <thead className="bg-muted text-muted-foreground transition-colors text-[10px] font-black tracking-widest">
 <tr>
 <th className="p-4 text-left">#</th>
 <th className="p-4 text-left">Name</th>
 <th className="p-4 text-left">Email</th>
 <th className="p-4 text-left">Zone</th>
 <th className="p-4 text-left">Action</th>
 </tr>
 </thead>

 <tbody>
 {operators.map((op, index) => (
 <tr
 key={op._id}
 className="border-b border-border hover:bg-muted/50 transition-colors"
 >
 <td className="p-4 w-10 text-foreground font-mono">{index + 1}</td>

 <td className="p-4 truncate max-w-[150px] font-bold text-foreground">
 {op.fullName}
 </td>

 <td className="p-4 text-muted-foreground truncate max-w-[200px]">
 {op.email}
 </td>

 <td className="p-4">
 <select
 className="bg-background border border-border text-foreground px-3 py-1.5 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
 onChange={(e) => {
 const zone = zones.find(
 (z) => z.zoneCode === e.target.value,
 );
 setSelectedZone({
 ...selectedZone,
 [op._id]: zone,
 });
 }}
 >
 <option>Select Zone</option>
 {zones.map((z) => (
 <option key={z.zoneCode} value={z.zoneCode}>
 {z.zoneName}
 </option>
 ))}
 </select>
 </td>

 <td className="p-4 flex gap-2 flex-wrap">
 <button
 onClick={() => approveOperator(op._id)}
 className="bg-success text-success-foreground px-4 py-1.5 rounded-lg font-bold shadow-sm hover:opacity-90 transition-all"
 >
 Approve
 </button>

 <button
 onClick={() => rejectOperator(op._id)}
 className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-lg font-bold shadow-sm hover:opacity-90 transition-all"
 >
 Reject
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {/* ================= NOTIFICATIONS ================= */}
 <div className="bg-card border border-border rounded-xl shadow-sm transition-colors overflow-hidden">
 <div className="flex justify-between items-center p-6 border-b border-border bg-muted/20">
 <h2 className="text-2xl font-black text-foreground">Notifications</h2>

 <button
 onClick={markAllAsRead}
 className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-black shadow-md hover:bg-primary/90 transition-all"
 >
 Mark All as Read
 </button>
 </div>

 {notifications.length === 0 ? (
 <p className="p-8 text-muted-foreground italic text-center">No notifications found</p>
 ) : (
 <table className="w-full text-sm">
 <thead className="bg-muted text-muted-foreground transition-colors text-[10px] font-black tracking-widest">
 <tr>
 <th className="p-4 text-left">#</th>
 <th className="p-4 text-left">Title</th>
 <th className="p-4 text-left">Message</th>
 <th className="p-4 text-left">Type</th>
 <th className="p-4 text-left">Status</th>
 <th className="p-4 text-left">Date</th>
 <th className="p-4 text-left">Action</th>
 </tr>
 </thead>

 <tbody>
 {notifications.map((n) => (
 <tr key={n.id} className="border-b border-border hover:bg-muted/30 transition-colors text-foreground">
 <td className="p-4 font-mono text-muted-foreground">{n.srNo}</td>
 <td className="p-4 font-bold">{n.title}</td>
 <td className="p-4 text-muted-foreground text-xs leading-relaxed max-w-xs">{n.message}</td>

 <td className="p-4">
 <span className="bg-success text-success-foreground px-3 py-1 rounded-full text-[10px] font-black tracking-tighter shadow-sm">
 {n.type}
 </span>
 </td>

 <td className="p-4 font-medium">{n.status}</td>
 <td className="p-4 text-muted-foreground text-xs">{n.date}</td>

 <td className="p-4">
 <button
 onClick={() => deleteNotification(n.id)}
 className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 rounded-lg text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
 >
 Delete
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 </DepartmentLayout>
 </>
 );
};

export default OperatorRequests;

