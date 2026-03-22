import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  BadgeCheck,
} from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DepartmentRegister = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    departmentName: "",
    departmentId: "",
    headName: "",
    officialEmail: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    let firebaseUser = null;

    try {

      /* Step 1 — Create Firebase user */

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.officialEmail,
        form.password
      );

      firebaseUser = userCredential.user;

      const token = await firebaseUser.getIdToken(true);

      /* Step 2 — Send data to backend */

      const response = await fetch(
        "http://localhost:5000/api/departments/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            departmentName: form.departmentName,
            departmentCode: form.departmentId,
            description: form.headName,
            contactPhone: form.phone,
            officeAddress: form.location,
            city: "Default City", // required by backend
            role: "department_admin"
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      /* Step 3 — Success */

      toast.success(
        "Department registered successfully. Waiting for admin approval."
      );

      /* redirect to login */

      setTimeout(() => {
        navigate("/department-login");
      }, 1500);

    } catch (error) {

      /* Step 4 — If backend fails delete firebase user */

      if (firebaseUser) {
        try {
          await firebaseUser.delete();
        } catch (deleteError) {
          console.log("Firebase cleanup failed:", deleteError);
        }
      }

      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LandingNavbar />

      <div className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10">

          <div className="text-center mb-10">

            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-gray-700" />
            </div>

            <h2 className="text-3xl font-bold">
              Department Registration
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Register your municipal department to access the civic platform
            </p>

          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            <div className="relative">
              <Building2 className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="departmentName"
                placeholder="Department Name"
                value={form.departmentName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>

            <div className="relative">
              <BadgeCheck className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="departmentId"
                placeholder="Department Code / ID"
                value={form.departmentId}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="headName"
                placeholder="Head of Department"
                value={form.headName}
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
                placeholder="Official Email"
                value={form.officialEmail}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                placeholder="Contact Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="location"
                placeholder="Office Location / Address"
                value={form.location}
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

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black"
              >
                Register Department
              </button>
            </div>

            <div className="md:col-span-2 text-center text-sm text-gray-500">
              Already registered?{" "}
              <Link
                to="/department-login"
                className="text-gray-900 font-medium hover:underline"
              >
                Login here
              </Link>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default DepartmentRegister;