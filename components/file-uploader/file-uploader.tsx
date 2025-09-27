"use client";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderProgressState,
  RenderUploadedState,
} from "./render-state";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { generateImageURL } from "@/utils";
import { fileUploaderMaxSize } from "@/constants";
interface UploaderState {
  id: string | null;
  file: File | null;
  isUploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  isError: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export default function FileUploader({
  onChange,
  value,
  acceptedFileType,
}: {
  onChange?: (value: string) => void;
  value?: string;
  acceptedFileType: "image" | "video";
}) {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    isUploading: false,
    progress: 0,
    isDeleting: false,
    isError: false,
    fileType: acceptedFileType,
    key: value,
    objectUrl: value ? generateImageURL(value) : "",
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        isUploading: true,
        progress: 0,
      }));
      try {
        // step:1 get presigned url
        const response = await fetch("/api/s3/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: file.type.includes("image"),
          }),
        });
        if (!response.ok) {
          toast.error("Failed to get presigned URL");
          setFileState((prev) => ({
            ...prev,
            isUploading: false,
            isError: true,
            progress: 0,
          }));
          return;
        }
        const { presignedUrl, key } = await response.json();
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setFileState((prev) => ({
                ...prev,
                progress: Math.round(progress),
              }));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                isUploading: false,
                progress: 100,
                key,
              }));
              onChange?.(key);
              toast.success("File uploaded successfully");
              resolve();
            } else {
              reject(new Error("Failed to upload file"));
            }
          };
          xhr.onerror = () => {
            reject(new Error("Failed to upload file"));
          };
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        toast.error("Failed to upload file");
        setFileState((prev) => ({
          ...prev,
          isUploading: false,
          isError: true,
          progress: 0,
        }));
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    (accpetedFiles: File[]) => {
      if (accpetedFiles.length) {
        const file = accpetedFiles[0];
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          id: uuidv4(),
          file,
          isUploading: false,
          progress: 0,
          isDeleting: false,
          isError: false,
          fileType: acceptedFileType,
          objectUrl: URL.createObjectURL(file),
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl, acceptedFileType, uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      acceptedFileType === "image" ? { "image/*": [] } : { "video/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: fileUploaderMaxSize[acceptedFileType],
    onDropRejected: rejectedFiles,
    disabled: fileState.isUploading || !!fileState.objectUrl,
  });

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl, acceptedFileType]);

  useEffect(() => {
    if (!value) {
      // reset when form.reset sets value = ""
      setFileState({
        id: null,
        file: null,
        isUploading: false,
        progress: 0,
        isDeleting: false,
        isError: false,
        fileType: acceptedFileType,
        key: undefined,
        objectUrl: undefined,
      });
    } else {
      setFileState((prev) => ({ ...prev, key: value }));
    }
  }, [value, acceptedFileType]);

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    setFileState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch(`/api/s3/delete?key=${fileState.key}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to remove file from storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          isError: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      onChange?.("");

      // Reset everything
      setFileState({
        id: null,
        file: null,
        isUploading: false,
        progress: 0,
        key: undefined,
        isDeleting: false,
        isError: false,
        objectUrl: undefined,
        fileType: acceptedFileType,
      });

      toast.success("File removed successfully");
    } catch (error) {
      toast.error("Failed to delete file");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        isError: true,
      }));
    }
  }

  function rejectedFiles(files: FileRejection[]) {
    if (files.length) {
      const tooManyFiles = files.filter(
        (file) => file.errors[0].code === "too-many-files"
      );
      if (tooManyFiles.length) {
        toast.error("Too many files.");
      }
      const tooLargeFiles = files.filter(
        (file) => file.errors[0].code === "file-too-large"
      );
      if (tooLargeFiles.length) {
        toast.error("File size is too large.");
      }
      const invalidFiles = files.filter(
        (file) => file.errors[0].code === "invalid-file"
      );
      if (invalidFiles.length) {
        toast.error("Invalid file type.");
      }
    }
  }

  function renderContent() {
    if (fileState.isError) {
      return <RenderErrorState />;
    }
    if (fileState.isUploading) {
      return (
        <RenderProgressState
          progress={fileState.progress}
          file={fileState.file!}
        />
      );
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          fileType={fileState.fileType}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  return (
    <Card
      className={cn(
        "p-4 border-2 border-dashed",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary"
      )}
      {...getRootProps()}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
