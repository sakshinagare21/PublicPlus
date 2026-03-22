import DashboardLayout from "../../layout/DashboardLayout";
import {
  Edit,
  Share2,
  MapPin,
  CheckCircle2,
  Users,
  Lock,
  Shield,
  Star,
  Megaphone,
} from "lucide-react";

const achievements = [
  { icon: Megaphone, label: "Top Reporter", sub: "30+ Verified Reports", unlocked: true },
  { icon: CheckCircle2, label: "Fact Checker", sub: "100 Verifications", unlocked: true },
  { icon: Users, label: "Pillar", sub: "Active for 1 Year", unlocked: true },
  { icon: Lock, label: "Urban Hero", sub: "10 Major Resolutions", unlocked: false },
];

const recentActivity = [
  { icon: CheckCircle2, color: "text-success", title: "Pothole Resolved", desc: "Your report #CF-4209 was marked as fixed by City Maintenance.", time: "2 HOURS AGO" },
  { icon: Edit, color: "text-primary", title: "Verification Earned", desc: '5 other citizens verified your report on "Broken Streetlight".', time: "YESTERDAY" },
  { icon: Star, color: "text-warning", title: "Score Increase", desc: "Trust Score increased by +1.2 due to consistent accuracy.", time: "3 DAYS AGO" },
];

const Profile = () => (
  <DashboardLayout>
    <div className="grid gap-6 lg:grid-cols-5">

      {/* Main */}
      <div className="lg:col-span-3 space-y-6">

        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-6 flex-wrap">

            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                AJ
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success-foreground" />
              </div>
            </div>

            <div className="flex-1">

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Alex Johnson
                </h1>

                <button className="flex items-center gap-2 border border-border px-3 py-1 rounded-md text-sm hover:bg-secondary transition">
                  <Edit className="h-3 w-3" />
                  Edit Profile
                </button>

                <button className="border border-border px-2 py-1 rounded-md hover:bg-secondary transition">
                  <Share2 className="h-3 w-3" />
                </button>
              </div>

              <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                Seattle, WA · Verified Citizen since 2022
              </p>

              <div className="mt-4 flex gap-8">
                {[
                  { val: "45", label: "TOTAL REPORTS" },
                  { val: "98%", label: "VERIF. RATE" },
                  { val: "12", label: "RESOLVED" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {s.val}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              Civic Achievements
            </h2>
            <a href="#" className="text-sm font-semibold text-primary hover:underline">
              View All
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`rounded-xl border border-border bg-card p-4 text-center ${
                  !a.unlocked ? "opacity-40" : ""
                }`}
              >
                <div
                  className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                    a.unlocked ? "bg-accent" : "bg-secondary"
                  }`}
                >
                  <a.icon className="h-6 w-6 text-accent-foreground" />
                </div>

                <p className="text-sm font-semibold text-foreground">
                  {a.label}
                </p>

                <p className="text-[10px] text-muted-foreground">
                  {a.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Analytics */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">
            Urban Impact Analytics
          </h2>

          {[
            { label: "Verification Accuracy", value: "98.4%", pct: 98, color: "bg-success" },
            { label: "Community Trust Level", value: "High", pct: 85, color: "bg-primary" },
            { label: "Response Rate", value: "85%", pct: 70, color: "bg-warning" },
          ].map((bar) => (
            <div key={bar.label} className="mb-4 last:mb-0">

              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{bar.label}</span>
                <span className="font-semibold text-foreground">{bar.value}</span>
              </div>

              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full ${bar.color}`}
                  style={{ width: `${bar.pct}%` }}
                />
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Sidebar */}
      <div className="lg:col-span-2 space-y-6">

        {/* Trust Score */}
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">
            Citizen Trust Score
          </h3>

          <div className="relative mx-auto h-40 w-40">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="10" strokeDasharray="314" strokeDashoffset="25" strokeLinecap="round" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold text-foreground">
                92
              </span>
              <span className="text-xs font-bold text-primary">
                EXCELLENT
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            You are in the top 5% of citizens.
          </p>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">

                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ${a.color}`}>
                  <a.icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {a.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.desc}
                  </p>
                  <p className="text-[10px] font-bold text-primary mt-1">
                    {a.time}
                  </p>
                </div>

              </div>
            ))}
          </div>

          <button className="w-full mt-4 border border-border py-2 rounded-lg hover:bg-secondary transition">
            View Full History
          </button>
        </div>

        {/* Privacy */}
        <div className="rounded-xl border border-border bg-card p-6">

          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              Privacy Settings
            </h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Your profile is currently{" "}
            <span className="font-bold text-foreground">
              Publicly Visible
            </span>{" "}
            to local authorities and verified citizens.
          </p>

          <button className="w-full mt-4 border border-border py-2 rounded-lg hover:bg-secondary transition">
            Manage Privacy
          </button>

        </div>

      </div>

    </div>
  </DashboardLayout>
);

export default Profile;
