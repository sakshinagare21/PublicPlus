import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import OperatorLayout from "../../layout/OperatorLayout";
import {
  User,
  Shield,
  Briefcase,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { updatePassword } from "firebase/auth";
import { auth } from "../../../firebase";

const ProfileOperator = () => {
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    newPass: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handlePasswordUpdate = async () => {
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) {
      toast.error("New passkey must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("Confirm passkey mismatch.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, passwordForm.newPass);
        toast.success("Identity passkey updated. Security termination initiated.");
        
        // Finalize Operator Session
        setTimeout(() => {
          logout();
          auth.signOut();
          navigate("/operator-login");
        }, 1500);

        setPasswordForm({ newPass: "", confirm: "" });
      } else {
        toast.error("Session expired.");
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Security critical: Please re-login to calibrate passkey.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/operator/profile`,
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
    return (
      <OperatorLayout>
        <p className="p-6 text-gray-400">Loading...</p>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout>
      <div className="space-y-8">

        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-8 p-8 bg-card border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>

          <div className="w-24 h-24 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl">
            {operator.fullName?.charAt(0)}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-foreground">
              {operator.fullName}
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Operator ID: {operator._id.slice(-6)}
            </p>

            <div className="flex gap-4 mt-4">
              <span className="bg-success text-white px-4 py-1 rounded-xl text-xs font-medium">
                {operator.status}
              </span>
              <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-xl text-xs font-medium">
                {operator.approvalStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info */}
            <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <User size={20} className="text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Name
                  </p>
                  <p className="font-semibold text-foreground">
                    {operator.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Email
                  </p>
                  <p className="font-semibold text-primary">
                    {operator.email}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Phone Number
                  </p>
                  <p className="font-semibold text-foreground">
                    {operator.phoneNumber || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    User ID
                  </p>
                  <p className="text-muted-foreground text-xs truncate">
                    {operator.firebaseUID}
                  </p>
                </div>

              </div>
            </div>

            {/* Work Details */}
            <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase size={20} className="text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Work Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Assigned Zone
                  </p>
                  <p className="font-semibold text-foreground">
                    {operator.assignedZone?.zoneName || "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Department
                  </p>
                  <p className="font-semibold text-foreground">
                    {operator.departmentId?.departmentName || "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Active Tasks
                  </p>
                  <p className="font-semibold text-primary text-lg">
                    {operator.currentActiveTasks}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Capacity
                  </p>
                  <p className="font-semibold text-foreground text-lg">
                    {operator.maxCapacity}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* Security */}
            <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Update Passkey
                </h3>
              </div>

              <input
                type="password"
                name="newPass"
                placeholder="New Security Passkey"
                value={passwordForm.newPass}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all font-medium"
              />

              <input
                type="password"
                name="confirm"
                placeholder="Confirm Security Passkey"
                value={passwordForm.confirm}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all font-medium"
              />

              <button
                onClick={handlePasswordUpdate}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-[11px] tracking-widest hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "COMMITTING UPDATE..." : "UPDATE IDENTITY KEY"}
              </button>
            </div>

            {/* Account Actions */}
            <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                Account Actions
              </h3>

              <button className="w-full bg-background border border-border py-4 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:border-primary flex items-center justify-center gap-3">
                <LogOut size={16} className="text-primary" />
                Logout from all devices
              </button>

              <button className="w-full text-destructive text-sm flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
                <AlertTriangle size={16} />
                Delete account
              </button>
            </div>

          </div>

        </div>

      </div>
    </OperatorLayout>
  );
};

export default ProfileOperator;

