import { SignedIn, SignedOut } from "@clerk/nextjs";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyImages } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
      {/* Upload Panel */}
      <div className="lg:col-span-1 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-emerald-500/20 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm hover:shadow-emerald-500/30 transition-all duration-300">
        <h2 className="text-2xl font-extrabold text-emerald-400 tracking-wide">
          Upload Image
        </h2>
        <p className="text-gray-400 text-sm mt-2 mb-6">
          Share your manga artwork with the community.
        </p>
        <UploadDialog />
        <div className="mt-6 text-xs text-gray-500 italic">
          Supported formats: JPG, PNG, GIF
        </div>
      </div>

      {/* Gallery Section */}
      <div className="lg:col-span-3">
        <h3 className="text-xl font-semibold text-emerald-400 mb-6 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Your Gallery
        </h3>

        {images.length === 0 ? (
          <p className="text-gray-500 text-center py-12 border border-dashed border-zinc-700 rounded-2xl bg-zinc-950/50 italic">
            No images yet. Upload something to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 hover:shadow-emerald-600/40 transition-transform hover:scale-[1.03] duration-300"
              >
                <ImageModal image={image}>
                  <div className="relative aspect-video bg-zinc-900">
                    <img
                      src={image.imageUrl}
                      alt={`Image ${image.id}`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500">
                      <span className="text-emerald-400 font-semibold text-lg tracking-wide">
                        View Fullscreen
                      </span>
                    </div>
                    {/* Image Label */}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-center text-sm text-gray-200 font-mono">
                      {image.imageName || image.fileName}
                    </div>
                  </div>
                </ImageModal>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white font-sans">
      {/* Signed In */}
      <SignedIn>
        <section className="px-6 py-12 space-y-14">
          {/* Hero Banner */}
          <div className="relative h-64 md:h-72 rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/40 to-transparent animate-pulse-slow" />
            <div className="relative h-full flex flex-col justify-center px-8">
              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg tracking-wide">
                <span className="text-emerald-400">My Gallery</span>
              </h1>
              <p className="mt-2 text-gray-300 max-w-xl leading-relaxed">
                Manage your uploads and showcase your manga artwork in style.
              </p>
            </div>
          </div>

          <Images />
        </section>
      </SignedIn>

      {/* Signed Out → Hero + Featured */}
      <SignedOut>
        {/* Hero Section */}
        <section className="relative h-80 md:h-[32rem] bg-gradient-to-br from-emerald-800 via-emerald-700 to-zinc-900 rounded-b-3xl overflow-hidden shadow-2xl">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-25 blur-sm"></div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl tracking-wide">
              Welcome to <span className="text-emerald-400">MangaVault</span>
            </h1>
            <p className="mt-4 text-gray-200 max-w-2xl text-lg md:text-xl leading-relaxed">
              Explore, discover, and share your favorite manga art with the
              community.
            </p>
            <Button className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl shadow-xl shadow-emerald-500/30 px-12 py-3 text-lg transform hover:scale-105 transition duration-300">
              Browse Manga
            </Button>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -bottom-24 left-1/2 w-[130%] h-72 bg-emerald-500/30 blur-3xl -translate-x-1/2 rounded-full animate-pulse-slow"></div>
        </section>

        {/* Featured Manga Cards */}
        <section
          id="featured"
          className="px-6 md:px-12 py-24 bg-gradient-to-t from-zinc-950 to-zinc-900 -mt-20 rounded-t-3xl shadow-inner relative"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-400 mb-14 tracking-wider relative">
            Featured Manga
            <span className="block mx-auto mt-3 w-20 h-1 bg-emerald-500 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {[
              {
                title: "Attack on Titan",
                desc: "Humanity fights for survival against giant Titans.",
                img: "./img/aot.jpg",
              },
              {
                title: "Gokusen",
                desc: "A comedy-drama about a teacher and her students.",
                img: "/img/gok.jpg",
              },
              {
                title: "Naruto",
                desc: "A young ninja strives to become the strongest in his village.",
                img: "./img/nar.jpg",
              },
            ].map((manga, idx) => (
              <div
                key={idx}
                className="relative bg-gradient-to-br from-zinc-950 to-zinc-900 shadow-xl border border-zinc-800 rounded-3xl overflow-hidden transform hover:scale-105 hover:shadow-emerald-500/40 transition-all duration-500 group"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={manga.img}
                    alt={manga.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-emerald-400 font-semibold text-lg tracking-wide">
                      Read More
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 relative z-10">
                  <h3 className="font-bold text-lg md:text-xl text-emerald-400 mb-2">
                    {manga.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {manga.desc}
                  </p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition duration-1000"></div>
              </div>
            ))}
          </div>
        </section>

                {/* About Section */}
        <section id="about" className="px-6 md:px-12 py-24 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 border-t border-zinc-800">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-400 mb-14 tracking-wider">
            About MangaVault
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h3 className="text-2xl font-semibold text-emerald-400 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                MangaVault is a platform for manga enthusiasts worldwide. Our
                mission is to provide a creative space where artists can share
                their artwork, fans can discover new favorites, and the
                community can thrive together.
              </p>
              <h3 className="text-2xl font-semibold text-emerald-400 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                We envision MangaVault as the go-to hub for manga culture and
                art — a place where creativity flourishes, collaboration grows,
                and everyone feels welcome.
              </p>
            </div>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-800">
              <img
                src="/img/about.png"
                alt="About MangaVault"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>
        {/* About Section */}
        <section className="px-6 md:px-12 py-24 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 border-t border-zinc-800">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-400 mb-14 tracking-wider">
            About MangaVault
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h3 className="text-2xl font-semibold text-emerald-400 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                MangaVault is a platform for manga enthusiasts worldwide. Our
                mission is to provide a creative space where artists can share
                their artwork, fans can discover new favorites, and the
                community can thrive together.
              </p>
              <h3 className="text-2xl font-semibold text-emerald-400 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                We envision MangaVault as the go-to hub for manga culture and
                art — a place where creativity flourishes, collaboration grows,
                and everyone feels welcome.
              </p>
            </div>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-800">
              <img
                src="/img/about.png"
                alt="About MangaVault"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

      </SignedOut>
    </main>
  );
}
