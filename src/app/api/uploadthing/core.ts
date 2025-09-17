import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // ✅ Input includes description and imageName
    .input(
      z.object({
        imageName: z.string().min(5),
        description: z.string().min(1), // required
      })
    )
    .middleware(async ({ req, input }) => {
      const user = await auth();

      if (!user.userId) throw new UploadThingError("Unauthorized");

      // ✅ Fetch user details from Clerk
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(user.userId);

      return {
        userId: user.userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "unknown",
        name: clerkUser.firstName ?? "Anonymous",
        imageName: input.imageName,
        description: input.description,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      // ✅ Save full info into DB
      await db.insert(images).values({
        email: metadata.email,
        name: metadata.name,
        fileName: file.name,
        imageName: metadata.imageName,
        description: metadata.description,
        imageUrl: file.ufsUrl,
        userId: metadata.userId,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
