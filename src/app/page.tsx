import { SignedIn, SignedOut } from "@clerk/nextjs";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyImages } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="p-6">
      {/* Upload Button Section */}
      <div className="flex justify-end mb-6">
        <UploadDialog />
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative rounded-xl overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          >
            <ImageModal image={image}>
              <div className="relative aspect-video bg-zinc-900">
                <img
                  src={image.imageUrl}
                  alt={`Image ${image.id}`}
                  className="h-full w-full object-cover object-top transition-opacity duration-300 group-hover:opacity-80"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 text-center text-sm text-zinc-200 font-mono">
                  {image.imageName || image.fileName}
                </div>
              </div>
            </ImageModal>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-black/80 backdrop-blur-md px-6 py-4 shadow-md border-b border-zinc-800">
        <h1 className="text-2xl font-extrabold tracking-wider text-pink-400">
          MangaVault
        </h1>
        <SignedOut>
          <div className="text-sm text-zinc-300">
            Please Sign In above to Continue!
          </div>
        </SignedOut>
        <SignedIn>
          <div className="text-sm text-zinc-300">Welcome Back!</div>
        </SignedIn>
      </header>

      {/* Body */}
      <section className="px-6 py-8">
        <SignedIn>
          <Images />
        </SignedIn>
        <SignedOut>
          <div className="mt-10 text-center text-lg text-zinc-400">
            <p className="mb-4">🚀 Upload & share your favorite anime and manga art!</p>
            <p>Sign in to get started!</p>
          </div>
        </SignedOut>
      </section>
    </main>
  );
}
