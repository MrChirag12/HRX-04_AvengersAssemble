"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Home, FileText, BarChart2, MessageSquare } from "lucide-react"; // Icon imports

interface Course {
  id: string;
  name: string;
  section?: string;
}

interface Announcement {
  id: string;
  text: string;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Record<string, Announcement[]>>({});
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (session === null) {
      router.push("/auth");
    }
  }, [session, router]);

  useEffect(() => {
    if (!session?.accessToken) return;

    fetch("https://classroom.googleapis.com/v1/courses", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        if (data.courses?.[0]) setSelectedCourseId(data.courses[0].id);
      });
  }, [session]);

  useEffect(() => {
    if (!session?.accessToken || !selectedCourseId) return;

    fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourseId}/announcements`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements((prev) => ({
          ...prev,
          [selectedCourseId]: data.announcements || [],
        }));
      });

    fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourseId}/courseWork`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAssignments((prev) => ({
          ...prev,
          [selectedCourseId]: data.courseWork || [],
        }));
      });
  }, [selectedCourseId, session]);

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/auth" });
  };

  const navLinks = [
    { label: "Feature 1", route: "/feature-1", icon: <Home size={18} /> },
    { label: "Feature 2", route: "/feature-2", icon: <FileText size={18} /> },
    { label: "Feature 3", route: "/feature-3", icon: <BarChart2 size={18} /> },
    { label: "Feature 4", route: "/feature-4", icon: <MessageSquare size={18} /> },
  ];

  return (
    <>
      <div className="px-6 py-10 space-y-10">
        {/* Announcements + Classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-[1.025] hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Announcements</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {announcements[selectedCourseId || ""]?.length > 0 ? (
                announcements[selectedCourseId || ""].map((a) => (
                  <div key={a.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm hover:shadow-md transition-all">
                    <p className="text-base text-gray-700">{a.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-base italic text-gray-400">No announcements yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-[1.025] hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Your Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(showAllCourses ? courses : courses.slice(0, 4)).map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 ${
                    selectedCourseId === course.id
                      ? 'border-blue-600 bg-gradient-to-r from-blue-100 to-blue-50'
                      : 'border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:bg-blue-50'
                  }`}
                >
                  <h3 className="font-semibold text-blue-900 text-lg">{course.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{course.section}</p>
                </div>
              ))}
              {courses.length > 4 && (
                <button
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="text-sm text-blue-600 mt-2 hover:underline hover:text-blue-800 transition-colors col-span-full"
                >
                  {showAllCourses ? "Show Less" : "Show All Classes"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Assignments + Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-[1.025] hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Assignments</h2>
            <div className="space-y-4">
              {assignments[selectedCourseId || ""]?.length > 0 ? (
                assignments[selectedCourseId || ""].map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-indigo-50 shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-semibold text-base text-indigo-900">{assignment.title}</h3>
                    {assignment.description && (
                      <p className="text-xs text-gray-600 mt-1">{assignment.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-base italic text-gray-400">No assignments yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-[1.025] hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Calendar</h2>
            <Calendar selected={date} onSelect={(selectedDate) => setDate(selectedDate || new Date())} className="rounded-xl border shadow" />
          </div>
        </div>
      </div>
    </>
  );
}
