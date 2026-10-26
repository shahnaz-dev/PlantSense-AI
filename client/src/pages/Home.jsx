import React from "react";
import { Link } from "react-router-dom";
import { Sprout, ScanLine, History, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950">
      {/* Navigation Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sprout className="w-8 h-8 text-brand-400" />

          <span className="text-xl font-bold tracking-tight text-white">
            Plant<span className="text-brand-400">Sense</span>
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-brand-500/20"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-16 text-center max-w-4xl mx-auto">
        {/* AI Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-full text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Plant Identification
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Identify and Understand <br />

          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-brand-500">
            Your Plants Instantly
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Identify plant species, explore useful botanical information, access
          practical care guidance, and keep track of your plant scans using
          AI-powered Plant Identification
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            to="/scan"
            className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all shadow-xl shadow-brand-500/30 flex items-center gap-2 group"
          >
            <ScanLine className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Identify a Plant
          </Link>

          <Link
            to="/dashboard"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            View Dashboard
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          {/* Plant Recognition */}
          <div className="glass p-6 rounded-2xl">
            <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center text-brand-400 mb-4">
              <ScanLine className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">
              AI-Powered Plant Identification
            </h3>

            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Upload a plant photo and use AI-Powered Plant Identification to identify
              the plant and explore its available botanical information.
            </p>
          </div>

          {/* Plant Care */}
          <div className="glass p-6 rounded-2xl">
            <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center text-brand-400 mb-4">
              <Sprout className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Plant Care Guidance
            </h3>

            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Explore helpful guidance for sunlight, watering, soil,
              temperature, fertilizer, and plant safety.
            </p>
          </div>

          {/* Scan History */}
          <div className="glass p-6 rounded-2xl">
            <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center text-brand-400 mb-4">
              <History className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Plant Scan History
            </h3>

            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Keep a record of your identified plants and revisit your previous
              scans whenever you need them.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-slate-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} PlantSense AI. AI-powered plant
          identification and practical plant-care guidance.
        </p>
      </footer>
    </div>
  );
}
