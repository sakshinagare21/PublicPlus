import DepartmentLayout from "../../layout/DepartmentLayout";

const Zones = () => {
  return (
    <DepartmentLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">
            Zones & Geographic Monitoring
          </h1>
          <p className="text-gray-400 text-sm">
            Monitor issue density and performance by zone
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#111c2e] p-4 rounded-xl border border-gray-800 flex gap-4">
          <select className="bg-[#0f172a] border border-gray-700 p-2 rounded">
            <option>All Zones</option>
            <option>North Zone</option>
            <option>Central Zone</option>
          </select>

          <select className="bg-[#0f172a] border border-gray-700 p-2 rounded">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        {/* Map + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Map Area */}
          <div className="lg:col-span-2 bg-[#111c2e] border border-gray-800 rounded-xl p-6 h-[400px]">
            <p className="text-gray-400">
              Map will be displayed here (Leaflet / Google Maps)
            </p>
          </div>

          {/* Analytics Panel */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">
              Zone Analytics
            </h3>

            <div className="space-y-2 text-sm">
              <p>Total Issues: 124</p>
              <p>Active: 32</p>
              <p>Overdue: 5</p>
              <p>SLA Compliance: 92%</p>
            </div>

            <div className="w-full h-2 bg-gray-800 rounded">
              <div className="h-2 bg-green-500 rounded w-[92%]"></div>
            </div>
          </div>

        </div>

        {/* Zone Table */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">
            Zone performance table here...
          </p>
        </div>

      </div>
    </DepartmentLayout>
  );
};

export default Zones;