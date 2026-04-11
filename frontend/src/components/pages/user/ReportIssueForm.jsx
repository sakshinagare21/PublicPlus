import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../layout/DashboardLayout";
import { Camera, MapPin, Mic, MicOff, Target, ArrowLeft, CheckCircle2, FileText, ChevronRight, X, Navigation2, AlertTriangle } from "lucide-react";
import { detectZone } from "../../../api/zone";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";

const steps = [
    { num: 1, label: "Visual Identification", icon: Camera },
    { num: 2, label: "Geospatial Data", icon: MapPin },
    { num: 3, label: "Incident Details", icon: FileText },
];

const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "1.5rem",
};

const defaultCenter = {
    lat: 18.5204,
    lng: 73.8567,
};

const ReportIssue = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [images, setImages] = useState([]);
    const [listening, setListening] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [categories, setCategories] = useState([]);
    const [zonesData, setZonesData] = useState([]);
    const [zone, setZone] = useState("");
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        title: "",
        category: "",
        descriptionText: "",
        lat: "",
        lng: "",
    });

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);

    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issue-types`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data.types);
        } catch (err) {
            console.log("Error fetching categories");
        }
    };

    const fetchZones = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/zones`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setZonesData(res.data);
        } catch (err) {
            console.log("Error fetching zones");
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchZones();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const files = Array.from(e.target.files);
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const filteredFiles = files.filter(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            return validExtensions.includes(extension);
        });

        if (filteredFiles.length !== files.length) {
            toast.error("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
        }

        if (filteredFiles.length > 0) {
            setImages(prev => [...prev, ...filteredFiles]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const startVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return toast.error("Voice recognition not supported in this browser");

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.start();
        setListening(true);

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setForm((prev) => ({
                ...prev,
                descriptionText: prev.descriptionText + " " + text,
            }));
        };
        recognition.onend = () => setListening(false);
    };

    const getLocation = () => {
        if (!navigator.geolocation) return toast.error("Geolocation is not supported");

        toast.loading("Acquiring satellite signal...", { id: "geo" });
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const newPos = { lat, lng };
                setForm((prev) => ({ ...prev, lat, lng }));
                setMarkerPosition(newPos);
                setZone(detectZone(lat, lng, zonesData));
                map?.panTo(newPos);
                map?.setZoom(17);
                toast.success("Coordinates synchronized", { id: "geo" });
            },
            () => toast.error("Location access denied", { id: "geo" }),
            { enableHighAccuracy: true }
        );
    };




    useEffect(() => {
        if (step === 1 && isLoaded && !markerPosition) {
            getLocation();
        }
    }, [step, isLoaded, markerPosition]);

    useEffect(() => {
        if (form.lat && form.lng) {
            setZone(detectZone(form.lat, form.lng, zonesData));
        }
    }, [form.lat, form.lng, zonesData]);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!form.lat || !form.lng) return toast.error("Geospatial data missing");
        if (images.length === 0) return toast.error("Evidence Capture mandatory (Image required)");

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("category", form.category);
            formData.append("descriptionText", form.descriptionText);
            formData.append("lat", form.lat);
            formData.append("lng", form.lng);
            images.forEach((img) => formData.append("images", img));

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/issues`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Incident Report Transmitted 🚀");
            setShowPreview(false);
            setStep(0);
            setImages([]);
            setForm({ title: "", category: "", descriptionText: "", lat: "", lng: "" });
            setMarkerPosition(null);
        } catch (err) {
            if (err.response?.status === 409 && err.response?.data?.duplicateFound) {
                const { existingIssue } = err.response.data;
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-card border border-primary/50 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <AlertTriangle className="text-primary" size={20} />
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-black text-foreground">Duplicate Issue Detected</p>
                                    <p className="mt-1 text-xs text-muted-foreground font-medium line-clamp-1">
                                        "{existingIssue.title}" is already being tracked nearby.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-border">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    navigate(`/issue/${existingIssue._id}`);
                                }}
                                className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-xs font-black tracking-widest text-primary hover:bg-primary/5 transition-colors uppercase"
                            >
                                Upvote & View
                            </button>
                        </div>
                    </div>
                ), { duration: 6000 });
            } else {
                toast.error(err.response?.data?.message || "Transmission failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

                {/* PROGRESS SYSTEM */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="absolute top-[22px] left-0 w-full h-0.5 bg-border -z-0"></div>
                        {steps.map((s, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${i <= step ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-background border-border text-muted-foreground'}`}>
                                    <s.icon size={20} />
                                </div>
                                <span className={`text-[10px] font-black tracking-widest ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* INPUT STAGE */}
                <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-colors"></div>

                    {step === 0 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                                    <Camera className="text-primary" /> Evidence Capture
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium">Upload high-resolution images of the infrastructure fault for analysis.</p>
                            </div>

                            <div className="group relative border-2 border-dashed border-border rounded-3xl p-12 flex flex-col items-center justify-center hover:border-primary transition-all cursor-pointer bg-muted/20">
                                <input type="file" multiple accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <Camera className="text-primary" />
                                </div>
                                <p className="text-foreground font-black">Select Photo</p>
                                <p className="text-[10px] text-muted-foreground mt-2 tracking-widest font-black opacity-60">Drop files or click to browse</p>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                                    {images.map((img, i) => (
                                        <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-border">
                                            <img src={URL.createObjectURL(img)} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <button onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-destructive hover:bg-destructive shadow-lg text-destructive-foreground p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button onClick={() => setStep(1)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-[1.25rem] font-black tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group">
                                Digital Identification Trace <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                                    <MapPin className="text-primary" /> Location
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium">Report your current incidenct</p>
                            </div>

                            <div className="border border-border rounded-3xl overflow-hidden relative shadow-inner bg-muted/20">
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={markerPosition || defaultCenter}
                                        zoom={markerPosition ? 17 : 13}
                                        onLoad={onLoad}
                                        onUnmount={onUnmount}
                                        options={{
                                            disableDefaultUI: true,
                                            zoomControl: true,
                                            styles: [
                                                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                                {
                                                    featureType: "administrative.locality",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#d59563" }],
                                                },
                                                {
                                                    featureType: "poi",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#d59563" }],
                                                },
                                                {
                                                    featureType: "poi.park",
                                                    elementType: "geometry",
                                                    stylers: [{ color: "#263c3f" }],
                                                },
                                                {
                                                    featureType: "poi.park",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#6b9a76" }],
                                                },
                                                {
                                                    featureType: "road",
                                                    elementType: "geometry",
                                                    stylers: [{ color: "#38414e" }],
                                                },
                                                {
                                                    featureType: "road",
                                                    elementType: "geometry.stroke",
                                                    stylers: [{ color: "#212a37" }],
                                                },
                                                {
                                                    featureType: "road",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#9ca5b3" }],
                                                },
                                                {
                                                    featureType: "road.highway",
                                                    elementType: "geometry",
                                                    stylers: [{ color: "#746855" }],
                                                },
                                                {
                                                    featureType: "road.highway",
                                                    elementType: "geometry.stroke",
                                                    stylers: [{ color: "#1f2835" }],
                                                },
                                                {
                                                    featureType: "road.highway",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#f3d19c" }],
                                                },
                                                {
                                                    featureType: "transit",
                                                    elementType: "geometry",
                                                    stylers: [{ color: "#2f3948" }],
                                                },
                                                {
                                                    featureType: "transit.station",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#d59563" }],
                                                },
                                                {
                                                    featureType: "water",
                                                    elementType: "geometry",
                                                    stylers: [{ color: "#17263c" }],
                                                },
                                                {
                                                    featureType: "water",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#515c6d" }],
                                                },
                                                {
                                                    featureType: "water",
                                                    elementType: "labels.text.stroke",
                                                    stylers: [{ color: "#17263c" }],
                                                },
                                            ],
                                        }}
                                    >
                                        {markerPosition && <Marker position={markerPosition} animation={window.google.maps.Animation.DROP} />}
                                    </GoogleMap>
                                ) : (
                                    <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 text-muted-foreground font-black tracking-widest text-[10px]">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        Initializing map...
                                    </div>
                                )}

                                <button
                                    onClick={getLocation}
                                    className="absolute bottom-6 left-6 bg-card border border-border p-4 rounded-2xl shadow-2xl hover:text-primary transition-all active:scale-95 group z-10"
                                >
                                    <Target size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Latitude</label>
                                    <input readOnly name="lat" value={form.lat} placeholder="0.000000" className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/30 text-foreground font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Longitude</label>
                                    <input readOnly name="lng" value={form.lng} placeholder="0.000000" className="w-full bg-muted/20 border border-border rounded-xl px-4 py-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/30 text-foreground font-mono" />
                                </div>
                            </div>

                            <div className="bg-muted/40 border border-border rounded-2xl p-6 transition-colors shadow-sm">
                                <label className="text-[10px] font-black tracking-widest text-muted-foreground mb-2 block font-mono opacity-50">Zone</label>
                                <div className="text-foreground font-black text-lg tracking-tight transition-colors">{zone || "Awaiting Telemetry..."}</div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(0)} className="flex-1 bg-background border border-border text-muted-foreground py-5 rounded-[1.25rem] font-black tracking-widest text-[10px] flex items-center justify-center gap-2 hover:text-foreground hover:border-border transition-all active:scale-95">
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <button onClick={() => setStep(2)} disabled={!form.lat} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-[1.25rem] font-black tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed">
                                    Finalize Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                                    <FileText className="text-primary" /> Log Particulars
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium">Provide a descriptive brief and category</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Title</label>
                                    <input name="title" value={form.title} onChange={handleChange} placeholder="Brief subject (e.g. Water Leak Main St)" className="w-full bg-background border border-border rounded-xl px-4 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 text-foreground font-bold" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Category</label>
                                    <select name="category" value={form.category} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-muted-foreground font-bold appearance-none">
                                        <option value="">Select Sector</option>
                                        {categories.map((c) => <option key={c._id} value={c._id}>{c.label}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Description</label>
                                    <textarea name="descriptionText" value={form.descriptionText} onChange={handleChange} placeholder="Describe the severity and specifics..." className="w-full bg-background border border-border rounded-xl px-4 py-4 h-40 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 text-foreground font-medium leading-relaxed custom-scrollbar" />
                                    <button type="button" onClick={startVoice} className={`absolute right-4 bottom-4 p-4 rounded-full transition-all shadow-xl ${listening ? 'bg-destructive animate-pulse text-destructive-foreground shadow-destructive/20' : 'bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm'}`}>
                                        {listening ? <MicOff size={20} /> : <Mic size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 bg-background border border-border text-muted-foreground py-5 rounded-[1.25rem] font-black tracking-widest text-[10px] flex items-center justify-center gap-2 hover:text-foreground hover:border-border transition-all active:scale-95">
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <button onClick={() => setShowPreview(true)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-[1.25rem] font-black tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group">
                                    Review <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* PREVIEW MODAL - HIGH VISIBILITY */}
                {showPreview && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-background/80 animate-in fade-in duration-300">
                        <div className="bg-card border border-border rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">

                            {/* Header */}
                            <div className="p-10 border-b border-border bg-muted/30 flex items-center justify-between transition-colors">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">Final Verification</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em]">Incident Ready for Submission</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowPreview(false)} className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all active:scale-90">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">

                                {/* Meta Stats */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-muted/30 border border-border rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Target size={60} className="text-primary" />
                                        </div>
                                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-2">Category</p>
                                        <p className="text-primary font-black tracking-tight text-lg ">
                                            {categories.find(c => c._id === form.category)?.label || "Unassigned"}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-muted/30 border border-border rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <MapPin size={60} className="text-emerald-500" />
                                        </div>
                                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-2">Logistic Zone</p>
                                        <p className="text-emerald-500 font-black tracking-tight text-lg ">{zone || "Metro Sector"}</p>
                                    </div>
                                </div>

                                {/* Headline & Brief */}
                                <div className="space-y-6">
                                    <div className="px-2">
                                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-3">Title</p>
                                        <h3 className="text-3xl font-black text-foreground leading-none tracking-tight">{form.title}</h3>
                                    </div>
                                    <div className="p-8 bg-background rounded-[2rem] border border-border transition-colors relative group">
                                        <div className="absolute top-4 right-4 text-muted-foreground opacity-20"><FileText size={40} /></div>
                                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-4 block">Description</p>
                                        <div className="text-muted-foreground text-lg leading-relaxed   font-medium">
                                            "{form.descriptionText || "No additional parameters provided."}"
                                        </div>
                                    </div>
                                </div>

                                {/* Evidence Grid */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                        Proof <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[8px] font-black border border-primary/20">{images.length} ARTIFACTS</span>
                                    </p>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                        {images.map((img, i) => (
                                            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border group relative shadow-2xl">
                                                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-10 border-t border-border bg-muted/30 flex gap-6">
                                <button onClick={() => setShowPreview(false)} className="flex-1 border border-border text-muted-foreground py-5 rounded-2xl font-black tracking-widest text-[10px] hover:bg-muted hover:text-foreground transition-all active:scale-95">
                                    Check
                                </button>
                                <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-2xl font-black tracking-widest text-[10px] shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                                    {isSubmitting ? "Submitting issue..." : "Submit"}
                                    {!isSubmitting && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ReportIssue;



