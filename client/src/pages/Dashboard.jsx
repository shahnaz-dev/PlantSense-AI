import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Plus, User, Calendar, Tag, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  // 1. Setup reactive states for real dynamic values
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // 2. Automatically query your active port 5003 backend server
 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }
  const savedUser = localStorage.getItem("user");

if (savedUser) {
  setUser(JSON.parse(savedUser));
}

  const fetchScanData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5003/api/scans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        setRecentScans(response.data);
      } else {
        setRecentScans([]);
      }
    } catch (err) {
      console.error("Error communicating with Backend Server:", err);
      setError("Could not retrieve real-time history records.");
    } finally {
      setLoading(false);
    }
  };

  fetchScanData();
}, []);

  // 3. Dynamic Calculation Metrics derived straight from your Database values
  const totalScanned = recentScans.length;
  
  const avgConfidence = totalScanned > 0 
    ? (recentScans.reduce((sum, item) => sum + (Number(item.confidence) || 0), 0) / totalScanned).toFixed(1)
    : "0.0";

  const totalFamilies = totalScanned > 0
    ? new Set(recentScans.map(item => item.type)).size
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-slate-900 bg-slate-900/50 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Sprout className="w-6 h-6 text-brand-400" />
            <span className="text-lg font-bold text-white">PlantSense</span>
          </div>
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-brand-500/10 text-brand-300 font-medium rounded-lg">
              Dashboard
            </Link>
            <Link to="/scan" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white transition-colors rounded-lg">
              New Scan
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-800 pt-6">
          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
               {user?.name || "PlantSense User"}
            </p>
       <button
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }}
  className="text-xs text-slate-500 hover:text-slate-400"
>
  Logout
</button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center gap-4 flex-wrap mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Your Plant Library</h1>
            <p className="text-slate-400 mt-1">Keep track of your identified botanical specimens.</p>
          </div>
          <Link to="/scan" className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg flex items-center gap-2 shadow-lg shadow-brand-500/20">
            <Plus className="w-4 h-4" /> Scan New Plant
          </Link>
        </header>

        {/* Dynamic Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 rounded-2xl">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Scanned</span>
            <div className="text-3xl font-bold text-white mt-1">{totalScanned} {totalScanned === 1 ? 'Plant' : 'Plants'}</div>
          </div>
          <div className="glass p-6 rounded-2xl">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">AI Avg Confidence</span>
            <div className="text-3xl font-bold text-brand-400 mt-1">{avgConfidence}%</div>
          </div>
          <div className="glass p-6 rounded-2xl">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Plant Families</span>
            <div className="text-3xl font-bold text-white mt-1">{totalFamilies} {totalFamilies === 1 ? 'Family' : 'Families'}</div>
          </div>
        </section>

        {/* Scans List Container */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Scan History</h2>
          
          {loading && (
            <div className="text-slate-400 text-sm py-4 animate-pulse">Querying Database history entries...</div>
          )}

          {error && (
            <div className="text-red-400 text-sm py-2 bg-red-950/20 border border-red-900/50 rounded-xl px-4">{error}</div>
          )}

          {!loading && recentScans.length === 0 && (
            <div className="text-slate-500 text-center py-10 bg-slate-900/20 rounded-2xl border border-slate-900/60 border-dashed">
              No history found. Try running a new plant scan!
            </div>
          )}

          <div className="space-y-4">
            {recentScans.map((scan) => (
              <div key={scan._id || scan.id} className="glass p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-800 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center text-brand-400">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{scan.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {scan.type || 'Unclassified'}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> 
                        {scan.date ? new Date(scan.date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-900">
                  <div>
                    <span className="text-xs text-slate-500 block text-right">Confidence</span>
                    <span className="text-sm font-semibold text-brand-400">{scan.confidence}% Match</span>
                  </div>
                  <Link to={`/plant/${scan._id || scan.id}`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
