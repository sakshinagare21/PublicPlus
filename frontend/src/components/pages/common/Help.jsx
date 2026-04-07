import React from "react";
import {
  User,
  Building2,
  HelpCircle,
  FileText,
  CheckCircle2,
  Smartphone,
  Info,
  Target
} from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import Footer from "../../layout/Footer";

const HelpCard = ({ icon: Icon, title, description }) => (
  <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all hover:border-primary/50 group text-center">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
      <Icon className="h-7 w-7 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const Help = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-muted/30 py-24 border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <div className="container max-w-4xl text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black mb-6 tracking-widest uppercase">
            <HelpCircle size={14} /> Knowledge Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            How can we <span className="text-primary  ">help</span>?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Everything you need to know about using PublicPlus to report and resolve civic infrastructure issues.
          </p>
        </div>
      </div>

      {/* Simplified Role-Based Support */}
      <div className="container py-24 px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <HelpCard
            icon={User}
            title="Citizens"
            description="Snap photos, log issues with AI-assisted geolocation, and track resolution progress in real-time."
          />

          <HelpCard
            icon={Building2}
            title="Departments"
            description="Manage your municipality's tasks, assign operators to specific zones, and analyze impact reports."
          />

          <HelpCard
            icon={Smartphone}
            title="Operators"
            description="Receive assigned tasks, navigate to locations, and upload proof of resolution to maintain your trust score."
          />
        </div>
      </div>

      {/* Feature Section - Simple & Visual */}
      <div className="bg-muted/30 py-24 border-y border-border">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h2 className="text-4xl font-black tracking-tight leading-tight">
                Smart Verification
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                Our AI-driven engine automatically classifies faults and verifies resolutions to ensure every report is handled with transparency and speed.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                  <span className="font-bold text-sm">Automated Routing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="text-primary h-6 w-6" />
                  <span className="font-bold text-sm">Precision Detection</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xs scale-110">
              <div className="relative bg-card border border-border rounded-[2rem] p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Platform Health</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                {[
                  { label: "Uptime", value: "99.9%" },
                  { label: "Accuracy", value: "90%+" },
                  { label: "SLA Adherence", value: "94%" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground">{stat.label}</span>
                    <span className="font-black text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean FAQs */}
      <div className="container py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground font-medium">Clear answers to help you navigate our platform.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do I report a new infrastructure fault?",
                a: "Simply click 'Report Issue' on your dashboard. Use the camera to capture evidence, and our AI will automatically detect your location and categorize the fault."
              },
              {
                q: "How can I track the status of my report?",
                a: "All your submissions are visible in the 'Reports' section with real-time status updates: Open, In Progress, or Resolved."
              },
              {
                q: "What is the role of an Operator?",
                a: "Operators are field workers who resolve the reported issues. They upload proof of resolution which you then verify from your dashboard."
              },
              {
                q: "How is my data protected?",
                a: "PublicPlus uses standard encryption for all user data. Your specific location is only shared with the department responsible for fixing the reported issue."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
                <h4 className="text-lg font-bold mb-4 flex gap-4">
                  <span className="text-primary opacity-50">#</span> {faq.q}
                </h4>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;

