import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const search = searchParams.get("search")?.toLowerCase();

        const userImages = await db.query.images.findMany({
          where: (model, { eq, ilike, and }) =>
            and(
              eq(model.userId, userId),
              search
                ? or(
                    ilike(model.name, `%${search}%`),
                    ilike(model.email, `%${search}%`)
                  )
                : undefined
            ),
        });

    const enrichedImages = await Promise.all(
      userImages.map(async (img) => {
        const user = await clerkClient.users.getUser(img.userId);

        return {
          ...img,
          fullName: [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown",
        };
      })
    );

    return NextResponse.json(
      { images: enrichedImages },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    console.error("Error fetching images:", err);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
