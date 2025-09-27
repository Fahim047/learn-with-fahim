import { createLesson } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";
import { lessonCreateSchema, LessonCreateSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewLessonModal({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LessonCreateSchema>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: "",
      courseId: courseId,
      chapterId: chapterId,
    },
    mode: "onChange",
  });
  async function onSubmit(values: LessonCreateSchema) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLesson(values));
      if (error || !result.success) {
        toast.error(result?.error || "Failed to create lesson");
        return;
      }
      toast.success(result.message || "Lesson created successfully");
      form.reset();
      setOpen(false);
    });
  }
  function handleOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusIcon className="mr-1 size-4" />
          New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Create New Lesson</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            What would you like to name this lesson?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="title"
              control={form.control}
              rules={{ required: "Chapter title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Chapter 1" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <DialogFooter>
              <Button
                size="lg"
                className={cn(
                  "mt-4",
                  isPending ? "cursor-not-allowed" : "cursor-pointer"
                )}
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Lesson"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
