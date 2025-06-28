"use client";

import { Button } from "@/components/ui/button";
import CompareDemo from "@/components/ui/compare-demo";
import LampDemo from "@/components/ui/lamp-demo";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 sm:px-16 py-20 flex flex-col items-center justify-start gap-4">
      <div className="w-full flex flex-col items-center">
        <LampDemo />
        <div className="flex flex-col items-center w-full max-w-2xl mt-1 z-50">
          <p className="text-2xl md:text-3xl font-bold text-white mb-8 text-center drop-shadow-lg">
            EduVerse is your all-in-one edutech platform to learn, and grow using smart AI-assisted features.
          </p>
          <Button
            onClick={() => window.location.href = "/auth"}
            className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-400 text-white text-lg px-10 py-4 font-bold shadow-xl rounded-2xl border-2 border-blue-400/40 backdrop-blur-md transition-all duration-200 transform hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,176,255,0.25)] hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 before:absolute before:inset-0 before:rounded-2xl before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition before:duration-200 overflow-hidden"
            style={{ boxShadow: '0 4px 24px 0 rgba(0,176,255,0.10)' }}
          >
            <span className="relative z-10">Start Your Learning Journey →</span>
          </Button>
        </div>
      </div>
      {/* CompareDemo will be added below here after scrolling */}
      <div className="w-full flex justify-center mt-12">
        <CompareDemo />
      </div>
    </main>
  );
}
