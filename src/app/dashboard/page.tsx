'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ add router for redirect

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
  const router = useRouter(); // ✅ for navigation

  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Record<string, Announcement[]>>({});
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Redirect to /auth if session is null
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
    signOut({
      redirect: true,
      callbackUrl: "/auth", // ✅ fallback in case useEffect doesn't catch
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] px-6 sm:px-12 py-10 space-y-12 text-[#1e3a8a]">
      {/* Top Bar with Heading + Profile Dropdown */}
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        {session?.user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow border border-gray-200"
            >
              <span className="text-sm font-medium text-[#1e3a8a] hidden sm:block">
                {session.user.name}
              </span>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="text-red-600 px-6 py-2 text-sm hover:bg-red-50 w-full text-left rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Layout for Classes + Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Classes */}
        <div className="bg-white border border-[#cdd6f3] rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          <div className="space-y-3">
            {(showAllCourses ? courses : courses.slice(0, 3)).map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  selectedCourseId === course.id
                    ? 'border-[#1e3a8a] bg-[#e6ecfc]'
                    : 'border-[#dce3f0] hover:bg-[#edf2ff]'
                }`}
              >
                <h3 className="font-medium">{course.name}</h3>
                <p className="text-sm text-[#475569]">{course.section}</p>
              </div>
            ))}
            {courses.length > 3 && (
              <button
                onClick={() => setShowAllCourses(!showAllCourses)}
                className="text-sm text-[#1e3a8a] mt-2 hover:underline"
              >
                {showAllCourses ? "Show Less" : "Show All Classes"}
              </button>
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white border border-[#cdd6f3] rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
            {announcements[selectedCourseId || ""]?.length > 0 ? (
              announcements[selectedCourseId || ""].map((a) => (
                <div
                  key={a.id}
                  className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f9fbff]"
                >
                  <p>{a.text}</p>
                </div>
              ))
            ) : (
              <p className="italic text-[#64748b]">No announcements yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="bg-white border border-[#cdd6f3] rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Assignments</h2>
        <div className="space-y-4">
          {assignments[selectedCourseId || ""]?.length > 0 ? (
            assignments[selectedCourseId || ""].map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 border border-[#e2e8f0] rounded-lg bg-[#f9fbff]"
              >
                <h3 className="font-medium">{assignment.title}</h3>
                {assignment.description && (
                  <p className="text-sm text-[#475569]">{assignment.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className="italic text-[#64748b]">No assignments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
