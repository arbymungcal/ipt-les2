"use client";

import { useUser } from "@clerk/nextjs"; 
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { DeleteButton } from "./delete-button";

interface ImageModalProps {
  image: {
    id: number;
    fileName: string | null;
    imageName: string | null;
    imageUrl: string;
    userId: string;
    createdAt: Date;
  };
  children: React.ReactNode;
}

export function ImageModal({ image, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploaderInfo, setUploaderInfo] = useState<{ fullName: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
  if (!isOpen || uploaderInfo) return;

  setIsLoading(true);
  fetch(`/api//user/${image.userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error);
      setUploaderInfo({ fullName: data.fullName });
    })
    .catch((error) => {
      console.error("Error fetching uploader info:", error);
      setUploaderInfo({ fullName: "Unknown" });
    })
    .finally(() => {
      setIsLoading(false);
    });
}, [isOpen]);


  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-lg shadow-lg">
  <div className="flex flex-col md:flex-row h-full">

    {/* Left Panel - Image */}
    <div className="bg-[#1e1e1e] p-4 w-full md:w-[65%] flex items-center justify-center">
      <img
        src={image.imageUrl}
        alt={image.imageName || "Image"}
        className="w-full max-h-[75vh] object-contain rounded-md border border-zinc-700"
      />
    </div>

    {/* Right Panel - Metadata */}
    <div className="bg-white dark:bg-zinc-900 text-black dark:text-white w-full md:w-[35%] flex flex-col justify-between border-l border-zinc-200 dark:border-zinc-800">
      <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <DialogTitle className="text-xl font-semibold text-center">
          {image.imageName || image.fileName}
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 px-6 py-4 space-y-6">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Uploaded By
          </span>
          <span className="text-base font-medium">
            {isLoading ? "Loading..." : uploaderInfo?.fullName}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Created At
          </span>
          <span className="text-base font-medium">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6">
        <DeleteButton idAsNumber={image.id} />
      </div>
    </div>
  </div>
</DialogContent>

      </Dialog>
    </div>
  );
}