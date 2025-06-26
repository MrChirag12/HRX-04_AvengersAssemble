"use client";

import { Button } from "@/components/ui/button";
import { DockDemo } from "@/components/DockDemo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] text-black px-6 sm:px-16 py-20 flex flex-col items-center justify-center gap-20">
      
      {/* Dock at top now */}
      <DockDemo />

      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">
          Empowering Learning with <span className="text-blue-600">AI-Driven</span> Tools
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          EduNova is your all-in-one edutech platform to learn, teach, and grow using smart AI-assisted features.
        </p>
        <Button
          onClick={() => window.location.href = "/auth"}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Start Your Learning Journey →
        </Button>
      </div>
    </main>
  );
}
