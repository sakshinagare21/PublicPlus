import React, { useState, useEffect } from "react";
import axios from "axios";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
    FileText,
    Download,
    Trash2,
    Calendar,
    Users,
    TrendingUp,
    Award,
    Loader2,
    FileSpreadsheet,
    Zap,
    Clock,
    Activity,
    MoreHorizontal,
    ChevronRight,
    BarChart3
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

const DepartmentReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/detailed-reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error("Fetch Reports Error:", err);
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const logReportToBackend = async (name, type, format) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/departments/log-report`,
                { name, type, format, stats: data.summary },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(prev => ({ ...prev, reports: res.data.reports }));
        } catch (err) {
            console.error("Failed to log report", err);
        }
    };

    const downloadCSV = async () => {
        if (!data) return;
        setExportLoading(true);
        try {
            const reportName = `Muni_Audit_${new Date().toISOString().split('T')[0]}`;
            const monthlyCsv = Papa.unparse(data.monthlyStats.map(m => ({ Month: m.month, "Issues Reported": m.count })));
            const operatorCsv = Papa.unparse(data.operatorStats.map(op => ({
                Operator: op.fullName,
                Email: op.email,
                "Issues Reported": op.reported,
                "Issues Solved": op.solved,
                "Success Rate": op.reported > 0 ? ((op.solved / op.reported) * 100).toFixed(2) + "%" : "0%"
            })));

            const blob = new Blob([`SUMMARY STATS\nGenerated:,${new Date().toLocaleString()}\nToday:,${data.summary.today}\nThis Week:,${data.summary.week}\nThis Month:,${data.summary.month}\n\nMONTHLY REPORTS\n${monthlyCsv}\n\nOPERATOR PERFORMANCE\n${operatorCsv}`], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${reportName}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            await logReportToBackend(reportName, "Operational Data", "CSV");
            toast.success("CSV Export Successful");
        } catch (err) {
            toast.error("CSV Export failed");
        } finally {
            setExportLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!data) return;
        setExportLoading(true);
        try {
            const reportName = `Dept_Performance_${new Date().getTime()}`;
            const doc = jsPDF();
            const timestamp = new Date().toLocaleString();

            doc.setFontSize(22);
            doc.setTextColor(40);
            doc.text("SERVICE PERFORMANCE AUDIT", 14, 20);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated: ${timestamp}`, 14, 28);

            doc.autoTable({
                startY: 40,
                head: [['Metric', 'Value']],
                body: [
                    ["New Issues Today", data.summary.today],
                    ["Resolved Total", data.summary.totalResolved],
                    ["SLA Compliance", `${data.summary.slaCompliance}%`]
                ]
            });

            doc.save(`${reportName}.pdf`);
            await logReportToBackend(reportName, "Efficacy Audit", "PDF");
            toast.success("PDF Audit Generated");
        } catch (err) {
            toast.error("PDF Export failed");
        } finally {
            setExportLoading(false);
        }
    };

    const getMonthName = (m) => new Date(2024, m - 1).toLocaleString('default', { month: 'short' });

    if (loading) {
        return (
            <DepartmentLayout>
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                    <Loader2 className="animate-spin text-primary h-10 w-10" />
                    <p className="text-sm text-muted-foreground animate-pulse">Aggregating Field Data...</p>
                </div>
            </DepartmentLayout>
        );
    }

    return (
        <DepartmentLayout>
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">
                            Performance Intelligence
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Archival auditing and organizational efficacy reviews
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={downloadCSV}
                            disabled={exportLoading}
                            className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border text-xs font-bold text-muted-foreground hover:bg-background hover:text-foreground transition-all"
                        >
                            <FileSpreadsheet size={16} className="text-emerald-500" />
                            Download CSV
                        </button>
                        <button
                            onClick={downloadPDF}
                            disabled={exportLoading}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                        >
                            {exportLoading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                            Official PDF Audit
                        </button>
                    </div>
                </div>

                {/* KPIS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Today's Pulse", value: data.summary.today, icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { label: "Weekly Cycle", value: data.summary.week, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Monthly Load", value: data.summary.month, icon: Calendar, color: "text-primary", bg: "bg-primary/10" }
                    ].map((kpi, i) => (
                        <div key={i} className="bg-card border rounded-2xl p-8 flex items-center gap-6 shadow-sm hover:shadow-md transition">
                            <div className={`h-14 w-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                                <kpi.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] mb-2">{kpi.label}</p>
                                <h3 className="text-4xl font-bold tracking-tighter leading-none">{kpi.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 bg-card border rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-lg font-semibold">Monthly Trajectory</h3>
                                <p className="text-xs text-muted-foreground font-medium">Seasonal issue distribution audit</p>
                            </div>
                            <BarChart3 size={20} className="text-muted-foreground opacity-30" />
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" tickFormatter={getMonthName} fontSize={11} fontWeight="500" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis fontSize={11} fontWeight="500" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: '12px' }} labelFormatter={getMonthName} />
                                    <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-card border rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                        <div className="mb-10">
                            <h3 className="text-lg font-semibold">Weekly Analysis</h3>
                            <p className="text-xs text-muted-foreground font-medium">Standard 7-day field pulse</p>
                        </div>
                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="week" fontSize={11} fontWeight="500" axisLine={false} tickLine={false} tickFormatter={(w) => `W${w}`} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis fontSize={11} fontWeight="500" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* PERSONNEL AUDIT */}
                <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-8 border-b bg-muted/20">
                        <h3 className="text-lg font-semibold">Personnel Efficacy Audit</h3>
                        <p className="text-xs text-muted-foreground font-medium">Individual performance and load distribution review</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/10 border-b">
                                    <th className="p-6 text-xs font-semibold text-muted-foreground tracking-wider">Operator Asset</th>
                                    <th className="p-6 text-xs font-semibold text-muted-foreground tracking-wider text-center">Load Factor</th>
                                    <th className="p-6 text-xs font-semibold text-muted-foreground tracking-wider text-center">Resolution</th>
                                    <th className="p-6 text-xs font-semibold text-muted-foreground tracking-wider">Effectiveness</th>
                                    <th className="p-6 text-xs font-semibold text-muted-foreground tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.operatorStats.map((op, i) => {
                                    const efficacy = op.reported > 0 ? (op.solved / op.reported) * 100 : 0;
                                    return (
                                        <tr key={i} className="hover:bg-muted/5 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center font-bold text-primary">{op.fullName[0]}</div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{op.fullName}</p>
                                                        <p className="text-[10px] text-muted-foreground leading-none">{op.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center font-bold text-xl">{op.reported}</td>
                                            <td className="p-6 text-center font-bold text-xl text-emerald-500">{op.solved}</td>
                                            <td className="p-6">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground ">
                                                        <span>Rating</span>
                                                        <span>{efficacy.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                                        <div className={`h-full transition-all duration-1000 ${efficacy > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${efficacy}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button className="p-2.5 hover:bg-muted rounded-lg text-muted-foreground transition-all opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DepartmentLayout>
    );
};

export default DepartmentReports;


