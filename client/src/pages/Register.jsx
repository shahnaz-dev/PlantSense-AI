import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, ArrowRight } from "lucide-react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5003/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-center gap-2 mb-8">
          <Sprout className="w-8 h-8 text-brand-400" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Plant<span className="text-brand-400">Sense</span>
          </span>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white text-center mb-1">
            Create Account
          </h2>

          <p className="text-slate-400 text-sm text-center mb-6">
            Start building your plant inventory.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>

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
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 text-white rounded-xl flex items-center justify-center gap-2"
            >
              Sign Up
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
