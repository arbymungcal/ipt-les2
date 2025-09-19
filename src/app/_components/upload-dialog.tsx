"use client";

import { Upload, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useUploadThing } from "~/utils/uploadthing";

const formSchema = z.object({
  imageName: z
    .string()
    .min(5, { message: "Image Name must be at least 5 characters long" })
    .max(50),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(200),
});

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageName: "",
      description: "",
    },
  });

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImageName(file.name);
      setSelectedImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedImageName(null);
      setSelectedImageUrl(null);
      toast.error("Please select a valid image file.");
    }
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast.loading("Uploading...", { duration: 100000, id: "upload-begin" });
    },
    onUploadError: () => {
      toast.dismiss("upload-begin");
      toast.error("Upload Error");
    },
    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success("Upload Complete!");
      router.refresh();
    },
  });

  const handleImageUpload = async () => {
    if (!inputRef.current?.files?.length) {
      toast.warning("No File Selected!");
      return;
    }
    const selectedImage = Array.from(inputRef.current.files);
    await startUpload(selectedImage, {
      imageName: form.getValues("imageName"),
      description: form.getValues("description"),
    });
    setSelectedImageName(null);
    setSelectedImageUrl(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpen(false);
    await handleImageUpload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90">
          <Upload className="h-4 w-4" /> Upload Image
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upload Image</DialogTitle>
          <DialogDescription className="text-gray-500">
            Choose an image, add details, and submit to upload.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Image Preview */}
          {selectedImageUrl ? (
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
              <img
                src={selectedImageUrl}
                alt={selectedImageName || "Selected Image"}
                className="w-full max-h-[240px] object-cover"
              />
              <div className="p-2 text-center text-sm text-gray-600">
                {selectedImageName}
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
              <ImageIcon className="h-10 w-10" />
              <span className="ml-2">No image selected</span>
            </div>
          )}

          {/* File Input */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Select File
            </Button>
            <input
              type="file"
              ref={inputRef}
              className="sr-only"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="imageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Image Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your image" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a short description" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:opacity-90 shadow-md"
              >
                {isUploading ? "Uploading..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
