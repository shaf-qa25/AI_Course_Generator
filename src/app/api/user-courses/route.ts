import { db } from "@/config/db";
import { Courses } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await db.select()
        .from(Courses)
        .where(eq(Courses.userId, user.primaryEmailAddress?.emailAddress as string))
        .orderBy(desc(Courses.id));

    return NextResponse.json(result);
}