"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Lesson = {
  id: string;
  title: string;
  duration?: string | null;
};

type Chapter = {
  id: string;
  title: string;
  lessons: Lesson[];
};

interface CurriculumAccordionProps {
  course: {
    slug: string;
    chapters: Chapter[];
  };
  enrolled: boolean;
}

export default function CurriculumAccordion({
  course,
  enrolled,
}: CurriculumAccordionProps) {
  const { chapters } = course;

  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Curriculum will be available soon.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {chapters.map((chapter, idx) => (
        <AccordionItem
          key={chapter.id}
          value={`chapter-${chapter.id}`}
          className="rounded-lg border border-border bg-muted/20 overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline font-semibold text-base">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="rounded-full text-xs w-6 h-6 flex items-center justify-center"
              >
                {idx + 1}
              </Badge>
              <span>{chapter.title}</span>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col divide-y divide-border">
              {chapter.lessons.length === 0 && (
                <div className="text-sm text-muted-foreground italic p-3 pl-10">
                  Lessons will be added soon.
                </div>
              )}

              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={cn(
                    "flex items-center justify-between p-3 pl-10 hover:bg-muted/50 transition rounded-md group",
                    !enrolled && "cursor-not-allowed opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {enrolled ? (
                      <PlayCircle className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {enrolled ? (
                      <Link
                        href={`/dashboard/courses/${course.slug}/lessons/${lesson.id}`}
                        className="font-medium hover:underline"
                      >
                        {lesson.title}
                      </Link>
                    ) : (
                      <span className="font-medium">{lesson.title}</span>
                    )}
                  </div>
                  {lesson.duration && (
                    <span className="text-xs text-muted-foreground">
                      {lesson.duration}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
