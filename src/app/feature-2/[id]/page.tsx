"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Video, CheckCircle, MoreVertical } from "lucide-react"; // Updated icons
import { Course, Subtopic } from "@/types/feature-2";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming shadcn dropdown components

function TopicReelModal({ open, onClose, subtopics, initialIndex }: { open: boolean; onClose: () => void; subtopics: Subtopic[]; initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);
  if (!open || !subtopics || subtopics.length === 0) return null;
  const subtopic = subtopics[index];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-0 relative flex flex-col items-stretch">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10" onClick={onClose} title="Close">
          ×
        </button>
        <div className="flex-1 flex flex-col justify-center p-8 min-h-[400px]">
          <div className="text-xs text-gray-500 mb-2">{index + 1} / {subtopics.length}</div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2 text-left">
            <BookOpen size={24} /> {subtopic.title}
          </h2>
          <div className="space-y-4 text-gray-700 text-left">
            <p><span className="font-medium">Theory:</span> {subtopic.theory}</p>
            <p><span className="font-medium">Example:</span> {subtopic.example}</p>
            <p><span className="font-medium">Hands-on:</span> {subtopic.handsOn}</p>
            {subtopic.videoUrl && (
              <div className="mt-4">
                <span className="font-medium flex items-center gap-2"><Video size={18} /> Video:</span>
                <div className="mt-2">
                  <iframe
                    width="100%"
                    height="240"
                    src={subtopic.videoUrl.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            title="Previous"
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
            onClick={() => setIndex((i) => Math.min(subtopics.length - 1, i + 1))}
            disabled={index === subtopics.length - 1}
            title="Next"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeSubtopic, setActiveSubtopic] = useState<{ subtopics: Subtopic[]; index: number } | null>(null);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      const res = await fetch(`/api/feature-2/courses?cid=${id}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
      } else {
        setError("Course not found");
      }
      setLoading(false);
    }
    if (id) fetchCourse();
  }, [id]);

  const handleToggle = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
  };

  const handleDelete = async () => {
    if (!course) return;
    setDeleting(true);
    await fetch("/api/feature-2/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cid: course.cid }),
    });
    setDeleting(false);
    router.push("/feature-2");
  };

  const handleMarkCompleted = (idx: number) => {
    setCompletedChapters((prev) => new Set([...prev, idx]));
  };

  if (loading) return <div className="p-10 text-center text-gray-700 animate-pulse">Loading course...</div>;
  if (error || !course) return <div className="p-10 text-center text-red-600">{error || "Course not found"}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-sm rounded-lg min-h-screen">
      {/* Header Section */}
      <div className="flex items-center gap-6 mb-10 bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="w-32 h-32 relative">
          {course.bannerImageUrl ? (
            <Image src={course.bannerImageUrl} alt={`${course.name} course banner`} fill className="rounded-lg object-cover border" />
          ) : course.bannerImagePrompt && (/^(https?:\/\/|\/)/.test(course.bannerImagePrompt) ? (
            <Image src={course.bannerImagePrompt} alt={`${course.name} course banner`} fill className="rounded-lg object-cover border" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg border text-gray-500">
              <BookOpen size={32} />
            </div>
          ))}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">{course.name}</h1>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Category: {course.category}</span>
            <span>Level: {course.level}</span>
            <span className="flex items-center gap-1"><BookOpen size={16} /> {course.noOfChapters} Chapters</span>
          </div>
        </div>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" title="More options">
              <MoreVertical size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32 bg-white border border-gray-200 rounded-md shadow-lg">
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 hover:bg-red-50 cursor-pointer">
              {deleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-yellow-600 hover:bg-yellow-50 cursor-pointer">
              Star
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Gamified Roadmap */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-start gap-2">
          <BookOpen size={24} className="mt-1" /> Your Learning Journey
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-dashed border-blue-200" />
          {course.chapters.map((ch, idx) => (
            <div key={idx} className="mb-10 flex justify-between items-center w-full">
              <div className={`w-5/12 bg-white p-4 rounded-lg shadow-sm ${completedChapters.has(idx) ? "ring-2 ring-green-400" : ""}`}>
                <div
                  className={`flex items-center p-3 bg-gray-50 rounded-lg transition-all duration-300 ${expanded === idx ? "ring-1 ring-blue-100" : ""}`}
                  onClick={() => handleToggle(idx)}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-medium ${completedChapters.has(idx) ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                    {idx + 1}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">{ch.chapterName}</h3>
                    <p className="text-xs text-gray-500">Duration: {ch.duration}</p>
                  </div>
                </div>
                {expanded === idx && (
                  <div className="mt-4 ml-12 space-y-2 text-left">
                    <p className="text-sm font-medium text-gray-700">Subtopics:</p>
                    <div className="flex flex-col gap-2">
                      {ch.subtopics.map((subtopic, i) => (
                        <button
                          key={i}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md shadow hover:bg-gray-50 text-sm text-gray-800 font-medium transition-all hover:shadow-md text-left"
                          onClick={() => setActiveSubtopic({ subtopics: ch.subtopics, index: i })}
                        >
                          {subtopic.title}
                        </button>
                      ))}
                    </div>
                    <button
                      className={`mt-4 px-4 py-2 rounded-md font-semibold transition-colors ${completedChapters.has(idx) ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                      onClick={() => handleMarkCompleted(idx)}
                      disabled={completedChapters.has(idx)}
                    >
                      {completedChapters.has(idx) ? "Completed" : "Mark as Completed"}
                    </button>
                  </div>
                )}
              </div>
              <div className="w-2/12 flex justify-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${completedChapters.has(idx) ? "bg-green-100 text-green-700" : "bg-green-50 text-green-700"}`}>
                  <CheckCircle size={20} />
                </div>
              </div>
              <div className="w-5/12 bg-white p-4 rounded-lg shadow-sm" />
            </div>
          ))}
          {activeSubtopic && (
            <TopicReelModal
              open={!!activeSubtopic}
              onClose={() => setActiveSubtopic(null)}
              subtopics={activeSubtopic.subtopics}
              initialIndex={activeSubtopic.index}
            />
          )}
        </div>
      </div>
    </div>
  );
}