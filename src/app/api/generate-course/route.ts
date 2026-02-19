import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { Courses } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

// ISKO TRUE KAR DE JAB LIMIT KHATAM HO JAYE
const USE_MOCK_DATA = true;

export async function POST(req: Request) {
    try {
        const { prompt, type } = await req.json();
        const user = await currentUser();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let slides;

        if (USE_MOCK_DATA) {
            // Dummy data taaki tera kaam chalta rahe
            slides = [
                {
                    title: `Introduction to ${prompt}`,
                    content: `${prompt} is a fascinating topic that is changing the world. Let's explore its core concepts step by step.`,
                    imagePrompt: `${prompt} futuristic technology concept`
                },
                {
                    title: "Core Mechanics",
                    content: "The fundamental principles involve high-speed data processing and efficient resource management.",
                    imagePrompt: "digital networking abstract blue lines"
                },
                {
                    title: "Real-world Applications",
                    content: "From healthcare to space exploration, this technology is everywhere, making life easier for everyone.",
                    imagePrompt: "modern city with advanced robots"
                },
                {
                    title: "The Future",
                    content: "The possibilities are endless. We are just scratching the surface of what can be achieved.",
                    imagePrompt: "galaxy space portal 3d render"
                }
            ];

            // Long course hai toh 4 slides aur add kar do
            if (type === "long") {
                slides = [...slides, ...slides];
            }
        } else {
            // --- ORIGINAL GEMINI FETCH LOGIC ---
            const slideCount = type === "long" ? 8 : 4;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Create a ${slideCount}-slide course for: ${prompt}. Return ONLY a JSON array. Format: [{"title": "...", "content": "...", "imagePrompt": "..."}]` }] }],
                    generationConfig: { response_mime_type: "application/json" }
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            slides = JSON.parse(data.candidates[0].content.parts[0].text);
        }

        // Database mein entry mock data ke sath bhi hogi!
        const result = await db.insert(Courses).values({
            courseId: uuidv4(),
            userId: user?.primaryEmailAddress?.emailAddress as string,
            prompt: prompt,
            type: type || "quick",
            content: slides,
        }).returning();

        return NextResponse.json(result[0]);

    } catch (error: any) {
        console.error("Final API Error:", error);
        return NextResponse.json({ error: error.message || "API issue" }, { status: 500 });
    }
}