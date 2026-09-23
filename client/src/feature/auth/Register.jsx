import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "../../context/AuthContext";
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

const DEPARTMENTS_WITH_SUB = [
  "Preclinical departments",
  "ParaClinical Departments",
  "Medicine and Allied Departments",
  "Surgery and allied departments",
];

export default function Register() {
  const navigate = useNavigate();
  const { status } = useAuth();

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

    const requiresSubDepartment = DEPARTMENTS_WITH_SUB.includes(form.department);

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
      toast.error(err.response?.data?.message || "Registration failed", { id });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <LoadingScreen message="Verifying session…" variant="fullscreen" />
    );
  }

  return (
    <AuthLayout
      title="Researcher registration"
      description="Create an account to submit and manage IEC proposals. All fields are required for committee records."
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <FormInput
          label="Name of researcher"
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

        {DEPARTMENTS_WITH_SUB.includes(form.department) && (
          <FormSelect
            label="Sub department"
            value={form.subDepartment}
            onChange={(v) => handleChange("subDepartment", v)}
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
          label="Email"
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

        <div className="sm:col-span-2 space-y-4 pt-2">
          <Button type="submit" disabled={loading} className="h-11 w-full rounded-sm">
            {loading ? "Creating account…" : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        required
        className="h-11 rounded-sm bg-background"
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full rounded-sm bg-background">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
