import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronRight, HelpCircle } from "lucide-react";

const FAQ_DATA = {
 admin: [
 { q: "How to manage departments?", a: "Go to the 'Departments' section from the sidebar. You can approve new registration requests, view contact details, and monitor department activity." },
 { q: "What is SLA monitoring?", a: "SLA (Service Level Agreement) monitors the resolution time of tasks. If a task exceeds the predefined time based on its priority, it's flagged and escalated to admin for review." },
 { q: "Where can I see system audits?", a: "All administrative and system actions are logged in the 'Audit Logs' section for security and transparency." },
 { q: "How to assign zones?", a: "Navigate to 'Zone Mapping' to see active sectors. You can define boundaries and monitor mission distribution across geographical locations." },
 ],
 department: [
 { q: "How to handle escalations?", a: "Escalated tasks appear in your task list with a red flag. You must review the reason provided by the operator and either approve the override or assign it to a different unit." },
 { q: "Can I manage mission types?", a: "Yes, go to 'Settings' then 'Categories' to define what types of issues your department handles (e.g., Waste, Road repairs)." },
 { q: "How to add operators?", a: "Share the operator registration link. Once they apply, their requests will appear in 'Operator Requests' for your approval." },
 { q: "What is the team management view?", a: "It shows your active operators, their current workload, and their trust scores based on mission verification." },
 ],
 operator: [
 { q: "How to upload task proof?", a: "Open a task from 'My Tasks', click 'Upload Proof', and attach a clear image of the resolved issue. This initiates the citizen verification process." },
 { q: "Why is my trust score low?", a: "Trust scores decrease if missions are reopened by citizens or if resolution proofs are rejected. Complete tasks accurately to increase it." },
 { q: "What is a zone mismatch error?", a: "Missions are geofenced. You can only upload proof if you are physically within the assigned mission zone." },
 { q: "How to mark a task as invalid?", a: "If the reported issue doesn't exist or is a duplicate, upload proof of the current state and select 'Invalid Issue' during submission." },
 ],
 user: [
 { q: "How to report an issue?", a: "Go to 'Report Issue' in your dashboard. You can use your voice or type the description. Ensure your location is accurate for precise routing." },
 { q: "What happens after reporting?", a: "Our AI Engine categorizes the issue and routes it to the appropriate department and nearest active operator. You can track this in real-time." },
 { q: "How to verify resolution?", a: "When an operator completes a task, you'll receive a notification. Review the proof they uploaded and click 'Verify' to close the ticket." },
 { q: "What are upvotes for?", a: "Upvoting similar issues in your community increases their priority score, ensuring they get handled faster by metropolitan units." },
 ],
};

const FAQChatbot = ({ role = "user" }) => {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState([
 { type: "bot", text: `Hello! I'm your PublicPlus ${role.charAt(0).toUpperCase() + role.slice(1)} Assistant. How can I help you today?` }
 ]);
 const [showQuestions, setShowQuestions] = useState(true);
 const scrollRef = useRef(null);

 const roleFaqs = FAQ_DATA[role.toLowerCase()] || FAQ_DATA.user;

 useEffect(() => {
 if (scrollRef.current) {
 scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
 }
 }, [messages]);

 const handleQuestionClick = (faq) => {
 setMessages(prev => [...prev, { type: "user", text: faq.q }]);
 setShowQuestions(false);
 
 setTimeout(() => {
 setMessages(prev => [...prev, { type: "bot", text: faq.a }]);
 setShowQuestions(true);
 }, 600);
 };

 return (
 <div className="fixed bottom-6 right-6 z-[9999] font-sans">
 {/* Chat Toggle Button */}
 <button
 onClick={() => setIsOpen(!isOpen)}
 className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
 isOpen ? "bg-red-500 rotate-90" : "bg-primary shadow-primary/30"
 }`}
 >
 {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-white w-7 h-7" />}
 </button>

 {/* Chat Window */}
 {isOpen && (
 <div className="absolute bottom-20 right-0 w-[350px] max-h-[500px] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300">
 {/* Header */}
 <div className="p-5 bg-primary text-primary-foreground flex items-center gap-3">
 <div className="p-2 bg-white/20 rounded-xl">
 <Bot className="w-5 h-5" />
 </div>
 <div>
 <h3 className="font-bold text-sm">Metropolitan Support</h3>
 <p className="text-[10px] opacity-80 tracking-widest font-medium">Internal Intelligence Unit</p>
 </div>
 </div>

 {/* Messages Area */}
 <div 
 ref={scrollRef}
 className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/5 dark:bg-slate-900/5 min-h-[300px]"
 >
 {messages.map((msg, i) => (
 <div
 key={i}
 className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
 msg.type === "user" ? "flex-row-reverse" : ""
 }`}
 >
 <div className={`p-2 rounded-xl shrink-0 h-fit ${
 msg.type === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
 }`}>
 {msg.type === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
 </div>
 <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
 msg.type === "bot" 
 ? "bg-card border border-border text-foreground rounded-tl-none" 
 : "bg-primary text-primary-foreground rounded-tr-none"
 }`}>
 {msg.text}
 </div>
 </div>
 ))}

 {/* Role-Based Quick Questions */}
 {showQuestions && (
 <div className="space-y-2 pt-2 animate-in fade-in duration-500">
 <p className="text-[10px] text-muted-foreground font-bold tracking-wider pl-1">Suggested Queries</p>
 <div className="grid gap-2">
 {roleFaqs.map((faq, i) => (
 <button
 key={i}
 onClick={() => handleQuestionClick(faq)}
 className="text-left p-3 rounded-xl border border-border bg-card hover:border-primary hover:text-primary transition-all text-xs flex items-center justify-between group"
 >
 {faq.q}
 <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
 </button>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="p-4 border-t border-border bg-background flex items-center gap-2">
 <div className="flex-1 bg-muted/50 rounded-xl px-4 py-2 text-xs text-muted-foreground italic flex items-center gap-2">
 <HelpCircle className="w-3 h-3" />
 Automated responses only.
 </div>
 <button 
 className="p-2 bg-primary/10 text-primary rounded-xl cursor-not-allowed opacity-50"
 disabled
 >
 <Send className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}
 </div>
 );
};

export default FAQChatbot;

