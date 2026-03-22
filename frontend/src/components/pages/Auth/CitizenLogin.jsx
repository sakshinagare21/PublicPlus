import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingNavbar from "../../layout/LandingNavbar";


import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";

const CitizenLogin = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // 🔹 Send Firebase token to backend
  // 🔹 Send Firebase token to backend
const sendTokenToBackend = async (token) => {

  const response = await fetch(
    "http://localhost:5000/api/users/login", // ✅ correct route
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // ✅ important
      },
    }
  );

  if (!response.ok) {
    throw new Error("Backend login failed");
  }

  return response.json();
};


  // 🔹 Email Login
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1️⃣ Login with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    // 2️⃣ Get Firebase ID token
    const token = await userCredential.user.getIdToken();

    // 3️⃣ Send token to backend
    const data = await sendTokenToBackend(token);

    // 4️⃣ Store both token + backend user
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data));

    alert("Login successful");
    navigate("/dashboard");

  } catch (error) {
    alert(error.message);
  }
};


  // 🔹 Google Login
  const handleGoogleLogin = async () => {
  try {

    // 1️⃣ Login with Google
    const result = await signInWithPopup(auth, googleProvider);

    // 2️⃣ Get Firebase token
    const token = await result.user.getIdToken();

    // 3️⃣ Send token to backend
    const data = await sendTokenToBackend(token);

    // 4️⃣ Save session
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data));

    alert("Google login successful");

    navigate("/dashboard");

  } catch (error) {
    console.error(error);
    alert("Google login failed: " + error.message);
  }

 

};


  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNavbar />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Login to continue to Civic Platform
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="w-full border rounded-lg px-4 py-2 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border py-3 rounded-lg mt-2"
            >
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register-citizen" className="text-blue-600">
                Register
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;