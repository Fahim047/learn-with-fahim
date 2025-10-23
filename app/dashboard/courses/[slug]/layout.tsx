import React from "react";
import CourseContentSidebar from "../../_components/course-content-sidebar";
import { getCourseSidebarData } from "@/data/user/get-course-sidebar-data";
import { tryCatch } from "@/lib/try-catch";
import { notFound } from "next/navigation";

export default async function CourseLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug } = await params;
  const { data: courseSidebarData, error } = await tryCatch(
    getCourseSidebarData(slug)
  );
  if (error || !courseSidebarData) return notFound();
  return (
    <div className="min-h-screen bg-muted/30 flex">
      <CourseContentSidebar
        courseSlug={slug}
        courseTitle={courseSidebarData.title}
        chapters={courseSidebarData.chapters}
      />
      <div className="flex-1 p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
