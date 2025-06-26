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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] to-[#e0e7ff] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white shadow-2xl px-6 py-8 hidden lg:flex flex-col justify-between border-r border-gray-200 rounded-tr-3xl rounded-br-3xl">
        <div className="space-y-8">
          {session?.user && (
            <div className="flex flex-col items-center gap-3">
              {session.user.image && (
                <Image src={session.user.image} alt="Profile" width={72} height={72} className="rounded-full border-4 border-blue-200 shadow-lg transition-transform duration-300 hover:scale-105" />
              )}
              <div className="text-center text-sm">
                <p className="font-semibold text-[#1e3a8a] text-lg">{session.user.name}</p>
              </div>
            </div>
          )}

          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-400 text-center tracking-tight drop-shadow-lg">EduNova</h2>

          <nav className="flex flex-col gap-4">
            {navLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.route)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-white shadow hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 text-[#1e3a8a] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {item.icon}
                <span className="text-base font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Modern Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-8 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-lg hover:from-red-500 hover:to-red-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 space-y-10">
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
      </main>
    </div>
  );
}
