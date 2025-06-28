import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { runMigrations } from "@/lib/db-migration";

// Run migrations on API startup
let migrationsRun = false;
async function ensureMigrations() {
  if (!migrationsRun) {
    try {
      await runMigrations();
      migrationsRun = true;
    } catch (error) {
      console.error("Failed to run migrations:", error);
    }
  }
}

export async function GET(req: NextRequest) {
  await ensureMigrations();
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      const result = await pool.query("SELECT * FROM courses WHERE name = $1", [id]);
      if (result.rows.length === 0) return NextResponse.json({ error: "Course not found" }, { status: 404 });
      const courseData = result.rows[0].coursejson;
      // Add bannerImageUrl to the course data if it exists
      if (result.rows[0].bannerimageurl) {
        courseData.bannerImageUrl = result.rows[0].bannerimageurl;
      }
      return NextResponse.json({ course: courseData });
    }
    const result = await pool.query("SELECT * FROM courses ORDER BY id DESC");
    return NextResponse.json({ 
      courses: result.rows.map(row => {
        const courseData = row.coursejson;
        // Add bannerImageUrl to each course if it exists
        if (row.bannerimageurl) {
          courseData.bannerImageUrl = row.bannerimageurl;
        }
        return courseData;
      })
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await ensureMigrations();
  
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
    const bannerImageUrl = course.bannerImageUrl || "";

    // Check for required fields
    if (!name || !level || !userEmail || !cid || !noOfChapters) {
      return NextResponse.json({ error: "Missing required course fields" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO courses (cid, name, description, noOfChapters, includeVideo, level, category, courseJson, userEmail, bannerImageUrl)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        cid,
        name,
        description,
        noOfChapters,
        includeVideo,
        level,
        category,
        courseJson,
        userEmail,
        bannerImageUrl
      ]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB Insert Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await ensureMigrations();
  
  const { id } = await req.json();
  try {
    await pool.query("DELETE FROM courses WHERE name = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 