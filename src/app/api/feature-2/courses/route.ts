import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      const result = await pool.query("SELECT * FROM courses WHERE name = $1", [id]);
      if (result.rows.length === 0) return NextResponse.json({ error: "Course not found" }, { status: 404 });
      return NextResponse.json({ course: result.rows[0].coursejson });
    }
    const result = await pool.query("SELECT * FROM courses ORDER BY id DESC");
    return NextResponse.json({ courses: result.rows.map(row => row.coursejson) });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { course } = await req.json();
  try {
    const userEmail = course.userEmail || "demo@user.com";
    // Sanitize and validate fields
    const cid = course.cid || course.name;
    const name = course.name || "";
    const description = course.description || "";
    const noOfChapters = Number(course.noOfChapters) || 0;
    const includeVideo = !!course.includeVideo;
    const level = course.level || "";
    const category = course.category || "";
    const courseJson = JSON.stringify(course);

    // Check for required fields
    if (!name || !level || !userEmail || !cid || !noOfChapters) {
      return NextResponse.json({ error: "Missing required course fields" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO courses (cid, name, description, noOfChapters, includeVideo, level, category, courseJson, userEmail)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        cid,
        name,
        description,
        noOfChapters,
        includeVideo,
        level,
        category,
        courseJson,
        userEmail
      ]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB Insert Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await pool.query("DELETE FROM courses WHERE name = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 