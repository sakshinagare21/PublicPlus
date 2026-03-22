import { Link } from "react-router-dom";
import { useState } from "react";
import { Building2, Mail, Lock, BadgeCheck } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

const DepartmentLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    departmentId: "",
    officialEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.officialEmail,
        form.password
      );

      const token = await userCredential.user.getIdToken(true);

      const response = await fetch(
        "http://localhost:5000/api/departments/login",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("department", JSON.stringify(data.department));
      localStorage.setItem("token", token);

      toast.success("Login successful");

      navigate("/department/dashboard");

    } catch (error) {

      toast.error(error.message);

    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LandingNavbar />

      <div className="flex flex-1">
        {/* UI remains exactly the same */}

        <div className="flex items-center justify-center px-6 py-12 w-full lg:w-1/2">

          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">

            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold">
                Department Login
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="relative">
                <BadgeCheck className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="departmentId"
                  placeholder="Department ID / Code"
                  value={form.departmentId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg pl-10 pr-4 py-3"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="officialEmail"
                  placeholder="Official Department Email"
                  value={form.officialEmail}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg pl-10 pr-4 py-3"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg pl-10 pr-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Login to Department Dashboard
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DepartmentLogin;