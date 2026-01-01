import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEPARTMENTS_WITH_SUB = [
  "Preclinical departments",
  "ParaClinical Departments",
  "Medicine and Allied Departments",
  "Surgery and allied departments",
];

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
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" &&
        !DEPARTMENTS_WITH_SUB.includes(value) && {
          subDepartment: "",
        }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiresSubDepartment =
      DEPARTMENTS_WITH_SUB.includes(form.department);

    if (requiresSubDepartment && !form.subDepartment) {
      toast.error("Please select a sub department");
      setLoading(false);
      return;
    }

    const id = toast.loading("Creating account…");

    try {
      await api.post("/users/register", {
        ...form,
        role: "researcher",
      });

      toast.success("Account created successfully", { id });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed",
        { id }
      );
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
              <h1 className="text-3xl font-bold text-gray-900">
                EthixPortal
              </h1>
              <p className="text-gray-600">
                Institutional Ethics Committee
              </p>
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
        <Card className="bg-white border border-gray-300 shadow-2xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormInput
                label="Name of Researcher"
                value={form.name}
                onChange={(v) => handleChange("name", v)}
              />

              <FormInput
                label="Designation"
                value={form.designation}
                onChange={(v) => handleChange("designation", v)}
              />

              <FormInput
                label="Qualification"
                value={form.qualification}
                onChange={(v) => handleChange("qualification", v)}
              />

              <FormSelect
                label="Department"
                value={form.department}
                onChange={(v) => handleChange("department", v)}
                options={[
                  "Preclinical departments",
                  "ParaClinical Departments",
                  "Medicine and Allied Departments",
                  "Surgery and allied departments",
                  "Emergency medicines",
                ]}
              />

              {/* Sub Department ONLY when required */}
              {DEPARTMENTS_WITH_SUB.includes(form.department) && (
                <FormSelect
                  label="Sub Department"
                  value={form.subDepartment}
                  onChange={(v) =>
                    handleChange("subDepartment", v)
                  }
                  options={getSubDepartments(form.department)}
                />
              )}

              <FormInput
                label="Institution"
                value={form.institution}
                onChange={(v) => handleChange("institution", v)}
              />

              <FormInput
                label="Contact"
                value={form.contact}
                onChange={(v) => handleChange("contact", v)}
              />

              <FormInput
                label="Email ID"
                type="email"
                value={form.email}
                onChange={(v) => handleChange("email", v)}
              />

              <FormInput
                label="Password"
                type="password"
                value={form.password}
                onChange={(v) => handleChange("password", v)}
              />

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full bg-blue-600 hover:bg-blue-700
                    text-white py-3 disabled:opacity-60
                  "
                >
                  {loading ? "Creating account…" : "Register"}
                </Button>
              </div>

              <div className="md:col-span-2 text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------- UI HELPERS -------------------- */

function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="w-full space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        required
        className="
          w-full min-h-12 px-4 py-3 rounded-lg
          border-gray-300 text-sm leading-5
          focus-visible:ring-2 focus-visible:ring-blue-500
        "
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div className="w-full space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="
            w-full min-h-12 px-4 py-3 rounded-lg
            border-gray-300 text-sm leading-5
            flex items-center focus:ring-2 focus:ring-blue-500
          "
        >
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent className="w-(--radix-select-trigger-width)">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-sm">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StatCard({ value, label, color }) {
  const colors = {
    blue: "text-blue-600",
    teal: "text-teal-600",
    green: "text-green-600",
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

/* -------------------- DATA -------------------- */

function getSubDepartments(department) {
  const map = {
    "Preclinical departments": ["Physiology", "Anatomy", "Biochemistry"],
    "ParaClinical Departments": [
      "Pharmacology",
      "Pathology",
      "Microbiology",
      "Forensic Medicine and Toxicology",
    ],
    "Medicine and Allied Departments": [
      "General Medicine",
      "Paediatrics",
      "Community Medicine",
      "Psychiatry",
    ],
    "Surgery and allied departments": [
      "General Surgery",
      "Orthopedics",
      "Anesthesiology",
    ],
  };

  return map[department] || [];
}