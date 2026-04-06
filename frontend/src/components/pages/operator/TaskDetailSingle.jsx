import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
    Clock,
    MapPin,
    AlertTriangle,
    UploadCloud,
    CheckCircle,
    XCircle,
    Navigation2,
    Loader2,
    ArrowLeft,
    Shield,
    Zap,
    Target,
    FileText,
    Camera,
    Activity,
    ArrowRight,
    ClipboardList,
    Navigation
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";
import { detectZone } from "../../../api/zone";

const BASE_URL = "http://localhost:5000";

const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "1.5rem",
};

const TaskDetailSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    // Timer State
    const [timeLeft, setTimeLeft] = useState("");
    const [isExpired, setIsExpired] = useState(false);

    // Upload Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Location State
    const [proofLat, setProofLat] = useState("");
    const [proofLng, setProofLng] = useState("");
    const [zonesData, setZonesData] = useState([]);
    const [detectedZone, setDetectedZone] = useState(null);
    const [currentSector, setCurrentSector] = useState(null);
    const [taskDetectedZone, setTaskDetectedZone] = useState("");
    const [isLocating, setIsLocating] = useState(false);

    // Google Maps State
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["routes", "geometry"],
    });

    const [routePath, setRoutePath] = useState(null);
    const [operatorLocation, setOperatorLocation] = useState(null);
    const [routeInfo, setRouteInfo] = useState({ distance: "", duration: "" });
    const [map, setMap] = useState(null);

    // Escalation State
    const [showEscalateModal, setShowEscalateModal] = useState(false);
    const [escalationReason, setEscalationReason] = useState("");
    const [escalationFile, setEscalationFile] = useState(null);
    const [isEscalating, setIsEscalating] = useState(false);

    /* ================= FETCH ISSUE BY ID ================= */
    const fetchTask = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${BASE_URL}/api/issues/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const issue = res.data;

            const formatted = {
                id: issue._id,
                title: issue.title,
                description: issue.description?.text || "No descriptive brief available.",
                location: issue.fullAddress || (issue.location?.coordinates ? `${issue.location.coordinates[1]}, ${issue.location.coordinates[0]}` : "Geo-coordinates pending"),
                lat: issue.location?.coordinates[1],
                lng: issue.location?.coordinates[0],
                status: issue.status,
                priority: issue.priority?.level || "Medium",
                deadline: issue.sla?.resolutionDeadline || null,
                department: issue.assignedDepartment?.departmentName || "General Logistics",
                assignedDate: issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A",
                rejectionProof: issue.resolution?.rejectionProof || null,
                zone: issue.zone || "N/A",
                images: issue.images || [],
            };

            setTask(formatted);
            console.log("Telemetry Data Synchronized:", formatted);
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Telemetry link failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    /* ================= FETCH ZONES ================= */
    const fetchZones = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/zones`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setZonesData(res.data);
        } catch (err) {
            console.error("Zone Fetch Error:", err);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    /* ================= ZONE DETECTION ================= */
    useEffect(() => {
        if (proofLat || proofLng) {
            const zoneName = detectZone(proofLat, proofLng, zonesData);
            setDetectedZone(zoneName);
        } else {
            setDetectedZone(null);
        }
    }, [proofLat, proofLng, zonesData]);

    useEffect(() => {
        if (operatorLocation && zonesData.length > 0) {
            const sector = detectZone(operatorLocation.lat, operatorLocation.lng, zonesData);
            setCurrentSector(sector);
        }
    }, [operatorLocation, zonesData]);

    useEffect(() => {
        if (task && task.lat && task.lng && zonesData.length > 0) {
            setTaskDetectedZone(detectZone(task.lat, task.lng, zonesData));
        }
    }, [task, zonesData]);

    /* ================= NAVIGATION LOGIC ================= */
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setOperatorLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                },
                () => console.log("Operator location denied")
            );
        }
    }, []);

    // Modern Routes API Logic
    useEffect(() => {
        if (isLoaded && operatorLocation && task?.lat && task?.lng) {
            const fetchRoute = async () => {
                try {
                    // Initialize the Routes library
                    const { Route } = await window.google.maps.importLibrary("routes");

                    const originLatLng = new window.google.maps.LatLng(Number(operatorLocation.lat), Number(operatorLocation.lng));
                    const destinationLatLng = new window.google.maps.LatLng(Number(task.lat), Number(task.lng));

                    const request = {
                        origin: { location: originLatLng },
                        destination: { location: destinationLatLng },
                        travelMode: "DRIVING",
                        routingPreference: "TRAFFIC_AWARE",
                        // Using wildcard for fields to return all metadata including polyline
                        fields: ["*"]
                    };

                    const { routes } = await Route.computeRoutes(request);

                    if (routes && routes.length > 0) {
                        const route = routes[0];

                        // Set distance and duration with defensive parsing
                        const distKm = route.distanceMeters ? (route.distanceMeters / 1000).toFixed(1) : "0.0";
                        const durRaw = route.duration || route.localizedValues?.duration?.text || "0s";
                        const durMin = typeof durRaw === "string"
                            ? Math.round(parseInt(durRaw.replace("s", "")) / 60)
                            : (typeof durRaw === "number" ? Math.round(durRaw / 60) : 0);

                        setRouteInfo({
                            distance: `${distKm} km`,
                            duration: `${durMin} min`
                        });

                        // Decode the encoded polyline
                        if (route.polyline?.encodedPolyline) {
                            const decodedPath = window.google.maps.geometry.encoding.decodePath(
                                route.polyline.encodedPolyline
                            );
                            setRoutePath(decodedPath);
                        }
                    }
                } catch (error) {
                    console.error("Routes API Error:", error);
                }
            };
            fetchRoute();
        }
    }, [isLoaded, operatorLocation, task]);

    const startExternalNavigation = () => {
        if (!task?.lat || !task?.lng) return;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}&travelmode=driving`;
        window.open(url, "_blank");
    };

    /* ================= LIVE TIMER ================= */
    useEffect(() => {
        if (!task || !task.deadline) return;

        const calculateTimeLeft = () => {
            const statuses = ["pending_verification", "resolved", "escalated", "closed"];
            if (statuses.includes(task.status)) {
                setTimeLeft("Protocol Suspended");
                setIsExpired(false);
                return;
            }

            const now = new Date();
            const deadlineDate = new Date(task.deadline);
            const difference = deadlineDate - now;

            if (difference <= 0) {
                setIsExpired(true);
                setTimeLeft("SLA BREACHED");
            } else {
                const hours = Math.floor((difference / (1000 * 60 * 60)));
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                setIsExpired(false);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [task]);

    const handleAutoDetect = () => {
        if (!navigator.geolocation) {
            toast.error("GPS terminal not accessible");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setProofLat(pos.coords.latitude.toFixed(6));
                setProofLng(pos.coords.longitude.toFixed(6));
                setIsLocating(false);
                toast.success("Geo-coordinates locked");
            },
            () => {
                setIsLocating(false);
                toast.error("Auto-sync failed. Manual entry required.");
            }
        );
    };

    const handleUploadProof = async (e) => {
        e.preventDefault();
        if (!proofFile || !proofLat || !proofLng) {
            toast.error("Incomplete resolution bundle");
            return;
        }

        const validExtensions = ['jpg', 'jpeg', 'png'];
        const extension = proofFile.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(extension)) {
            toast.error("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
            return;
        }

        const isMatched = detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase();
        if (!isMatched) {
            toast.error(`Sector mismatch: Deployment in ${detectedZone || "Unknown"} denied.`);
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("proof", proofFile);
        formData.append("lat", proofLat);
        formData.append("lng", proofLng);

        try {
            await axios.post(`${BASE_URL}/api/issues/${id}/upload-proof`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Mission success uploaded");
            setShowUploadModal(false);
            fetchTask();
        } catch (error) {
            toast.error("Transmission failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleEscalate = async (e) => {
        e.preventDefault();
        if (!escalationReason.trim() || !proofLat || !proofLng) {
            toast.error("Escalation rationale and Geo-Lock required");
            return;
        }

        const isMatched = detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase();
        if (!isMatched) {
            toast.error(`Sector mismatch: Escalation in ${detectedZone || "Unknown"} denied.`);
            return;
        }

        if (escalationFile) {
            const validExtensions = ['jpg', 'jpeg', 'png'];
            const extension = escalationFile.name.split('.').pop().toLowerCase();
            if (!validExtensions.includes(extension)) {
                toast.error("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
                return;
            }
        }

        setIsEscalating(true);
        const formData = new FormData();
        formData.append("reason", escalationReason);
        if (escalationFile) formData.append("proof", escalationFile);

        try {
            await axios.post(`${BASE_URL}/api/issues/${id}/escalate`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Directive escalated to command");
            setShowEscalateModal(false);
            fetchTask();
        } catch (err) {
            toast.error("Escalation failed");
        } finally {
            setIsEscalating(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const configs = {
            reported: { label: "REPORTED", bg: "bg-muted", text: "text-muted-foreground" },
            assigned: { label: "ASSIGNED", bg: "bg-blue-500/10", text: "text-blue-500" },
            in_progress: { label: "IN PROGRESS", bg: "bg-amber-500/10", text: "text-amber-500" },
            pending_verification: { label: "PENDING SYNC", bg: "bg-purple-500/10", text: "text-purple-500" },
            resolved: { label: "RESOLVED", bg: "bg-emerald-500/10", text: "text-emerald-500" },
            reopened: { label: "REOPENED", bg: "bg-rose-500/10", text: "text-rose-500" },
        };
        const config = configs[status] || { label: status, bg: "bg-muted", text: "text-muted-foreground" };
        return (
            <span className={`${config.bg} ${config.text} border border-current/20 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <OperatorLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing Mission Intel...</p>
                </div>
            </OperatorLayout>
        );
    }

    if (!task) {
        return (
            <OperatorLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center shadow-glow border border-rose-500/20">
                        <AlertTriangle size={40} className="text-rose-500" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-foreground">Mission Archive Not Found</h2>
                        <p className="text-sm text-muted-foreground font-medium opacity-60 uppercase tracking-widest">Target ID: {id} | Telemetry Link Failed</p>
                    </div>
                </div>
            </OperatorLayout>
        );
    }

    return (
        <OperatorLayout>
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 pb-20" style={{ fontFamily: "Calibri, sans-serif" }}>

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-6">
                    <div className="space-y-4">
                        <Link to="/operator/tasks" className="flex items-center gap-2 text-xs font-bold text-primary hover:text-foreground transition-all">
                            <ArrowLeft size={16} /> RETURN TO LOGISTICS GRID
                        </Link>
                        <h1 className="text-4xl font-semibold text-foreground tracking-tight ">
                            Mission Directive
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="bg-muted px-3 py-1 rounded-lg text-xs font-bold text-muted-foreground">ID: #{task?.id?.slice(-8).toUpperCase()}</span>
                            <span className="text-muted-foreground text-sm font-medium opacity-60">| {task?.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-3">
                            <Shield size={16} className="text-primary" />
                            <span className="text-[10px] font-bold text-primary tracking-widest leading-none">Tac-Link Established</span>
                        </div>
                    </div>
                </div>

                {/* TOP KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                    <div className={`col-span-1 md:col-span-2 p-8 rounded-2xl border flex flex-col justify-center gap-2 ${isExpired ? 'bg-rose-500/10 border-rose-500/20' : 'bg-primary/5 border-primary/10 shadow-sm'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest">SLA Time Objective</p>
                            <Clock size={16} className={isExpired ? 'text-rose-500' : 'text-primary'} />
                        </div>
                        <h2 className={`text-5xl font-bold tracking-tighter ${isExpired ? 'text-rose-500' : 'text-primary'}`}>{timeLeft}</h2>
                    </div>

                    <div className="bg-card border rounded-2xl p-7 flex flex-col justify-center min-h-[140px] shadow-sm">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest mb-2 opacity-60 uppercase">Department Control</p>
                        <h3 className="text-xl font-bold text-foreground break-words leading-tight">{task.department}</h3>
                    </div>

                    <div className="bg-card border rounded-2xl p-7 flex flex-col justify-center min-h-[140px] shadow-sm">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest mb-2 opacity-60 uppercase">Mission Sector</p>
                        <h3 className="text-xl font-bold text-emerald-500 break-words leading-tight">{task.zone}</h3>
                    </div>

                    <div className="bg-card border rounded-2xl p-7 flex flex-col justify-center min-h-[140px] shadow-sm">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest mb-2 opacity-60 uppercase">Operator Locale</p>
                        <h3 className={`text-xl font-bold break-words leading-tight ${currentSector === task.zone ? 'text-emerald-500' : 'text-foreground opacity-60'}`}>
                            {currentSector || "Locking Locale..."}
                        </h3>
                    </div>

                    <div className="bg-card border rounded-2xl p-7 flex flex-col justify-center min-h-[140px] shadow-sm">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest mb-2 opacity-60 uppercase">Assignment Log</p>
                        <h3 className="text-xl font-bold text-foreground break-words leading-tight">{task.assignedDate}</h3>
                    </div>
                </div>

                {/* CORE MISSION DETAILS & TACTICAL MAP */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Intal */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-card border rounded-2xl p-10 space-y-10 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground tracking-widest opacity-40">Field Summary</p>
                                    <h2 className="text-2xl font-semibold ">{task.title}</h2>
                                </div>
                                <div className="flex gap-3">
                                    <StatusBadge status={task.status} />
                                    <span className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest">
                                        {task.priority} Priority
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                                        <FileText size={14} className="text-primary" />
                                        Title
                                    </h4>
                                    <div className="bg-muted/30 p-6 rounded-2xl border text-sm font-medium text-foreground/80 leading-relaxed  ">
                                        "{task.title}"
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                                        <MapPin size={14} className="text-primary" />
                                        Location
                                    </h4>
                                    <div className="bg-muted/30 p-6 rounded-2xl border text-sm font-medium text-foreground/80 leading-relaxed   relative">
                                        "{task.location}"
                                        {taskDetectedZone && (
                                            <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-primary bg-primary/5 border border-primary/20 w-fit px-3 py-1.5 rounded-lg not- ">
                                                <Target size={12} className="opacity-60" /> Verified Zone: {taskDetectedZone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                                    <ClipboardList size={14} className="text-primary" />
                                    Mission Briefing
                                </h4>
                                <div className="bg-muted/30 p-8 rounded-2xl border text-sm font-medium text-foreground/80 leading-relaxed">
                                    "{task.description}"
                                </div>
                            </div>

                            {task.images && task.images.length > 0 && (
                                <div className="space-y-3 pt-4">
                                    <h4 className="text-[10px] font-black text-primary tracking-widest flex items-center gap-2 uppercase">
                                        <Camera size={14} className="text-primary" />
                                        Issue Image
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {task.images.map((img, i) => (
                                            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border group relative transition-all hover:border-primary/50">
                                                <img
                                                    src={img.url ? (img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url.startsWith('/') ? '' : '/'}${img.url}`) : '/placeholder-image.png'}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt={`Evidence ${i}`}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found'; }}
                                                />
                                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tactical Map Section */}
                        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b flex justify-between items-center bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <Activity size={18} className="text-primary animate-pulse" />
                                    <h3 className="text-xs font-bold tracking-[0.2em]">Real-time Deployment Grid</h3>
                                </div>
                                {routeInfo.distance && (
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-bold text-muted-foreground ">Distance</span>
                                            <span className="text-xs font-bold text-foreground">{routeInfo.distance}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-bold text-muted-foreground ">Estimated Time</span>
                                            <span className="text-xs font-bold text-primary">{routeInfo.duration}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative h-[400px] w-full bg-muted">
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        center={operatorLocation || { lat: task.lat, lng: task.lng }}
                                        zoom={15}
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
                                        {routePath && (
                                            <Polyline
                                                path={routePath}
                                                options={{
                                                    strokeColor: "#3b82f6",
                                                    strokeOpacity: 1,
                                                    strokeWeight: 5,
                                                }}
                                            />
                                        )}
                                        {operatorLocation && <Marker position={operatorLocation} label="YOU" />}
                                        {task.lat && <Marker position={{ lat: task.lat, lng: task.lng }} label="TARGET" />}
                                    </GoogleMap>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                        <Loader2 className="animate-spin" />
                                        <span className="text-[10px] font-bold tracking-widest">Initializing Tactical Link...</span>
                                    </div>
                                )}

                                <button
                                    onClick={startExternalNavigation}
                                    className="absolute bottom-6 right-6 bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs tracking-widest hover:scale-105 transition-all active:scale-95 z-10"
                                >
                                    <Navigation size={18} />
                                    Start Navigation
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Evidence & Actions */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Rejection / Protocol Violation Banner */}
                        {task.status === "reopened" && task.rejectionProof && (
                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8 space-y-6 animate-pulse">
                                <h4 className="text-rose-500 font-bold text-sm tracking-widest flex items-center gap-2">
                                    <AlertTriangle size={20} /> Protocol Counter-Verification
                                </h4>
                                <div className="rounded-xl overflow-hidden border border-rose-500/20 shadow-xl">
                                    <img
                                        src={task.rejectionProof.startsWith('http') ? task.rejectionProof : `${BASE_URL}${task.rejectionProof.startsWith('/') ? '' : '/'}${task.rejectionProof}`}
                                        alt="Evidence"
                                        className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Rejection+Proof+Not+Found'; }}
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-rose-500/80 tracking-widest text-center">Citizen has rejected previous resolution. Sector revisit required.</p>
                            </div>
                        )}

                        {/* Action Hub */}
                        <div className="bg-card border rounded-2xl p-10 space-y-6 shadow-sm">
                            <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest mb-4">Command Center Actions</h3>

                            {["assigned", "in_progress", "reopened"].includes(task.status) ? (
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                                    >
                                        <CheckCircle size={20} />
                                        Certify Resolution
                                    </button>
                                    <button
                                        onClick={() => setShowEscalateModal(true)}
                                        className="w-full bg-muted border hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 text-muted-foreground py-5 rounded-2xl font-bold text-xs tracking-widest flex items-center justify-center gap-3 transition-all"
                                    >
                                        <AlertTriangle size={20} />
                                        Escalate Directive
                                    </button>
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-muted/30 rounded-2xl border border-dashed flex flex-col items-center gap-4">
                                    {task.status === "resolved" ? (
                                        <><CheckCircle size={32} className="text-emerald-500" /><p className="text-xs font-bold text-emerald-500 tracking-widest">Protocol Success</p></>
                                    ) : task.status === "pending_verification" ? (
                                        <><Clock size={32} className="text-primary animate-pulse" /><p className="text-xs font-bold text-primary tracking-widest">Awaiting Verification</p></>
                                    ) : (
                                        <><XCircle size={32} className="text-muted-foreground" /><p className="text-xs font-bold text-muted-foreground tracking-widest">Logic Locked</p></>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* UPLOAD MODAL */}
                {showUploadModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}></div>
                        <div className="bg-card w-full max-w-[600px] rounded-[2rem] border shadow-2xl relative z-10 animate-in zoom-in-95 duration-500 overflow-hidden">
                            <div className="p-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-semibold">Field Verification</h2>
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest mt-1">Upload final resolution evidence bundle</p>
                                    </div>
                                    <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-muted rounded-full transition-all">
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleUploadProof} className="space-y-6">
                                    <div className="bg-muted/30 p-6 rounded-2xl border space-y-5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground">Geo-Spatial Synchronization</p>
                                                <p className="text-[9px] font-mono text-muted-foreground/60">Required: {task?.zone}</p>
                                            </div>
                                            <button type="button" onClick={handleAutoDetect} className="text-[10px] font-bold text-primary flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 active:scale-95 transition-all">
                                                <Navigation2 size={12} /> SCAN LOCALE
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={proofLat} onChange={e => setProofLat(e.target.value)} placeholder="0.000000" className="w-full bg-background border px-4 py-3 rounded-xl text-xs font-mono font-bold outline-none border-primary/20" />
                                            <input value={proofLng} onChange={e => setProofLng(e.target.value)} placeholder="0.000000" className="w-full bg-background border px-4 py-3 rounded-xl text-xs font-mono font-bold outline-none border-primary/20" />
                                        </div>
                                        <div className="bg-muted/10 p-4 rounded-xl border border-dashed border-primary/20">
                                            {!proofLat || !proofLng ? (
                                                <div className="flex flex-col items-center justify-center py-2 gap-2 opacity-40">
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <p className="text-[10px] font-bold tracking-[0.2em]">AWAITING GEO-LOCK...</p>
                                                </div>
                                            ) : (
                                                <div className={`flex items-center justify-between animate-in zoom-in-95 duration-300 ${detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase() ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <Shield size={16} className={detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase() ? 'animate-pulse' : ''} />
                                                        <div className="flex flex-col">
                                                            <p className="text-[10px] font-bold tracking-widest leading-none">Sector Identified</p>
                                                            <p className="text-xs font-black tracking-tight">{detectedZone || "Analyzing..."}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-current/10 px-3 py-1.5 rounded-lg border border-current/20 text-[10px] font-bold tracking-[0.1em]">
                                                        {detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase() ? "PROTOCOL VERIFIED" : "SECTOR MISMATCH"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-2 border-dashed rounded-2xl p-10 text-center hover:bg-muted/30 transition-all cursor-pointer relative group">
                                        <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={e => setProofFile(e.target.files[0])} className="hidden" id="modal-proof" />
                                        <label htmlFor="modal-proof" className="cursor-pointer flex flex-col items-center gap-4">
                                            <Camera size={40} className={`transition-all ${proofFile ? 'text-primary' : 'text-muted-foreground opacity-30'}`} />
                                            <p className="text-[10px] font-bold tracking-widest truncate max-w-[300px]">
                                                {proofFile ? proofFile.name : "Initialize Visual Scan"}
                                            </p>
                                        </label>
                                    </div>

                                    <button disabled={isUploading} className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xs tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                        {isUploading ? <><Loader2 className="animate-spin" /> Transmitting...</> : <><UploadCloud size={20} /> Upload Proof Bundle</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* ESCALATE MODAL */}
                {showEscalateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEscalateModal(false)}></div>
                        <div className="bg-card w-full max-w-[600px] rounded-[2rem] border shadow-2xl relative z-10 animate-in zoom-in-95 duration-500 overflow-hidden">
                            <div className="p-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-semibold text-rose-500">Escalate Mission</h2>
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest mt-1">Alert command center of critical field blocks</p>
                                    </div>
                                    <button onClick={() => setShowEscalateModal(false)} className="p-2 hover:bg-muted rounded-full transition-all">
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleEscalate} className="space-y-6">
                                    <div className="bg-rose-500/5 p-6 rounded-2xl border border-rose-500/20 space-y-5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-bold tracking-widest text-rose-500/60">Escalation Locale Sync</p>
                                                <p className="text-[9px] font-mono text-rose-500/40">Target Sector: {task?.zone}</p>
                                            </div>
                                            <button type="button" onClick={handleAutoDetect} className="text-[10px] font-bold text-rose-500 flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 active:scale-95 transition-all">
                                                <Navigation2 size={12} /> SCAN LOCALE
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={proofLat} onChange={e => setProofLat(e.target.value)} placeholder="0.000000" className="w-full bg-background border px-4 py-3 rounded-xl text-xs font-mono font-bold outline-none border-rose-500/20 text-rose-500" />
                                            <input value={proofLng} onChange={e => setProofLng(e.target.value)} placeholder="0.000000" className="w-full bg-background border px-4 py-3 rounded-xl text-xs font-mono font-bold outline-none border-rose-500/20 text-rose-500" />
                                        </div>
                                        <div className="bg-rose-500/5 p-4 rounded-xl border border-dashed border-rose-500/20">
                                            {!proofLat || !proofLng ? (
                                                <div className="flex flex-col items-center justify-center py-2 gap-2 opacity-40 text-rose-500">
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <p className="text-[10px] font-bold tracking-[0.2em]">AWAITING GEO-LOCK...</p>
                                                </div>
                                            ) : (
                                                <div className={`flex items-center justify-between animate-in zoom-in-95 duration-300 ${detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase() ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <Shield size={16} className={detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase() ? 'animate-pulse' : ''} />
                                                        <div className="flex flex-col">
                                                            <p className="text-[10px] font-bold tracking-widest leading-none">Sector Identified</p>
                                                            <p className="text-xs font-black tracking-tight">{detectedZone || "Analyzing..."}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-current/10 px-3 py-1.5 rounded-lg border border-current/20 text-[10px] font-bold tracking-[0.1em]">
                                                        {detectedZone?.trim().toLowerCase() === task?.zone?.trim().toLowerCase() ? "PROTOCOL VERIFIED" : "SECTOR MISMATCH"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Escalation Rationale</p>
                                        <textarea
                                            value={escalationReason}
                                            onChange={e => setEscalationReason(e.target.value)}
                                            placeholder="Provide precise details of operational blockade..."
                                            className="w-full bg-muted/30 border p-6 rounded-2xl min-h-[150px] text-sm font-medium outline-none focus:border-rose-500/50 resize-none"
                                        />
                                    </div>

                                    <div className="border border-dashed rounded-xl p-6 text-center hover:bg-muted/30 transition-all cursor-pointer relative group">
                                        <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={e => setEscalationFile(e.target.files[0])} className="hidden" id="esc-proof" />
                                        <label htmlFor="esc-proof" className="cursor-pointer flex flex-col items-center gap-2 font-bold text-muted-foreground/60 text-[10px] tracking-widest">
                                            {escalationFile ? escalationFile.name : "Optional Detail Capture"}
                                        </label>
                                    </div>

                                    <button disabled={isEscalating} className="w-full bg-rose-500 text-white py-5 rounded-2xl font-bold text-xs tracking-widest shadow-xl shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                        {isEscalating ? <><Loader2 className="animate-spin" /> Transmission Active...</> : <><AlertTriangle size={20} /> Signal Command Hub</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </OperatorLayout>
    );
};

export default TaskDetailSingle;
