import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Mail, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:5003/api/auth/forgot-password",
      {
        email,
      }
    );

    setMessage(response.data.message);

    // Temporary testing link
    if (response.data.resetLink) {
      console.log(
        "Password reset link:",
        response.data.resetLink
      );
    }
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
        "Could not process the password reset request."
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

        {/* Forgot Password Card */}
        <div className="glass p-8 rounded-3xl">

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-500/10 flex items-center justify-center">
              <Mail className="w-7 h-7 text-brand-400" />
            </div>

            <h2 className="text-xl font-bold text-white">
              Forgot Password?
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Enter your registered email address and we will help you reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors"
            >
              Send Reset Instructions
            </button>

          </form>

          {message && (
            <div className="mt-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm text-center">
              {message}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}