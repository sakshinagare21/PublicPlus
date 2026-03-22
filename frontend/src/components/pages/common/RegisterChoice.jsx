import { Link } from "react-router-dom";
import { User, Shield, Building2 } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { UserCog } from "lucide-react";
const RegisterChoice = () => {
return ( 
  <>
  <LandingNavbar/>
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-6"> <div className="max-w-6xl w-full text-center">
  

    {/* Header */}
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      Join Civic Intelligence
    </h1>

    <p className="text-gray-600 mb-14 text-lg">
      Choose how you want to participate in building smarter cities
    </p>

    {/* Cards */}
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      {/* Citizen */}
      <div className="group bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3">

        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition">
          <User className="w-8 h-8 text-blue-600 group-hover:text-white transition" />
        </div>

        <h2 className="text-xl font-semibold mb-3">
          Register as Citizen
        </h2>

        <p className="text-gray-600 mb-6">
          Report civic issues, track progress, and contribute to improving
          your city infrastructure.
        </p>

        <Link to="/register-citizen">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition">
            Continue as Citizen
          </button>
        </Link>
      </div>

      {/* Admin */}
      <div className="group bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3">

        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition">
          <Shield className="w-8 h-8 text-purple-600 group-hover:text-white transition" />
        </div>

        <h2 className="text-xl font-semibold mb-3">
          Login as Admin
        </h2>

        <p className="text-gray-600 mb-6">
          Manage reports, assign tasks, and monitor city infrastructure
          operations efficiently.
        </p>

        <Link to="/admin-login">
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 active:scale-95 transition">
            Continue as Admin
          </button>
        </Link>
      </div>

      {/* Department */}
      <div className="group bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3">

        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition">
          <Building2 className="w-8 h-8 text-green-600 group-hover:text-white transition" />
        </div>

        <h2 className="text-xl font-semibold mb-3">
          Department
        </h2>

        <p className="text-gray-600 mb-6">
          Handle infrastructure issues and assign repair tasks.
        </p>

        <Link to="/department-register">
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 active:scale-95 transition">
            Continue
          </button>
        </Link>
      </div>
      

      {/* Operator */}
      <div className="group bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3">

  {/* Icon */}
  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition">
    <UserCog className="w-8 h-8 text-blue-600 group-hover:text-white transition" />
  </div>

  {/* Title */}
  <h2 className="text-xl font-semibold mb-3 text-center">
    Operator
  </h2>

  {/* Description */}
  <p className="text-gray-600 mb-6 text-center">
    Manage assigned field tasks, update issue status, and upload work proof.
  </p>

  {/* Button */}
  <Link to="/operator-register">
    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition">
      Continue
    </button>
  </Link>

</div>
    </div>
  </div>
</div>
</>
);
};

export default RegisterChoice;
