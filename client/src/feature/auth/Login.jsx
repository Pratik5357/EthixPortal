import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const { login, status } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/", { replace: true });
    }
  }, [status, navigate]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = toast.loading("Signing in...");

    try {
      await login(form);
      toast.success("Welcome back 👋", { id });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Invalid credentials", { id });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Branding */}
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
            Digitizing Medical Research Ethics
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Secure, compliant, and efficient workflow management for IEC
            approvals in Indian medical colleges.
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white border border-gray-300 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">
              Welcome Back
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="w-full space-y-2">
                <Label className="text-gray-700">Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="
                    h-10
                    border-gray-300
                    focus-visible:ring-blue-500
                    focus-visible:ring-2
                  "
                />
              </div>

              {/* Password */}
              <div className="w-full space-y-1.5">
                <Label className="text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="
                      h-10
                      border-gray-300
                      focus-visible:ring-blue-500
                      focus-visible:ring-2
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  mt-2
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  disabled:opacity-60
                "
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="flex justify-between text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Forgot Password?
                </a>
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create Account
                </Link>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;


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