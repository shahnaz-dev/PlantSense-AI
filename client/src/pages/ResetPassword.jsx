import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Sprout, Lock, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
  `https://onrender.com{token}`,
  {
    password,
  }
);

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not reset your password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md glass p-8 rounded-3xl">

        <div className="flex items-center justify-center gap-2 mb-6">
          <Sprout className="w-8 h-8 text-brand-400" />
          <span className="text-2xl font-bold text-white">
            Plant<span className="text-brand-400">Sense</span>
          </span>
        </div>

        <div className="text-center mb-6">
          <Lock className="w-10 h-10 text-brand-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">
            Reset Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
          />

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl"
          >
            Reset Password
          </button>

        </form>

        {message && (
          <div className="mt-4 text-center text-brand-300">
            {message}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            to="/login"
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}