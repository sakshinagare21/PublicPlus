import { useState } from "react";
import { Search, User, Building2, Shield, CreditCard, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import Footer from "../../layout/Footer";
import LandingNavbar from "../../layout/LandingNavbar";

const AccordionItem = ({ question, answer }) => {
 const [open, setOpen] = useState(false);

 return (
 <div className="rounded-xl border border-border bg-card transition-colors">
 <button
 onClick={() => setOpen(!open)}
 className="flex w-full items-center justify-between p-4 text-left font-medium text-foreground hover:bg-accent/50 transition-colors"
 >
 {question}
 <ChevronDown
 className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
 />
 </button>

 {open && (
 <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-4">
 {answer}
 </div>
 )}
 </div>
 );
};

const FAQ = () => {
 return (
 <div className="min-h-screen bg-background text-foreground">
 <LandingNavbar />
 {/* HERO SEARCH */}
 <div className="border-b border-border bg-card/50 backdrop-blur-sm">
 <div className="mx-auto max-w-6xl px-6 py-12 text-center">
 <h1 className="text-3xl font-bold text-foreground">
 How can we help you today?
 </h1>

 <p className="mt-4 text-sm text-muted-foreground">
 Popular:{" "}
 <span className="text-primary hover:underline cursor-pointer">Reporting faults</span>{" "}
 <span className="text-primary hover:underline cursor-pointer">Data privacy</span>{" "}
 <span className="text-primary hover:underline cursor-pointer">API Access</span>
 </p>
 </div>
 </div>

 {/* MAIN LAYOUT */}
 <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">

 {/* FAQ CONTENT */}
 <main className="flex-1 space-y-10">

 {/* FOR CITIZENS */}
 <section>
 <h2 className="mb-4 text-xl font-bold text-foreground">
 For Citizens
 </h2>

 <div className="space-y-4">
 <AccordionItem
 question="How do I report a new infrastructure fault?"
 answer="You can report a fault by clicking the 'New Report' button on your dashboard. Upload a photo, add a description, and confirm the location."
 />

 <AccordionItem
 question="Can I track the status of my report?"
 answer="Yes. All submitted reports are visible in your dashboard with real-time status updates."
 />

 <AccordionItem
 question="Is my data shared with anyone?"
 answer="Your data is securely encrypted and only shared with authorized municipal departments."
 />
 </div>
 </section>

 {/* FOR GOVERNMENT */}
 <section>
 <h2 className="mb-4 text-xl font-bold text-foreground">
 For Government
 </h2>

 <div className="space-y-4">
 <AccordionItem
 question="How is the priority of faults determined?"
 answer="Our AI analyzes severity, safety impact, and location density to assign priority."
 />

 <AccordionItem
 question="Can we integrate our existing ticketing system?"
 answer="Yes. We provide API access for seamless integration."
 />
 </div>
 </section>

 {/* TECHNICAL */}
 <section>
 <h2 className="mb-4 text-xl font-bold text-foreground">
 Technical & Privacy
 </h2>

 <div className="space-y-4">
 <AccordionItem
 question="How accurate is the AI image recognition?"
 answer="Our AI achieves over 90% accuracy in infrastructure classification."
 />

 <AccordionItem
 question="What encryption standards do you use?"
 answer="We use industry-standard AES-256 encryption."
 />
 </div>
 </section>

 {/* HELPFUL BOX */}
 <div className="rounded-xl border border-border bg-card p-6 text-center">
 <h3 className="font-semibold text-foreground">
 Was this page helpful?
 </h3>

 <div className="mt-4 flex justify-center gap-4">
 <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent transition-colors text-foreground">
 <ThumbsUp className="h-4 w-4 text-success" />
 Yes
 </button>

 <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-accent transition-colors text-foreground">
 <ThumbsDown className="h-4 w-4 text-destructive" />
 No
 </button>
 </div>
 </div>
 </main>
 </div>

 {/* FOOTER */}
 <Footer />
 </div>
 );
};

export default FAQ;

