import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { or } from "drizzle-orm";

// ========== GET ==========
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const search = searchParams.get("search")?.toLowerCase();

    const whereClause = userId
      ? (model: any, { eq, ilike, and }: any) =>
          and(
            eq(model.userId, userId),
            search
              ? or(
                  ilike(model.name, `%${search}%`),
                  ilike(model.email, `%${search}%`)
                )
              : undefined
          )
      : undefined;

    const userImages = await db.query.images.findMany({ where: whereClause });

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

// ========== POST (filter by name/email) ==========
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = body?.name?.toLowerCase() || null;

    const whereClause = name
      ? (model: any, { ilike, or }: any) =>
          or(
            ilike(model.name, `%${name}%`),
            ilike(model.email, `%${name}%`)
          )
      : undefined;

    const filteredImages = await db.query.images.findMany({ where: whereClause });

    const enrichedImages = await Promise.all(
      filteredImages.map(async (img) => {
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
    console.error("Error filtering images:", err);
    return NextResponse.json({ error: "Failed to filter images" }, { status: 500 });
  }
}
