import DashboardLayout from "../../layout/DashboardLayout";
import {
  CheckCircle2,
  Clock,
  Star,
  Share2,
  Download,
  Calendar,
  Filter,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const summaryCards = [
  { icon: CheckCircle2, iconColor: "text-success bg-success/10", label: "Total Resolved", value: "1,284", trend: "↗12%" },
  { icon: Clock, iconColor: "text-primary bg-primary/10", label: "Avg Resolution Time", value: "4.2 Days", trend: "↘8%" },
  { icon: Star, iconColor: "text-warning bg-warning/10", label: "Impact Score", value: "94/100", trend: "↗5%" },
];

const resolvedItems = [
  { dept: "PUBLIC WORKS", deptColor: "bg-primary text-primary-foreground", title: "Pothole Repair - 5th Avenue & Main", location: "Central Business District, Section 4", reported: "Oct 12", fixed: "Oct 14", verified: "Oct 15", verifier: "3 Residents", duration: "72 Hours" },
  { dept: "UTILITIES", deptColor: "bg-success text-success-foreground", title: "Malfunctioning Streetlight - Oak Street", location: "Riverside Heights, North Gate", reported: "Oct 08", fixed: "Oct 09", verified: "Oct 11", verifier: "City Inspector #42", duration: "24 Hours" },
  { dept: "SANITATION", deptColor: "bg-warning text-warning-foreground", title: "Illegal Dumping - Park Entrance", location: "Greenwood Park, South Entrance", reported: "Oct 01", fixed: "Oct 02", verified: "Oct 03", verifier: "Community Lead", duration: "36 Hours" },
];

const Analytics = () => (
  <DashboardLayout>
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Home &gt; Impact History</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Civic Impact History
          </h1>
          <p className="text-sm text-muted-foreground">
            Audit trail of resolved urban issues and community accountability.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-secondary transition">
            <Share2 className="h-4 w-4" />
            Share
          </button>

          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm hover:opacity-90 transition">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconColor}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-foreground">
                {card.value}
              </span>
              <span className="text-sm font-semibold text-success">
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <button className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-secondary transition">
          <Calendar className="h-4 w-4" />
          Last 30 Days
        </button>

        <button className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-secondary transition">
          <Filter className="h-4 w-4" />
          All Issue Types
        </button>

        <button className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-secondary transition">
          <MapPin className="h-4 w-4" />
          All Neighborhoods
        </button>

        <span className="ml-auto text-sm text-muted-foreground self-center">
          Showing 150 archived reports
        </span>
      </div>

      {/* Resolved Items */}
      <div className="space-y-4">
        {resolvedItems.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${item.deptColor}`}>
                    {item.dept}
                  </span>
                  <span className="text-xs text-muted-foreground">· Resolved</span>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground">
                  {item.title}
                </h3>

                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </p>

                {/* Timeline */}
                <div className="mt-4 flex items-center gap-0">
                  {["REPORTED", "FIXED", "VERIFIED"].map((step, i) => (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                        </div>

                        <p className="text-[9px] uppercase text-muted-foreground mt-1">
                          {step}
                        </p>

                        <p className="text-[10px] font-medium text-foreground">
                          {[item.reported, item.fixed, item.verified][i]}
                        </p>
                      </div>

                      {i < 2 && (
                        <div className="h-0.5 w-16 sm:w-32 bg-primary mx-1 -mt-5" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Verified by:
                    <span className="font-semibold text-foreground ml-1">
                      {item.verifier}
                    </span>
                  </span>

                  <span>
                    Total Duration:
                    <span className="font-semibold text-foreground ml-1">
                      {item.duration}
                    </span>
                  </span>
                </div>
              </div>

              <Link
                to={`/reports/${item.title}`}
                className="text-sm font-semibold text-primary hover:underline mt-auto"
              >
                View Details →
              </Link>

            </div>
          </div>
        ))}
      </div>

    </div>
  </DashboardLayout>
);

export default Analytics;
