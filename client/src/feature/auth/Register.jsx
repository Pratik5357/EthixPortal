import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    designation: "",
    qualification: "",
    department: "",
    subDepartment: "",
    institution: "",
    contact: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/users/register", {
        ...form,
        role: "researcher" 
      });

      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT — Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="bg-blue-600 p-3 rounded-xl mr-4">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">EthixPortal</h1>
              <p className="text-gray-600">Institutional Ethics Committee</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join EthixPortal
          </h2>

          <p className="text-xl text-gray-600 mb-8">
            Create your account to submit and manage research proposals securely.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard value="50+" label="Medical Colleges" color="blue" />
            <StatCard value="1000+" label="Research Proposals" color="teal" />
            <StatCard value="95%" label="Approval Rate" color="green" />
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Create Account
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input label="Name of Researcher" name="name" value={form.name} onChange={handleChange} />
            <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} />
            <Input label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} />

            <Select
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              options={[
                "Preclinical departments",
                "ParaClinical Departments",
                "Medicine and Allied Departments",
                "Surgery and allied departments",
                "Emergency medicines"
              ]}
            />

            {form.department && (
              <Select
                label="Sub Department"
                name="subDepartment"
                value={form.subDepartment}
                onChange={handleChange}
                options={getSubDepartments(form.department)}
              />
            )}

            <Input label="Institution" name="institution" value={form.institution} onChange={handleChange} />
            <Input label="Contact" name="contact" value={form.contact} onChange={handleChange} />
            <Input label="Email ID" type="email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />

            {error && (
              <div className="md:col-span-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {loading ? "Creating account…" : "Register"}
              </button>
            </div>

            <div className="md:col-span-2 text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

function StatCard({ value, label, color }) {
  const colors = {
    blue: "text-blue-600",
    teal: "text-teal-600",
    green: "text-green-600"
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
      <div className={`text-2xl font-bold ${colors[color]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">
        {label}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        placeholder={label}
        required
        className="
          w-full px-4 py-3 
          border border-gray-300 rounded-lg
          shadow-sm focus:shadow-md
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition
        "
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        {...props}
        required
        className="
          w-full px-4 py-3 
          border border-gray-300 rounded-lg
          shadow-sm focus:shadow-md
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition
        "
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function getSubDepartments(department) {
  const map = {
    "Preclinical departments": ["Physiology", "Anatomy", "Biochemistry"],
    "ParaClinical Departments": [
      "Pharmacology",
      "Pathology",
      "Microbiology",
      "Forensic Medicine and Toxicology"
    ],
    "Medicine and Allied Departments": [
      "General Medicine",
      "Paediatrics",
      "Community Medicine",
      "Psychiatry"
    ],
    "Surgery and allied departments": [
      "General Surgery",
      "Orthopedics",
      "Anesthesiology"
    ]
  };
  return map[department] || [];
}