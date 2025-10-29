"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // or your toast library
import { useTransition } from "react";
import { markLessonAsComplete } from "@/actions/courses";

export function MarkAsCompleteButton({
  lessonId,
  isCompleted,
}: {
  lessonId: string;
  isCompleted: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  async function handleMarkComplete() {
    startTransition(async () => {
      const res = await markLessonAsComplete(lessonId);

      if (!res.success) {
        toast.error(res.message || "Failed to mark lesson as complete");
        return;
      }

      toast.success("✅ Lesson marked as complete!");
    });
  }

  return (
    <Button
      onClick={handleMarkComplete}
      disabled={isPending || isCompleted}
      className="w-full sm:w-auto"
    >
      {isPending ? "Marking..." : "Mark as Complete"}
    </Button>
  );
}
