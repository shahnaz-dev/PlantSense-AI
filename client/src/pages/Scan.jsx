import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Camera,
  Upload,
  ArrowLeft,
  Loader2,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

// Backend API URL
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export default function Scan() {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate image format
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Validate image size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.onerror = () => {
      alert("Unable to read the selected image.");
      setSelectedFile(null);
      setImage(null);
    };

    reader.readAsDataURL(file);
  };

  const handleSimulateScan = async () => {
    if (!selectedFile) {
      alert("Please select a plant image first.");
      return;
    }

    if (!API_URL) {
      alert("API configuration is missing. Please check VITE_API_URL.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first before identifying a plant.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Backend expects the field name "image"
      formData.append("image", selectedFile);

      const response = await axios.post(
        `${API_URL}/api/scan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 120000,
        }
      );

      const data = response.data;

      // Check whether PlantNet identified the plant
      if (!data.success || !data.scientificName) {
        throw new Error(
          data.message || "Plant identification was unsuccessful."
        );
      }

      // Navigate to result page
      navigate("/result", {
        state: {
          commonName: data.commonName,
          scientificName: data.scientificName,
          confidence: data.confidence,
          family: data.family,
          genus: data.genus,
          image,
        },
      });

    } catch (error) {
      console.error(
        "Plant Identification Error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        "Plant identification failed.";

      alert(`Plant identification failed: ${message}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="glass p-8 rounded-3xl relative overflow-hidden">

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white">
              Identify Your Plant
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Upload a clear photo of the leaves or stem.
            </p>
          </div>

          {/* Photo Upload Container */}
          <div className="border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl aspect-video flex flex-col justify-center items-center relative overflow-hidden group transition-colors bg-slate-900/30">

            {image ? (
              <>
                <img
                  src={image}
                  alt="Plant Preview"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">

                  <label className="p-3 bg-slate-950 rounded-full hover:bg-brand-500 cursor-pointer text-white transition-colors">
                    <Upload className="w-5 h-5" />

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center w-full h-full">

                <div className="w-12 h-12 bg-slate-800 group-hover:bg-brand-500/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-brand-400 transition-colors mb-4">
                  <Camera className="w-6 h-6" />
                </div>

                <span className="text-sm font-semibold text-white">
                  Select Photo or Take Picture
                </span>

                <span className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG (Max 10MB)
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

              </label>
            )}

            {/* Loading Animation */}
            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col justify-center items-center z-10">

                <div className="w-full h-1.5 bg-brand-500 absolute top-0 animate-bounce"></div>

                <Loader2 className="w-10 h-10 text-brand-400 animate-spin mb-4" />

                <p className="text-sm font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
                  ANALYZING BOTANICAL DATA...
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Identifying Plant using Pl@ntNet
                </p>

              </div>
            )}

          </div>

          {/* Identify Button */}
          {image && (
            <button
              onClick={handleSimulateScan}
              disabled={loading}
              className="w-full mt-6 py-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Identifying...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Identify Species
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
