"use client";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

interface ImageModalProps{
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

export function ImageModal({ image, children}: ImageModalProps){
     const [isOpen, setIsOpen] = useState(false);
     const [uploaderInfo, setUploaderInfo ] = useState<{fullName: string } | null>(
        null,
    );
     const [isLoading, setIsLoading] = useState(false);
     const { user} = useUser();
      useEffect (() => {
        if (isOpen && !uploaderInfo){
            setIsLoading(true);
            fetch('/api/user/${image.userId')
            .then((res) => res.json())
            .then((data) => {
                if (data.error){
                    throw new Error(data.error);
                }
                setUploaderInfo({ fullName: data.fullName});
                setIsLoading(false);
            })
            .catch((error) =>{
                console.error("Error fetching uploader info:",error);
                setUploaderInfo({fullName: "Unkwown"});
                setIsLoading(false);
            })
        }
      }, [isOpen, uploaderInfo, image.userId]);

    return (
        <div>
         <div onClick={() => setIsOpen(true)} className="cursor-pointer">
            {children}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-h-[90vh] min-w-[]90vw overflow-hidden p-0">
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-1 items-center justify-center bg-black p4">
                    <img src={image.imageUrl} alt={String(image)} className="max-h-full object-contain"/>
                </div>
                <div className="flex flex-col w-full md:w-80">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="text-center">
                {image.imageName || image.fileName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col p-4 space-y-4 flex-1">
            <div className="flex flex-col">
                <span className="text-sm-font-medium">Upload By:</span>
                <span>{isLoading ? "Loading..." : uploaderInfo?.fullName}
                </span>
            </div>

            <div className="flex flex-col">
                <span className="text-sm-font-medium">Created At:</span>
                <span>{new Date(image.createdAt).toLocaleDateString()}
                </span>
            </div>
            <div className="">
                <Button>Delete</Button>
            </div>
          </div>
           </div>
          </div>
        </DialogContent>
        </Dialog>
    </div>
    );
}