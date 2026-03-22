import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Calendar } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { useNavigate } from "react-router-dom";
// ✅ Firebase
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


// ✅ API imports
import { getCurrentLocation } from "../../../api/locationApi";

const CitizenRegister = () => {
const navigate = useNavigate();
const [form, setForm] = useState({
name: "",
email: "",
mobile: "",
dob: "",
gender: "",
address: "",
location: "",
latitude: "",
longitude: "",
password: "",
confirmPassword: "",
agree: false,
});

const [error, setError] = useState("");

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
setForm({
...form,
[name]: type === "checkbox" ? checked : value,
});
};


// ✅ Get GPS Location (same as your code)
const handleGetLocation = async () => {
  try {
    const coords = await getCurrentLocation();

    setForm((prev) => ({
      ...prev,
      location: `${coords.latitude}, ${coords.longitude}`,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));

  } catch (error) {
    alert("Location error: " + error);
  }
};


// ✅ Submit with Firebase + Backend
// ✅ Submit with Firebase + Backend
const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (!form.agree) {
    setError("Please accept Terms & Privacy Policy");
    return;
  }

  setError("");

  try {
    // 🔥 Step 1: Create Firebase User
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    const firebaseUser = userCredential.user;

    // ✅ IMPORTANT: Force refresh token
    const token = await firebaseUser.getIdToken(true);

    console.log("Firebase Token:", token);

    // 🔥 Step 2: Send Profile Data to Backend
    const response = await fetch(
      "http://localhost:5000/api/users/create-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          mobile: form.mobile,
          dob: form.dob,
          gender: form.gender,
          address: form.address,
          latitude: form.latitude,
          longitude: form.longitude,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      //delete user if backend fails
      await firebaseUser.delete();

      throw new Error(data.message || "Registration failed");
    }

    // ✅ Save user & token
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Registration successful 🎉");
    navigate("/dashboard");

  } catch (err) {
    console.error("Register Error:", err);
    setError(err.message);
  }
};


return ( 
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100"> 
<LandingNavbar />

  {/* Left Side — Visual */} 
  <div className="hidden lg:flex items-center justify-center p-12">
     <div className="max-w-md text-center">
       <h2 className="text-4xl font-bold mb-6"> Build Smarter Cities Together </h2>
        <p className="text-gray-600">
          Join the citizen network helping improve infrastructure,
          transparency, and urban safety using AI-powered reporting.
        </p>
         <div className="mt-10 bg-white rounded-2xl shadow-lg p-6"> 
          <p className="text-blue-600 font-bold text-2xl">12,000+</p>
          <p className="text-sm text-gray-600">
            Issues resolved thanks to citizens
          </p>
         </div>
     </div>
  </div>


  <div className="flex items-center justify-center px-6 py-12">
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">

      <h1 className="text-3xl font-bold text-center mb-2">
        Citizen Registration
      </h1>

      <p className="text-center text-gray-600 mb-8">
        Create your account to start reporting civic issues
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Mobile */}
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* DOB + Gender */}
        <div className="grid md:grid-cols-2 gap-4">

          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

        </div>

        {/* Address */}
        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            name="location"
            placeholder="City / Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleGetLocation}
          className="text-blue-600 text-sm"
        >
          Use Current Location
        </button>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
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

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Terms */}
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            required
          />
          I agree to the Terms & Privacy Policy
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          Create Account
        </button>

        {/* Login */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login-citizen" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>

      </form>
    </div>
  </div>
</div>
);
};

export default CitizenRegister;