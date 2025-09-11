// app/api/images/route.ts in Site A
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allImages = await db.select().from(images);
  return NextResponse.json(allImages);
}
