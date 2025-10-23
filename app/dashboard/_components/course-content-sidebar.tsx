"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type Lesson = {
  id: string;
  title: string;
  duration?: string;
  completed?: boolean;
};

type Chapter = {
  id: string;
  title: string;
  lessons: Lesson[];
};

interface CourseContentSidebarProps {
  courseSlug: string;
  courseTitle: string;
  chapters: Chapter[];
}

export default function CourseContentSidebar({
  courseTitle,
  courseSlug,
  chapters,
}: CourseContentSidebarProps) {
  const pathname = usePathname();

  // Extract current lesson ID from URL
  const activeLessonId = useMemo(() => {
    const parts = pathname.split("/");
    return parts[parts.length - 1]; // lessonId at the end
  }, [pathname]);

  // Determine which chapter should be open based on current lesson
  const activeChapterId = useMemo(() => {
    for (const ch of chapters) {
      if (ch.lessons.some((l) => l.id === activeLessonId)) return ch.id;
    }
    return chapters[0]?.id;
  }, [chapters, activeLessonId]);

  const totalLessons = chapters.flatMap((c) => c.lessons).length;
  const completedCount = chapters
    .flatMap((c) => c.lessons)
    .filter((l) => l.completed).length;

  return (
    <aside className="w-80 border-r backdrop-blur-xl p-4 flex flex-col bg-background/70">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-primary" />
        {courseTitle}
      </h2>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={(completedCount / totalLessons) * 100}
          className="h-2"
        />
        <p className="text-xs text-muted-foreground text-center">
          {completedCount} / {totalLessons} lessons completed
        </p>
      </div>

      <Separator className="my-3" />

      {/* Chapter Accordion */}
      <Accordion
        type="single"
        collapsible
        defaultValue={activeChapterId}
        className="space-y-2 flex-1 overflow-y-auto pr-1"
      >
        {chapters.map((chapter) => (
          <AccordionItem
            key={chapter.id}
            value={chapter.id}
            className="bg-accent/10 border-none p-2 rounded-md"
          >
            <AccordionTrigger className="text-base font-medium py-2 hover:text-primary">
              {chapter.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {chapter.lessons.map((lesson) => {
                  const isActive = activeLessonId === lesson.id;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/courses/${courseSlug}/lessons/${lesson.id}`}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm transition ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <PlayCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/30"></span>
                        )}
                        <div className="flex flex-col">
                          <span>{lesson.title}</span>
                          {lesson.duration && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      {lesson.completed && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
