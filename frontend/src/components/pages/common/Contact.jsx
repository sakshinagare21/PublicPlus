import React, { useState } from "react";
import LandingNavbar from "../../layout/LandingNavbar";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Contact = () => {
 const [formData, setFormData] = useState({
 name: "",
 email: "",
 subject: "",
 message: "",
 });
 const [loading, setLoading] = useState(false);
 const [submitted, setSubmitted] = useState(false);

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 try {
 const res = await axios.post("http://localhost:5000/api/contact/submit", formData);
 if (res.data.success) {
 toast.success("Message sent successfully!");
 setSubmitted(true);
 setFormData({ name: "", email: "", subject: "", message: "" });
 }
 } catch (error) {
 toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
 <LandingNavbar />

 <main className="container mx-auto px-6 py-16">
 <div className="max-w-5xl mx-auto">
 {/* Header */}
 <div className="text-center mb-16">
 <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
 Contact Our Intelligence Center
 </h1>
 <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
 Have questions about the PublicPlus ecosystem? Our mission control team is here to assist you with technical support and coordination.
 </p>
 </div>

 <div className="grid md:grid-cols-5 gap-12 items-start">
 {/* Contact Info */}
 <div className="md:col-span-2 space-y-8">
 <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-3xl shadow-xl hover:shadow-primary/5 transition-all group">
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
 <MessageSquare className="w-5 h-5 text-primary" />
 Direct Channels
 </h3>

 <div className="space-y-6">
 <div className="flex gap-4 items-start">
 <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
 <Mail className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-semibold text-muted-foreground tracking-wider">Email Support</p>
 <p className="text-lg font-medium">publicplusadmin@gmail.com</p>
 </div>
 </div>

 <div className="flex gap-4 items-start">
 <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
 <Phone className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-semibold text-muted-foreground tracking-wider">Hotline</p>
 <p className="text-lg font-medium">+1 (234) 567-890</p>
 </div>
 </div>

 <div className="flex gap-4 items-start">
 <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
 <MapPin className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-semibold text-muted-foreground tracking-wider">Headquarters</p>
 <p className="text-lg font-medium">Pune District,<br />Maharashtra</p>
 </div>
 </div>
 </div>
 </div>

 {/* Dynamic Design Element */}
 <div className="hidden md:block p-8 bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 rounded-3xl">
 <p className="text-sm font-medium italic text-muted-foreground">
 "Efficiency is not just about response, but about the quality of coordination."
 </p>
 </div>
 </div>

 {/* Contact Form */}
 <div className="md:col-span-3">
 {submitted ? (
 <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-500">
 <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
 <CheckCircle2 className="w-10 h-10" />
 </div>
 <h2 className="text-3xl font-bold">Transmission Received</h2>
 <p className="text-muted-foreground text-lg">
 Your inquiry has been successfully dispatched to our administrative sector. Expect a response within 24 operational hours.
 </p>
 <button
 onClick={() => setSubmitted(false)}
 className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
 >
 Send Another message
 </button>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="bg-card border border-border p-8 md:p-10 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
 <input
 required
 type="text"
 name="name"
 value={formData.name}
 onChange={handleChange}
 placeholder="John Doe"
 className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-muted-foreground">Contact Email</label>
 <input
 required
 type="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
 placeholder="john@example.com"
 className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-semibold text-muted-foreground">Subject</label>
 <input
 required
 type="text"
 name="subject"
 value={formData.subject}
 onChange={handleChange}
 placeholder="Technical Inquiry / Partnership / Feedback"
 className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-semibold text-muted-foreground">Detailed Message</label>
 <textarea
 required
 rows="5"
 name="message"
 value={formData.message}
 onChange={handleChange}
 placeholder="How can we assist you today?"
 className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
 ></textarea>
 </div>

 <button
 disabled={loading}
 className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 group"
 >
 {loading ? (
 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
 ) : (
 <>
 Send Message
 <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
 </>
 )}
 </button>
 </form>
 )}
 </div>
 </div>
 </div>
 </main>
 </div>
 );
};

export default Contact;

