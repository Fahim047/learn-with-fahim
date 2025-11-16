"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { enrollInCourse } from "@/actions/courses";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnrollNowButtonProps {
  courseId: string;
  className?: string;
}

export default function EnrollNowButton({
  courseId,
  className,
}: EnrollNowButtonProps) {
  const [isPending, startTransition] = useTransition();
  function handleEnroll() {
    startTransition(async () => {
      await enrollInCourse(courseId);
    });
  }
  return (
    <>
      <Button
        size="lg"
        className={cn("w-full", className)}
        onClick={handleEnroll}
        disabled={isPending}
      >
        {isPending ? (
          <>
            Enrolling
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          "Enroll Now"
        )}
      </Button>
    </>
  );
}
