import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Sun,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sparkles,
  Sprout,
  Leaf,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function PlantDetail() {
  const { id } = useParams();

  const [plant, setPlant] = useState(null);
  const [care, setCare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [careLoading, setCareLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
  return;
}
    const fetchPlantDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Get the selected plant from MongoDB
        const plantResponse = await axios.get(`https://onrender.com{id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const scan = plantResponse.data;

        setPlant(scan);

        // Get plant-specific care information
        try {
          setCareLoading(true);

          const careResponse = await axios.get(
  `https://onrender.com{encodeURIComponent(scan.name)}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

          setCare(careResponse.data);
        } catch (careError) {
          console.error(
            "Unable to load plant care:",
            careError.response?.data || careError.message
          );

          setCare({
            found: false,
            description:
              "PlantSense provides practical general care recommendations to support healthy plant growth.",
            sunlight:
              "Provide appropriate light based on the plant species and avoid sudden changes in light exposure.",
            watering:
              "Water according to the plant's needs and avoid keeping the soil continuously waterlogged.",
            soil:
              "Use a well-draining growing medium suitable for the identified plant.",
            temperature:
              "Maintain a stable temperature and protect the plant from extreme heat or cold.",
            fertilizer:
              "Use a balanced fertilizer during the active growing season according to the product instructions.",
            toxicity:
              "Toxicity information is currently unavailable. Verify plant safety before keeping it near children or pets.",
          });
        } finally {
          setCareLoading(false);
        }
      } catch (err) {
        console.error(
          "Unable to load plant details:",
          err.response?.data || err.message
        );

        setError(
          "The selected plant could not be loaded. Please return to the dashboard and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-11 h-11 text-brand-400 animate-spin mb-4" />
        <p className="text-white font-semibold">
          Loading plant information...
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Retrieving your scan from the PlantSense library
        </p>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="glass max-w-lg w-full rounded-3xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-white">
            Plant Not Available
          </h1>

          <p className="text-slate-400 text-sm mt-3">
            {error || "The requested plant record could not be found."}
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Top navigation */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>

          <span className="px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {plant.confidence}% AI Match
          </span>
        </div>

        {/* Plant information */}
        <section className="glass rounded-3xl p-7 md:p-9 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-full md:w-52 aspect-square bg-brand-500/10 border border-brand-500/20 rounded-3xl flex flex-col items-center justify-center text-brand-400 shrink-0">
              <Sprout className="w-16 h-16 mb-3" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                PlantSense
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-brand-400 text-xs font-semibold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                Plant Family: {plant.type || "Unknown"}
              </span>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
                {plant.name || "Unknown Plant"}
              </h1>

              <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                {careLoading
                  ? "Preparing species-specific plant information..."
                  : care?.description}
              </p>

              <div className="mt-5 pt-5 border-t border-slate-800">
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                This plant was identified using AI-powered species recognition and saved to your PlantSense library. The care recommendations below provide helpful general guidance for healthy plant growth.
              </p>
              </div>
            </div>
          </div>
        </section>

        {/* Care requirements */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Care Requirements
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                 General care recommendations for healthy plant growth
              </p>
            </div>

            {care?.found === false && !careLoading && (
              <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                General guidance
              </span>
            )}
          </div>

          {careLoading ? (
            <div className="glass rounded-2xl p-10 flex flex-col items-center justify-center">
              <Loader2 className="w-9 h-9 text-brand-400 animate-spin mb-3" />

              <p className="text-white text-sm font-semibold">
                Loading plant care recommendations...
              </p>

              <p className="text-slate-500 text-xs mt-1">
                Searching the PlantSense botanical knowledge base
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sunlight */}
              <div className="glass p-5 rounded-2xl flex gap-4">
                <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">
                    Sunlight
                  </h4>

                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {care?.sunlight}
                  </p>
                </div>
              </div>

              {/* Watering */}
              <div className="glass p-5 rounded-2xl flex gap-4">
                <div className="w-11 h-11 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">
                    Watering
                  </h4>

                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {care?.watering}
                  </p>
                </div>
              </div>

              {/* Soil */}
              <div className="glass p-5 rounded-2xl flex gap-4">
                <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                  <Sprout className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">
                    Soil
                  </h4>

                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {care?.soil}
                  </p>
                </div>
              </div>

              {/* Temperature */}
              <div className="glass p-5 rounded-2xl flex gap-4">
                <div className="w-11 h-11 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">
                    Temperature
                  </h4>

                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {care?.temperature}
                  </p>
                </div>
              </div>

              {/* Fertilizer */}
              <div className="glass p-5 rounded-2xl flex gap-4">
                <div className="w-11 h-11 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">
                    Fertilizer
                  </h4>

                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {care?.fertilizer}
                  </p>
                </div>
              </div>

              {/* Toxicity */}
              <div className="glass p-5 rounded-2xl flex gap-4">
                <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">
                    Toxicity Information
                  </h4>

                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {care?.toxicity}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Information note */}
        <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-slate-500 text-xs leading-relaxed">
            <span className="text-slate-300 font-semibold">
              Plant care note:
            </span>{" "}
            Care requirements may vary according to climate, soil conditions,
            plant age, and growing environment. Use these recommendations as
            general guidance and observe your plant regularly.
          </p>
        </div>
      </div>
    </div>
  );
}
