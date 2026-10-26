import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, ArrowRight, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5003/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* PlantSense Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sprout className="w-8 h-8 text-brand-400" />

          <span className="text-2xl font-bold tracking-tight text-white">
            Plant<span className="text-brand-400">Sense</span>
          </span>
        </div>

        {/* Login Card */}
        <div className="glass p-8 rounded-3xl">

          <h2 className="text-xl font-bold text-white text-center mb-1">
            Welcome Back
          </h2>

          <p className="text-slate-400 text-sm text-center mb-6">
            Sign in to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                placeholder="Enter your email"
              />
            </div>

            {/* Password with Show/Hide Button */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>
            </div>
            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Sign In

              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

{/* Sign Up */}
<div className="mt-5 text-center text-sm text-slate-400">
  Don't have an account?{" "}

  <Link
    to="/register"
    className="text-brand-400 hover:text-brand-300"
  >
    Sign Up
  </Link>
</div>

        </div>
      </div>
    </div>
  );
}