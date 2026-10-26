import { useLocation, Link } from "react-router-dom";

export default function PlantResult() {
 const { state } = useLocation();
 const progress = state?.confidence || 0;

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        No plant data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-slate-900/80 backdrop-blur-lg p-10 rounded-3xl
       shadow-2xl w-full max-w-6xl text-white border border-slate-700">

      <h1 className="text-4xl font-bold text-center mb-10">
  🌿 Plant Identified
</h1>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

  {/* LEFT SIDE */}
  <div>

    <p className="mb-3">
      <strong>Common Name:</strong> {state.commonName}
    </p>

    <p className="mb-3">
      <strong>Scientific Name:</strong> {state.scientificName}
    </p>

    <p className="mb-2">
      <strong>Confidence:</strong> {state.confidence}%
    </p>

    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden mb-6">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-1000"
        style={{ width: `${progress}%` }}
      ></div>
    </div>

    <p className="mb-3">
      <strong>Family:</strong> {state.family}
    </p>

    <p>
      <strong>Genus:</strong> {state.genus}
    </p>

  </div>

  {/* RIGHT SIDE */}
  <div className="bg-slate-800 rounded-xl p-6">

    <h2 className="text-2xl font-bold text-green-400 mb-5">
      🌱 Plant Care
    </h2>

    <p className="mb-3">
      💧 <strong>Water:</strong> Water when the top 2–3 cm of soil becomes dry.
    </p>

    <p className="mb-3">
      ☀️ <strong>Sunlight:</strong> Bright indirect sunlight.
    </p>

    <p className="mb-3">
      🌡 <strong>Temperature:</strong> 18°C – 30°C
    </p>

    <p>
      🌿 <strong>Care Tip:</strong> Avoid overwatering and provide good air circulation.
    </p>

  </div>

</div>

<Link
  to="/scan"
  className="block text-center mt-10 bg-green-600 hover:bg-green-700 rounded-xl py-4 text-lg"
>
  Scan Another Plant
</Link>

      </div>
    </div>
  );
}