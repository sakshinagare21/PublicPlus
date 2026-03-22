import React from "react";
import toast from "react-hot-toast";
import { MapPin, Eye, Settings } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const zones = [
  { name: "Zone A-12", area: "Central District", status: "Active", priority: "High", incidents: 42, type: "critical" },
  { name: "Zone B-07", area: "Harbor Side", status: "Active", priority: "Medium", incidents: 18, type: "warning" },
  { name: "Zone C-04", area: "North Quarter", status: "Monitoring", priority: "Low", incidents: 7, type: "info" },
  { name: "Zone D-15", area: "Industrial East", status: "Active", priority: "High", incidents: 31, type: "critical" },
  { name: "Zone E-09", area: "East District", status: "Active", priority: "Medium", incidents: 14, type: "warning" },
];

export default function ZoneMapping() {

  const handleSettings = () => {
    toast("Opening settings...");
  };

  const handleZoneClick = (zone) => {
    toast.success(`${zone.name} — ${zone.incidents} incidents`);
  };

  const handleView = (zone) => {
    toast(`Viewing ${zone.name}`);
  };

  return (
    <AdminLayout>
    <div className="space-y-6 bg-black text-white min-h-screen p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Zone Mapping & Monitoring</h1>
        <button
          onClick={handleSettings}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Map */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <div className="relative h-[400px] bg-gradient-to-br from-black via-gray-900 to-black">

          <svg className="absolute inset-0 w-full h-full opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#3b82f6" strokeWidth="0.5"/>
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#3b82f6" strokeWidth="0.5"/>
            ))}
          </svg>

          {[
            { x: "25%", y: "35%", color: "bg-red-500" },
            { x: "55%", y: "55%", color: "bg-yellow-500" },
            { x: "75%", y: "25%", color: "bg-blue-500" },
            { x: "40%", y: "70%", color: "bg-red-500" },
            { x: "65%", y: "45%", color: "bg-yellow-500" },
          ].map((marker, i) => (
            <button
              key={i}
              onClick={() => handleZoneClick(zones[i])}
              className={`absolute w-5 h-5 rounded-full ${marker.color} animate-pulse hover:scale-150 transition-transform`}
              style={{ left: marker.x, top: marker.y }}
            />
          ))}

        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">

          <thead>
            <tr className="text-xs text-gray-400 tracking-wider border-b border-gray-800">
              <th className="text-left p-4">ZONE</th>
              <th className="text-left p-4">AREA</th>
              <th className="text-left p-4">STATUS</th>
              <th className="text-left p-4">PRIORITY</th>
              <th className="text-left p-4">INCIDENTS</th>
              <th className="text-left p-4">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {zones.map((zone) => (
              <tr key={zone.name} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">

                <td className="p-4 font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {zone.name}
                </td>

                <td className="p-4 text-gray-400">{zone.area}</td>

                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${
                    zone.status === "Active"
                      ? "bg-green-900/40 text-green-400"
                      : "bg-blue-900/40 text-blue-400"
                  }`}>
                    {zone.status}
                  </span>
                </td>

                <td className={`p-4 text-xs font-bold ${
                  zone.type === "critical"
                    ? "text-red-400"
                    : zone.type === "warning"
                    ? "text-yellow-400"
                    : "text-blue-400"
                }`}>
                  {zone.priority}
                </td>

                <td className="p-4">{zone.incidents}</td>

                <td className="p-4">
                  <button
                    onClick={() => handleView(zone)}
                    className="flex items-center gap-1 text-blue-400 hover:underline text-xs"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
</AdminLayout>
  );
}
