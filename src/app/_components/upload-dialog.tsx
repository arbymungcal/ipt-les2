"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadButton, useUploadThing } from "~/utils/uploadthing";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
 
const formSchema = z.object({
  imageName: z
  .string()
  .min(5, { message: "Image Name must be at least 5 characters long"})
  .max(50),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long"})
    .max(200),
});

export function UploadDialog(){
  const [open, setOpen] = useState(false);
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageName: "",
      description: "",
    },
  })

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [SelectImageName, setSelectedImageName] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?. [0];
    if (file && file.type.startsWith("image/")) {
        setSelectedImageName(file.name);
        setSelectedImageUrl(URL.createObjectURL(file));
      } else{
        setSelectedImageName(null);
        setSelectedImageUrl(null);
        toast.error('Please select a valid image file.');
      }
   };
    
   const { startUpload, isUploading} = useUploadThing("imageUploader",{
    onUploadBegin: () => {
      toast(
        <div className="flex items-center gap2">
          <span className="text-lg"> Uploading...</span>
        </div>,
        {
          duration: 100000,
          id:"upload-begin",
        }
      );
    },
    onUploadError: () => {
      toast.dismiss("upload-begin");
      toast.error(<span className="text-lg">Upload Error</span>);
    },
    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success(<span className="textlg">Upload Complete!</span>);
      router.refresh();
    },
   });

   const handleImageUpload = async () => {
    if (!inputRef.current?.files?.length){
      toast.warning(<span className="text-lg">No File Selected!</span>);
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
    console.log(values)
    setOpen(false);
    await handleImageUpload();
   }


   
    return(
      //   <UploadButton
      //   endpoint="imageUploader"
      //   onClientUploadComplete={(res) => {
      //     // Do something with the response
      //     console.log("Files: ", res);
      //     //alert("Upload Completed");
      //     toast.success("Upload Completed");
      //     router.refresh();
      //   }}
      //   onUploadError={(error: Error) => {
      //     // Do something with the error.
      //     //alert(`ERROR! ${error.message}`);
      //     toast.error('ERROR! ${error.message}');
      //   }}
      // />
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Upload Image</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Select an image to upload. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {selectedImageUrl !== null && (
              <div>
                <img 
                src={selectedImageUrl}
                alt={SelectImageName || "selected Image"}
                className="w-full rounded-md object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button 
               variant={"outline"} 
               onClick={() => inputRef.current?.click()}
              >
                <Upload />
              </Button>
              <input type="file" ref={inputRef} className="sr-only" accept="image"
              onChange={handleImageSelect}
              />
              {setSelectedImageName !== null && (
                <div>Selected Image: {SelectImageName} </div>
              )}
            </div>
          </div>
          {/* <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div> */}
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    {/* Image Name field */}
    <FormField
      control={form.control}
      name="imageName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image Name</FormLabel>
          <FormControl>
            <Input placeholder="Image Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Description field */}
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input placeholder="Enter a short description" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Submit button */}
    <DialogFooter>
      <Button type="submit" disabled={isUploading}>
        Submit
      </Button>
    </DialogFooter>
  </form>
</Form>


        </DialogContent>
    </Dialog>
    );

}