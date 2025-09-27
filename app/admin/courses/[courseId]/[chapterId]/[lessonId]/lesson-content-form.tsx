"use client";
import { updateLessonContent } from "@/actions/courses";
import FileUploader from "@/components/file-uploader/file-uploader";
import TipTapEditor from "@/components/rich-text-editor/tip-tap-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AdminLessonType } from "@/data/admin/admin-get-lesson";
import { tryCatch } from "@/lib/try-catch";
import { LessonCreateSchema, lessonCreateSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
interface LessonContentFormProps {
  data: AdminLessonType;
  courseId: string;
  chapterId: string;
}
export default function LessonContentForm({
  data,
  courseId,
  chapterId,
}: LessonContentFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<LessonCreateSchema>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: data.title,
      chapterId,
      courseId,
      description: data.description || "",
      thumbnailKey: data.thumbnailKey || "",
      videoKey: data.videoKey || "",
    },
    mode: "onSubmit",
  });
  function onSubmit(values: LessonCreateSchema) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLessonContent(values, data.id)
      );
      if (error || !result.success) {
        toast.error(result?.error || "Failed to update lesson");
        return;
      }
      toast.success(result?.message || "Lesson updated successfully");
      router.refresh();
    });
  }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add lesson contents</CardTitle>
          <CardDescription>
            Fill in the lesson contents of the lesson.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TipTapEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onChange={field.onChange}
                        acceptedFileType="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onChange={field.onChange}
                        acceptedFileType="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
