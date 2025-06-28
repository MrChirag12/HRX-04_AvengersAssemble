"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PlusCircle, Book, Star } from "lucide-react"; // Added PlusCircle, Book, and Star imports
import { Course } from "@/types/feature-2";
import CourseFormModal from "./CourseFormModal";
import Link from "next/link";

export default function Feature2Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/feature-2/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      }
    }
    fetchCourses();
  }, []);

  const handleCourseCreated = async (formData: {
    name: string;
    description: string;
    category: string;
    level: string;
    includeVideo: boolean;
    noOfChapters: number;
  }) => {
    const res = await fetch("/api/feature-2/generate-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to generate course");
    }
    const { course } = await res.json();
    const storeRes = await fetch("/api/feature-2/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course }),
    });
    if (!storeRes.ok) {
      throw new Error("Failed to save course");
    }
    setShowModal(false);
    const coursesRes = await fetch("/api/feature-2/courses");
    if (coursesRes.ok) {
      const data = await coursesRes.json();
      setCourses(data.courses);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-[#f8fafc] px-4">
      <div className="w-full max-w-6xl mx-auto rounded-3xl p-8 shadow-2xl border border-white/30 bg-white/80" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 drop-shadow">AI Course Generator</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onClick={() => setShowModal(true)}
          >
            <PlusCircle size={20} /> Create New Course
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg py-20">
              No courses yet. Click "Create New Course" to get started!
            </div>
          ) : (
            courses.map((course) => {
              const total = course.noOfChapters || (course.chapters?.length ?? 0);
              const completed = 0; // Placeholder for demo; replace with actual progress logic
              return (
                <Link key={course.name} href={`/feature-2/${course.name}`} className="block">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    {/* Image Banner */}
                    <div className="w-full h-32 bg-gray-200 relative">
                      {course.bannerImagePrompt && (/^(https?:\/\/|\/)/.test(course.bannerImagePrompt) ? (
                        <Image src={course.bannerImagePrompt} alt={course.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                      ))}
                    </div>
                    {/* Course Details */}
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-indigo-800 mb-2">{course.name}</h2>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        {/* Left: Icon and Chapters */}
                        <div className="flex items-center gap-2 text-gray-700">
                          <Book size={18} />
                          <span className="text-sm font-medium">Chapters: {total}</span>
                        </div>
                        {/* Right: Level Status */}
                        <span className="text-sm font-medium text-blue-700 capitalize">{course.level}</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{completed}/{total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(completed / total) * 100 || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
        <CourseFormModal open={showModal} onClose={() => setShowModal(false)} onCourseCreated={handleCourseCreated} />
      </div>
    </div>
  );
}