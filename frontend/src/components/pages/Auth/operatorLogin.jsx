import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

const OperatorLogin = () => {

  const navigate = useNavigate();

  const [showPassword,setShowPassword] = useState(false);

  const [form,setForm] = useState({
    email:"",
    password:"",
    remember:false
  });

  const handleChange = (e)=>{
    const {name,value,type,checked} = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{

      /* 1️⃣ Firebase Login */

      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      /* 2️⃣ Get Firebase Token */

      const token = await user.getIdToken();

      /* 3️⃣ Call Backend Login API */

      const res = await fetch(
        "http://localhost:5000/api/operator/login",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message);
      }

      /* 4️⃣ Save token */

      localStorage.setItem("token",token);

      toast.success("Login successful");

      /* 5️⃣ Navigate */

      navigate("/operator/dashboard");

    }catch(err){

      toast.error(err.message);

    }
  };

  return (
    <>
      <LandingNavbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

        <div className="bg-white w-full max-w-md rounded-xl shadow-md p-8">

          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 p-4 rounded-xl">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>

            <h1 className="text-2xl font-semibold mt-4">PublicPlus</h1>

            <p className="text-gray-500 text-sm">
              Field Service Management Operator Portal
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
            alt="Operator"
            className="rounded-lg mb-6"
          />

          <h2 className="text-lg font-semibold mb-1">
            Operator Login
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            Access your PublicPlus dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm mb-1">
                Operator Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@company.com"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>

              <div className="flex justify-between text-sm mb-1">
                <label>Password</label>
              </div>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 pr-10"
                />

                <div
                  className="absolute right-3 top-2.5 cursor-pointer"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </div>

              </div>

            </div>

            <div className="flex items-center gap-2 text-sm">

              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />

              <label>Keep me signed in</label>

            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Sign In
            </button>

          </form>

          <div className="text-center mt-6 text-sm">

            <span>New Operator? </span>

            <Link
              to="/operator-register"
              className="text-blue-600 hover:underline"
            >
              Register here
            </Link>

          </div>

        </div>

      </div>
    </>
  );
};

export default OperatorLogin;