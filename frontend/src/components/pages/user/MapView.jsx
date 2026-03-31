import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../layout/DashboardLayout";
import {
 MapPin,
 Search,
 Filter,
 CheckSquare,
 Square,
 X,
 Navigation,
 Plus,
 AlertTriangle,
 Clock,
 Eye,
 Camera,
 Layers,
 Activity,
 ChevronRight,
 Target
} from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Link } from "react-router-dom";

const mapContainerStyle = {
 width: "100%",
 height: "100%",
};

const defaultCenter = {
 lat: 18.5204,
 lng: 73.8567,
};

const MapView = () => {
 const [issues, setIssues] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [userLocation, setUserLocation] = useState(null);
 const [selectedIssue, setSelectedIssue] = useState(null);
 const [isReporting, setIsReporting] = useState(false);
 const [newIssueCoords, setNewIssueCoords] = useState(null);
 const [searchQuery, setSearchQuery] = useState("");
 
 // Filters
 const [filters, setFilters] = useState({
 categories: [],
 priorities: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
 statuses: ["reported", "assigned", "in_progress", "reopened", "pending_verification", "resolved"]
 });

 const { isLoaded } = useJsApiLoader({
 id: "google-map-script",
 googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
 libraries: ["places"],
 });

 const [map, setMap] = useState(null);
 const token = localStorage.getItem("token");

 const fetchIssues = async () => {
 try {
 setLoading(true);
 const res = await axios.get("http://127.0.0.1:5000/api/issues/all", {
 headers: { Authorization: `Bearer ${token}` }
 });
 if (res.data.success) {
 setIssues(res.data.issues);
 }
 } catch (err) {
 console.error("Map Fetch Error:", err);
 toast.error("Failed to sync mission coordinates");
 } finally {
 setLoading(false);
 }
 };

 const fetchCategories = async () => {
 try {
 const res = await axios.get("http://127.0.0.1:5000/api/issue-types/", {
 headers: { Authorization: `Bearer ${token}` }
 });
 const types = res.data.types || [];
 setCategories(types);
 setFilters(prev => ({ ...prev, categories: types.map(c => c._id) }));
 } catch (err) {
 console.error("Category Fetch Error:", err);
 }
 };

 useEffect(() => {
 if (token) {
 fetchIssues();
 fetchCategories();
 getUserLocation();
 }
 }, [token]);

 const getUserLocation = () => {
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const pos = {
 lat: position.coords.latitude,
 lng: position.coords.longitude
 };
 setUserLocation(pos);
 map?.panTo(pos);
 },
 () => toast.error("Location access denied")
 );
 }
 };

 const handleMapClick = (e) => {
 const lat = e.latLng.lat();
 const lng = e.latLng.lng();
 setNewIssueCoords({ lat, lng });
 setIsReporting(true);
 };

 const filteredIssues = issues.filter(i => {
 const matchesCategory = filters.categories.includes(i.category?._id);
 const matchesPriority = filters.priorities.includes(i.priority?.level?.toUpperCase());
 const matchesStatus = filters.statuses.includes(i.status);
 const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
 });

 const toggleFilter = (type, value) => {
 setFilters(prev => {
 const current = prev[type];
 const next = current.includes(value) 
 ? current.filter(v => v !== value) 
 : [...current, value];
 return { ...prev, [type]: next };
 });
 };

 const getMarkerIcon = (priority) => {
 const p = priority?.toLowerCase();
 if (p === 'critical' || p === 'high') return "http://maps.google.com/mapfiles/ms/icons/red-pushpin.png";
 if (p === 'medium') return "http://maps.google.com/mapfiles/ms/icons/orange-pushpin.png";
 return "http://maps.google.com/mapfiles/ms/icons/green-pushpin.png";
 };

 return (
 <DashboardLayout>
 <div className="flex h-[calc(100vh-100px)] -m-6 relative overflow-hidden transition-colors font-sans bg-background">
 
 {/* Tactical Filter Sidebar */}
 <div className="hidden lg:flex w-80 flex-col border-r border-border bg-card overflow-y-auto custom-scrollbar p-8 z-20">
 <div className="flex items-center gap-3 mb-10">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
 <Layers size={20} />
 </div>
 <div>
 <h2 className="text-xs font-black tracking-[0.2em] text-foreground">Strategic Overlay</h2>
 <p className="text-[10px] font-bold text-muted-foreground opacity-60">Operations Unit 01</p>
 </div>
 </div>

 <div className="space-y-10">
 {/* Sector Status */}
 <div>
 <p className="text-[10px] font-black text-muted-foreground opacity-40 mb-5 tracking-widest flex items-center gap-2">
 <Activity size={12} /> Tracking Topology
 </p>
 <div className="flex flex-wrap gap-2">
 {["reported", "assigned", "in_progress", "resolved"].map(status => (
 <button
 key={status}
 onClick={() => toggleFilter("statuses", status)}
 className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border ${
 filters.statuses.includes(status)
 ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
 : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50"
 }`}
 >
 {status.replace("_", " ")}
 </button>
 ))}
 </div>
 </div>

 {/* Severity Matrix */}
 <div>
 <p className="text-[10px] font-black text-muted-foreground opacity-40 mb-5 tracking-widest flex items-center gap-2">
 <AlertTriangle size={12} /> Threat Assessment
 </p>
 <div className="space-y-2">
 {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(p => (
 <button
 key={p}
 onClick={() => toggleFilter("priorities", p)}
 className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
 filters.priorities.includes(p)
 ? "bg-muted border-primary/20 opacity-100 shadow-inner"
 : "bg-transparent border-transparent opacity-40 hover:opacity-100"
 }`}
 >
 <span className="flex items-center gap-4">
 <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
 p === 'CRITICAL' || p === 'HIGH' ? 'bg-destructive' : p === 'MEDIUM' ? 'bg-warning' : 'bg-emerald-500'
 }`} />
 <span className="text-[10px] font-black tracking-widest text-foreground">{p} Intelligence</span>
 </span>
 {filters.priorities.includes(p) && <div className="w-2 h-2 rounded-full bg-primary" />}
 </button>
 ))}
 </div>
 </div>

 {/* Division Selector */}
 <div>
 <p className="text-[10px] font-black text-muted-foreground opacity-40 mb-5 tracking-widest flex items-center gap-2">
 <Target size={12} /> Infrastructure Divisions
 </p>
 <div className="space-y-3 px-1">
 {categories.map(cat => (
 <label key={cat._id} className="flex items-center gap-4 cursor-pointer group">
 <input 
 type="checkbox" 
 className="hidden" 
 checked={filters.categories.includes(cat._id)}
 onChange={() => toggleFilter("categories", cat._id)}
 />
 <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
 filters.categories.includes(cat._id) ? "bg-primary border-primary shadow-lg shadow-primary/20" : "bg-muted/50 border-border group-hover:border-primary/50"
 }`}>
 {filters.categories.includes(cat._id) && <Plus size={14} className="text-primary-foreground" />}
 </div>
 <span className={`text-[11px] font-bold transition-colors ${
 filters.categories.includes(cat._id) ? "text-foreground" : "text-muted-foreground"
 }`}>{cat.label}</span>
 </label>
 ))}
 </div>
 </div>
 </div>

 <div className="mt-auto pt-8 border-t border-border">
 <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
 <p className="text-[9px] font-black text-primary mb-2 tracking-[0.2em]">Live Telemetry</p>
 <p className="text-xs font-bold text-foreground flex items-center justify-between">
 Active Nodes <span>{filteredIssues.length}</span>
 </p>
 </div>
 </div>
 </div>

 {/* Global Map Terminal */}
 <div className="flex-1 relative bg-muted/5">
 
 {/* Tactical Search Overlay */}
 <div className="absolute top-8 left-8 right-8 z-10 flex gap-4 pointer-events-none">
 <div className="relative flex-1 max-w-2xl pointer-events-auto">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-40" />
 <input 
 type="text"
 placeholder="Synchronizing map coordinates..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-card/80 backdrop-blur-2xl border border-border rounded-[1.25rem] pl-16 pr-8 py-5 text-xs font-bold tracking-widest text-foreground shadow-2xl focus:ring-4 ring-primary/10 transition-all outline-none"
 />
 </div>
 </div>

 {/* Tactical Floating Controls */}
 <div className="absolute right-8 bottom-32 z-10 flex flex-col gap-4">
 <button 
 onClick={getUserLocation}
 className="p-5 bg-card/80 backdrop-blur-2xl border border-border rounded-2xl text-foreground hover:text-primary shadow-2xl transition-all active:scale-95 group"
 title="Recenter Map"
 >
 <Navigation size={22} className="group-hover:rotate-12 transition-transform" />
 </button>
 <button 
 onClick={() => setIsReporting(true)}
 className="p-6 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/40 hover:scale-105 transition-all active:scale-95 group"
 title="Initialize Field Mission"
 >
 <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
 </button>
 </div>

 {/* Google Map Interface */}
 <div className="w-full h-full grayscale-[0.2] contrast-[1.1]">
 {isLoaded ? (
 <GoogleMap
 mapContainerStyle={mapContainerStyle}
 center={userLocation || defaultCenter}
 zoom={13}
 onClick={handleMapClick}
 onLoad={setMap}
 options={{
 disableDefaultUI: true,
 zoomControl: true,
 styles: [
 { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
 { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
 { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
 { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
 ]
 }}
 >
 {userLocation && (
 <Marker 
 position={userLocation}
 icon={{
 url: "https://maps.google.com/mapfiles/kml/pal3/icon48.png",
 scaledSize: new window.google.maps.Size(40, 40)
 }}
 />
 )}

 {filteredIssues.map((issue) => (
 <Marker 
 key={issue._id}
 position={{ 
 lat: issue.location.coordinates[1], 
 lng: issue.location.coordinates[0] 
 }}
 icon={getMarkerIcon(issue.priority?.level)}
 onClick={() => setSelectedIssue(issue)}
 />
 ))}

 {selectedIssue && (
 <InfoWindow
 position={{ 
 lat: selectedIssue.location.coordinates[1], 
 lng: selectedIssue.location.coordinates[0] 
 }}
 onCloseClick={() => setSelectedIssue(null)}
 >
 <div className="w-72 p-1 font-sans">
 <div className="flex justify-between items-start mb-4">
 <span className={`px-3 py-1 rounded text-[9px] font-black tracking-[0.2em] ${
 selectedIssue.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
 }`}>
 {selectedIssue.status.replace("_", " ")}
 </span>
 <span className="text-[9px] font-bold text-muted-foreground opacity-50">
 #{selectedIssue._id.slice(-6).toUpperCase()}
 </span>
 </div>

 <h4 className="text-sm font-black text-foreground leading-tight mb-3 tracking-tight">{selectedIssue.title}</h4>
 
 <div className="flex items-center gap-3 mb-5">
 <div className={`px-3 py-1 rounded text-[9px] font-black tracking-widest border ${
 selectedIssue.priority?.level?.toLowerCase() === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-200' :
 'bg-emerald-50 text-emerald-600 border-emerald-200'
 }`}>
 {selectedIssue.priority?.level}
 </div>
 <span className="text-[9px] font-bold text-muted-foreground opacity-60">
 {selectedIssue.category?.label}
 </span>
 </div>

 <Link 
 to={`/issue/${selectedIssue._id}`}
 className="bg-primary text-primary-foreground py-3 rounded-xl text-[10px] font-black tracking-[0.2em] w-full flex items-center justify-center gap-2 hover:opacity-90 transition-all"
 >
 ACCESS ANALYTICS <ChevronRight size={14} />
 </Link>
 </div>
 </InfoWindow>
 )}
 </GoogleMap>
 ) : (
 <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-muted/10">
 <Loader2 className="w-12 h-12 text-primary animate-spin" />
 <p className="text-xs font-black tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Tactical Matrix...</p>
 </div>
 )}
 </div>

 {/* Operational Status Bar */}
 <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-2xl border-t border-border px-10 py-4 z-10 flex justify-between items-center">
 <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-muted-foreground/60">
 <span className="flex items-center gap-3">
 <Activity size={16} className="text-emerald-500 animate-pulse" />
 Sector Stable
 </span>
 <span className="flex items-center gap-3">
 <Target size={16} className="text-primary" />
 {filteredIssues.length} Verified Log Entries
 </span>
 </div>
 <p className="text-[10px] font-black text-primary tracking-[0.4em] opacity-80 animate-in fade-in slide-in-from-right duration-1000">
 Autonomous Mission Grid v2.4.0
 </p>
 </div>
 </div>

 {/* Tactical Mission Report Modal */}
 {isReporting && (
 <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 backdrop-blur-md bg-background/40 animate-in fade-in duration-500">
 <div className="bg-card border border-border rounded-[3rem] w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-500">
 <div className="p-12 border-b border-border bg-muted/10 relative">
 <button 
 onClick={() => { setIsReporting(false); setNewIssueCoords(null); }}
 className="absolute right-10 top-10 p-3 rounded-2xl bg-muted hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-90 shadow-sm"
 >
 <X size={20} />
 </button>
 <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2">Initialize Mission</h2>
 <p className="text-[10px] font-bold text-muted-foreground tracking-widest opacity-60 flex items-center gap-2">
 <Target size={14} className="text-primary" /> 
 {newIssueCoords ? `Co-ords: ${newIssueCoords.lat.toFixed(6)}, ${newIssueCoords.lng.toFixed(6)}` : "Select deployment origin on grid"}
 </p>
 </div>

 <div className="p-12 space-y-8">
 <p className="text-sm font-medium text-muted-foreground leading-relaxed">
 {newIssueCoords 
 ? "Origin coordinates locked. Proceed to full verification and evidence capture portal to finalize the mission log."
 : "Please select a tactical origin point on the strategic overlay to begin the mission reporting protocol."}
 </p>
 
 <div className="flex gap-4">
 <button 
 onClick={() => { setIsReporting(false); setNewIssueCoords(null); }}
 className="flex-1 bg-transparent border border-border py-5 rounded-[1.5rem] text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95"
 >
 Abort Protocol
 </button>
 <Link 
 to={newIssueCoords ? `/report?lat=${newIssueCoords.lat}&lng=${newIssueCoords.lng}` : `/report`}
 className="flex-1 bg-primary text-primary-foreground py-5 rounded-[1.5rem] text-[10px] font-black tracking-widest text-center shadow-2xl shadow-primary/30 hover:opacity-90 transition-all active:scale-95 group flex items-center justify-center gap-3"
 >
 Proceed to Field Log <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
 </div>
 </div>
 </div>
 )}

 </div>
 </DashboardLayout>
 );
};

export default MapView;

const Loader2 = ({ className }) => (
 <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
);

