import { useState, useEffect } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
User,
Shield,
Briefcase,
LogOut,
AlertTriangle,
} from "lucide-react";
import axios from "axios";

const ProfileOperator = () => {
const [operator, setOperator] = useState(null);

const [passwordForm, setPasswordForm] = useState({
current: "",
newPass: "",
confirm: "",
});

const handleChange = (e) => {
setPasswordForm({
...passwordForm,
[e.target.name]: e.target.value,
});
};

const handlePasswordUpdate = () => {
if (passwordForm.newPass !== passwordForm.confirm) {
alert("Passwords do not match");
return;
}

toast.success("Password Updated Successfully"); // STATIC ONLY

};

/* ================= FETCH PROFILE ================= */
const fetchProfile = async () => {
try {
const res = await axios.get(
"http://localhost:5000/api/operator/profile",
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
}
);

  setOperator(res.data);
} catch (err) {
  console.error("Profile error:", err);
}


};

useEffect(() => {
fetchProfile();
}, []);

if (!operator) {
return ( <OperatorLayout> <p className="p-6 text-gray-400">Loading...</p> </OperatorLayout>
);
}

return ( <OperatorLayout> <div className="space-y-8">


    {/* ===== HEADER (DYNAMIC) ===== */}
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
        {operator.fullName?.charAt(0)}
      </div>

      <div>
        <h1 className="text-2xl font-bold">
          {operator.fullName}
        </h1>

        <p className="text-gray-400 text-sm">
          Operator · ID: {operator._id.slice(-6)}
        </p>

        <div className="flex gap-3 mt-2">
          <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs">
            {operator.status.toUpperCase()}
          </span>
          <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
            {operator.approvalStatus}
          </span>
        </div>
      </div>
    </div>

    {/* ===== MAIN GRID ===== */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT SIDE (DYNAMIC) */}
      <div className="lg:col-span-2 space-y-6">

        {/* Personal Info */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={18} />
            <h3 className="font-semibold">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">

            <div>
              <p className="text-gray-400">Full Name</p>
              <p>{operator.fullName}</p>
            </div>

            <div>
              <p className="text-gray-400">Official Email</p>
              <p className="text-blue-400">
                {operator.email}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Phone Number</p>
              <p>{operator.phoneNumber || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-400">Firebase UID</p>
              <p className="truncate">
                {operator.firebaseUID}
              </p>
            </div>

          </div>
        </div>

        {/* Work Details */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase size={18} />
            <h3 className="font-semibold">
              Work Details
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">

            <div>
              <p className="text-gray-400">Assigned Zone</p>
              <p>
                {operator.assignedZone?.zoneName || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Department</p>
              <p>
                {operator.departmentId?.departmentName || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Active Tasks</p>
              <p>{operator.currentActiveTasks}</p>
            </div>

            <div>
              <p className="text-gray-400">Max Capacity</p>
              <p>{operator.maxCapacity}</p>
            </div>

          </div>
        </div>

      </div>

      {/* RIGHT SIDE (STATIC - UNCHANGED) */}
      <div className="space-y-6">

        {/* Security */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Shield size={18} />
            <h3 className="font-semibold">
              Security
            </h3>
          </div>

          <input
            type="password"
            name="current"
            placeholder="Current Password"
            value={passwordForm.current}
            onChange={handleChange}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
          />

          <input
            type="password"
            name="newPass"
            placeholder="New Password"
            value={passwordForm.newPass}
            onChange={handleChange}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={passwordForm.confirm}
            onChange={handleChange}
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
          />

          <button
            onClick={handlePasswordUpdate}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition"
          >
            Update Password
          </button>
        </div>

        {/* Account Actions */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">
            Account Actions
          </h3>

          <button className="w-full border border-gray-700 py-2 rounded-lg hover:bg-[#162235] transition flex items-center justify-center gap-2">
            <LogOut size={16} />
            Log Out from all devices
          </button>

          <button className="w-full text-red-500 hover:text-red-400 flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            Deactivate Account
          </button>
        </div>

      </div>

    </div>

  </div>
</OperatorLayout>

);
};

export default ProfileOperator;
