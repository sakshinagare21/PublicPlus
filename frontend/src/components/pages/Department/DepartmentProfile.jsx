import DepartmentLayout from "../../layout/DepartmentLayout";
import { User, Shield } from "lucide-react";

const DepartmentProfile = () => {
  return (
    <DepartmentLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Department Admin Profile
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your account information and security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: PROFILE INFO */}
          <div className="lg:col-span-2 bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-6">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                JD
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  James Wilson
                </h2>
                <p className="text-gray-400 text-sm">
                  Head of Urban Maintenance
                </p>
              </div>
            </div>

            <div className="space-y-4">

              <input
                defaultValue="Urban Maintenance Department"
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
              />

              <input
                defaultValue="j.wilson@publicplus.gov"
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
              />

              <input
                defaultValue="+1 555 234 5678"
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
              />

              <textarea
                defaultValue="Central Municipal Office, Ward 4"
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
              />

              <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg">
                Update Profile
              </button>

            </div>

          </div>

          {/* RIGHT: SECURITY PANEL */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-6">

            <h3 className="font-semibold text-lg">
              Security
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Role</span>
                <span>Department Admin</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Account Status</span>
                <span className="text-green-400">Active</span>
              </div>

            </div>

            <button className="w-full border border-gray-700 rounded-lg py-2 hover:bg-[#162235] transition">
              Change Password
            </button>

            <button className="w-full border border-gray-700 rounded-lg py-2 hover:bg-[#162235] transition">
              Logout All Sessions
            </button>

          </div>

        </div>

      </div>
    </DepartmentLayout>
  );
};

export default DepartmentProfile;