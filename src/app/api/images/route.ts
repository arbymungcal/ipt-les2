import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; // only if you want filtering

// GET all uploaded images
export async function GET() {
  const allImages = await db.select().from(images);
  
  return NextResponse.json(allImages);
}
