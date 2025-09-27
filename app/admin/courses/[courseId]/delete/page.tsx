"use client";

import { deleteCourse } from "@/actions/courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function DeleteCoursePage() {
  const [isPending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  async function handleDeleteCourse() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));
      if (error || !result.success) {
        toast.error(result?.error || "Failed to delete course");
        return;
      }
      toast.success(result.message || "Course deleted");
      router.push("/admin/courses");
    });
  }

  return (
    <Card className="flex flex-col items-center justify-center py-24 text-center space-y-6">
      {/* Icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
        <TrashIcon className="w-10 h-10 text-red-600" />
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Delete Course</h1>
        <p className="text-muted-foreground max-w-md">
          Are you sure you want to delete this course? This action cannot be
          undone and will permanently remove all related content.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/courses`}
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
        <Button
          variant="destructive"
          onClick={handleDeleteCourse}
          disabled={isPending}
          className="cursor-pointer"
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Card>
  );
}
