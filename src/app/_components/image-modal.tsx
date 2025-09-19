"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { DeleteButton } from "./delete-button";

interface ImageModalProps {
  image: {
    id: number;
    fileName: string | null;
    imageName: string | null;
    description?: string | null;
    imageUrl: string;
    userId: string;
    createdAt: Date;
  };
  children: React.ReactNode;
}

export function ImageModal({ image, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploaderInfo, setUploaderInfo] = useState<{ fullName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!isOpen || uploaderInfo) return;

    setIsLoading(true);
    fetch(`/api/user/${image.userId}`)
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
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
          <div className="flex flex-col md:flex-row h-full">

            {/* Left Panel - Image */}
            <div className="p-4 w-full md:w-[65%] flex items-center justify-center bg-gradient-to-tr from-zinc-900 to-black">
              <img
                src={image.imageUrl}
                alt={image.imageName || "Image"}
                className="w-full max-h-[75vh] object-contain rounded-xl border border-zinc-800 shadow-lg hover:shadow-emerald-500/40 transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>

            {/* Right Panel - Metadata */}
            <div className="w-full md:w-[35%] flex flex-col justify-between border-l border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">
              <DialogHeader className="p-6 border-b border-zinc-800">
                <DialogTitle className="text-2xl font-extrabold text-emerald-400 tracking-wide text-center drop-shadow-md">
                  {image.imageName || image.fileName}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 px-6 py-6 space-y-6 text-sm">
                {/* Description */}
                {image.description && (
                  <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700 shadow-md">
                    <span className="block text-xs uppercase text-emerald-400 font-semibold mb-2">
                      Description
                    </span>
                    <p className="text-gray-300 leading-relaxed text-base">
                      {image.description}
                    </p>
                  </div>
                )}

                {/* Uploaded By */}
                <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700 shadow-md">
                  <span className="block text-xs uppercase text-emerald-400 font-semibold mb-1">
                    Uploaded By
                  </span>
                  <span className="text-gray-200 font-medium">
                    {isLoading ? "Loading..." : uploaderInfo?.fullName}
                  </span>
                </div>

                {/* Created At */}
                <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700 shadow-md">
                  <span className="block text-xs uppercase text-emerald-400 font-semibold mb-1">
                    Created At
                  </span>
                  <span className="text-gray-200 font-medium">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 flex justify-end gap-4">

                {/* Delete button styled */}
                <DeleteButton
                  idAsNumber={image.id}
      
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
