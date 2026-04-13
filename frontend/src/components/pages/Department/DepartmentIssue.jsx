import { useState, useEffect } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import { useLocation } from "react-router-dom";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCcw,
  X,
  Clock,
  MapPin,
  AlertTriangle,
  ChevronRight,
  Filter,
  Users,
  Calendar,
  Zap,
  MoreHorizontal,
  ArrowRight,
  CheckCircle,
  FileText,
  Activity,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const configs = {
    "New": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
    "In Progress": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
    "Completed": { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
    "Escalated": { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
    "default": { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
  };
  const config = configs[status] || configs.default;
  return (
    <span className={`${config.bg} ${config.text} ${config.border} border px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ level }) => {
  const configs = {
    high: { icon: Zap, color: "text-red-500", label: "CRITICAL" },
    medium: { icon: AlertTriangle, color: "text-amber-500", label: "ELEVATED" },
    low: { icon: Clock, color: "text-blue-500", label: "STANDARD" }
  };
  const config = configs[level] || configs.low;
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/40 rounded-lg w-fit">
      <Icon size={12} className={config.color} />
      <span className={`text-[10px] font-black tracking-widest ${config.color}`}>{config.label}</span>
    </div>
  );
};

const Issues = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("New");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [task, setTask] = useState(null);
  const [issuesData, setIssuesData] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState("");
  const [priority, setPriority] = useState("");

  /* Reassignment State */
  const [deptOperators, setDeptOperators] = useState([]);
  const [reassignMode, setReassignMode] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [reassignLoading, setReassignLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const issueId = queryParams.get("issueId");
    if (issueId) {
      setSelectedId(issueId);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const [issuesRes, statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues/department/issue?page=${page}&limit=${limit}&zone=${zone}&priority=${priority}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues/department/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const formatted = (issuesRes.data.issues || []).map((issue) => ({
        id: issue._id,
        title: issue.title,
        zone: issue.zone,
        priority: issue.priority?.level?.toLowerCase() || "low",
        assignment: issue.assignedTo?.fullName || "Unassigned",
        rawStatus: issue.status,
        status: ["reported", "assigned", "pending_verification"].includes(issue.status) ? "New" :
          ["resolved", "closed"].includes(issue.status) ? "Completed" :
            issue.status === "escalated" ? "Escalated" :
              "In Progress",
        deadline: issue.sla?.resolutionDeadline ? new Date(issue.sla.resolutionDeadline) : null,
        isBreach: issue.sla?.isBreached,
        images: (issue.images || []).map(img => img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_BASE_URL}${img.url}`)
      }));

      setIssuesData(formatted);
      if (issuesRes.data.zones) setZones(issuesRes.data.zones);
      setTotalPages(Math.ceil(issuesRes.data.total / limit) || 1);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      toast.error("Real-time data sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, zone, priority]);

  const fetchTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const issue = res.data;
      setTask({
        id: issue._id,
        title: issue.title,
        description: issue.description?.text || "No descriptive brief.",
        location: issue.fullAddress || "Geo-coordinates pending",
        status: ["reported", "assigned", "pending_verification"].includes(issue.status) ? "New" :
          ["resolved", "closed"].includes(issue.status) ? "Completed" :
            issue.status === "escalated" ? "Escalated" :
              "In Progress",
        priority: issue.priority?.level || "low",
        deadline: issue.sla?.resolutionDeadline ? new Date(issue.sla.resolutionDeadline).toLocaleString() : "N/A",
        operator: issue.assignedTo?.fullName || "Awaiting Operator",
        escalationLevel: issue.sla?.escalationLevel || 1,
        citizen: issue.reportedBy?.fullName || "Verified Citizen",
        escalation: issue.resolution?.escalation || null,
        rawStatus: issue.status,
        images: (issue.images || []).map(img => img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_BASE_URL}${img.url}`),
        proof: issue.resolution?.proof?.url ? (issue.resolution.proof.url.startsWith('http') ? issue.resolution.proof.url : `${import.meta.env.VITE_API_BASE_URL}${issue.resolution.proof.url}`) : null,
        history: issue.statusHistory || [],
        escalationHistory: issue.sla?.escalationHistory || [],
        coordinates: issue.location?.coordinates ? `${issue.location.coordinates[1].toFixed(6)}, ${issue.location.coordinates[0].toFixed(6)}` : "Unavailable"
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task details");
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchTask(selectedId);
      fetchOperators(); // Refresh operators when modal opens
    }
  }, [selectedId]);

  const fetchOperators = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/operators`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeptOperators(res.data);
    } catch (err) {
      console.error("Fetch Operators Error:", err);
    }
  };

  const handleReassign = async () => {
    if (!selectedOperator) return toast.error("Select a tactical node (operator)");
    
    try {
      setReassignLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/issues/${task.id}/reassign`, 
        { operatorId: selectedOperator },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Mission Reassigned Successfully");
      setReassignMode(false);
      setSelectedId(null);
      setTask(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reassignment Transmission Failed");
    } finally {
      setReassignLoading(false);
    }
  };

  const filteredIssues = issuesData
    .filter((issue) => activeTab === "All" || issue.status === activeTab)
    .filter((issue) => issue.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DepartmentLayout>
      <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Task Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mission oversight and territorial incident control
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-muted-foreground tracking-widest">Protocol Active</span>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatBox title="Deployment Load" value={stats.total} icon={FileText} color="text-blue-500" bg="bg-blue-500/10" />
          <StatBox title="Incoming Queue" value={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
          <StatBox title="Active Field" value={stats.inProgress} icon={Zap} color="text-purple-500" bg="bg-purple-500/10" />
          <StatBox title="Neutralized" value={stats.resolved} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
        </div>

        {/* CONTROLS BAR */}
        <div className="bg-card border rounded-2xl p-4 shadow-sm space-y-4 lg:space-y-0 lg:flex items-center justify-between gap-6">

          <div className="flex p-1 bg-muted rounded-xl gap-1">
            {["All", "New", "In Progress", "Escalated", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 group w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Filter specific mission..."
                className="w-full bg-muted/40 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select
                className="bg-muted/40 border border-border/50 text-[11px] font-bold px-4 py-3 rounded-xl outline-none hover:border-primary/30 transition-all flex-1 md:flex-none"
                value={zone}
                onChange={(e) => { setZone(e.target.value); setPage(1); }}
              >
                <option value="">All Sectors</option>
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>

              <select
                className="bg-muted/40 border border-border/50 text-[11px] font-bold px-4 py-3 rounded-xl outline-none hover:border-primary/30 transition-all flex-1 md:flex-none"
                value={priority}
                onChange={(e) => { setPriority(e.target.value); setPage(1); }}
              >
                <option value="">All Prior</option>
                <option value="high">Critical</option>
                <option value="medium">Elevated</option>
                <option value="low">Standard</option>
              </select>
            </div>
          </div>
        </div>

        {/* REGISTRY TABLE */}
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Mission ID</th>
                  <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Name</th>
                  <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Sector</th>
                  <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Priority</th>
                  <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Status</th>
                  <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Deadline</th>
                  <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="p-6 bg-muted/10 h-16" />
                    </tr>
                  ))
                ) : filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-muted/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-border/50 bg-black/20">
                          {issue.images && issue.images.length > 0 ? (
                            <img src={issue.images[0]} alt="Tactical" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Activity size={14} className="opacity-20" />
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-xs text-primary font-bold">#{(issue.id?.slice(-6))}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-semibold text-sm text-foreground">{issue.title}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                        <Users size={12} />
                        <span className="text-[10px] font-medium tracking-tight">{issue.assignment}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span className="text-xs font-semibold">{issue.zone}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <PriorityBadge level={issue.priority} />
                    </td>
                    <td className="p-5">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="p-5">
                      {issue.deadline ? (
                        <div className={`flex items-center gap-2 ${issue.isBreach ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                          <Calendar size={13} />
                          <span className="text-xs font-medium">{issue.deadline.toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40 text-[10px] font-bold  ">Unspecified</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <button onClick={() => setSelectedId(issue.id)} className="p-2.5 hover:bg-primary/10 rounded-lg text-primary transition-all opacity-0 group-hover:opacity-100">
                        <Eye size={18} />
                      </button>
                      <button className="p-2.5 hover:bg-muted rounded-lg text-muted-foreground transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-20 text-center">
                      <Activity size={32} className="mx-auto mb-4 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground tracking-widest   opacity-50">Zero tactical missions detected</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROL */}
          <div className="flex justify-between items-center p-6 border-t bg-muted/20">
            <span className="text-xs font-medium text-muted-foreground">Displaying Layer {page} of Registry</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                PREVIOUS
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-30 transition"
              >
                NEXT LAYER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MISSION ANALYSIS MODAL */}
      {selectedId && task && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-[900px] rounded-[2rem] overflow-hidden border shadow-2xl relative animate-in zoom-in-95 duration-300">

            <div className="p-8 border-b bg-muted/20 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <StatusBadge status={task.status} />
                  <PriorityBadge level={task.priority} />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight leading-tight">{task.title}</h2>
              </div>
              <button
                onClick={() => { 
                  setSelectedId(null); 
                  setTask(null); 
                  setReassignMode(false); 
                  setSelectedOperator("");
                }}
                className="p-2.5 hover:bg-muted rounded-full transition-all text-muted-foreground hover:text-foreground"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Tactical Brief & Evidence</p>
                <div className="p-6 bg-muted/40 rounded-xl border border-border/50">
                  <p className="text-sm leading-relaxed text-foreground font-medium mb-6">{task.description}</p>

                  {/* 📷 INCIDENT IMAGES GALERY */}
                  {task.images && task.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {task.images.map((img, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-border/50 shadow-sm aspect-video bg-black/20">
                          <img src={img} alt="Incident" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Location Reference</p>
                  <div className="p-4 bg-muted/40 border rounded-xl flex items-center gap-4">
                    <MapPin size={20} className="text-primary" />
                    <p className="text-xs font-bold truncate">{task.location}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Precision Grid</p>
                  <div className="p-4 bg-muted/40 border rounded-xl flex items-center gap-4">
                    <Activity size={20} className="text-blue-500" />
                    <p className="text-xs font-mono font-bold tracking-tighter">{task.coordinates}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Protocol Schedule</p>
                  <div className="p-4 bg-muted/40 border rounded-xl flex items-center gap-4">
                    <Clock size={20} className="text-red-500" />
                    <p className="text-xs font-bold tracking-tighter">{task.deadline}</p>
                  </div>
                </div>
              </div>

              {/* REPORTER PROFILE */}
              <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {task.citizen[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary ">Reporter Profile</p>
                    <p className="text-sm font-bold">{task.citizen}</p>
                  </div>
                </div>
              </div>

              {/* 🔥 RESOLUTION PROOF BLOCK */}
              {task.proof && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-2xl space-y-5">
                  <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] tracking-[0.2em] uppercase">
                    <CheckCircle size={18} /> Resolution Compliance Evidence
                  </div>
                  <div className="rounded-xl overflow-hidden border border-emerald-500/10 shadow-glow shadow-emerald-500/5 bg-black/40">
                    <img
                      src={task.proof}
                      alt="Resolution Proof"
                      className="w-full h-auto max-h-[350px] object-contain mx-auto"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest text-center uppercase">Certified by operator: {task.operator} </p>
                </div>
              )}

              {/* ESCALATION BLOCK */}
              {task.escalation && (
                <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl space-y-5">
                  <div className="flex items-center gap-3 text-red-500 font-bold text-xs tracking-widest">
                    <AlertTriangle size={18} /> ESCALATION DIRECTIVE & EVIDENCE
                  </div>
                  <p className="text-sm   font-medium">"{task.escalation.reason}"</p>
                  {task.escalation.proof && (
                    <div className="rounded-xl overflow-hidden border shadow-lg bg-black/40">
                      <img
                        src={task.escalation.proof.startsWith('http') ? task.escalation.proof : `${import.meta.env.VITE_API_BASE_URL}${task.escalation.proof}`}
                        alt="Escalation Proof"
                        className="w-full h-auto max-h-[350px] object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 🔥 TACTICAL MISSION LOG (NEW) */}
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Tactical Activity Log</p>
                <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                  {task.history && task.history.length > 0 ? (
                    task.history.map((log, idx) => (
                      <div key={idx} className="relative pl-8 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary shadow-sm" />
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-black uppercase text-foreground">{log.status.replace('_', ' ')}</span>
                          <span className="text-[9px] font-bold text-muted-foreground">{new Date(log.updatedAt).toLocaleString()}</span>
                        </div>
                        {log.remark && (
                          <p className="text-xs text-muted-foreground leading-relaxed  ">"{log.remark}"</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground   pl-8">No initial deployment logs captured.</p>
                  )}
                </div>
              </div>

              {/* 🔥 REASSIGNMENT SELECTION UI */}
              {reassignMode && (
                <div className="p-8 bg-primary/5 border border-primary/20 rounded-3xl space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black tracking-widest text-primary uppercase flex items-center gap-2">
                       <Users size={16} /> Reassign Tactical Node
                    </h3>
                    <button onClick={() => setReassignMode(false)} className="text-[10px] font-black underline uppercase text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
                      Hand-pick an operator to take over this mission. This will override existing protocol assignments.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                       {deptOperators.map(op => (
                         <div 
                           key={op._id}
                           onClick={() => setSelectedOperator(op._id)}
                           className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                             selectedOperator === op._id 
                             ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                             : "bg-card border-border hover:border-primary/50"
                           }`}
                         >
                           <div className="flex items-center gap-3">
                              <div className={`h-2 w-2 rounded-full ${op.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                              <div>
                                <p className="text-xs font-bold">{op.fullName}</p>
                                <p className={`text-[9px] ${selectedOperator === op._id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {op.assignedZone?.zoneName || "General Sector"}
                                </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black uppercase opacity-60">LOAD</p>
                              <p className="text-xs font-black">{op.currentActiveTasks}/{op.maxCapacity}</p>
                           </div>
                         </div>
                       ))}
                    </div>

                    <button
                      onClick={handleReassign}
                      disabled={reassignLoading || !selectedOperator}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl shadow-primary/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 uppercase"
                    >
                      {reassignLoading ? "Transmitting..." : "Confirm Reassignment"}
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS (Simplified) */}
              <div className="flex gap-4 pt-6">
                {!reassignMode && (
                   <button
                    onClick={() => setReassignMode(true)}
                    className="flex-[1.5] flex items-center justify-center gap-2 bg-foreground text-background font-black text-[11px] tracking-widest py-4 rounded-xl hover:opacity-90 transition-all active:scale-95"
                  >
                    <RefreshCcw size={16} /> REASSIGN MISSION
                  </button>
                )}
                
                <button
                  onClick={async () => {
                    if (task.rawStatus === "escalated" || task.rawStatus === "pending_verification") {
                      const token = localStorage.getItem("token");
                      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/issues/${task.id}/status`,
                        { status: "closed", remark: "Status approved via mission oversight." },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      toast.success("Identity Node Synchronized: Ok");
                    }
                    setSelectedId(null);
                    setTask(null);
                    setReassignMode(false);
                    fetchData();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-black text-[11px] tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                >
                  OK
                </button>
                <button
                  onClick={() => { 
                    setSelectedId(null); 
                    setTask(null); 
                    setReassignMode(false); 
                    setSelectedOperator("");
                  }}
                  className="flex-1 bg-muted border font-black text-[11px] tracking-widest py-4 rounded-xl hover:bg-background transition-all active:scale-95"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DepartmentLayout>
  );
};

const StatBox = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition duration-300">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em]">{title}</p>
    </div>
    <h2 className="text-3xl font-bold leading-none">{value}</h2>
  </div>
);

export default Issues;

