import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { login, logout, status, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = toast.loading("Signing in…");

    try {
      const user = await login(form);
      toast.success("Signed in successfully", { id });
      navigate(user.role === "researcher" ? "/" : "/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials", { id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      description="Use your institutional credentials to access the IEC records desk."
    >
      {status === "authenticated" && user && (
        <div className="mb-5 rounded-sm border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          You are signed in as <span className="font-medium text-foreground">{user.email}</span>
          ({user.role}).{" "}
          <button
            type="button"
            onClick={async () => {
              await logout();
              toast.message("Signed out. Sign in with another account.");
            }}
            className="font-medium text-primary hover:underline"
          >
            Switch account
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@institution.edu"
            value={form.email}
            onChange={handleChange}
            required
            className="h-11 rounded-sm bg-background"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              className="h-11 rounded-sm bg-background pr-16"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="h-11 w-full rounded-sm">
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <a href="#" className="text-primary hover:underline">
            Forgot password?
          </a>
          <p className="text-muted-foreground">
            New researcher?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
