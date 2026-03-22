import { useState, useEffect } from "react";
import { User, Briefcase } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

const OperatorRegister = () => {
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    contact: "",
    department: "",
    password: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/departments/list");

        const data = await res.json();

        setDepartments(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.department) {
      toast.error("Please select department");
      return;
    }

    let firebaseUser = null;

    try {
      /* create firebase account */

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      firebaseUser = userCredential.user;

      const token = await firebaseUser.getIdToken(true);

      /* call backend */

      const res = await fetch("http://localhost:5000/api/operator/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.contact,
          departmentId: form.department,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Operator request sent to department");

      /* reset form */

      setForm({
        fullName: "",
        employeeId: "",
        email: "",
        contact: "",
        department: "",
        password: "",
      });
    } catch (err) {
      if (firebaseUser) {
        await firebaseUser.delete();
      }

      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <LandingNavbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-500 mb-3">
          Dashboard &gt; Operator Registration
        </p>

        <h2 className="text-3xl font-bold mb-2">Operator Registration</h2>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={form.contact}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              />

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
              >
                <option value="">Select Department</option>

                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-6"
            >
              Register Operator
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/operator-login"
                className="text-blue-600 hover:underline"
              >
                Return to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OperatorRegister;
