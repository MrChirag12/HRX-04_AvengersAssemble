import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const {
    name,
    description,
    category,
    level,
    includeVideo,
    noOfChapters
  } = await req.json();

  const prompt = `Generate a detailed, guided, gamified LMS-style learning course based on the following details. Each chapter should have a duration (e.g., '2 hours') and a list of subtopics. Each subtopic should include:
- A theory/reading section (short explanation)
- An example (code or real-world)
- A hands-on task or quiz
- Optionally, a video/tutorial link (if includeVideo is true)

Return only a valid JSON object with the schema below. Do not include any extra text.

Schema:
{
  "course": {
    "cid": "string", // unique id
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "subtopics": [
          {
            "title": "string",
            "theory": "string",
            "example": "string",
            "handsOn": "string",
            "videoUrl": "string (optional)"
          }
        ]
      }
    ]
  }
}

Details:
Course Name: ${name}
Description: ${description}
Category: ${category}
Level: ${level}
Include Video: ${includeVideo}
Number of Chapters: ${noOfChapters}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const geminiData = await geminiRes.json();
    console.log("Gemini API response:", geminiData);
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No response from Gemini");
    let courseData;
    try {
      courseData = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          courseData = JSON.parse(match[0]);
        } catch (e) {
          console.error("Failed to parse extracted JSON:", e, match[0]);
          throw new Error("Gemini response was not valid JSON (after extraction)");
        }
      } else {
        console.error("Gemini response was not valid JSON or extractable:", text);
        throw new Error("Gemini response was not valid JSON");
      }
    }
    // Validate structure
    const course = courseData.course;
    if (!course || !course.chapters || course.chapters.length !== Number(noOfChapters)) {
      throw new Error("Invalid course structure or chapter count mismatch");
    }
    course.cid = uuidv4();
    return NextResponse.json({ course });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 