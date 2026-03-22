import DashboardLayout from "../../layout/DashboardLayout";
import { Bell, Wrench, CheckCircle2, Shield, ArrowUp, MoreVertical, CheckCheck, MapPin} from "lucide-react";
import { useState } from "react";

const tabs = ["Recent", "Unread", "Priority"];

const sidebarFilters = [
{ icon: Bell, label: "All Notifications", count: 12, active: true },
{ icon: Wrench, label: "Updates", count: 5 },
{ icon: CheckCircle2, label: "Verifications", count: 3 },
{ icon: Shield, label: "System", count: null },
];

const notifications = [
{ type: "UPDATE", icon: Wrench, title: "Pothole repair scheduled for Main St", desc: "Maintenance crew assigned to report...", time: "2 mins ago", unread: true, action: "View Issue" },
{ type: "VERIFICATION", icon: CheckCircle2, title: "Is the streetlight at Sector 4 fixed?", desc: "Our logs indicate repair completion. As the original reporter, please confirm if the issue is resolved to close ticket #5102.", time: "1 hour ago", unread: true, action: "Confirm Fix", actionPrimary: true },
{ type: "SYSTEM", icon: Shield, title: "Privacy Policy Update", desc: "We've updated our data handling policies to improve transparency in government-citizen interactions.", time: "5 hours ago", action: "Read Policy" },
{ type: "UPDATE", icon: ArrowUp, title: "Community Garden Watering Schedule", desc: "New automatic irrigation system installed.", time: "Yesterday", action: "Check Levels", actionPrimary: true },
];

const Alerts = () => {
const [activeTab, setActiveTab] = useState(0);

return ( <DashboardLayout> <div className="flex gap-6">

    {/* Left sidebar */}
    <div className="hidden w-64 shrink-0 lg:block">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Alert Center
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Manage your urban accountability notifications and status updates.
      </p>

      <div className="space-y-1 mb-6">
        {sidebarFilters.map((f) => (
          <button
            key={f.label}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              f.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <span className="flex items-center gap-2">
              <f.icon className="h-4 w-4" />
              {f.label}
            </span>
            {f.count && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  f.active
                    ? "bg-primary-foreground/20"
                    : "bg-secondary"
                }`}
              >
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-accent p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
          Status Summary
        </p>
        <p className="text-sm text-muted-foreground">
          You have 4 critical issues requiring immediate attention in your sector.
        </p>
        <a
          href="#"
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          View urgency map →
        </a>
      </div>
    </div>

    {/* Main */}
    <div className="flex-1 min-w-0">

      <div className="flex items-center gap-4 mb-4 flex-wrap">

        <div className="flex gap-1 rounded-lg border border-border p-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium ${
                i === activeTab
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </button>

      </div>

      <div className="space-y-4">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
          >
            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
                <n.icon className="h-5 w-5 text-accent-foreground" />
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {n.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {n.time}
                  </span>
                  {n.unread && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>

                <h3 className="font-display text-sm font-bold text-foreground">
                  {n.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {n.desc}
                </p>

                <div className="mt-3 flex items-center gap-2">

                  <button
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition ${
                      n.actionPrimary
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border hover:bg-secondary"
                    }`}
                  >
                    {n.action}
                  </button>

                  <button className="rounded-lg p-1 hover:bg-secondary">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>

                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="border border-border px-4 py-2 rounded-md text-sm hover:bg-secondary">
          Show older notifications ↓
        </button>
      </div>

    </div>

    {/* Right sidebar */}
    <div className="hidden w-72 shrink-0 space-y-6 xl:block">

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-bold text-foreground">
            Active Area
          </h3>
        </div>

        <div className="rounded-lg bg-secondary/50 h-32 flex items-center justify-center mb-3">
          <MapPin className="h-6 w-6 text-muted-foreground" />
        </div>

        <p className="text-xs text-muted-foreground">
          Monitoring 4.2km² around your primary residence.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display text-sm font-bold text-foreground mb-3">
          Resolution Insights
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Avg. Response Time
            </span>
            <span className="font-bold text-foreground">
              14h 22m
            </span>
          </div>

          <div className="h-2 rounded-full bg-secondary">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Completed this week
            </span>
            <span className="font-bold text-success">
              +12
            </span>
          </div>
        </div>

        <button className="w-full mt-4 border border-border px-4 py-2 rounded-md text-sm hover:bg-secondary">
          View Analytics
        </button>

      </div>

    </div>

  </div>
</DashboardLayout>


);
};

export default Alerts;
