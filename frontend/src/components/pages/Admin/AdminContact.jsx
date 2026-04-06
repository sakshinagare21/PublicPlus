import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Mail, User, Calendar, MessageSquare, Trash2, ExternalLink, Search, Filter } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminContact = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/contact/all");
            setInquiries(res.data);
        } catch (error) {
            toast.error("Failed to load inquiries");
        } finally {
            setLoading(false);
        }
    };

    const filteredInquiries = inquiries.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Mail className="w-6 h-6 text-primary" />
                            Contact Inquiries
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage and respond to messages from the public sector.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search inquiries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 bg-muted/50 border border-border rounded-xl hover:bg-muted transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Inquiry List */}
                    <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-card animate-pulse rounded-xl border border-border"></div>
                            ))
                        ) : filteredInquiries.length === 0 ? (
                            <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border text-muted-foreground">
                                <MessageSquare className="w-10 h-10 mx-auto mb-4 opacity-20" />
                                No inquiries found
                            </div>
                        ) : (
                            filteredInquiries.map((inquiry) => (
                                <div
                                    key={inquiry._id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${selectedInquiry?._id === inquiry._id
                                            ? "bg-primary/10 border-primary shadow-md"
                                            : "bg-card border-border hover:border-primary/50"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-sm truncate pr-2">{inquiry.subject}</h3>
                                        <span className="text-[10px] font-bold tracking-tighter text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{inquiry.message}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {inquiry.name.charAt(0)}
                                        </div>
                                        <span className="text-xs font-medium">{inquiry.name}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Details View */}
                    <div className="lg:col-span-2">
                        {selectedInquiry ? (
                            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider">
                                            <Mail className="w-3 h-3" />
                                            Inquiry Details
                                        </div>
                                        <h2 className="text-3xl font-display font-bold leading-tight">
                                            {selectedInquiry.subject}
                                        </h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-2xl border border-border">
                                    <div className="flex gap-4 items-center">
                                        <div className="p-3 bg-card rounded-xl border border-border text-primary shadow-sm">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground opacity-60">From</p>
                                            <p className="font-bold">{selectedInquiry.name}</p>
                                            <p className="text-xs text-muted-foreground">{selectedInquiry.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="p-3 bg-card rounded-xl border border-border text-primary shadow-sm">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground opacity-60">Submitted At</p>
                                            <p className="font-bold">
                                                {new Date(selectedInquiry.createdAt).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                        Message Content
                                    </h4>
                                    <div className="bg-muted/20 p-8 rounded-2xl border border-border/50 text-foreground leading-relaxed whitespace-pre-wrap  ">
                                        "{selectedInquiry.message}"
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href={`mailto:${selectedInquiry.email}?subject=RE: ${selectedInquiry.subject}`}
                                        className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Reply via Email
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button className="flex-1 border border-border py-4 rounded-xl font-bold hover:bg-muted transition-all">
                                        Mark as Resolved
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] bg-card/50 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                    <Mail className="w-10 h-10 opacity-20" />
                                </div>
                                <p className="font-medium text-lg">Select an inquiry to view details</p>
                                <p className="text-sm opacity-60">Real-time transmissions monitored.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminContact;

