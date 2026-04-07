import { CheckCircle2, TrendingUp, Users, MapPin, BarChart3 } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";

const stats = [
{ icon: CheckCircle2, label: "Issues Resolved", value: "12,480" },
{ icon: Users, label: "Active Citizens", value: "8,230" },
{ icon: MapPin, label: "Cities Covered", value: "42" },
{ icon: TrendingUp, label: "Efficiency Increase", value: "37%" },
];

const impactStories = [
{
title: "Road Infrastructure Upgrade",
desc: "AI-assisted reporting helped repair 1,200+ road defects within 3 months.",
},
{
title: "Public Safety Improvement",
desc: "Streetlight repairs reduced accident zones by 22% across urban sectors.",
},
{
title: "Sanitation Optimization",
desc: "Smart routing cut waste management delays by 40%.",
},
];

const Impact = () => {
return ( <div className="min-h-screen bg-background text-foreground transition-colors">

 {/* Navbar */}
 <LandingNavbar />

 <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">

 {/* Header */}
 <div className="text-center max-w-2xl mx-auto">
 <h1 className="text-3xl md:text-4xl font-bold text-foreground">
 Real-World Civic Impact
 </h1>
 <p className="text-muted-foreground mt-4">
 Measuring measurable improvements driven by citizen reporting and
 AI-powered infrastructure intelligence.
 </p>
 </div>

 {/* Stats Grid */}
 <div className="grid gap-6 md:grid-cols-4">
 {stats.map((item) => (
 <div
 key={item.label}
 className="bg-card rounded-xl border border-border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/50"
 >
 <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
 <item.icon className="h-6 w-6 text-primary" />
 </div>
 <div>
 <p className="text-sm text-muted-foreground">{item.label}</p>
 <p className="text-xl font-bold text-foreground">{item.value}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Impact Stories */}
 <div>
 <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
 Key Achievements
 </h2>

 <div className="grid gap-6 md:grid-cols-3">
 {impactStories.map((story) => (
 <div
 key={story.title}
 className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-all hover:border-primary/50"
 >
 <h3 className="font-semibold text-lg text-foreground">{story.title}</h3>
 <p className="text-sm text-muted-foreground mt-2">{story.desc}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Progress Metrics */}
 <div className="bg-card rounded-xl border border-border shadow-sm p-8">
 <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 justify-center text-foreground">
 <BarChart3 className="h-6 w-6 text-primary" />
 Infrastructure Progress Metrics
 </h2>

 {[
 { label: "Road Repairs Completed", percent: 85 },
 { label: "Public Utility Fixes", percent: 72 },
 { label: "Citizen Satisfaction", percent: 91 },
 ].map((metric) => (
 <div key={metric.label} className="mb-6 last:mb-0">
 <div className="flex justify-between text-sm mb-2">
 <span className="text-muted-foreground">{metric.label}</span>
 <span className="font-semibold text-foreground">{metric.percent}%</span>
 </div>

 <div className="h-3 bg-accent rounded-full overflow-hidden">
 <div
 className="h-full bg-primary rounded-full transition-all duration-500"
 style={{ width: `${metric.percent}%` }}
 />
 </div>
 </div>
 ))}
 </div>

 </div>
</div>

);
};

export default Impact;


