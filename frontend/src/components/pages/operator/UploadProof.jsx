import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OperatorLayout from "../../layout/OperatorLayout";
import { Upload, CheckCircle, ClipboardList, Clock } from "lucide-react";

const UploadProof = () => {
 const { id } = useParams(); // task id
 const navigate = useNavigate();

 const [remarks, setRemarks] = useState("");
 const [file, setFile] = useState(null);
 const [preview, setPreview] = useState(null);
 const [proofs, setProofs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isInvalid, setIsInvalid] = useState(false);

 /* ================= FETCH PROOF HISTORY ================= */
 const fetchHistory = async () => {
 try {
 const res = await axios.get("http://127.0.0.1:5000/api/issues/operator/issue", {
 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
 });
 
 // Filter issues that have resolution proof uploaded
 const history = res.data.filter(issue => issue.resolution?.proof?.url);
 setProofs(history);
 } catch (err) {
 console.error("Failed to fetch history:", err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchHistory();
 }, []);

 const handleFileChange = (e) => {
 const selectedFile = e.target.files[0];
 setFile(selectedFile);

 if (selectedFile) {
 setPreview(URL.createObjectURL(selectedFile));
 }
 };

 const handleSubmit = async () => {
 if (!file) {
 toast.error("Please upload proof image");
 return;
 }

 if (isSubmitting) return;
 setIsSubmitting(true);

 const formData = new FormData();
 formData.append("proof", file);
 formData.append("notes", remarks);
 formData.append("isInvalid", isInvalid);

 try {
 await axios.post(`http://127.0.0.1:5000/api/issues/${id}/upload-proof`, formData, {
 headers: { 
 Authorization: `Bearer ${localStorage.getItem("token")}`,
 "Content-Type": "multipart/form-data"
 }
 });

 toast.success(isInvalid ? "Task marked as non-existent and closed." : "Proof uploaded successfully!");
 setRemarks("");
 setFile(null);
 setPreview(null);
 setIsInvalid(false);
 fetchHistory(); // Refresh list
 setTimeout(() => {
 navigate(`/operator/tasks/${id}`);
 }, 2000);
 } catch (err) {
 toast.error(err.response?.data?.message || "Upload failed");
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <OperatorLayout>
 <div className="space-y-8">

 <div className="transition-colors">
 <h1 className="text-4xl font-black text-foreground tracking-tighter transition-colors ">Mission Certification</h1>
 <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] mt-1 opacity-60 transition-colors italic">
 Submit visual evidence for Directive {id.slice(-6).toUpperCase()}
 </p>
 </div>

 {/* Upload Section */}
 <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl transition-colors relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>
 
 <textarea
 value={remarks}
 onChange={(e) => setRemarks(e.target.value)}
 placeholder={isInvalid ? "Explain why this task does not exist..." : "Document mission execution details..."}
 className="w-full bg-background border border-border rounded-2xl p-6 text-[10px] font-black tracking-widest focus:ring-4 focus:ring-primary/10 transition-all outline-none transition-colors placeholder:text-muted-foreground/30 shadow-inner relative z-10 min-h-[120px]"
 />

 {/* New Toggle for Task Does Not Exist */}
 <div className="mt-6 flex items-center gap-4 relative z-10">
 <label className="flex items-center gap-3 cursor-pointer group/toggle">
 <div 
 onClick={() => setIsInvalid(!isInvalid)}
 className={`w-12 h-6 rounded-full transition-all duration-300 relative border border-border ${isInvalid ? 'bg-destructive shadow-glow-destructive' : 'bg-muted'}`}
 >
 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isInvalid ? 'left-7' : 'left-1'}`} />
 </div>
 <span className={`text-[10px] font-black tracking-widest ${isInvalid ? 'text-destructive' : 'text-muted-foreground'}`}>
 Task does not exist / Wrong Issue
 </span>
 </label>
 </div>

 <div className="border-4 border-dashed border-border rounded-3xl p-12 text-center transition-all hover:border-primary/50 relative z-10 mt-6 group/upload cursor-pointer bg-muted/30 hover:bg-muted/50">
 <input
 type="file"
 accept="image/*"
 onChange={handleFileChange}
 className="hidden"
 id="fileUpload"
 />

 <label htmlFor="fileUpload" className="cursor-pointer">
 <Upload className="mx-auto text-primary mb-4 w-12 h-12 shadow-glow group-hover/upload:scale-110 transition-transform" />
 <p className="text-foreground text-xs font-black tracking-[0.2em]">
 Synchronize Visual Data
 </p>
 <p className="text-muted-foreground text-[10px] font-black tracking-widest opacity-40 mt-1">
 Drag or Click to Initialize Upload
 </p>
 </label>
 </div>

 {preview && (
 <div className="mt-8 relative z-10 transition-all animate-in zoom-in-95 duration-500">
 <p className="text-muted-foreground text-[10px] font-black tracking-widest mb-3 opacity-60">Visual Confirmation Preview</p>
 <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
 <img
 src={preview}
 alt="Preview"
 className="w-full h-auto object-cover max-h-[400px]"
 />
 </div>
 </div>
 )}

 <button
 onClick={handleSubmit}
 disabled={isSubmitting}
 className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] tracking-[0.2em] transition-all relative z-10 mt-10 shadow-xl ${
 isSubmitting 
 ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
 : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-primary/20 active:scale-95 shadow-glow"
 }`}
 >
 {isSubmitting ? (
 <>
 <div className="w-5 h-5 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin shadow-glow" />
 TRANSMITTING DATA...
 </>
 ) : (
 <>
 <CheckCircle size={20} className="shadow-glow" />
 {isInvalid ? "CLOSE TASK AS NON-EXISTENT" : "CERTIFY MISSION SUCCESS"}
 </>
 )}
 </button>

 </div>

 {/* Proof History */}
 <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-10 shadow-2xl transition-colors relative overflow-hidden">
 <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-success/5 rounded-full blur-[100px] transition-colors"></div>
 <div className="flex items-center justify-between relative z-10">
 <div>
 <h3 className="text-2xl font-black text-foreground tracking-tighter transition-colors flex items-center gap-3">
 <ClipboardList size={28} className="text-primary shadow-glow" />
 Operational Archives
 </h3>
 <p className="text-muted-foreground text-[10px] font-black tracking-widest opacity-40 mt-1">Verified field evidence logs.</p>
 </div>
 <span className="text-[10px] font-black tracking-[0.2em] bg-success/10 text-success px-5 py-2 rounded-xl border border-success/20 shadow-glow-success">
 {proofs.length} MISSION SUCCESSES
 </span>
 </div>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
 <Upload size={32} className="mb-2 animate-bounce" />
 <p>Loading your contributions...</p>
 </div>
 ) : proofs.length === 0 ? (
 <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
 <p className="text-muted-foreground italic">
 You haven't uploaded any proofs yet. Start by completing a task!
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 transition-colors">
 {proofs.map((issue) => (
 <div
 key={issue._id}
 className="bg-muted/30 border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 group shadow-sm hover:shadow-2xl hover:shadow-primary/5 active:scale-95"
 >
 <div className="relative aspect-video overflow-hidden">
 <img
 src={`http://127.0.0.1:5000${issue.resolution.proof.url}`}
 alt="Proof"
 className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
 />
 <div className="absolute top-4 right-4">
 <span className={`text-[9px] font-black px-3 py-1 rounded-lg shadow-xl tracking-widest border transition-colors ${
 issue.status === 'resolved' ? 'bg-success text-white border-success/50 shadow-glow-success' : 'bg-amber-500 text-white border-amber-500/50 shadow-glow-amber'
 }`}>
 {issue.status.replace('_', ' ')}
 </span>
 </div>
 </div>
 
 <div className="p-6 space-y-4 transition-colors">
 <h4 className="font-black text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
 {issue.title}
 </h4>
 
 {issue.resolution.notes && (
 <p className="text-[11px] text-muted-foreground line-clamp-2 font-medium italic opacity-80 leading-relaxed">
 "{issue.resolution.notes}"
 </p>
 )}

 <div className="pt-4 flex items-center justify-between border-t border-border mt-4 transition-colors">
 <span className="text-[10px] text-muted-foreground font-black tracking-widest flex items-center gap-2 opacity-50">
 <Clock size={14} className="text-primary opacity-60" />
 {new Date(issue.resolution.proof.uploadedAt).toLocaleDateString()}
 </span>
 <Link 
 to={`/operator/tasks/${issue._id}`}
 className="text-[10px] font-black text-primary hover:text-foreground transition-all tracking-[0.2em] shadow-glow"
 >
 ANALYZE DATA
 </Link>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 </div>
 </OperatorLayout>
 );
};

export default UploadProof;

