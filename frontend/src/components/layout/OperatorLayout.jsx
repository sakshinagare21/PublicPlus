import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Camera,
  User,
  LogOut,
  Search,
} from "lucide-react";
import axios from "axios";

const OperatorLayout = ({ children }) => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);

  /* ================= FETCH OPERATOR ================= */
  const fetchOperator = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/operator/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setOperator(res.data);
    } catch (err) {
      console.error("Operator fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOperator();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ remove token
    navigate("/operator-login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0f172a] to-[#0b1120] text-gray-200">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-[#0b1624] border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-blue-400">PublicPlus</h1>
          <p className="text-xs text-gray-400">FIELD OPERATOR</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-4 text-sm">
          <NavLink
            to="/operator/dashboard"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/operator/tasks"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
          >
            <ClipboardList size={18} />
            My Tasks
          </NavLink>

          <NavLink
            to="/operator/upload-proof"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
          >
            <Camera size={18} />
            Upload Proof
          </NavLink>

          <NavLink
            to="/operator/profile"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
          >
            <User size={18} />
            Profile
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-600/20 transition text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Operator Dashboard</h2>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                className="bg-[#0b1624] border border-gray-700 pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* Operator Name */}
            <p className="text-sm text-gray-300">
              {operator?.fullName || "Loading..."}
            </p>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              {operator?.fullName?.charAt(0) || "O"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default OperatorLayout;
