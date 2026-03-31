import { useState, useEffect } from "react";
import axios from "axios";
import { 
 BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
 XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
 MapContainer, TileLayer, CircleMarker, Popup 
} from "react-leaflet";
import { 
 AlertCircle, CheckCircle, Clock, Map as MapIcon, 
 TrendingUp, TrendingDown, Filter, Calendar, ChevronDown
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import "leaflet/dist/leaflet.css";

const COLORS = ["#ef4444", "#eab308", "#22c55e"]; // Red, Yellow, Green

const AnalyticsDashboard = () => {
 const [data, setData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [filters, setFilters] = useState({
 startDate: "",
 endDate: "",
 zone: "",
 priority: "",
 status: ""
 });
 const [zones, setZones] = useState([]);

 const token = localStorage.getItem("token");

 const fetchData = async () => {
 setLoading(true);
 try {
 const queryParams = new URLSearchParams(filters).toString();
 const res = await axios.get(`http://127.0.0.1:5000/api/analytics/admin?${queryParams}`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 console.log("Analytics Data Received:", res.data);
 setData(res.data);
 } catch (err) {
 console.error("Fetch Analytics Error:", err.response?.data || err.message);
 } finally {
 setLoading(false);
 }
 };

 const fetchZones = async () => {
 try {
 const res = await axios.get("http://127.0.0.1:5000/api/zones", {
 headers: { Authorization: `Bearer ${token}` }
 });
 setZones(res.data.zones || res.data);
 } catch (err) {
 console.error("Fetch Zones Error:", err);
 }
 };

 useEffect(() => {
 fetchZones();
 fetchData();
 }, [filters]);

 if (loading && !data) {
 return (
 <AdminLayout>
 <div className="flex items-center justify-center h-[60vh]">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
 </div>
 </AdminLayout>
 );
 }

 const getPriorityColor = (p) => {
 const priority = String(p || "").toLowerCase();
 switch(priority) {
 case 'high': return '#ef4444';
 case 'medium': return '#eab308';
 default: return '#22c55e';
 }
 };

 return (
 <AdminLayout>
 <div className="space-y-8 animate-in fade-in duration-700">
 
 {/* HEADER & FILTERS */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div className="space-y-1">
 <h1 className="text-3xl font-black text-foreground tracking-tight">City Analytics</h1>
 <p className="text-sm text-muted-foreground font-medium">Stats for city zones and report history.</p>
 </div>

 <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border">
 <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl">
 <Calendar size={16} className="text-muted-foreground" />
 <input 
 type="date" 
 className="bg-transparent text-xs font-bold outline-none"
 value={filters.startDate}
 onChange={(e) => setFilters({...filters, startDate: e.target.value})}
 />
 <span className="text-muted-foreground">→</span>
 <input 
 type="date" 
 className="bg-transparent text-xs font-bold outline-none"
 value={filters.endDate}
 onChange={(e) => setFilters({...filters, endDate: e.target.value})}
 />
 </div>

 <select 
 className="bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:border-primary transition-colors"
 value={filters.zone}
 onChange={(e) => setFilters({...filters, zone: e.target.value})}
 >
 <option value="">All Zones</option>
 {zones.map(z => <option key={z._id} value={z.areaName}>{z.areaName}</option>)}
 </select>

 <select 
 className="bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:border-primary transition-colors"
 value={filters.priority}
 onChange={(e) => setFilters({...filters, priority: e.target.value})}
 >
 <option value="">All Priorities</option>
 <option value="high">High</option>
 <option value="medium">Medium</option>
 <option value="low">Low</option>
 </select>

 <button 
 onClick={() => setFilters({ startDate: "", endDate: "", zone: "", priority: "", status: "" })}
 className="px-4 py-2 text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground transition-colors"
 >
 Reset Filters
 </button>
 </div>
 </div>

 {/* TOP KPI CARDS */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <MapIcon size={80} className="text-primary" />
 </div>
 <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1">Total City Areas</p>
 <h2 className="text-4xl font-black text-foreground">{data?.summary.totalZones}</h2>
 <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
 <TrendingUp size={14} /> All areas are monitored
 </div>
 </div>

 <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <AlertCircle size={80} className="text-amber-500" />
 </div>
 <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1">All Complaints</p>
 <h2 className="text-4xl font-black text-foreground">{data?.summary.totalIncidents}</h2>
 <div className="mt-4 flex items-center gap-2 text-amber-500 font-bold text-xs">
 <Clock size={14} /> {data?.summary.pendingIncidents} cases waiting to be fixed
 </div>
 </div>

 <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <CheckCircle size={80} className="text-emerald-500" />
 </div>
 <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1">Fixed Problems</p>
 <h2 className="text-4xl font-black text-foreground">{data?.summary.resolvedIncidents}</h2>
 <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
 <CheckCircle size={14} /> {((data?.summary.resolvedIncidents / data?.summary.totalIncidents || 0) * 100).toFixed(1)}% of work completed 
 </div>
 </div>

 <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
 <TrendingDown size={80} className="text-rose-500" />
 </div>
 <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1">Busiest Area</p>
 <h2 className="text-xl font-black text-foreground truncate">
 {data?.rankings.worstZone?._id || "None"}
 </h2>
 <div className="mt-4 flex items-center gap-2 text-rose-500 font-bold text-xs tracking-widest">
 Many reports here
 </div>
 </div>
 </div>

 {/* CHARTS GRID */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 
 {/* ZONE ANALYSIS BAR CHART */}
 <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xl font-black text-foreground">Reports by Area</h3>
 <div className="px-3 py-1 bg-muted rounded-lg text-[8px] font-black tracking-widest text-muted-foreground">Total Reports</div>
 </div>
 <div className="h-[300px] w-full min-h-[300px]">
 {data?.charts?.zoneAnalysis?.length > 0 ? (
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={data.charts.zoneAnalysis}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
 <XAxis dataKey="name" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
 <YAxis fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
 <Tooltip 
 contentStyle={{ borderRadius: '1rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontWeight: 'bold' }}
 cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
 />
 <Bar dataKey="incidents" fill="#5b21b6" radius={[4, 4, 0, 0]} barSize={20} />
 </BarChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-full flex items-center justify-center text-muted-foreground font-bold text-xs tracking-widest">
 No data for this area
 </div>
 )}
 </div>
 </div>

 {/* INCIDENT TRENDS LINE CHART */}
 <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xl font-black text-foreground">Reports over Time</h3>
 <div className="px-3 py-1 bg-muted rounded-lg text-[8px] font-black tracking-widest text-muted-foreground">Day-by-day stats</div>
 </div>
 <div className="h-[300px] w-full min-h-[300px]">
 {data?.charts?.trendAnalysis?.length > 0 ? (
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={data.charts.trendAnalysis}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
 <XAxis dataKey="date" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
 <YAxis fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
 <Tooltip 
 contentStyle={{ borderRadius: '1rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontWeight: 'bold' }}
 />
 <Line type="monotone" dataKey="count" stroke="#5b21b6" strokeWidth={4} dot={{ r: 4, fill: '#5b21b6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
 </LineChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-full flex items-center justify-center text-muted-foreground font-bold text-xs tracking-widest">
 No trends found
 </div>
 )}
 </div>
 </div>

 {/* PRIORITY & STATUS PIE/DONUT */}
 <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm grid md:grid-cols-2 gap-8">
 <div className="space-y-6">
 <h3 className="text-lg font-black text-foreground">Problem Priority</h3>
 <div className="h-[250px] w-full min-h-[250px]">
 <ResponsiveContainer width="100%" height={250}>
 <PieChart>
 <Pie
 data={data?.charts.priorityAnalysis}
 cx="50%" cy="50%"
 innerRadius={60} outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {data?.charts.priorityAnalysis.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={getPriorityColor(entry._id || entry.name)} />
 ))}
 </Pie>
 <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 'bold' }} />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

 <div className="space-y-6">
 <h3 className="text-lg font-black text-foreground">Working Status</h3>
 <div className="h-[250px] w-full min-h-[250px]">
 <ResponsiveContainer width="100%" height={250}>
 <PieChart>
 <Pie
 data={data?.charts.statusAnalysis}
 cx="50%" cy="50%"
 outerRadius={80}
 dataKey="value"
 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
 >
 {data?.charts.statusAnalysis.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={["#ef4444", "#22c55e", "#3b82f6"][index % 3]} />
 ))}
 </Pie>
 <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 'bold' }} />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* GEOSPATIAL HEATMAP PREVIEW */}
 <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xl font-black text-foreground">Problem Map</h3>
 <div className="px-3 py-1 bg-muted rounded-lg text-[8px] font-black tracking-widest text-muted-foreground">Highest problem areas</div>
 </div>
 <div className="h-[300px] w-full rounded-3xl overflow-hidden border border-border relative">
 <MapContainer 
 center={[18.5204, 73.8567]} 
 zoom={12} 
 style={{ height: "100%", width: "100%" }}
 className="z-10"
 >
 <TileLayer
 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
 />
 {data?.heatmapData.map((pos, i) => (
 <CircleMarker 
 key={i} 
 center={[pos[0], pos[1]]} 
 radius={10}
 pathOptions={{ 
 fillColor: '#ef4444', 
 fillOpacity: 0.3, 
 color: 'transparent' 
 }}
 />
 ))}
 </MapContainer>
 </div>
 </div>

 </div>
 </div>
 </AdminLayout>
 );
};

export default AnalyticsDashboard;

