import React from "react";
import DashboardLayout from "../../layout/DashboardLayout"

import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Megaphone,
  Asterisk,
  Search,
  MapPin,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";

const statCards = [
  { icon: FileText, label: "Total Reports", value: "1,240", badge: "+12%", badgeColor: "text-success" },
  { icon: AlertTriangle, label: "Active Issues", value: "142", badge: "Active", badgeColor: "text-warning" },
  { icon: CheckCircle2, label: "Resolved Cases", value: "1,098", badge: "88% Success", badgeColor: "text-success" },
];

const quickActions = [
  { icon: Megaphone, title: "Report Issue", desc: "Log standard civic faults like potholes or lights.", primary: true },
  { icon: Asterisk, title: "Emergency Report", desc: "Urgent hazards requiring immediate dispatch.", primary: true },
  { icon: Search, title: "Search Nearby", desc: "Locate and track existing reports in your zone.", primary: false },
];

const activityItems = [
  { icon: AlertTriangle, color: "text-warning bg-warning/10", title: "Pothole reported on 5th Ave", sub: "Assigned to: Road Maintenance Dept.", time: "2 mins ago" },
  { icon: CheckCircle2, color: "text-success bg-success/10", title: "Water Leak resolved in District 4", sub: "Public utility restored for 200+ households.", time: "1 hour ago" },
  { icon: Zap, color: "text-destructive bg-destructive/10", title: "Emergency: Power Line Down", sub: "Location: Oak Street. Status: Technician Dispatched.", time: "4 hours ago" },
];

const Dashboard = () => (
  <DashboardLayout>
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform status for Metropolis Urban Center
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last sync:{" "}
          <span className="font-semibold text-foreground">
            Just now
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <card.icon className="h-5 w-5 text-accent-foreground" />
              </div>

              <span className={`text-xs font-bold ${card.badgeColor}`}>
                {card.badge}
              </span>

            </div>

            <p className="text-sm text-muted-foreground">
              {card.label}
            </p>

            <p className="font-display text-3xl font-bold text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className={`rounded-xl p-6 text-left transition-all hover:shadow-lg ${
                action.primary
                  ? "bg-primary text-primary-foreground hover:shadow-primary/20"
                  : "border border-border bg-card text-foreground hover:shadow-lg"
              }`}
            >
              <action.icon
                className={`h-6 w-6 mb-4 ${
                  action.primary
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              />

              <h3 className="font-display text-lg font-bold">
                {action.title}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  action.primary
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {action.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed + Map */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Activity Feed */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6">

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-bold text-foreground">
              Recent Activity Feed
            </h2>

            <a
              href="#"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View All
            </a>
          </div>

          <div className="space-y-4">
            {activityItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color}`}
                >
                  <item.icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.sub}
                  </p>
                </div>

                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.time}
                </span>

              </div>
            ))}
          </div>

        </div>

        {/* Map */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">

          <h2 className="font-display text-lg font-bold text-foreground">
            Live Fault Mapping
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Real-time hotspots across districts
          </p>

          <div className="rounded-lg bg-secondary/50 h-48 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Interactive map</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                High Priority
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Standard
              </span>
            </div>

            <a
              href="#"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Open Map
              <ArrowRight className="h-3 w-3" />
            </a>

          </div>

        </div>

      </div>

    </div>
  </DashboardLayout>
);

export default Dashboard;
