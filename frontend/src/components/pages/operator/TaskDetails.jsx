import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
    Clock,
    AlertTriangle,
    Upload,
    CheckCircle,
} from "lucide-react";

const TaskDetails = () => {
    const { id } = useParams();

    // ===== Mock Task Data =====
    const task = {
        id,
        title: "Street Light Repair - Main St. NW",
        description:
            "Main street light #42 has been reported flickering and failing after dark. Inspect wiring harness and replace LED module if necessary.",
        priority: "High",
        status: "In Progress",
    };

    // ===== SLA Countdown (1 hour demo) =====
    const [timeLeft, setTimeLeft] = useState(3600);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    // ===== Upload State =====
    const [remarks, setRemarks] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const previewURL = URL.createObjectURL(selectedFile);
            setPreview(previewURL);
        }
    };

    const handleSubmit = () => {
        if (!file) {
            alert("Please upload proof before submitting.");
            return;
        }

        // Simulate upload
        console.log("Submitting Task:", {
            remarks,
            file,
        });

        alert("Task Submitted Successfully!");
    };

    return (
        <OperatorLayout>
            <div className="space-y-8">

                {/* ===== SLA WARNING BAR ===== */}
                <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-3xl flex justify-between items-center shadow-glow-destructive/10 transition-colors">
                    <div className="flex items-center gap-3 text-destructive font-black text-[10px] tracking-[0.2em]">
                        <AlertTriangle size={22} className="shadow-glow-destructive" />
                        SLA DEPLETION CRITICAL
                    </div>
                    <div className="text-destructive font-black text-2xl tracking-tighter shadow-glow-destructive font-mono">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* ===== TITLE ===== */}
                <div className="transition-colors">
                    <h1 className="text-4xl font-black text-foreground tracking-tighter transition-colors">
                        {task.title}
                    </h1>
                    <div className="flex gap-6 mt-3 transition-colors">
                        <span className="text-destructive text-[10px] font-black tracking-widest flex items-center gap-2 opacity-80">
                            <AlertTriangle size={16} />
                            {task.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest shadow-glow">
                            {task.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* ===== MAIN GRID ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT: DETAILS */}
                    <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-8 shadow-2xl transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] transition-colors"></div>
                        <h3 className="text-[10px] font-black text-muted-foreground tracking-[0.2em] opacity-40">Intelligence Log</h3>
                        <p className="text-foreground/80 font-medium text-sm leading-relaxed transition-colors  ">
                            "{task.description}"
                        </p>

                        <div className="rounded-3xl overflow-hidden border border-border shadow-2xl group transition-all">
                            <img
                                src="https://images.unsplash.com/photo-1509395176047-4a66953fd231"
                                alt="Issue"
                                className="w-full h-auto object-cover group-hover:scale-110 transition duration-700"
                            />
                        </div>
                    </div>

                    {/* RIGHT: OPERATION PANEL */}
                    <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-10 shadow-2xl transition-colors relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] transition-colors"></div>
                        <h3 className="text-[10px] font-black text-primary tracking-[0.2em] shadow-glow">
                            Command Operation Terminal
                        </h3>

                        {/* Remarks */}
                        <div className="space-y-3 relative z-10 transition-colors">
                            <label className="text-[10px] font-black text-muted-foreground tracking-widest opacity-40 transition-colors">
                                Tactical Completion Notes
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Log mission execution specifics..."
                                className="w-full bg-background border border-border rounded-2xl p-6 text-[11px] font-black tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner transition-colors placeholder:text-muted-foreground/20  "
                                rows="4"
                            />
                        </div>

                        {/* Upload */}
                        <div className="space-y-4 relative z-10 transition-colors">
                            <label className="text-[10px] font-black text-muted-foreground tracking-widest opacity-40 transition-colors">
                                Visual Proof Synchronizer
                            </label>

                            <div className="border-4 border-dashed border-border rounded-[2rem] p-10 text-center transition-all hover:border-primary/50 bg-muted/30 group/upload relative overflow-hidden transition-colors">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/upload:opacity-100 blur-3xl transition-opacity"></div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="fileUpload"
                                />

                                <label
                                    htmlFor="fileUpload"
                                    className="cursor-pointer flex flex-col items-center gap-4 relative z-10"
                                >
                                    <Upload className="text-primary w-12 h-12 shadow-glow group-hover:scale-110 transition-transform" />
                                    <div className="space-y-1">
                                        <p className="text-foreground text-[10px] font-black tracking-[0.2em] transition-colors">Capture Field Data</p>
                                        <p className="text-muted-foreground text-[9px] font-black tracking-widest opacity-40 transition-colors">Synchronize Visual Evidence (IMG)</p>
                                    </div>
                                </label>

                            </div>

                            {/* Preview */}
                            {preview && (
                                <div className="mt-6 rounded-3xl overflow-hidden border border-border shadow-2xl transition-all animate-in zoom-in-95 duration-500">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-auto object-cover max-h-[300px]"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-primary text-primary-foreground py-6 rounded-2xl flex items-center justify-center gap-4 font-black text-[11px] tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow relative z-10"
                        >
                            <CheckCircle size={22} className="shadow-glow" />
                            AUTHENTICATE & LOG MISSION
                        </button>

                    </div>

                </div>

            </div>
        </OperatorLayout>
    );
};

export default TaskDetails;


