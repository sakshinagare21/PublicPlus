import DashboardLayout from "../../layout/DashboardLayout";
import {
  MapPin,
  Search,
  Filter,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { useState } from "react";

const categories = [
  { label: "Infrastructure", checked: true },
  { label: "Sanitation", checked: true },
  { label: "Utilities & Power", checked: false },
  { label: "Public Safety", checked: false },
];

const severities = [
  { label: "Critical / High", color: "bg-destructive", active: true },
  { label: "Moderate", color: "bg-warning", active: true },
  { label: "Minor / Low", color: "bg-success", active: false },
];

const statuses = ["Reported", "In Progress", "Under Review", "Resolved"];

const MapView = () => {
  const [showDetail, setShowDetail] = useState(true);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-7rem)] gap-0 -m-6">

        {/* Filter Sidebar */}
        <div className="hidden w-60 shrink-0 border-r border-border bg-background p-5 overflow-auto lg:block">

          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-sm font-bold text-foreground">
              Filter Panel
            </h2>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Refine civic issues on the map
          </p>

          {/* Categories */}
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
              Issue Categories
            </p>

            <div className="space-y-2">
              {categories.map((c) => (
                <label
                  key={c.label}
                  className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                >
                  {c.checked ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4 text-muted-foreground" />
                  )}
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
              Severity Level
            </p>

            <div className="space-y-2">
              {severities.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    s.active ? "bg-secondary" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${s.color}`} />
                    <span
                      className={
                        s.active
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {s.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
              Status
            </p>

            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    s === "In Progress"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition">
            Apply Current View
          </button>

        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-secondary/30">

          {/* Search */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search location..."
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm shadow-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-primary/30" />
              <p className="font-display text-lg font-bold">
                Interactive Map View
              </p>
              <p className="text-sm">
                Map integration displays fault locations here
              </p>
            </div>
          </div>

          {/* Detail Overlay */}
          {showDetail && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-2xl">

              <button
                onClick={() => setShowDetail(false)}
                className="absolute right-4 top-4 rounded-full bg-secondary p-1 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                CRITICAL SEVERITY
              </span>

              <h3 className="font-display text-lg font-bold text-foreground mt-2">
                Large Pothole - Case #1042
              </h3>

              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                North Avenue & Milwaukee Ave
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">
                    Assigned Department
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Dept. of Public Works
                  </p>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">
                    Reported On
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Oct 24, 2023
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 border border-border py-2 rounded-lg hover:bg-secondary transition">
                  Full Report
                </button>

                <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition">
                  Notify Me
                </button>
              </div>

            </div>
          )}

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              SYSTEM LIVE · Last Data Sync: 1 minute ago
            </span>
            <span>DISPLAYING 42 ACTIVE FAULTS</span>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default MapView;
