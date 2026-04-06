import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
    MapPin, Eye, Settings, Plus, Search, Filter,
    Trash2, Edit, AlertTriangle, ShieldCheck,
    Activity, X, ChevronRight, BarChart
} from "lucide-react";
import {
    MapContainer, TileLayer, Marker, Popup, useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";

// Leaflet fix for marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom markers for priorities
const createIcon = (color) => {
    return new L.DivIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const highIcon = createIcon("#ef4444"); // Red
const mediumIcon = createIcon("#f59e0b"); // Yellow
const lowIcon = createIcon("#22c55e"); // Green

export default function ZoneMapping() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({ status: "", priority: "" });
    const [selectedZone, setSelectedZone] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        zoneId: "",
        areaName: "",
        lat: 18.5204, // Default Pune
        lng: 73.8567,
        status: "active",
        priority: "low",
        incidentCount: 0
    });

    // Handle data fetching
    useEffect(() => {
        fetchZones();
        // Real-time polling mock
        const interval = setInterval(() => {
            setZones(prev => prev.map(z => ({
                ...z,
                incidentCount: z.status === "active" ? z.incidentCount + (Math.random() > 0.8 ? 1 : 0) : z.incidentCount
            })));
        }, 10000);
        return () => clearInterval(interval);
    }, [filter]);

    const fetchZones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const query = new URLSearchParams({
                ...filter,
                search
            }).toString();

            const res = await fetch(`http://localhost:5000/api/zones?${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setZones(data);
            }
        } catch (error) {
            toast.error("Failed to sync zones");
        } finally {
            setLoading(false);
        }
    };

    // Map Click Component
    function MapEvents() {
        useMapEvents({
            click(e) {
                if (isAdding || isEditing) {
                    setFormData(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
                    toast.success("Location updated on cursor");
                }
            },
        });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const url = isEditing
            ? `http://localhost:5000/api/zones/${formData._id}`
            : "http://localhost:5000/api/zones";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setIsAdding(false);
                setIsEditing(false);
                fetchZones();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Network error during sync");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this zone protocol?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/zones/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Zone purged from grid");
                fetchZones();
            }
        } catch (error) {
            toast.error("Purge failed");
        }
    };

    const startEdit = (zone) => {
        setFormData({ ...zone, lat: zone.coordinates.lat, lng: zone.coordinates.lng });
        setIsEditing(true);
        setIsAdding(false);
    };

    const startAdd = () => {
        setFormData({
            zoneId: `Z-${Math.floor(Math.random() * 9000) + 1000}`,
            areaName: "",
            lat: 18.5204,
            lng: 73.8567,
            status: "active",
            priority: "low",
            incidentCount: 0
        });
        setIsAdding(true);
        setIsEditing(false);
    };

    return (
        <AdminLayout>
            <div className="flex h-[calc(100vh-120px)] bg-background border border-border rounded-3xl overflow-hidden shadow-2xl transition-colors">

                {/* LEFT: MAP PANEL (60%) */}
                <div className="flex-[3] relative border-r border-border min-h-[500px]">
                    <div className="absolute top-6 left-6 z-[1000] flex gap-3">
                        <div className="bg-card/80 backdrop-blur-md border border-border p-2 rounded-2xl shadow-2xl">
                            <div className="flex items-center gap-4 px-3 py-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-foreground/60 tracking-widest">Critical</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-[10px] font-black text-foreground/60 tracking-widest">Warning</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-[10px] font-black text-foreground/60 tracking-widest">Safe</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <MapContainer
                        center={[18.5204, 73.8567]}
                        zoom={13}
                        className="h-full w-full"
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        // For a darker/premium lookup, use:
                        // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapEvents />
                        {zones.map((zone) => (
                            <Marker
                                key={zone._id}
                                position={[zone.coordinates.lat, zone.coordinates.lng]}
                                icon={zone.priority === "high" ? highIcon : zone.priority === "medium" ? mediumIcon : lowIcon}
                            >
                                <Popup className="premium-popup">
                                    <div className="p-2 space-y-2 min-w-[200px]">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{zone.areaName}</h3>
                                            <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">{zone.zoneId}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="bg-muted px-3 py-2 rounded-xl">
                                                <p className="text-[9px] font-black text-muted-foreground">Status</p>
                                                <p className="text-xs font-bold capitalize">{zone.status}</p>
                                            </div>
                                            <div className="bg-muted px-3 py-2 rounded-xl">
                                                <p className="text-[9px] font-black text-muted-foreground">Priority</p>
                                                <p className={`text-xs font-bold capitalize ${zone.priority === 'high' ? 'text-red-500' : zone.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>{zone.priority}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-border/10">
                                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Activity size={12} /> {zone.incidentCount} Alerts</span>
                                            <button
                                                onClick={() => startEdit(zone)}
                                                className="text-primary hover:underline text-xs font-bold transition-all"
                                            >
                                                Manage Grid
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Visual Indicator for adding new zone */}
                        {(isAdding || isEditing) && (
                            <Marker position={[formData.lat, formData.lng]} opacity={0.5} />
                        )}
                    </MapContainer>
                </div>

                {/* RIGHT: DATA & CONTROL PANEL (40%) */}
                <div className="flex-[2] flex flex-col bg-card/50 backdrop-blur-3xl transition-colors">

                    {/* Controls Header */}
                    <div className="p-8 border-b border-border space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">Zone Control Cabinet</h2>
                                <p className="text-xs text-muted-foreground font-medium opacity-60 tracking-[0.2em] mt-1">Geospatial Grid Monitoring</p>
                            </div>
                            <button
                                onClick={isAdding || isEditing ? () => { setIsAdding(false); setIsEditing(false); } : startAdd}
                                className={`p-3 rounded-2xl transition-all shadow-glow ${isAdding || isEditing ? 'bg-muted text-foreground' : 'bg-primary text-white shadow-primary/20 hover:scale-105'}`}
                            >
                                {isAdding || isEditing ? <X size={20} /> : <Plus size={20} />}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" />
                                <input
                                    type="text"
                                    placeholder="ID or Area..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchZones()}
                                    className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                            <button
                                onClick={fetchZones}
                                className="p-3 bg-muted/50 border border-border rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                            >
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Form Overlay or Table */}
                    <div className="flex-1 overflow-y-auto relative p-0">
                        {(isAdding || isEditing) ? (
                            <div className="p-8 animate-in slide-in-from-right-4 duration-500">
                                <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary"><Edit size={16} /></div>
                                    {isEditing ? "Calibrate Infrastructure Zone" : "Initialize New Sector"}
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-muted-foreground/60 ml-2">Area Identity</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Koregaon Park"
                                            value={formData.areaName}
                                            onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                                            className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-4 text-sm font-bold text-foreground focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-muted-foreground/60 ml-2">Latitude</label>
                                            <input disabled value={formData.lat.toFixed(6)} className="w-full bg-muted/10 border border-border rounded-xl px-4 py-3 text-xs font-mono text-muted-foreground opacity-50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-muted-foreground/60 ml-2">Longitude</label>
                                            <input disabled value={formData.lng.toFixed(6)} className="w-full bg-muted/10 border border-border rounded-xl px-4 py-3 text-xs font-mono text-muted-foreground opacity-50" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black tracking-widest text-muted-foreground/60 ml-2">Alert Priority</label>
                                            <div className="flex gap-2">
                                                {['low', 'medium', 'high'].map(p => (
                                                    <button
                                                        key={p} type="button"
                                                        onClick={() => setFormData({ ...formData, priority: p })}
                                                        className={`flex-1 p-3 rounded-xl border text-[10px] font-black transition-all ${formData.priority === p ? 'bg-primary border-primary text-white shadow-glow' : 'bg-muted/50 border-border text-muted-foreground'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black tracking-widest text-muted-foreground/60 ml-2">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none"
                                            >
                                                <option value="active">Active</option>
                                                <option value="monitoring">Monitoring</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-border/50">
                                        <button className="w-full bg-primary text-white font-bold py-5 rounded-2xl shadow-glow shadow-primary/30 hover:scale-[1.01] active:scale-[0.98] transition-all">
                                            {isEditing ? "Apply Global Recalibration" : "Finalize Infrastructure Link"}
                                        </button>
                                        <p className="text-[9px] font-black text-center tracking-[0.3em] text-muted-foreground mt-4 opacity-40 italic">Click on the map to recalibrate geo-anchor</p>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {zones.length === 0 && !loading && (
                                    <div className="p-20 text-center opacity-40">
                                        <MapPin className="mx-auto mb-4" size={48} />
                                        <p className="text-sm font-black tracking-widest">No Sector Data Found</p>
                                    </div>
                                )}
                                {zones.map((zone) => (
                                    <div key={zone._id} className="group p-6 hover:bg-muted/30 transition-all cursor-pointer relative overflow-hidden">
                                        <div className="flex justify-between items-start relative z-10">
                                            <div onClick={() => startEdit(zone)} className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`w-2 h-2 rounded-full ${zone.priority === 'high' ? 'bg-red-500 shadow-glow-destructive' : zone.priority === 'medium' ? 'bg-yellow-500 shadow-glow-warning' : 'bg-green-500 shadow-glow-success'}`}></span>
                                                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{zone.areaName}</h4>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-muted-foreground/40 italic">
                                                    <span>{zone.zoneId}</span>
                                                    <span className="flex items-center gap-1">• <Activity size={10} /> {zone.incidentCount} Alerts</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleDelete(zone._id)} className="p-3 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white">
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="p-3 rounded-xl bg-muted/50 text-muted-foreground">
                                                    <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Analytics Pulse Footer */}
                    {!isAdding && !isEditing && (
                        <div className="p-8 bg-muted/30 border-t border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><ShieldCheck size={16} /></div>
                                    <div className="text-[10px] font-black tracking-widest text-muted-foreground/60">
                                        Infrastructure <br /> Resilience
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-foreground tabular-nums">98%</p>
                                    <p className="text-[9px] font-black text-green-500 tracking-tighter">Operational</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
 .premium-popup .leaflet-popup-content-wrapper {
 background-color: var(--card);
 color: var(--foreground);
 border-radius: 1.5rem;
 padding: 8px;
 border: 1px solid var(--border);
 box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
 }
 .premium-popup .leaflet-popup-tip {
 background-color: var(--card);
 border: 1px solid var(--border);
 }
 @keyframes pulse {
 0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
 70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
 }
 `}</style>
        </AdminLayout>
    );
}

