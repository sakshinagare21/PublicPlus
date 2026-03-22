import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, LogOut } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const zones = [
  { name: "Downtown Core", coords: "40.7128° N, 74.0060° W", dept: "Urban Planning" },
  { name: "East District", coords: "40.7300° N, 73.9800° W", dept: "Public Works" },
];

const categories = ["Road Repair", "Green Spaces", "Street Lighting"];

export default function SettingsPage() {
  const [platformName, setPlatformName] = useState("CityResponse AI Platform");
  const [language, setLanguage] = useState("English (Universal)");
  const [aiTriage, setAiTriage] = useState(true);
  const [sensitivity, setSensitivity] = useState(85);
  const [activeNav, setActiveNav] = useState("Preferences");
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const navItems = [
    { group: "MAIN MENU", items: [{ label: "Overview" }] },
    {
      group: "CONFIGURATIONS",
      items: [
        { label: "Preferences" },
        { label: "Zone Config" },
        { label: "Issue Categories" },
        { label: "API Integrations" },
        { label: "Security" },
      ],
    },
  ];

  const markChanged = () => {
    if (!hasUnsaved) setHasUnsaved(true);
  };

  return (
    <AdminLayout>
    <div className="flex gap-6 min-h-screen text-gray-200">

      {/* Sidebar */}
      <div className="w-56 shrink-0 space-y-6 bg-gray-900 border-r border-gray-800 p-4">

        {navItems.map((group) => (
          <div key={group.group}>
            <p className="text-xs tracking-widest text-gray-400 mb-2">
              {group.group}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeNav === item.label
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* User */}
        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
              👤
            </div>

            <div>
              <p className="text-white font-medium">Alex Rivera</p>
              <p className="text-xs">System Architect</p>
            </div>

            <button
              onClick={() => toast.success("Logged Out")}
              className="ml-auto hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 space-y-6 p-6">

        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-sm text-gray-400">
              Configure global platform behavior and AI engine parameters.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setHasUnsaved(false);
                toast("Changes discarded");
              }}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-blue-500"
            >
              Discard
            </button>

            <button
              onClick={() => {
                setHasUnsaved(false);
                toast.success("Settings saved");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-2 gap-6">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <label className="text-sm">Platform Display Name</label>
            <input
              value={platformName}
              onChange={(e) => {
                setPlatformName(e.target.value);
                markChanged();
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            />

            <label className="text-sm">Default Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                markChanged();
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option>English (Universal)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">

            <div className="flex justify-between">
              <span>AI Auto-Triage</span>

              <button
                onClick={() => {
                  setAiTriage(!aiTriage);
                  markChanged();
                  toast(`AI Auto-Triage ${!aiTriage ? "ON" : "OFF"}`);
                }}
                className={`w-12 h-6 rounded-full ${
                  aiTriage ? "bg-blue-600" : "bg-gray-700"
                }`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Confidence Sensitivity</span>
                <span className="text-blue-400">{sensitivity}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sensitivity}
                onChange={(e) => {
                  setSensitivity(Number(e.target.value));
                  markChanged();
                }}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Zones */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-4 text-left">ZONE NAME</th>
                <th className="p-4 text-left">COORDINATES</th>
                <th className="p-4 text-left">DEPARTMENT</th>
                <th className="p-4 text-left">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {zones.map((zone) => (
                <tr key={zone.name} className="hover:bg-gray-800">
                  <td className="p-4">{zone.name}</td>
                  <td className="p-4 text-gray-400">{zone.coords}</td>
                  <td className="p-4">{zone.dept}</td>
                  <td className="p-4 flex gap-2">
                    <Pencil
                      className="w-4 h-4 cursor-pointer hover:text-white"
                      onClick={() => toast(`Editing ${zone.name}`)}
                    />
                    <Trash2
                      className="w-4 h-4 cursor-pointer text-red-400"
                      onClick={() => toast.error(`Delete ${zone.name}?`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unsaved Banner */}
        {hasUnsaved && (
          <div className="fixed bottom-0 left-0 right-0 bg-blue-600/20 border-t border-blue-600 px-6 py-3 flex justify-between">
            <span>You have unsaved configuration changes</span>

            <button
              onClick={() => {
                setHasUnsaved(false);
                toast.success("Saved");
              }}
              className="text-blue-400 font-medium"
            >
              Review Now
            </button>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
