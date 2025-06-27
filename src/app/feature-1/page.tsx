"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Feature1Page() {
  const [loading, setLoading] = useState(false);
  // Set your Streamlit app URL here
  const STREAMLIT_URL = "http://localhost:8501"; // <-- Change if needed

  const handleLaunch = () => {
    setLoading(true);
    setTimeout(() => {
      window.open(STREAMLIT_URL, "_blank");
      setLoading(false);
    }, 1200); // Simulate loading
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 p-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">
          Welcome to Magic Learn AI Launcher
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Launch the interactive Streamlit app for gesture-based AI learning
          tools.
          <br />
          (Make sure the Streamlit app is running in another tab or window.)
        </p>
        {loading ? (
          <div className="flex flex-col items-center gap-4 my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-2"></div>
            <div className="text-blue-600 font-semibold text-lg">
              Launching Streamlit App...
            </div>
          </div>
        ) : (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg text-lg transition-all duration-200"
            onClick={handleLaunch}
          >
            Open Streamlit App
          </Button>
        )}
      </div>
    </div>
  );
}
