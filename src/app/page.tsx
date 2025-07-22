import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";

async function Images() {

  const mockUrls = 
  ["https://images.surferseo.art/84983c66-e859-4bcd-8155-b40faeca38e0.jpeg",
    "https://wallpaperset.com/w/full/2/5/a/377225.jpg",
    "https://gz0cmo2jhe.ufs.sh/f/YPRa7ngfiWIsX2rExP9lQCWtqyD3E9JfxSIbGHiNBPzvARZo",
    "https://gz0cmo2jhe.ufs.sh/f/YPRa7ngfiWIs2DCKPxVXwJUvkRL3zrIoTFthBiQd8NEKjMeP",
  ];

  const images = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
  }));

  return(
    <div>
      <div className="flex justify-end p-4">
        <UploadDialog />
      </div>
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {images.map((image) => (
        <div key={image.id} className="flex w-64 flex-col">
          <div className="relative aspect-video bg-zinc-900">

          <img 
           src={image.url}
           alt={'Image ${image.id}'} 
           className="h-full w-full object-contain object-top" 
          />
          </div>
            <div className="text-center">{image.id}</div>
        </div>
      ))}
     </div>
     </div>
  );
}


export default function HomePage() {
  return (
    <main className="">
    <SignedOut>
      <div className="h-full w-full text-center text-2xl">
      Please Sign In above to Continue!
      </div>
    </SignedOut>
    <SignedIn>
      <div className="hh-full w-full text-center text-2xl">
        Welcome Back!
        <Images />
      </div>  
    </SignedIn>
    </main>
  );
}
