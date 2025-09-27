import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="w-full text-sm text-muted-foreground">
        Drag and drop files here or{" "}
        <span className="text-primary font-bold">click to upload</span>
      </p>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 bg-destructive/20 rounded-full">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="w-full mt-4 text-sm text-muted-foreground">
        An error occurred while uploading the file.
      </p>
      <Button type="button" className="mt-4">
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  fileType: "image" | "video";
  handleRemoveFile: () => void;
}) {
  return (
    <div className="relative max-w-full w-[400px] h-[250px] mx-auto">
      {fileType === "image" ? (
        <Image
          src={previewUrl}
          alt="uploaded file"
          fill
          className="object-cover rounded-md"
        />
      ) : (
        <video src={previewUrl} controls className="w-full h-full rounded-md" />
      )}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? <Loader2Icon className="animate-spin" /> : <XIcon />}
      </Button>
    </div>
  );
}

export function RenderProgressState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex flex-col justify-center items-center">
      <p className="text-lg font-bold text-primary">{progress}%</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
