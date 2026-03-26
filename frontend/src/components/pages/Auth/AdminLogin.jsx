
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, Mail, Lock } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";
const AdminLogin = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // 1️⃣ Firebase Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 2️⃣ Get Firebase token
      const token = await userCredential.user.getIdToken();
      console.log("FRONTEND UID:", userCredential.user.uid);
      // 3️⃣ Verify admin from backend
      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("You are not authorized as admin");
      }

      const data = await response.json();

      // 4️⃣ Store session
      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(data));

      // 5️⃣ Redirect to dashboard
      
    toast.success("Admin login successful");

    setTimeout(() => {
      navigate("/admin");
    }, 1200);

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <LandingNavbar />

      <div className="flex flex-1">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-12">

          <div className="max-w-md text-center">

            <h2 className="text-4xl font-bold mb-6">
              Secure Admin Control Center
            </h2>

            <p className="text-gray-600">
              Manage civic operations, oversee infrastructure reports,
              and ensure transparency with intelligent monitoring.
            </p>

            <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">

              <p className="text-blue-600 font-bold text-2xl">
                12,000+
              </p>

              <p className="text-sm text-gray-600">
                Infrastructure issues managed
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-6 py-12 w-full lg:w-1/2">

          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">

            <div className="text-center mb-8">

              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold">
                Admin Login
              </h2>

              <p className="text-gray-500 text-sm">
                Access the secure management dashboard
              </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="accent-blue-600" />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
              >
                Login to Dashboard
              </button>

              {/* Back Link */}
              <p className="text-center text-sm text-gray-500">
                Not an admin?{" "}
                <Link to="/" className="text-blue-600 font-medium">
                  Return to main site
                </Link>
              </p>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;

